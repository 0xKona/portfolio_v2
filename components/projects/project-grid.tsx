"use client";

import { useRouter } from "next/navigation";
import { useProjects } from "@/hooks/use-projects";
import { ProjectCard } from "@/components/projects/project-card";
import { TerminalLoading } from "@/components/ui/terminal-loading";
import { TerminalErrorBox } from "@/components/ui/terminal-error-box";
import type { Project } from "@/types/data-types";

/** Number of columns in the grid (used to calculate maxRows) */
const GRID_COLUMNS = 3;

interface ProjectGridProps {
    /** Maximum number of rows to display. Undefined = show all */
    maxRows?: number;
    /** Only show featured projects */
    featuredOnly?: boolean;
    /** Only show published projects (default: true for public pages) */
    publishedOnly?: boolean;
    /** Additional CSS classes */
    className?: string;
}

export function ProjectGrid({
    maxRows,
    featuredOnly = false,
    publishedOnly = true,
    className = "",
}: ProjectGridProps) {
    const router = useRouter();
    const { projects, isLoading, error } = useProjects();

    // Filter projects based on props
    const filteredProjects = projects.filter((project) => {
        if (publishedOnly && project.status !== "published") return false;
        if (featuredOnly && !project.isFeatured) return false;
        return true;
    });

    // Sort: featured first, then by creation date
    const sortedProjects = [...filteredProjects].sort((a, b) => {
        if (a.isFeatured !== b.isFeatured) {
            return a.isFeatured ? -1 : 1;
        }
        return (
            new Date(b.createdAt ?? 0).getTime() -
            new Date(a.createdAt ?? 0).getTime()
        );
    });

    // Limit by maxRows if specified
    const maxItems = maxRows ? maxRows * GRID_COLUMNS : undefined;
    const displayedProjects = maxItems
        ? sortedProjects.slice(0, maxItems)
        : sortedProjects;

    const handleProjectClick = (id: string) => {
        router.push(`/projects/${id}`);
    };

    if (isLoading) {
        return (
            <div className={`flex justify-center py-12 ${className}`}>
                <TerminalLoading message="fetching projects..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className={className}>
                <TerminalErrorBox title="ERROR" message={error} />
            </div>
        );
    }

    if (displayedProjects.length === 0) {
        return (
            <div className={`text-center py-12 font-mono ${className}`}>
                <p className="text-neutral-500 text-sm">
                    <span className="text-neutral-600">$</span> ls projects/
                </p>
                <p className="text-neutral-600 text-xs mt-2">
                    no projects found
                </p>
            </div>
        );
    }

    return (
        <div className={className}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedProjects.map((project) => (
                    <ProjectCard
                        key={project.id}
                        project={project as Project}
                        onClick={() => handleProjectClick(project.id)}
                    />
                ))}
            </div>

            {/* Show "more" indicator if there are hidden projects */}
            {maxItems && sortedProjects.length > maxItems && (
                <div className="text-center mt-6">
                    <button
                        onClick={() => router.push("/projects")}
                        className="text-neutral-500 hover:text-cyan-400 text-xs font-mono transition-colors"
                    >
                        + {sortedProjects.length - maxItems} more projects →
                    </button>
                </div>
            )}
        </div>
    );
}
