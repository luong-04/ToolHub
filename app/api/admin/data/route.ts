import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { AVAILABLE_COMPONENT_KEYS } from "@/components/tools/available-keys";

export async function GET() {
    const [categories, rawTools] = await Promise.all([
        prisma.category.findMany({ orderBy: { name: "asc" } }),
        prisma.tool.findMany({
            include: {
                category: true,
                translations: true // Bổ sung lấy bản dịch
            },
            orderBy: { createdAt: "desc" },
        }),
    ]);

    // Format lại dữ liệu cho Admin Page dễ đọc
    const tools = rawTools.map(tool => {
        // Ưu tiên hiển thị tiếng Việt trong Admin, nếu không có thì lấy tiếng Anh
        const trans = tool.translations.find(t => t.language === 'vi')
            || tool.translations.find(t => t.language === 'en')
            || tool.translations[0];

        return {
            ...tool,
            name: trans?.name || tool.componentKey,
            description: trans?.description || "",
            content: trans?.content || ""
        };
    });

    return NextResponse.json({
        categories,
        tools,
        availableKeys: AVAILABLE_COMPONENT_KEYS,
    });
}