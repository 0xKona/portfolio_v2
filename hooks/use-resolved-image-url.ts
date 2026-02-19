"use client";

import { useEffect, useState, useRef } from "react";
import { getUrl } from "aws-amplify/storage";
import { getImageVariantPath } from "./use-image-upload";

type ImageVariant = "thumb" | "preview" | "original";

/**
 * Resolves an S3 storage path to a signed URL for display.
 * Supports image variants (thumb, preview, original) using naming conventions.
 * Returns null if resolution fails.
 * 
 * @param path - The base S3 path stored in the database
 * @param variant - Which image variant to load (default: "original")
 */
export function useResolvedImageUrl(
    path?: string | null,
    variant: ImageVariant = "original"
): string | null {
    const [url, setUrl] = useState<string | null>(null);
    const currentRequestRef = useRef<string | null>(null);

    useEffect(() => {
        // Track which request we're making to ignore stale responses
        const requestKey = `${path}-${variant}`;
        currentRequestRef.current = requestKey;
        
        if (!path) return;
        
        // Already a full URL - use directly (in async callback to satisfy linter)
        if (path.startsWith("http")) {
            // Use microtask to avoid synchronous setState warning
            queueMicrotask(() => {
                if (currentRequestRef.current === requestKey) {
                    setUrl(path);
                }
            });
            return;
        }
        
        // Get the variant path and resolve to signed URL
        const variantPath = getImageVariantPath(path, variant);
        getUrl({ path: variantPath })
            .then((result) => {
                if (currentRequestRef.current === requestKey) {
                    setUrl(result.url.toString());
                }
            })
            .catch(() => {
                // Fallback to original if variant doesn't exist
                if (variant !== "original") {
                    getUrl({ path })
                        .then((result) => {
                            if (currentRequestRef.current === requestKey) {
                                setUrl(result.url.toString());
                            }
                        })
                        .catch(() => {
                            if (currentRequestRef.current === requestKey) {
                                setUrl(null);
                            }
                        });
                } else {
                    if (currentRequestRef.current === requestKey) {
                        setUrl(null);
                    }
                }
            });
        
        // Cleanup: mark this request as stale
        return () => {
            currentRequestRef.current = null;
        };
    }, [path, variant]);

    return url;
}
