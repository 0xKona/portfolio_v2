/**
 * SkillsManagerPage — Page for creating, editing, and deleting skills.
 * Provides an inline editor and a tabular list of all skills.
 */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSkills, type AmplifySkill } from "@/hooks/use-skills";
import { SkillList } from "@/components/manager/skill-list";
import {
    SkillEditor,
    type SkillFormData,
} from "@/components/manager/skill-editor";
import { TerminalButton } from "@/components/ui/terminal-button";

export default function SkillsManagerPage() {
    const router = useRouter();
    const { skills, isLoading, error, createSkill, updateSkill, deleteSkill } =
        useSkills();

    /** Which skill is being edited — null for create mode, undefined for closed */
    const [editingSkill, setEditingSkill] = useState<
        AmplifySkill | null | undefined
    >(undefined);
    const [isSaving, setIsSaving] = useState(false);

    const isEditorOpen = editingSkill !== undefined;

    /** Open editor for new skill */
    const handleCreate = () => setEditingSkill(null);

    /** Open editor for existing skill */
    const handleEdit = (skill: AmplifySkill) => setEditingSkill(skill);

    /** Close editor */
    const handleCancel = () => setEditingSkill(undefined);

    /** Save — create or update depending on mode */
    const handleSave = async (data: SkillFormData) => {
        setIsSaving(true);
        try {
            if (editingSkill) {
                await updateSkill(editingSkill.id, data);
            } else {
                await createSkill(data);
            }
            setEditingSkill(undefined);
        } finally {
            setIsSaving(false);
        }
    };

    /** Delete with confirmation */
    const handleDelete = async (id: string) => {
        if (!confirm("Delete this skill?")) return;
        await deleteSkill(id);
    };

    return (
        <main className="min-h-screen pt-20 pb-12">
            {/* Page header */}
            <div className="flex items-center justify-between mb-8 border-b border-neutral-800 pb-4">
                <div>
                    <h1 className="text-neutral-300 text-sm font-mono">
                        <span className="text-neutral-500">$</span> ls
                        ~/manager/skills
                    </h1>
                    <p className="text-neutral-600 text-xs font-mono mt-1">
                        {skills.length} skill{skills.length !== 1 ? "s" : ""}{" "}
                        found
                    </p>
                </div>
                <div className="flex gap-3">
                    <TerminalButton
                        variant="secondary"
                        onClick={() => router.push("/manager")}
                    >
                        &gt; projects
                    </TerminalButton>
                    {!isEditorOpen && (
                        <TerminalButton
                            variant="primary"
                            onClick={handleCreate}
                            prefix="+"
                        >
                            new skill
                        </TerminalButton>
                    )}
                </div>
            </div>

            {/* Inline editor */}
            {isEditorOpen && (
                <div className="mb-8">
                    <SkillEditor
                        key={editingSkill?.id ?? "new"}
                        initialData={
                            editingSkill
                                ? {
                                      name: editingSkill.name,
                                      displayName: editingSkill.displayName,
                                      lucideIconName:
                                          editingSkill.lucideIconName ?? "",
                                      type:
                                          (editingSkill.type as SkillFormData["type"]) ??
                                          "language",
                                  }
                                : undefined
                        }
                        onSave={handleSave}
                        onCancel={handleCancel}
                        isSaving={isSaving}
                    />
                </div>
            )}

            {/* Skills table */}
            <SkillList
                skills={skills}
                isLoading={isLoading}
                error={error}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </main>
    );
}
