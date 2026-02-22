import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const q = req.nextUrl.searchParams.get("q")?.trim() || "";
    if (q.length < 1) return NextResponse.json([]);

    try {
        // SQLite LIKE is case-insensitive for ASCII by default
        const tools = await prisma.tool.findMany({
            where: {
                isPublished: true,
                OR: [
                    { name: { contains: q } },
                    { description: { contains: q } },
                    { slug: { contains: q } },
                ],
            },
            select: {
                name: true,
                slug: true,
                description: true,
                category: { select: { name: true } },
            },
            take: 6,
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(tools);
    } catch (error) {
        console.error("Search error:", error);
        return NextResponse.json([], { status: 500 });
    }
}
