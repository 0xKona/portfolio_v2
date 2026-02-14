"use client";

import { useEffect, useState } from "react";
import { getUrl } from "aws-amplify/storage";

/**
 * Resolves an S3 storage path to a signed URL for display.
 * Returns null if the path is already a full URL or resolution fails.
 */
export function useResolvedImageUrl(path?: string | null): string | null {
    // Initialise with the path if it's already a full URL, avoiding an effect-triggered setState
    const [url, setUrl] = useState<string | null>(
        path?.startsWith("http") ? path : null,
    );

    useEffect(() => {
        if (!path || path.startsWith("http")) return;
        // Resolve S3 storage path to a signed URL
        getUrl({ path })
            .then((result) => setUrl(result.url.toString()))
            .catch(() => setUrl(null));
    }, [path]);

    return url;
}
