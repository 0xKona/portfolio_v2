/**
 * ManagerRoot — Dashboard page for managing portfolio projects.
 * Lists all projects as cards and provides navigation to the project editor.
 */
"use client";

import { useRouter } from "next/navigation";
import { useProjects } from "@/hooks/use-projects";
import { ProjectList } from "@/components/manager/project-list";
import { TerminalButton } from "@/components/ui/terminal-button";
import Signout from "@/components/auth/sign-out";

export default function ManagerRoot() {
    const router = useRouter();
    const { projects, isLoading, error, deleteProject } = useProjects();

    const handleSelect = (id: string) => {
        router.push(`/manager/${id}`);
    };

    const handleCreate = () => {
        router.push("/manager/new");
    };

    return (
        <main className="min-h-screen pt-20 pb-12">
            {/* Page header */}
            <div className="flex items-center justify-between mb-8 border-b border-neutral-800 pb-4">
                <div>
                    <h1 className="text-neutral-300 text-sm font-mono">
                        <span className="text-neutral-500">$</span> ls
                        ~/manager/projects
                    </h1>
                    <p className="text-neutral-600 text-xs font-mono mt-1">
                        {projects.length} project
                        {projects.length !== 1 ? "s" : ""} found
                    </p>
                </div>
                <div className="flex gap-3">
                    <TerminalButton
                        variant="primary"
                        onClick={handleCreate}
                        prefix="+"
                    >
                        new project
                    </TerminalButton>
                    <Signout />
                </div>
            </div>

            {/* Project grid */}
            <ProjectList
                projects={projects}
                isLoading={isLoading}
                error={error}
                onSelect={handleSelect}
            />
        </main>
    );
}
