"use client";

import { useState } from "react";
import { uploadData, getUrl, remove } from "aws-amplify/storage";

interface UploadState {
    isUploading: boolean;
    progress: number;
    error: string | null;
}

interface UseImageUploadReturn extends UploadState {
    uploadImage: (file: File) => Promise<string | null>;
    removeImage: (path: string) => Promise<boolean>;
    getImageUrl: (path: string) => Promise<string | null>;
    clearError: () => void;
}

/**
 * Generates a unique S3 key for a file under the projects/ prefix.
 * Uses timestamp + random string to avoid collisions.
 */
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

    const uploadImage = async (file: File): Promise<string | null> => {
        setState({ isUploading: true, progress: 0, error: null });

        try {
            const key = generateS3Key(file.name);

            await uploadData({
                path: key,
                data: file,
                options: {
                    contentType: file.type,
                    onProgress: ({ transferredBytes, totalBytes }) => {
                        if (totalBytes) {
                            const percent = Math.round(
                                (transferredBytes / totalBytes) * 100
                            );
                            setState((prev) => ({ ...prev, progress: percent }));
                        }
                    },
                },
            }).result;

            setState({ isUploading: false, progress: 100, error: null });
            return key;
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Upload failed";
            setState({ isUploading: false, progress: 0, error: message });
            return null;
        }
    };

    const removeImage = async (path: string): Promise<boolean> => {
        try {
            await remove({ path });
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
