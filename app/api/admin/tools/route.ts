import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, slug, categoryId, componentKey, description, content } = body;

        if (!name || !slug || !categoryId || !componentKey) {
            return NextResponse.json({ error: "Thiếu thông tin bắt buộc" }, { status: 400 });
        }

        const existing = await prisma.tool.findUnique({ where: { slug } });
        if (existing) return NextResponse.json({ error: "Slug đã tồn tại" }, { status: 400 });

        const tool = await prisma.tool.create({
            data: {
                name,
                slug,
                categoryId,
                componentKey,
                description: description || null,
                content: content || "<p>Nội dung đang cập nhật...</p>",
                isPublished: false,
            },
        });
        return NextResponse.json(tool);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, isPublished } = body;

        const tool = await prisma.tool.update({
            where: { id },
            data: { isPublished },
        });
        return NextResponse.json(tool);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

        await prisma.tool.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
