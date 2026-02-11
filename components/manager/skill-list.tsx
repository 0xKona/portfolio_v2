/**
 * SkillList — Displays all skills as rows with edit/delete actions.
 * Used on the skills manager page for CRUD operations.
 */
"use client";

import { TerminalButton } from "@/components/ui/terminal-button";
import { TerminalLoading } from "@/components/ui/terminal-loading";
import type { AmplifySkill } from "@/hooks/use-skills";

interface SkillListProps {
    /** Skills to display */
    skills: AmplifySkill[];
    /** Whether data is loading */
    isLoading: boolean;
    /** Error message */
    error: string | null;
    /** Called when edit is clicked */
    onEdit: (skill: AmplifySkill) => void;
    /** Called when delete is clicked */
    onDelete: (id: string) => void;
}

/** Maps skill type to a colour class for the badge */
const typeColor: Record<string, string> = {
    language: "text-green-400 border-green-400",
    framework: "text-cyan-400 border-cyan-400",
    platform: "text-yellow-400 border-yellow-400",
};

export function SkillList({
    skills,
    isLoading,
    error,
    onEdit,
    onDelete,
}: SkillListProps) {
    if (isLoading) {
        return <TerminalLoading message="loading skills..." />;
    }

    if (error) {
        return (
            <div className="text-red-400 text-sm font-mono py-12 text-center">
                <span className="text-neutral-600">$</span> error: {error}
            </div>
        );
    }

    if (skills.length === 0) {
        return (
            <div className="text-neutral-500 text-sm font-mono py-12 text-center">
                <span className="text-neutral-600">$</span> ls skills/
                <br />
                <span className="text-neutral-600 mt-2 block">
                    (empty directory)
                </span>
            </div>
        );
    }

    return (
        <div className="space-y-1">
            {/* Table header */}
            <div className="grid grid-cols-12 gap-2 text-neutral-600 text-xs font-mono px-3 py-1 border-b border-neutral-800">
                <div className="col-span-3">name</div>
                <div className="col-span-3">display</div>
                <div className="col-span-2">type</div>
                <div className="col-span-2">icon</div>
                <div className="col-span-2 text-right">actions</div>
            </div>

            {/* Skill rows */}
            {skills.map((skill) => (
                <div
                    key={skill.id}
                    className="grid grid-cols-12 gap-2 items-center text-sm font-mono px-3 py-2 border border-neutral-800 hover:border-neutral-700 transition-colors"
                >
                    <div className="col-span-3 text-neutral-300 truncate">
                        {skill.name}
                    </div>
                    <div className="col-span-3 text-neutral-400 truncate">
                        {skill.displayName}
                    </div>
                    <div className="col-span-2">
                        <span
                            className={`text-xs border px-1.5 py-0.5 ${
                                typeColor[skill.type ?? ""] ??
                                "text-neutral-500 border-neutral-700"
                            }`}
                        >
                            {skill.type ?? "—"}
                        </span>
                    </div>
                    <div className="col-span-2 text-neutral-500 truncate text-xs">
                        {skill.lucideIconName || "—"}
                    </div>
                    <div className="col-span-2 flex justify-end gap-2">
                        <TerminalButton
                            variant="ghost"
                            onClick={() => onEdit(skill)}
                            className="text-xs text-cyan-400"
                        >
                            edit
                        </TerminalButton>
                        <TerminalButton
                            variant="ghost"
                            onClick={() => onDelete(skill.id)}
                            className="text-xs text-red-400"
                        >
                            ×
                        </TerminalButton>
                    </div>
                </div>
            ))}
        </div>
    );
}
