// app/tools/[slug]/page.tsx
import { ToolRegistry } from '@/components/tools/tool-registry';
import prisma from "../../../lib/prisma"; // Bạn cần tạo file prisma.ts trong lib để kết nối

export default async function ToolPage({ params }: { params: { slug: string } }) {
    // 1. Lấy dữ liệu từ DB
    const toolData = await prisma.tool.findUnique({
        where: { slug: params.slug }
    });

    if (!toolData) return <div>Tool không tồn tại!</div>;

    // 2. Lấy Component Logic tương ứng từ Registry
    const SelectedTool = ToolRegistry[toolData.componentKey];

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-extrabold mb-6">{toolData.name}</h1>

            {/* KHU VỰC CHẠY TOOL */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-10">
                {SelectedTool ? <SelectedTool /> : <p>Đang tải...</p>}
            </div>

            {/* KHU VỰC SEO - Thuần HTML để Google Index tốt */}
            <article className="prose lg:prose-xl">
                <div dangerouslySetInnerHTML={{ __html: toolData.content }} />
            </article>
        </div>
    );
}