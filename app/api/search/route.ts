import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const q = req.nextUrl.searchParams.get("q")?.trim() || "";
    const locale = req.nextUrl.searchParams.get("locale") || "en";

    if (q.length < 1) return NextResponse.json([]);

    try {
        const rawTools = await prisma.tool.findMany({
            where: {
                isPublished: true,
                OR: [
                    { slug: { contains: q } },
                    {
                        translations: {
                            some: {
                                language: { in: [locale, "en"] },
                                OR: [
                                    { name: { contains: q } },
                                    { description: { contains: q } }
                                ]
                            }
                        }
                    }
                ]
            },
            include: {
                category: { select: { name: true } },
                translations: {
                    where: { language: { in: [locale, "en"] } }
                }
            },
            take: 6,
            orderBy: { createdAt: "desc" },
        });

        // Format lại dữ liệu: Bơm name và description từ bản dịch ra ngoài
        const tools = rawTools.map(tool => {
            const trans = tool.translations.find(t => t.language === locale) || tool.translations[0];
            return {
                slug: tool.slug,
                name: trans?.name || tool.componentKey,
                description: trans?.description || "",
                category: tool.category,
            };
        });

        return NextResponse.json(tools);
    } catch (error) {
        console.error("Search error:", error);
        return NextResponse.json([], { status: 500 });
    }
}