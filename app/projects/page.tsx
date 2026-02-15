import { AsciiTitle } from "@/components/ui/ascii-title";
import { ProjectGrid } from "@/components/projects/project-grid";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Projects",
    description:
        "Explore my portfolio of software development projects, including full-stack applications, cloud architecture, and web development work.",
    openGraph: {
        title: "Projects | Connor Robinson",
        description:
            "Explore my portfolio of software development projects, including full-stack applications, cloud architecture, and web development work.",
    },
};

/** Projects — Public-facing projects listing page */
export default function ProjectsPage() {
    return (
        <main className="min-h-screen flex flex-col items-center pt-20 pb-12">
            {/* ASCII heading */}
            <AsciiTitle text="MY PROJECTS" className="mb-8" />

            {/* Subtitle */}
            <p className="text-neutral-500 text-sm font-mono mb-10 text-center">
                <span className="text-neutral-600">$</span> ls ~/projects --all
            </p>

            {/* Projects grid */}
            <div className="w-full max-w-6xl px-4">
                <ProjectGrid publishedOnly={true} />
            </div>
        </main>
    );
}
