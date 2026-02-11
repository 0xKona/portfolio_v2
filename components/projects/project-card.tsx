/**
 * ProjectCard — Reusable card component for displaying a project summary.
 * Used in both the manager dashboard and the public-facing projects listing.
 * Shows project name, status, description, and key metadata.
 */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getUrl } from "aws-amplify/storage";
import type { Project, ProjectImage } from "@/types/data-types";

interface ProjectCardProps {
    /** The project data object to display */
    project: Project;
    /** Click handler — used to open editor in manager, or navigate on public site */
    onClick?: () => void;
    /** Additional CSS classes */
    className?: string;
}

/**
 * Resolves an S3 storage path to a signed URL for display.
 * Returns null if the path is already a full URL or resolution fails.
 */
function useResolvedImageUrl(path?: string | null): string | null {
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

export function ProjectCard({
    project,
    onClick,
    className = "",
}: ProjectCardProps) {
    const { name, desc, status, isFeatured, images, skills } = project;

    // Resolve first image thumbnail
    const firstImage = images?.find((img): img is ProjectImage => img !== null);
    const thumbnailUrl = useResolvedImageUrl(firstImage?.url);

    return (
        <button
            type="button"
            onClick={onClick}
            className={`
                w-full text-left border border-neutral-700 p-4
                hover:border-cyan-400 transition-colors duration-150
                focus:outline-none focus:border-cyan-400
                group cursor-pointer
                ${className}
            `}
        >
            {/* Status + featured badge row */}
            <div className="flex items-center justify-between mb-2">
                <span
                    className={`text-xs font-mono ${
                        status === "published"
                            ? "text-green-400"
                            : "text-neutral-500"
                    }`}
                >
                    [{status}]
                </span>
                {isFeatured && (
                    <span className="text-xs text-cyan-400 font-mono">
                        ★ featured
                    </span>
                )}
            </div>

            {/* Thumbnail */}
            {thumbnailUrl && (
                <div className="relative w-full h-32 mb-3 border border-neutral-800 overflow-hidden">
                    <Image
                        src={thumbnailUrl}
                        alt={firstImage?.alt || name}
                        fill
                        className="object-cover"
                        unoptimized
                    />
                </div>
            )}

            {/* Project name */}
            <h3 className="text-neutral-300 text-sm font-mono group-hover:text-cyan-400 transition-colors mb-1">
                <span className="text-neutral-500">&gt;</span> {name}
            </h3>

            {/* Description */}
            {desc && (
                <p className="text-neutral-500 text-xs font-mono line-clamp-2 mb-2">
                    {desc}
                </p>
            )}

            {/* Skills tags */}
            {skills && skills.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                    {skills
                        .filter((s): s is string => s !== null)
                        .slice(0, 5)
                        .map((skill) => (
                            <span
                                key={skill}
                                className="text-xs text-neutral-500 border border-neutral-700 px-1.5 py-0.5 font-mono"
                            >
                                {skill}
                            </span>
                        ))}
                    {skills.length > 5 && (
                        <span className="text-xs text-neutral-600 font-mono">
                            +{skills.length - 5}
                        </span>
                    )}
                </div>
            )}
        </button>
    );
}
