// app/tools/[slug]/page.tsx
import { ToolRegistry } from '@/components/tools/tool-registry'; // Sửa lỗi ToolRegistry [cite: 865]
import prisma from '@/lib/prisma'; // Sửa lỗi prisma [cite: 866]
import { notFound } from 'next/navigation';

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const toolData = await prisma.tool.findUnique({
        where: { slug: slug },
    });

    if (!toolData || (!toolData.isPublished && process.env.NODE_ENV === 'production')) {
        return notFound();
    }

    const SelectedTool = ToolRegistry[toolData.componentKey];

    return (
        <div className="max-w-5xl mx-auto space-y-10">
            {/* Tiêu đề LED */}
            <div className="space-y-2">
                <h1 className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 uppercase italic">
                    {toolData.name}
                </h1>
                <div className="h-1 w-20 bg-cyan-500 rounded-full shadow-[0_0_10px_#06b6d4]"></div>
            </div>

            {/* Khu vực chạy Tool - Bo tròn cực đại [cite: 881] */}
            <section className="bg-[#0a0a0a] border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.05)] rounded-[3rem] p-10">
                {SelectedTool ? <SelectedTool /> : <p className="text-cyan-500 animate-pulse">Đang khởi tạo công cụ...</p>}
            </section>

            {/* Bài viết SEO - Giao diện hiện đại [cite: 885] */}
            <article className="bg-[#111] border border-white/5 rounded-[3rem] p-12 prose prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: toolData.content }} />
            </article>
        </div>
    );
}