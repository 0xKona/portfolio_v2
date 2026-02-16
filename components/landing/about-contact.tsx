"use client";
import { GameTrigger } from "@/components/game/game-trigger";
import { SOCIAL_LINKS } from "@/lib/constants/social-links";

export function AboutContact() {
    const { github, linkedIn } = SOCIAL_LINKS;

    return (
        <section className="w-full max-w-4xl mx-auto px-4 py-20 border-t border-neutral-800">
            {/* Terminal header */}
            <div className="font-mono text-neutral-500 text-sm mb-6">
                <span className="text-green-400">$</span> cat contact.txt
            </div>

            {/* Contact content */}
            <div className="space-y-8">
                <h2 className="font-mono text-3xl text-green-400">
                    GET IN TOUCH
                </h2>

                <div className="space-y-4 text-neutral-300 font-mono text-sm">
                    <p>
                        {">"} Feel free to reach out for collaborations,
                        opportunities, or just to say hi!
                    </p>

                    <div className="space-y-2 pl-4 border-l-2 border-neutral-700">
                        <p>
                            <span className="text-cyan-400">GITHUB:</span>{" "}
                            <a
                                href={github.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-neutral-400 hover:text-green-400 transition-colors underline"
                            >
                                {github.url}
                            </a>
                        </p>
                        <p>
                            <span className="text-cyan-400">LINKEDIN:</span>{" "}
                            <a
                                href={linkedIn.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-neutral-400 hover:text-green-400 transition-colors underline"
                            >
                                {linkedIn.url}
                            </a>
                        </p>
                    </div>
                </div>

                <GameTrigger
                    label="That's it! Might as well play a mini-game"
                    variant="ghost"
                />
            </div>
        </section>
    );
}
