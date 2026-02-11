/**
 * ProjectList — Displays the grid of project cards on the manager dashboard.
 * Handles loading, empty, and error states with terminal-style feedback.
 */
"use client";

import { ProjectCard } from "@/components/projects/project-card";
import { TerminalLoading } from "@/components/ui/terminal-loading";
import type { Project } from "@/types/data-types";

interface ProjectListProps {
    /** Projects to display */
    projects: Project[];
    /** Whether data is loading */
    isLoading: boolean;
    /** Error message to display */
    error: string | null;
    /** Called when a project card is clicked */
    onSelect: (id: string) => void;
}

export function ProjectList({
    projects,
    isLoading,
    error,
    onSelect,
}: ProjectListProps) {
    if (isLoading) {
        return <TerminalLoading message="loading projects..." />;
    }

    if (error) {
        return (
            <div className="text-red-400 text-sm font-mono py-12 text-center">
                <span className="text-neutral-600">$</span> error: {error}
            </div>
        );
    }

    if (projects.length === 0) {
        return (
            <div className="text-neutral-500 text-sm font-mono py-12 text-center">
                <span className="text-neutral-600">$</span> ls projects/
                <br />
                <span className="text-neutral-600 mt-2 block">
                    (empty directory)
                </span>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
                <ProjectCard
                    key={project.id}
                    project={project}
                    onClick={() => onSelect(project.id)}
                />
            ))}
        </div>
    );
}
