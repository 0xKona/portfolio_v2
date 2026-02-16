"use client";

import { useRouter } from "next/navigation";
import { ProjectGrid } from "@/components/projects/project-grid";

export function FeaturedProjects() {
  const router = useRouter();

  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-12">
      <div className="font-mono text-neutral-500 text-sm mb-4">
        <span className="text-green-400">$</span> ls ~/projects --featured
      </div>

      <div className="mb-6">
        <h2 className="text-green-400 font-mono text-2xl mb-2">
          FEATURED PROJECTS
        </h2>
        <p className="text-neutral-500 text-sm font-mono">
          Showcasing my best work
        </p>
      </div>

      <ProjectGrid featuredOnly={true} publishedOnly={true} maxRows={1} />

      <div className="text-center mt-8">
        <button
          onClick={() => router.push("/projects")}
          className="border border-neutral-700 px-6 py-2 text-neutral-300 hover:border-cyan-400 hover:text-cyan-400 transition-colors font-mono text-sm"
        >
          view all projects →
        </button>
      </div>
    </section>
  );
}
