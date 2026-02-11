/**
 * SkillEditor — Inline form for creating or editing a single skill.
 * Renders as a row with input fields and save/cancel actions.
 */
"use client";

import { useState } from "react";
import { TerminalInput } from "@/components/ui/terminal-input";
import { TerminalSelect } from "@/components/ui/terminal-select";
import { TerminalButton } from "@/components/ui/terminal-button";

export interface SkillFormData {
    name: string;
    displayName: string;
    lucideIconName: string;
    type: "language" | "framework" | "platform";
}

const EMPTY_SKILL: SkillFormData = {
    name: "",
    displayName: "",
    lucideIconName: "",
    type: "language",
};

const SKILL_TYPE_OPTIONS = [
    { value: "language", label: "language" },
    { value: "framework", label: "framework" },
    { value: "platform", label: "platform" },
];

interface SkillEditorProps {
    /** Initial data when editing an existing skill */
    initialData?: Partial<SkillFormData>;
    /** Called when the user saves */
    onSave: (data: SkillFormData) => Promise<void>;
    /** Called when the user cancels */
    onCancel: () => void;
    /** Whether a save is in progress */
    isSaving?: boolean;
}

export function SkillEditor({
    initialData,
    onSave,
    onCancel,
    isSaving = false,
}: SkillEditorProps) {
    const [form, setForm] = useState<SkillFormData>({
        ...EMPTY_SKILL,
        ...initialData,
    });

    const updateField = <K extends keyof SkillFormData>(
        key: K,
        value: SkillFormData[K],
    ) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSave(form);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="border border-cyan-400 p-4 space-y-3"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <TerminalInput
                    label="name (identifier) *"
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder="react"
                    required
                />
                <TerminalInput
                    label="display name *"
                    value={form.displayName}
                    onChange={(e) => updateField("displayName", e.target.value)}
                    placeholder="React"
                    required
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <TerminalInput
                    label="lucide icon name"
                    value={form.lucideIconName}
                    onChange={(e) =>
                        updateField("lucideIconName", e.target.value)
                    }
                    placeholder="code-2"
                />
                <TerminalSelect
                    label="type *"
                    value={form.type}
                    onChange={(e) =>
                        updateField(
                            "type",
                            e.target.value as SkillFormData["type"],
                        )
                    }
                    options={SKILL_TYPE_OPTIONS}
                />
            </div>
            <div className="flex gap-2 pt-2">
                <TerminalButton
                    type="submit"
                    variant="primary"
                    disabled={isSaving || !form.name || !form.displayName}
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
