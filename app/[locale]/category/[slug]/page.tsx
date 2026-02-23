import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/routing";

type Props = {
    params: Promise<{ locale: string; slug: string }>;
};

export default async function CategoryPage({ params }: Props) {
    const { locale, slug } = await params;

    // 1. Lấy danh mục và lồng các tool đã xuất bản (kèm bản dịch)
    const categoryRaw = await prisma.category.findUnique({
        where: { slug },
        include: {
            tools: {
                where: { isPublished: true },
                orderBy: { createdAt: "desc" },
                include: {
                    translations: {
                        where: { language: { in: [locale, "en"] } }
                    }
                }
            },
        },
    });

    if (!categoryRaw) {
        return notFound();
    }

    // 2. Format lại mảng tools để gán name và description cho chuẩn UI
    const tools = categoryRaw.tools.map(tool => {
        const trans =
            tool.translations.find(t => t.language === locale) ||
            tool.translations.find(t => t.language === "en") ||
            tool.translations[0];

        return {
            ...tool,
            name: trans?.name || tool.componentKey,
            description: trans?.description || ""
        };
    });

    return (
        <div className="max-w-6xl mx-auto space-y-8 sm:space-y-12 pt-6 sm:pt-10">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs text-gray-500">
                <Link href="/" className="hover:text-neon-blue transition-colors">Trang chủ</Link>
                <span>/</span>
                <span className="text-gray-400">Danh mục</span>
                <span>/</span>
                <span className="text-gray-300">{categoryRaw.name}</span>
            </nav>

            {/* Header Danh mục */}
            <div className="space-y-4">
                <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
                    {categoryRaw.name}
                </h1>
                <div className="h-1 w-16 bg-gradient-to-r from-neon-blue to-blue-600 rounded-full" />
                <p className="text-gray-400">
                    Khám phá {tools.length} công cụ hỗ trợ tối ưu trong danh mục {categoryRaw.name}.
                </p>
            </div>

            {/* Danh sách Công cụ */}
            {tools.length === 0 ? (
                <div className="glass-card p-10 text-center text-gray-500">
                    Đang cập nhật công cụ cho danh mục này...
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {tools.map((tool) => (
                        <Link
                            key={tool.id}
                            href={`/tools/${tool.slug}`}
                            className="glass-card group relative"
                        >
                            <span className="text-[10px] font-bold text-neon-blue/50 uppercase tracking-widest">
                                {categoryRaw.name}
                            </span>
                            <h3 className="text-lg font-bold mt-2 text-white group-hover:text-neon-blue transition-colors duration-300">
                                {tool.name}
                            </h3>
                            <p className="mt-3 text-sm text-gray-500 line-clamp-2">
                                {tool.description || "Công cụ xử lý dữ liệu thông minh, nhanh chóng và bảo mật."}
                            </p>
                            <div className="mt-4 flex items-center gap-2 text-xs text-neon-blue/40 group-hover:text-neon-blue transition-all duration-300">
                                Mở công cụ
                                <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}