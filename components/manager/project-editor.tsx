/**
 * ProjectEditor — Form component for creating and editing projects.
 * Manages local form state and delegates persistence to parent via callbacks.
 * Supports image upload, skills management, and all project schema fields.
 */
"use client";

import { useState } from "react";
import { TerminalInput } from "@/components/ui/terminal-input";
import { TerminalTextarea } from "@/components/ui/terminal-textarea";
import { TerminalSelect } from "@/components/ui/terminal-select";
import { TerminalCheckbox } from "@/components/ui/terminal-checkbox";
import { TerminalButton } from "@/components/ui/terminal-button";
import { ImageUploader } from "@/components/manager/image-uploader";
import { SkillPicker } from "@/components/manager/skill-picker";

interface ProjectImage {
    url: string;
    alt: string;
    caption?: string | null;
}

/** Shape of the form data managed by the editor */
export interface ProjectFormData {
    name: string;
    desc: string;
    images: ProjectImage[];
    video: string;
    skills: string[];
    githubUrl: string;
    demoUrl: string;
    isFeatured: boolean;
    status: "published" | "draft";
}

/** Default empty form state for new projects */
const EMPTY_FORM: ProjectFormData = {
    name: "",
    desc: "",
    images: [],
    video: "",
    skills: [],
    githubUrl: "",
    demoUrl: "",
    isFeatured: false,
    status: "draft",
};

interface ProjectEditorProps {
    /** Initial form data — provided when editing an existing project */
    initialData?: Partial<ProjectFormData>;
    /** Called when the user saves the form */
    onSave: (data: ProjectFormData) => Promise<void>;
    /** Called when the user cancels editing */
    onCancel: () => void;
    /** Whether a save is currently in progress */
    isSaving?: boolean;
    /** The mode label displayed in the header */
    mode?: "create" | "edit";
}

export function ProjectEditor({
    initialData,
    onSave,
    onCancel,
    isSaving = false,
    mode = "create",
}: ProjectEditorProps) {
    const [form, setForm] = useState<ProjectFormData>({
        ...EMPTY_FORM,
        ...initialData,
    });

    /** Update a single field in the form state */
    const updateField = <K extends keyof ProjectFormData>(
        key: K,
        value: ProjectFormData[K],
    ) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSave(form);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Header */}
            <div className="border-b border-neutral-800 pb-3 mb-6">
                <h2 className="text-neutral-300 text-sm font-mono">
                    <span className="text-neutral-500">$</span>{" "}
                    {mode === "create" ? "new project" : "edit project"}
                </h2>
            </div>

            {/* Name */}
            <TerminalInput
                label="name *"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="project name..."
                required
            />

            {/* Description */}
            <TerminalTextarea
                label="description"
                value={form.desc}
                onChange={(e) => updateField("desc", e.target.value)}
                placeholder="project description..."
                rows={4}
            />

            {/* Status + Featured row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TerminalSelect
                    label="status *"
                    value={form.status}
                    onChange={(e) =>
                        updateField(
                            "status",
                            e.target.value as "published" | "draft",
                        )
                    }
                    options={[
                        { value: "draft", label: "draft" },
                        { value: "published", label: "published" },
                    ]}
                />
                <div className="flex items-end pb-1">
                    <TerminalCheckbox
                        label="featured project"
                        checked={form.isFeatured}
                        onChange={(e) =>
                            updateField("isFeatured", e.target.checked)
                        }
                    />
                </div>
            </div>

            {/* Images */}
            <ImageUploader
                images={form.images}
                onChange={(images) => updateField("images", images)}
            />

            {/* Video URL */}
            <TerminalInput
                label="video url"
                value={form.video}
                onChange={(e) => updateField("video", e.target.value)}
                placeholder="https://youtube.com/..."
                type="url"
            />

            {/* Skills */}
            <SkillPicker
                selected={form.skills}
                onChange={(skills) => updateField("skills", skills)}
            />

            {/* URLs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TerminalInput
                    label="github url"
                    value={form.githubUrl}
                    onChange={(e) => updateField("githubUrl", e.target.value)}
                    placeholder="https://github.com/..."
                    type="url"
                />
                <TerminalInput
                    label="demo url"
                    value={form.demoUrl}
                    onChange={(e) => updateField("demoUrl", e.target.value)}
                    placeholder="https://..."
                    type="url"
                />
            </div>

            {/* Action bar */}
            <div className="flex gap-3 pt-4 border-t border-neutral-800">
                <TerminalButton
                    type="submit"
                    variant="primary"
                    disabled={isSaving || !form.name}
                    prefix="$"
                >
                    {isSaving ? "saving..." : "save"}
                </TerminalButton>
                <TerminalButton
                    type="button"
                    variant="ghost"
                    onClick={onCancel}
                    disabled={isSaving}
                >
                    cancel
                </TerminalButton>
            </div>
        </form>
    );
}
