"use client";

import Image from "next/image";
import { renderIcon } from "@/lib/utils/get-icon";
import type { SkillIconName } from "@/lib/constants/skill-icons";

export function AboutMe() {
    interface MySkills {
        [key: string]: string[];
    }

    const mySkills: MySkills = {
        frontend: [
            "react",
            "nextjs",
            "react-native",
            "typescript",
            "javascript",
            "tailwindcss",
            "css",
        ],
        backend: [
            "nodejs",
            "aws-amplify",
            "mysql",
            "sqlite",
            "graphql",
            "aws-dynamodb",
        ],
        cloud: ["aws", "vercel", "aws-lambda", "aws-step-functions", "aws-cdk"],
        tools: ["docker", "git", "gitlab", "github"],
        additional: ["c++", "golang", "java", "python", "php"],
    };

    return (
        <section className="w-full max-w-4xl mx-auto px-4 py-20 relative">
            {/* Terminal header */}
            <div className="font-mono text-neutral-500 text-sm mb-6">
                <span className="text-green-400">$</span> cat about.txt
            </div>

            {/* About content */}
            <div className="space-y-8 relative">
                <h1 className="font-mono text-3xl text-green-400">ABOUT ME</h1>

                <div className="space-y-6 text-neutral-300 font-mono text-sm">
                    {/* Bio section */}
                    <div className="space-y-4">
                        <p className="text-neutral-400">
                            <span className="text-cyan-400">{">"}</span>{" "}
                            I&apos;m Connor, a 3rd year degree apprentice in the
                            UK specializing in TypeScript and AWS cloud
                            development.
                        </p>
                        <p className="text-neutral-400">
                            <span className="text-cyan-400">{">"}</span> I build
                            scalable React web applications and APIs on AWS,
                            with additional experience in React Native mobile
                            development.
                        </p>
                        <p className="text-neutral-400">
                            <span className="text-cyan-400">{">"}</span> In my
                            spare time, I&apos;m always tinkering — whether
                            that&apos;s side projects or experimenting with new
                            technologies.
                        </p>
                    </div>

                    {/* Skills section */}
                    <div className="space-y-4 pt-4 border-t border-neutral-800">
                        <h2 className="text-lg text-green-400">
                            <span className="text-neutral-600">#</span> SKILLS
                        </h2>
                        <div className="space-y-4 pl-4 border-l-2 border-neutral-700">
                            {Object.entries(mySkills).map(
                                ([category, skills]) => (
                                    <div key={category}>
                                        <div className="flex items-center gap-2 mb-3">
                                            <p className="text-cyan-400 uppercase text-xs tracking-wide">
                                                {category}
                                            </p>
                                            {category === "additional" && (
                                                <p className="text-neutral-500 text-xs">
                                                    I don&apos;t use these
                                                    regularly but have some
                                                    experience
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap gap-2.5">
                                            {skills.map((skill) => (
                                                <div
                                                    key={skill}
                                                    className="flex items-center gap-2 px-3 py-2 border border-neutral-700 rounded-none bg-neutral-900 hover:bg-neutral-800 hover:border-cyan-400 transition-colors"
                                                >
                                                    <div className="shrink-0 text-cyan-400 w-4 h-4">
                                                        {renderIcon(
                                                            skill as SkillIconName,
                                                            "w-4 h-4",
                                                        )}
                                                    </div>
                                                    <span className="text-neutral-300 text-xs capitalize">
                                                        {skill.replace(
                                                            /\./g,
                                                            "",
                                                        )}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ),
                            )}
                        </div>
                    </div>

                    {/* Laptop edge animation */}
                    <div className="absolute bottom-4 right-4 pointer-events-none">
                        <Image
                            src="/laptop_edge.gif"
                            alt="Chibi character sitting on laptop edge"
                            width={128}
                            height={128}
                            className="h-32 w-auto -mb-8 opacity-90"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
