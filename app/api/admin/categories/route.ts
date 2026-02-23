import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { translate } from '@vitalets/google-translate-api';

// Danh sách các ngôn ngữ cần dịch sang (không bao gồm bản gốc 'vi')
const LANGUAGES = ['en', 'ja', 'ko', 'id', 'es', 'pt', 'de', 'fr', 'hi'];

export async function POST(req: NextRequest) {
    try {
        const { name } = await req.json(); // Nhận tên Tiếng Việt từ Admin
        if (!name) return NextResponse.json({ error: "Tên danh mục không được trống" }, { status: 400 });

        // Tạo slug chuẩn SEO từ tên Tiếng Việt
        const slug = name
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");

        const existing = await prisma.category.findUnique({ where: { slug } });
        if (existing) return NextResponse.json({ error: "Slug đã tồn tại" }, { status: 400 });

        // 1. Chuẩn bị mảng dịch thuật, bắt đầu bằng bản gốc Tiếng Việt
        const translationsToCreate = [
            { language: 'vi', name: name }
        ];

        // 2. Tiến hành dịch tự động sang 9 ngôn ngữ còn lại
        console.log(`🚀 Đang dịch danh mục "${name}" sang 9 ngôn ngữ...`);

        for (const lang of LANGUAGES) {
            try {
                const res = await translate(name, { to: lang });
                translationsToCreate.push({
                    language: lang,
                    name: res.text
                });
            } catch (err) {
                console.error(`Lỗi khi dịch danh mục sang ${lang}:`, err);
                // Nếu dịch lỗi, lấy tạm tên Tiếng Việt làm dự phòng
                translationsToCreate.push({
                    language: lang,
                    name: name
                });
            }
        }

        // 3. Tạo Category và lồng các bản dịch vào cùng một lúc
        const category = await prisma.category.create({
            data: {
                slug,
                translations: {
                    create: translationsToCreate
                }
            },
            include: { translations: true }
        });

        console.log("✅ Đã tạo danh mục và dịch thuật hoàn tất.");
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

        // Kiểm tra xem danh mục có công cụ nào không trước khi xóa
        const toolsCount = await prisma.tool.count({ where: { categoryId: id } });
        if (toolsCount > 0) {
            return NextResponse.json(
                { error: `Không thể xóa: danh mục đang chứa ${toolsCount} công cụ` },
                { status: 400 }
            );
        }

        // Xóa danh mục (bảng dịch thuật sẽ tự động xóa nhờ onDelete: Cascade)
        await prisma.category.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}