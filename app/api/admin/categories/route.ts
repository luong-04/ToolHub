import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { name } = await req.json();
        if (!name) return NextResponse.json({ error: "Tên danh mục không được trống" }, { status: 400 });

        const slug = name
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");

        const existing = await prisma.category.findUnique({ where: { slug } });
        if (existing) return NextResponse.json({ error: "Slug đã tồn tại" }, { status: 400 });

        const category = await prisma.category.create({ data: { name, slug } });
        return NextResponse.json(category);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

        // Check if category has tools
        const tools = await prisma.tool.findMany({ where: { categoryId: id } });
        if (tools.length > 0) {
            return NextResponse.json(
                { error: `Không thể xóa: danh mục có ${tools.length} công cụ` },
                { status: 400 }
            );
        }

        await prisma.category.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
