import prisma from "@/lib/prisma";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://toolhub.vn";

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1.0,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
        },
    ];

    // Category pages
    const categories = await prisma.category.findMany({
        select: { slug: true },
    });

    const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
        url: `${baseUrl}/category/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
    }));

    // Tool pages
    const tools = await prisma.tool.findMany({
        where: { isPublished: true },
        select: { slug: true, createdAt: true },
        orderBy: { createdAt: "desc" },
    });

    const toolPages: MetadataRoute.Sitemap = tools.map((tool) => ({
        url: `${baseUrl}/tools/${tool.slug}`,
        lastModified: tool.createdAt,
        changeFrequency: "weekly" as const,
        priority: 0.9,
    }));

    return [...staticPages, ...categoryPages, ...toolPages];
}
