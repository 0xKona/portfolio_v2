"use client";

import { useState } from "react";
import { uploadData, getUrl, remove } from "aws-amplify/storage";
import imageCompression from "browser-image-compression";

interface UploadState {
    isUploading: boolean;
    progress: number;
    error: string | null;
}

/**
 * Image variant paths returned from upload.
 * All variants can be derived from the base path using naming conventions.
 */
interface ImagePaths {
    /** Base path stored in DB - use getImageVariantPath() to derive variants */
    basePath: string;
    /** Thumb version (~400px) for cards/lists */
    thumbPath: string;
    /** Preview version (~1200px) for detail views */
    previewPath: string;
    /** Optimized original (~2000px) for full-res viewing */
    originalPath: string;
}

interface UseImageUploadReturn extends UploadState {
    uploadImage: (file: File) => Promise<ImagePaths | null>;
    removeImage: (basePath: string) => Promise<boolean>;
    getImageUrl: (path: string) => Promise<string | null>;
    clearError: () => void;
}

/** Image compression configurations for each variant */
const IMAGE_VARIANTS = {
    thumb: {
        maxSizeMB: 0.1,
        maxWidthOrHeight: 400,
        suffix: "-thumb",
    },
    preview: {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1200,
        suffix: "-preview",
    },
    original: {
        maxSizeMB: 1.5,
        maxWidthOrHeight: 2000,
        suffix: "",
    },
} as const;

/**
 * Derives variant path from base path using naming convention.
 * @param basePath - The base path stored in the database
 * @param variant - The variant to get ('thumb' | 'preview' | 'original')
 */
export function getImageVariantPath(
    basePath: string,
    variant: "thumb" | "preview" | "original"
): string {
    if (variant === "original") return basePath;
    const suffix = IMAGE_VARIANTS[variant].suffix;
    // Insert suffix before file extension
    return basePath.replace(/(\.[^.]+)$/, `${suffix}$1`);
}

function generateS3Key(fileName: string): string {
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const sanitised = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    return `projects/${timestamp}-${randomSuffix}-${sanitised}`;
}

export function useImageUpload(): UseImageUploadReturn {
    const [state, setState] = useState<UploadState>({
        isUploading: false,
        progress: 0,
        error: null,
    });

    const uploadImage = async (file: File): Promise<ImagePaths | null> => {
        setState({ isUploading: true, progress: 0, error: null });

        try {
            const basePath = generateS3Key(file.name);
            const thumbPath = getImageVariantPath(basePath, "thumb");
            const previewPath = getImageVariantPath(basePath, "preview");
            const originalPath = basePath;

            // Compress all variants in parallel
            const [thumbBlob, previewBlob, originalBlob] = await Promise.all([
                imageCompression(file, {
                    maxSizeMB: IMAGE_VARIANTS.thumb.maxSizeMB,
                    maxWidthOrHeight: IMAGE_VARIANTS.thumb.maxWidthOrHeight,
                    useWebWorker: true,
                    fileType: "image/jpeg",
                }),
                imageCompression(file, {
                    maxSizeMB: IMAGE_VARIANTS.preview.maxSizeMB,
                    maxWidthOrHeight: IMAGE_VARIANTS.preview.maxWidthOrHeight,
                    useWebWorker: true,
                    fileType: "image/jpeg",
                }),
                imageCompression(file, {
                    maxSizeMB: IMAGE_VARIANTS.original.maxSizeMB,
                    maxWidthOrHeight: IMAGE_VARIANTS.original.maxWidthOrHeight,
                    useWebWorker: true,
                    // Keep original format for quality
                }),
            ]);

            setState((prev) => ({ ...prev, progress: 30 }));

            // Upload thumbnail (0-40%)
            await uploadData({
                path: thumbPath,
                data: thumbBlob,
                options: {
                    contentType: "image/jpeg",
                    onProgress: ({ transferredBytes, totalBytes }) => {
                        if (totalBytes) {
                            const percent = 30 + Math.round(
                                (transferredBytes / totalBytes) * 20
                            );
                            setState((prev) => ({ ...prev, progress: percent }));
                        }
                    },
                },
            }).result;

            // Upload preview (40-70%)
            await uploadData({
                path: previewPath,
                data: previewBlob,
                options: {
                    contentType: "image/jpeg",
                    onProgress: ({ transferredBytes, totalBytes }) => {
                        if (totalBytes) {
                            const percent = 50 + Math.round(
                                (transferredBytes / totalBytes) * 20
                            );
                            setState((prev) => ({ ...prev, progress: percent }));
                        }
                    },
                },
            }).result;

            // Upload original (70-100%)
            await uploadData({
                path: originalPath,
                data: originalBlob,
                options: {
                    contentType: file.type,
                    onProgress: ({ transferredBytes, totalBytes }) => {
                        if (totalBytes) {
                            const percent = 70 + Math.round(
                                (transferredBytes / totalBytes) * 30
                            );
                            setState((prev) => ({ ...prev, progress: percent }));
                        }
                    },
                },
            }).result;

            setState({ isUploading: false, progress: 100, error: null });
            return { basePath, thumbPath, previewPath, originalPath };
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Upload failed";
            setState({ isUploading: false, progress: 0, error: message });
            return null;
        }
    };

    const removeImage = async (basePath: string): Promise<boolean> => {
        try {
            // Remove all variants
            const variants = ["thumb", "preview", "original"] as const;
            await Promise.all(
                variants.map((variant) =>
                    remove({ path: getImageVariantPath(basePath, variant) }).catch(() => {})
                )
            );
            return true;
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Delete failed";
            setState((prev) => ({ ...prev, error: message }));
            return false;
        }
    };

    const getImageUrl = async (path: string): Promise<string | null> => {
        try {
            const result = await getUrl({ path });
            return result.url.toString();
        } catch {
            return null;
        }
    };

    const clearError = () => setState((prev) => ({ ...prev, error: null }));

    return {
        ...state,
        uploadImage,
        removeImage,
        getImageUrl,
        clearError,
    };
}
