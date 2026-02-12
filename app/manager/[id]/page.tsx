"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useProject } from "@/hooks/use-project";
import { useProjects } from "@/hooks/use-projects";
import {
    ProjectEditor,
    type ProjectFormData,
} from "@/components/manager/project-editor";
import { TerminalButton } from "@/components/ui/terminal-button";
import { TerminalLoading } from "@/components/ui/terminal-loading";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function ProjectEditorPage({ params }: PageProps) {
    const { id } = use(params);
    const router = useRouter();
    const isNew = id === "new";

    const { project, isLoading, error } = useProject(isNew ? null : id);
    const { createProject, updateProject, deleteProject } = useProjects();

    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    /** Convert Amplify project data to form-compatible shape */
    const initialData: Partial<ProjectFormData> | undefined = project
        ? {
              name: project.name,
              desc: project.desc ?? "",
              images: (project.images ?? [])
                  .filter(
                      (
                          img,
                      ): img is {
                          url: string;
                          alt: string;
                          caption?: string | null;
                      } => img != null && img.url !== undefined,
                  )
                  .map((img) => ({
                      url: img.url,
                      alt: img.alt,
                      caption: img.caption,
                  })),
              video: project.video ?? "",
              skills: (project.skills ?? []).filter(
                  (s): s is string => s !== null,
              ),
              githubUrl: project.githubUrl ?? "",
              demoUrl: project.demoUrl ?? "",
              isFeatured: project.isFeatured,
              status: project.status as "published" | "draft",
          }
        : undefined;

    /** Handle save — create or update depending on mode */
    const handleSave = async (data: ProjectFormData) => {
        setIsSaving(true);
        setSaveError(null);

        try {
            const payload = {
                name: data.name,
                desc: data.desc || null,
                images: data.images.map((img) => ({
                    url: img.url,
                    alt: img.alt,
                    caption: img.caption || null,
                })),
                video: data.video || null,
                skills: data.skills,
                githubUrl: data.githubUrl || null,
                demoUrl: data.demoUrl || null,
                isFeatured: data.isFeatured,
                status: data.status,
            };

            if (isNew) {
                const created = await createProject(payload);
                if (created) {
                    router.push("/manager");
                } else {
                    setSaveError("Failed to create project");
                }
            } else {
                const updated = await updateProject(id, payload);
                if (updated) {
                    router.push("/manager");
                } else {
                    setSaveError("Failed to update project");
                }
            }
        } catch (err) {
            setSaveError(err instanceof Error ? err.message : "Save failed");
        } finally {
            setIsSaving(false);
        }
    };

    /** Handle project deletion */
    const handleDelete = async () => {
        if (!confirm("Are you sure? This action cannot be undone.")) return;

        setIsDeleting(true);
        const success = await deleteProject(id);
        if (success) {
            router.push("/manager");
        }
        setIsDeleting(false);
    };

    const handleCancel = () => {
        router.push("/manager");
    };

    // Loading state
    if (!isNew && isLoading) {
        return (
            <main className="min-h-screen pt-20 pb-12">
                <TerminalLoading message="loading project..." />
            </main>
        );
    }

    // Error fetching project
    if (!isNew && error) {
        return (
            <main className="min-h-screen pt-20 pb-12">
                <div className="text-red-400 text-sm font-mono py-12 text-center">
                    <span className="text-neutral-600">$</span> error: {error}
                </div>
                <div className="text-center">
                    <TerminalButton variant="secondary" onClick={handleCancel}>
                        &gt; back
                    </TerminalButton>
                </div>
            </main>
        );
    }

    // Project not found
    if (!isNew && !project) {
        return (
            <main className="min-h-screen pt-20 pb-12">
                <div className="text-red-400 text-sm font-mono py-12 text-center">
                    <span className="text-neutral-600">$</span> error: project
                    not found
                </div>
                <div className="text-center">
                    <TerminalButton variant="secondary" onClick={handleCancel}>
                        &gt; back
                    </TerminalButton>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen pt-20 pb-12 max-w-3xl mx-auto">
            {/* Save error display */}
            {saveError && (
                <div className="text-red-400 text-xs font-mono border border-red-400 p-3 mb-6">
                    error: {saveError}
                </div>
            )}

            {/* Editor form — key forces remount when project data loads */}
            <ProjectEditor
                key={isNew ? "new" : project?.id}
                initialData={initialData}
                onSave={handleSave}
                onCancel={handleCancel}
                isSaving={isSaving}
                mode={isNew ? "create" : "edit"}
            />

            {/* Delete section — only for existing projects */}
            {!isNew && (
                <div className="mt-12 pt-6 border-t border-neutral-800">
                    <div className="flex items-center justify-between">
                        <span className="text-neutral-600 text-xs font-mono">
                            danger zone
                        </span>
                        <TerminalButton
                            variant="ghost"
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="text-red-400 hover:text-red-300 border border-red-400 hover:border-red-300"
                        >
                            {isDeleting ? "deleting..." : "× delete project"}
                        </TerminalButton>
                    </div>
                </div>
            )}
        </main>
    );
}
