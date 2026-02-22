import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { AVAILABLE_COMPONENT_KEYS } from "@/components/tools/available-keys";

export async function GET() {
    const [categories, tools] = await Promise.all([
        prisma.category.findMany({ orderBy: { name: "asc" } }),
        prisma.tool.findMany({
            include: { category: true },
            orderBy: { createdAt: "desc" },
        }),
    ]);
    return NextResponse.json({
        categories,
        tools,
        availableKeys: AVAILABLE_COMPONENT_KEYS,
    });
}
