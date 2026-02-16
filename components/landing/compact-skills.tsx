"use client";

import { renderIcon } from "@/lib/utils/get-icon";
import type { SkillIconName } from "@/lib/constants/skill-icons";

const CORE_SKILLS: SkillIconName[] = [
    "typescript",
    "react",
    "nextjs",
    "nodejs",
    "aws",
    "aws-amplify",
    "tailwindcss",
    "docker",
    "git",
    "graphql",
    "mysql",
    "aws-lambda",
];

export function CompactSkills() {
    return (
        <section className="w-full max-w-4xl mx-auto px-4 py-12">
            <div className="font-mono text-neutral-500 text-sm mb-4">
                <span className="text-green-400">$</span> cat skills.json
            </div>

            <div className="border border-neutral-800 p-6">
                <h2 className="text-green-400 font-mono text-lg mb-4">
                    CORE TECHNOLOGIES
                </h2>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                    {CORE_SKILLS.map((skill) => (
                        <div
                            key={skill}
                            className="flex flex-col items-center gap-2 p-3 border border-neutral-700 hover:border-cyan-400 transition-colors group"
                            title={skill}
                        >
                            <div className="text-cyan-400 w-8 h-8 group-hover:scale-110 transition-transform">
                                {renderIcon(skill, "w-8 h-8")}
                            </div>
                            <span className="text-neutral-400 text-xs font-mono text-center capitalize">
                                {skill.replace(/^aws-/, "")}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
