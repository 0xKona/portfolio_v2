import { use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useProject } from "@/hooks/use-project";
import { useResolvedImageUrl } from "@/hooks/use-resolved-image-url";
import { TerminalLoading } from "@/components/ui/terminal-loading";
import { TerminalErrorBox } from "@/components/ui/terminal-error-box";
import { TerminalButton } from "@/components/ui/terminal-button";
import { ImageSkeleton } from "@/components/ui/image-skeleton";
import { renderIcon } from "@/lib/utils/get-icon";
import type { SkillIconName } from "@/lib/constants/skill-icons";
import type { ProjectImage } from "@/types/data-types";

interface ProjectDetailPageProps {
    params: Promise<{ id: string }>;
}

/** Image component with S3 URL resolution and skeleton loading */
function ProjectImageDisplay({ image }: { image: ProjectImage }) {
    const resolvedUrl = useResolvedImageUrl(image.url);
    const originalUrl = useResolvedImageUrl(
        image.url.replace(/-preview\.jpg$/, "")
    );

    if (!resolvedUrl) return null;

    return (
        <div className="border border-neutral-700">
            <div className="relative w-full aspect-video">
                {!originalUrl ? (
                    <ImageSkeleton className="w-full h-full" />
                ) : (
                    <Image
                        src={originalUrl}
                        alt={image.alt}
                        fill
                        className="object-cover"
                        unoptimized
                        placeholder="blur"
                        blurDataURL={resolvedUrl}
                    />
                )}
            </div>
            {image.caption && (
                <p className="text-neutral-500 text-xs font-mono p-2 border-t border-neutral-800">
                    {image.caption}
                </p>
            )}
        </div>
    );
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
    const { id } = use(params);
    const router = useRouter();
    const { project, isLoading, error } = useProject(id);

    if (isLoading) {
        return (
            <main className="min-h-screen pt-20 pb-12 flex justify-center">
                <TerminalLoading message="loading project..." />
            </main>
        );
    }

    if (error || !project) {
        return (
            <main className="min-h-screen pt-20 pb-12">
                <TerminalErrorBox
                    title="ERROR"
                    message={error ?? "Project not found"}
                />
                <div className="mt-4">
                    <TerminalButton
                        variant="secondary"
                        onClick={() => router.push("/projects")}
                    >
                        ← back to projects
                    </TerminalButton>
                </div>
            </main>
        );
    }

    // Filter valid images
    const images = (project.images ?? []).filter(
        (img): img is ProjectImage => img !== null && img !== undefined,
    );

    // Filter valid skills
    const skills = (project.skills ?? []).filter(
        (s): s is string => s !== null && s !== undefined,
    );

    return (
        <main className="min-h-screen pt-20 pb-12">
            {/* Back navigation */}
            <div className="mb-6">
                <button
                    onClick={() => router.push("/projects")}
                    className="text-neutral-500 hover:text-cyan-400 text-xs font-mono transition-colors"
                >
                    ← back to projects
                </button>
            </div>

            {/* Header */}
            <header className="mb-8 border-b border-neutral-800 pb-6">
                <div className="flex items-center gap-3 mb-2">
                    {project.isFeatured && (
                        <span className="text-xs text-cyan-400 font-mono">
                            ★ featured
                        </span>
                    )}
                    <span
                        className={`text-xs font-mono ${
                            project.status === "published"
                                ? "text-green-400"
                                : "text-neutral-500"
                        }`}
                    >
                        [{project.status}]
                    </span>
                </div>

                <h1 className="text-neutral-300 text-2xl font-mono mb-2">
                    <span className="text-neutral-500">$</span> {project.name}
                </h1>

                {project.desc && (
                    <p className="text-neutral-400 text-sm font-mono max-w-2xl">
                        {project.desc}
                    </p>
                )}
            </header>

            {/* Main content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Images section */}
                <div className="lg:col-span-2 space-y-4">
                    {images.length > 0 ? (
                        images.map((image, index) => (
                            <ProjectImageDisplay key={index} image={image} />
                        ))
                    ) : (
                        <div className="border border-neutral-800 p-8 text-center">
                            <p className="text-neutral-600 text-xs font-mono">
                                no images available
                            </p>
                        </div>
                    )}

                    {/* Video embed */}
                    {project.video && (
                        <div className="border border-neutral-700 p-4">
                            <p className="text-neutral-500 text-xs font-mono mb-2">
                                video
                            </p>
                            <a
                                href={project.video}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-cyan-400 hover:text-cyan-300 text-sm font-mono break-all"
                            >
                                {project.video}
                            </a>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Skills */}
                    {skills.length > 0 && (
                        <div className="border border-neutral-800 p-4">
                            <h2 className="text-neutral-500 text-xs font-mono mb-3">
                                technologies
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="inline-flex items-center gap-1 text-xs text-neutral-300 border border-neutral-700 px-2 py-1 font-mono"
                                    >
                                        {renderIcon(skill as SkillIconName)}
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Links */}
                    {(project.githubUrl || project.demoUrl) && (
                        <div className="border border-neutral-800 p-4">
                            <h2 className="text-neutral-500 text-xs font-mono mb-3">
                                links
                            </h2>
                            <div className="space-y-2">
                                {project.githubUrl && (
                                    <a
                                        href={project.githubUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-sm font-mono text-neutral-400 hover:text-cyan-400 transition-colors"
                                    >
                                        <span className="text-neutral-600">
                                            &gt;
                                        </span>
                                        github
                                    </a>
                                )}
                                {project.demoUrl && (
                                    <a
                                        href={project.demoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-sm font-mono text-neutral-400 hover:text-cyan-400 transition-colors"
                                    >
                                        <span className="text-neutral-600">
                                            &gt;
                                        </span>
                                        live demo
                                    </a>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Metadata */}
                    <div className="border border-neutral-800 p-4">
                        <h2 className="text-neutral-500 text-xs font-mono mb-3">
                            metadata
                        </h2>
                        <div className="space-y-1 text-xs font-mono text-neutral-600">
                            {project.createdAt && (
                                <p>
                                    created:{" "}
                                    {new Date(
                                        project.createdAt,
                                    ).toLocaleDateString()}
                                </p>
                            )}
                            {project.updatedAt && (
                                <p>
                                    updated:{" "}
                                    {new Date(
                                        project.updatedAt,
                                    ).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
