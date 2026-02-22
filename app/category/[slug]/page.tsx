import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const category = await prisma.category.findUnique({ where: { slug } });

    if (!category) return { title: "Danh mục không tồn tại — ToolHub" };

    const title = `${category.name} — Công Cụ Trực Tuyến Miễn Phí | ToolHub`;
    const description = `Khám phá bộ sưu tập ${category.name} miễn phí tại ToolHub. Xử lý 100% tại trình duyệt, bảo mật tuyệt đối, không cần đăng ký.`;

    return {
        title,
        description,
        openGraph: { title, description, type: "website", locale: "vi_VN", siteName: "ToolHub" },
        alternates: { canonical: `/category/${slug}` },
    };
}

export default async function CategoryPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const category = await prisma.category.findUnique({
        where: { slug },
        include: {
            tools: {
                where: { isPublished: true },
                orderBy: { createdAt: "desc" },
            },
        },
    });

    if (!category) return notFound();

    // JSON-LD
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: category.name,
        description: `Bộ sưu tập ${category.name} miễn phí tại ToolHub.`,
        url: `https://toolhub.vn/category/${category.slug}`,
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="space-y-8 sm:space-y-12">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-xs text-gray-500">
                    <Link href="/" className="hover:text-neon-blue transition-colors">Trang chủ</Link>
                    <span>/</span>
                    <span className="text-gray-400">{category.name}</span>
                </nav>

                {/* Header */}
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-1 h-10 rounded-full bg-gradient-to-b from-neon-blue to-blue-600" />
                        <div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white">{category.name}</h1>
                            <p className="text-sm text-gray-500 mt-1">
                                {category.tools.length} công cụ có sẵn
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tool grid */}
                {category.tools.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {category.tools.map((tool, i) => (
                            <Link
                                href={`/tools/${tool.slug}`}
                                key={tool.id}
                                className="glass-card group relative"
                            >
                                {i < 3 && (
                                    <div className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-neon-blue/10 border border-neon-blue/20 text-[10px] font-bold text-neon-blue uppercase tracking-wider">
                                        Mới
                                    </div>
                                )}
                                <h3 className="text-lg font-bold text-white group-hover:text-neon-blue transition-colors duration-300">
                                    {tool.name}
                                </h3>
                                <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                                    {tool.description || "Công cụ xử lý dữ liệu thông minh và bảo mật."}
                                </p>
                                <div className="mt-4 flex items-center gap-2 text-xs text-neon-blue/40 group-hover:text-neon-blue transition-all duration-300">
                                    Sử dụng ngay
                                    <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="text-4xl mb-4">🔧</div>
                        <p className="text-gray-500">Chưa có công cụ nào trong danh mục này.</p>
                        <Link href="/" className="inline-block mt-4 text-sm text-neon-blue hover:underline">
                            ← Quay về trang chủ
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}
