import { MetadataRoute } from "next";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/data";
import { cookies } from "next/headers";
import type { Schema } from "@/amplify/data/resource";
import outputs from "@/amplify_outputs.json";

const client = generateServerClientUsingCookies<Schema>({
    config: outputs,
    cookies,
});

/**
 * Sitemap configuration - helps search engines discover and index pages
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://konarobinson.com";

    // Static routes
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1.0,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/projects`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.9,
        },
    ];

    // Fetch published projects from database
    try {
        const { data: projects } = await client.models.PortfolioProjectV2.list({
            authMode: "identityPool",
        });

        // Filter for published projects and map to sitemap entries
        const projectRoutes: MetadataRoute.Sitemap = projects
            .filter((project) => project.status === "published")
            .map((project) => ({
                url: `${baseUrl}/projects/${project.id}`,
                lastModified: project.updatedAt
                    ? new Date(project.updatedAt)
                    : new Date(),
                changeFrequency: "monthly" as const,
                priority: 0.7,
            }));

        return [...staticRoutes, ...projectRoutes];
    } catch (error) {
        console.error("Failed to fetch projects for sitemap:", error);
        // Return static routes only if database fetch fails
        return staticRoutes;
    }
}
