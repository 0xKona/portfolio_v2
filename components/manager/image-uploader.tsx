/**
 * ImageUploader — Sub-component for uploading and managing project images.
 * Handles file selection, S3 upload via useImageUpload, and image removal.
 * Displays upload progress with terminal-style progress bar.
 */
"use client";

import { useRef } from "react";
import Image from "next/image";
import { useImageUpload } from "@/hooks/use-image-upload";
import { useResolvedImageUrl } from "@/hooks/use-resolved-image-url";
import { TerminalButton } from "@/components/ui/terminal-button";
import { ImageSkeleton } from "@/components/ui/image-skeleton";

interface ProjectImage {
    url: string;
    alt: string;
    caption?: string | null;
}

interface ImageUploaderProps {
    /** Current list of project images */
    images: ProjectImage[];
    /** Callback when the images list changes */
    onChange: (images: ProjectImage[]) => void;
}

/** Single image thumbnail with resolved URL */
function ImageThumbnail({
    image,
    onRemove,
    onAltChange,
}: {
    image: ProjectImage;
    onRemove: () => void;
    onAltChange: (alt: string) => void;
}) {
    // Use thumb variant for fast loading in the manager
    const resolvedUrl = useResolvedImageUrl(image.url, "thumb");
    const isLoading = !resolvedUrl && !image.url.startsWith("http");

    return (
        <div className="border border-neutral-700 p-2">
            {/* Thumbnail preview */}
            {isLoading ? (
                <ImageSkeleton className="w-full h-24 mb-2" />
            ) : resolvedUrl ? (
                <div className="relative w-full h-24 mb-2 overflow-hidden">
                    <Image
                        src={resolvedUrl}
                        alt={image.alt}
                        fill
                        className="object-cover"
                        unoptimized
                    />
                </div>
            ) : (
                <div className="w-full h-24 mb-2 bg-neutral-900 flex items-center justify-center">
                    <span className="text-neutral-600 text-xs font-mono">
                        error loading
                    </span>
                </div>
            )}

            {/* Alt text input */}
            <input
                type="text"
                value={image.alt}
                onChange={(e) => onAltChange(e.target.value)}
                placeholder="alt text..."
                className="w-full bg-black border border-neutral-700 text-neutral-300 text-xs font-mono px-2 py-1 mb-2 focus:border-cyan-400 focus:outline-none"
            />

            {/* Remove button */}
            <TerminalButton
                variant="ghost"
                onClick={onRemove}
                className="text-red-400 hover:text-red-300 text-xs w-full"
            >
                × remove
            </TerminalButton>
        </div>
    );
}

export function ImageUploader({ images, onChange }: ImageUploaderProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const {
        isUploading,
        progress,
        error,
        uploadImage,
        removeImage,
        clearError,
    } = useImageUpload();

    /** Handle file selection and upload */
    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const result = await uploadImage(file);
        if (result) {
            // Store the basePath - variants are derived from it using naming conventions
            onChange([
                ...images,
                {
                    url: result.basePath,
                    alt: file.name.replace(/\.[^.]+$/, ""),
                },
            ]);
        }

        // Reset file input so the same file can be re-selected
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    /** Remove an image by index, also delete from S3 */
    const handleRemove = async (index: number) => {
        const image = images[index];
        // Attempt S3 deletion (non-blocking — image is removed from list regardless)
        if (!image.url.startsWith("http")) {
            removeImage(image.url);
        }
        onChange(images.filter((_, i) => i !== index));
    };

    /** Update alt text for an image at a given index */
    const handleAltChange = (index: number, alt: string) => {
        const updated = [...images];
        updated[index] = { ...updated[index], alt };
        onChange(updated);
    };

    // Terminal-style progress bar
    const totalBlocks = 10;
    const filledBlocks = Math.round((progress / 100) * totalBlocks);
    const progressBar =
        "█".repeat(filledBlocks) + "░".repeat(totalBlocks - filledBlocks);

    return (
        <div>
            <label className="block text-neutral-500 text-xs font-mono mb-2">
                images
            </label>

            {/* Image grid */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
                    {images.map((image, index) => (
                        <ImageThumbnail
                            key={`${image.url}-${index}`}
                            image={image}
                            onRemove={() => handleRemove(index)}
                            onAltChange={(alt) => handleAltChange(index, alt)}
                        />
                    ))}
                </div>
            )}

            {/* Upload progress */}
            {isUploading && (
                <div className="text-neutral-500 text-xs font-mono mb-2">
                    uploading [{progressBar}] {progress}%
                </div>
            )}

            {/* Error display */}
            {error && (
                <div className="text-red-400 text-xs font-mono mb-2">
                    error: {error}
                    <button
                        onClick={clearError}
                        className="ml-2 text-neutral-500 hover:text-neutral-300"
                    >
                        [dismiss]
                    </button>
                </div>
            )}

            {/* Upload button */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
            />
            <TerminalButton
                type="button"
                variant="secondary"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                prefix="+"
            >
                upload image
            </TerminalButton>
        </div>
    );
}
