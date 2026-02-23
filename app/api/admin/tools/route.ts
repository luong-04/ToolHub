import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { translate } from '@vitalets/google-translate-api';

const LANGUAGES = ['en', 'ja', 'ko', 'id', 'es', 'pt', 'de', 'fr', 'hi'];

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, slug, categoryId, componentKey, description, content } = body;

        if (!name || !slug || !categoryId || !componentKey) {
            return NextResponse.json({ error: "Thiếu thông tin bắt buộc" }, { status: 400 });
        }

        // 1. Lưu bản dịch gốc Tiếng Việt trước
        const translationsToCreate = [
            { language: 'vi', name, description, content }
        ];

        // 2. Tự động dịch sang 9 ngôn ngữ còn lại
        console.log("🚀 Đang tự động dịch sang 9 ngôn ngữ...");

        for (const lang of LANGUAGES) {
            try {
                // Dịch tên, mô tả và nội dung
                const [resName, resDesc, resContent] = await Promise.all([
                    translate(name, { to: lang }),
                    description ? translate(description, { to: lang }) : { text: "" },
                    content ? translate(content, { to: lang }) : { text: "" }
                ]);

                translationsToCreate.push({
                    language: lang,
                    name: resName.text,
                    description: resDesc.text || null,
                    content: resContent.text || null
                });
            } catch (err) {
                console.error(`Lỗi khi dịch sang ${lang}:`, err);
                // Nếu lỗi, lấy tạm Tiếng Việt hoặc bỏ qua để không làm sập tiến trình
                translationsToCreate.push({
                    language: lang,
                    name: name,
                    description: description || null,
                    content: content || null
                });
            }
        }

        // 3. Lưu vào Database
        const tool = await prisma.tool.create({
            data: {
                slug,
                categoryId,
                componentKey,
                isPublished: false,
                translations: {
                    create: translationsToCreate
                }
            },
        });

        console.log("✅ Đã thêm công cụ và tự động dịch hoàn tất!");
        return NextResponse.json(tool);
    } catch (error: any) {
        console.error("Lỗi API Admin:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Giữ nguyên các hàm PATCH và DELETE cũ của bạn
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