"use client";

export function AboutMe() {
    return (
        <section className="w-full max-w-4xl mx-auto px-4 py-20">
            {/* Terminal header */}
            <div className="font-mono text-neutral-500 text-sm mb-6">
                <span className="text-green-400">$</span> cat about.txt
            </div>

            {/* About content */}
            <div className="space-y-8">
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4 border-l-2 border-neutral-700">
                            <div>
                                <p className="text-cyan-400 mb-2">FRONTEND:</p>
                                <p className="text-neutral-400">
                                    [Placeholder: Your frontend technologies]
                                </p>
                            </div>
                            <div>
                                <p className="text-cyan-400 mb-2">BACKEND:</p>
                                <p className="text-neutral-400">
                                    [Placeholder: Your backend technologies]
                                </p>
                            </div>
                            <div>
                                <p className="text-cyan-400 mb-2">CLOUD:</p>
                                <p className="text-neutral-400">
                                    [Placeholder: Your cloud platforms]
                                </p>
                            </div>
                            <div>
                                <p className="text-cyan-400 mb-2">TOOLS:</p>
                                <p className="text-neutral-400">
                                    [Placeholder: Your development tools]
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Experience section */}
                    <div className="space-y-4 pt-4 border-t border-neutral-800">
                        <h2 className="text-lg text-green-400">
                            <span className="text-neutral-600">#</span>{" "}
                            EXPERIENCE
                        </h2>
                        <div className="space-y-4 pl-4 border-l-2 border-neutral-700">
                            <div>
                                <p className="text-cyan-400">
                                    [Placeholder: Job Title]
                                </p>
                                <p className="text-neutral-500 text-xs">
                                    [Company Name] • [Date Range]
                                </p>
                                <p className="text-neutral-400 mt-2">
                                    [Placeholder: Brief description of role and
                                    achievements]
                                </p>
                            </div>
                            <div>
                                <p className="text-cyan-400">
                                    [Placeholder: Job Title]
                                </p>
                                <p className="text-neutral-500 text-xs">
                                    [Company Name] • [Date Range]
                                </p>
                                <p className="text-neutral-400 mt-2">
                                    [Placeholder: Brief description of role and
                                    achievements]
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
