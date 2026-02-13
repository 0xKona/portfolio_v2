"use client";

import { useState, useRef, useEffect } from "react";
import {
    SKILL_ICON_NAMES,
    type SkillIconName,
} from "@/lib/constants/skill-icons";
import { renderIcon } from "@/lib/utils/get-icon";

interface SkillPickerProps {
    selected: string[];
    onChange: (selected: string[]) => void;
}

export function SkillPicker({ selected, onChange }: SkillPickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [filter, setFilter] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    /** Toggle a skill in/out of the selection by name */
    const toggleSkill = (name: string) => {
        if (selected.includes(name)) {
            onChange(selected.filter((s) => s !== name));
        } else {
            onChange([...selected, name]);
        }
    };

    /** Remove a skill from the selection */
    const removeSkill = (name: string) => {
        onChange(selected.filter((s) => s !== name));
    };

    // Filter skills by the search input
    const filteredSkills = SKILL_ICON_NAMES.filter((name) =>
        name.toLowerCase().includes(filter.toLowerCase()),
    );

    return (
        <div ref={containerRef}>
            <label className="block text-neutral-500 text-xs font-mono mb-1">
                skills
            </label>

            {/* Selected skill tags */}
            {selected.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                    {selected.map((name) => (
                        <span
                            key={name}
                            className="inline-flex items-center gap-1 text-xs text-neutral-300 border border-neutral-700 px-2 py-0.5 font-mono"
                        >
                            {renderIcon(name as SkillIconName)}
                            {name}
                            <button
                                type="button"
                                onClick={() => removeSkill(name)}
                                className="text-red-400 hover:text-red-300 ml-1"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            )}

            {/* Dropdown trigger */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="
                    w-full text-left bg-black border border-neutral-700
                    text-neutral-400 font-mono text-sm px-3 py-2
                    hover:border-cyan-400 focus:border-cyan-400 focus:outline-none
                    transition-colors cursor-pointer
                "
            >
                select skills ({selected.length} selected)
            </button>

            {/* Dropdown list */}
            {isOpen && (
                <div className="border border-neutral-700 border-t-0 max-h-48 overflow-y-auto bg-black">
                    {/* Search filter */}
                    <div className="sticky top-0 bg-black border-b border-neutral-800 p-2">
                        <input
                            type="text"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            placeholder="filter..."
                            className="
                                w-full bg-black border border-neutral-700 text-neutral-300
                                font-mono text-xs px-2 py-1
                                focus:border-cyan-400 focus:outline-none
                                placeholder:text-neutral-600
                            "
                            autoFocus
                        />
                    </div>

                    {/* Skill options */}
                    {filteredSkills.length === 0 ? (
                        <div className="text-neutral-600 text-xs font-mono px-3 py-2">
                            no skills found
                        </div>
                    ) : (
                        filteredSkills.map((name) => {
                            const isSelected = selected.includes(name);
                            return (
                                <button
                                    key={name}
                                    type="button"
                                    onClick={() => toggleSkill(name)}
                                    className={`
                                        w-full text-left px-3 py-1.5 font-mono text-xs
                                        flex items-center gap-2
                                        hover:bg-neutral-900 transition-colors cursor-pointer
                                        ${isSelected ? "text-green-400" : "text-neutral-400"}
                                    `}
                                >
                                    <span className="w-6 shrink-0 whitespace-nowrap">
                                        {isSelected ? "[×]" : "[ ]"}
                                    </span>
                                    {renderIcon(name)}
                                    <span>{name}</span>
                                </button>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
}
