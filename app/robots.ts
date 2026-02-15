import { MetadataRoute } from "next";

/**
 * Robots.txt configuration - allows all crawlers to index all pages
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */
export default function robots(): MetadataRoute.Robots {
    const baseUrl = "https://konarobinson.com";

    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/manager", "/signin"],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
