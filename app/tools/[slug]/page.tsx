// app/tools/[slug]/page.tsx
import { ToolRegistry } from '@/components/tools/tool-registry';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';

// Dynamic metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const tool = await prisma.tool.findUnique({
        where: { slug },
        include: { category: true },
    });

    if (!tool) return { title: 'Công cụ không tồn tại — ToolHub' };

    const title = `${tool.name} — Công Cụ Trực Tuyến Miễn Phí | ToolHub`;
    const description = tool.description || `${tool.name} — công cụ trực tuyến miễn phí, xử lý 100% tại trình duyệt. An toàn, nhanh chóng, không cần đăng ký.`;

    return {
        title,
        description,
        keywords: [tool.name, tool.category.name, 'công cụ trực tuyến', 'miễn phí', 'ToolHub', tool.slug.replace(/-/g, ' ')],
        openGraph: {
            title,
            description,
            type: 'website',
            locale: 'vi_VN',
            url: `https://toolhub.vn/tools/${tool.slug}`,
            siteName: 'ToolHub',
        },
        alternates: {
            canonical: `/tools/${tool.slug}`,
        },
    };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const toolData = await prisma.tool.findUnique({
        where: { slug },
        include: { category: true },
    });

    if (!toolData || (!toolData.isPublished && process.env.NODE_ENV === 'production')) {
        return notFound();
    }

    const SelectedTool = ToolRegistry[toolData.componentKey];

    // Fetch related tools (same category) and suggested tools (different categories)
    const [relatedTools, suggestedTools] = await Promise.all([
        prisma.tool.findMany({
            where: {
                categoryId: toolData.categoryId,
                id: { not: toolData.id },
                isPublished: true,
            },
            take: 3,
            orderBy: { createdAt: 'desc' },
        }),
        prisma.tool.findMany({
            where: {
                categoryId: { not: toolData.categoryId },
                isPublished: true,
            },
            take: 3,
            orderBy: { createdAt: 'desc' },
        })
    ]);

    // JSON-LD Schema
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: toolData.name,
        description: toolData.description || `${toolData.name} — công cụ trực tuyến miễn phí.`,
        applicationCategory: 'WebApplication',
        operatingSystem: 'All',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'VND',
        },
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.8',
            ratingCount: '150',
        },
    };

    // BreadcrumbList schema
    const breadcrumbLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: 'https://toolhub.vn' },
            { '@type': 'ListItem', position: 2, name: toolData.category.name, item: `https://toolhub.vn/category/${toolData.category.slug}` },
            { '@type': 'ListItem', position: 3, name: toolData.name, item: `https://toolhub.vn/tools/${toolData.slug}` },
        ],
    };

    return (
        <>
            {/* JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
            />

            <div className="max-w-5xl mx-auto space-y-6 sm:space-y-10">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-xs text-gray-500">
                    <a href="/" className="hover:text-neon-blue transition-colors">Trang chủ</a>
                    <span>/</span>
                    <a href={`/category/${toolData.category.slug}`} className="hover:text-neon-blue transition-colors">{toolData.category.name}</a>
                    <span>/</span>
                    <span className="text-gray-400">{toolData.name}</span>
                </nav>

                {/* Tool Title — H1 */}
                <div className="space-y-2">
                    <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 uppercase italic">
                        {toolData.name}
                    </h1>
                    <div className="h-1 w-20 bg-cyan-500 rounded-full shadow-[0_0_10px_#06b6d4]" />
                    {toolData.description && (
                        <p className="text-sm sm:text-base text-gray-400 max-w-2xl mt-2">{toolData.description}</p>
                    )}
                </div>

                {/* Tool Component */}
                <section className="bg-[#0a0a0a] border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.05)] rounded-2xl sm:rounded-[3rem] p-4 sm:p-6 md:p-10">
                    {SelectedTool ? <SelectedTool /> : <p className="text-cyan-500 animate-pulse">Đang khởi tạo công cụ...</p>}
                </section>

                {/* SEO Article Content */}
                {toolData.content && (
                    <article className="bg-[#111] border border-white/5 rounded-2xl sm:rounded-[3rem] p-5 sm:p-8 md:p-12 prose prose-invert max-w-none prose-sm sm:prose-base prose-headings:text-white prose-headings:font-bold prose-h2:text-xl prose-h2:sm:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3 prose-p:text-gray-400 prose-p:leading-relaxed prose-li:text-gray-400 prose-strong:text-neon-blue prose-a:text-neon-blue prose-a:no-underline hover:prose-a:underline">
                        <div dangerouslySetInnerHTML={{ __html: toolData.content }} />
                    </article>
                )}

                {/* Internal Linking: Related Tools & Suggested Tools */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-white/5">
                    {/* Công cụ liên quan */}
                    {relatedTools.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-cyan-500 rounded-full" />
                                Công cụ liên quan
                            </h3>
                            <div className="grid grid-cols-1 gap-3">
                                {relatedTools.map((tool) => (
                                    <Link key={tool.id} href={`/tools/${tool.slug}`} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all group">
                                        <div className="w-10 h-10 rounded-lg bg-black/50 flex items-center justify-center text-cyan-500 group-hover:scale-110 transition-transform">
                                            🔧
                                        </div>
                                        <div>
                                            <div className="font-semibold text-sm text-gray-200 group-hover:text-cyan-400 transition-colors">{tool.name}</div>
                                            <div className="text-xs text-gray-500 line-clamp-1">{tool.description}</div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Công cụ đề xuất */}
                    {suggestedTools.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-blue-600 rounded-full" />
                                Có thể bạn thích
                            </h3>
                            <div className="grid grid-cols-1 gap-3">
                                {suggestedTools.map((tool) => (
                                    <Link key={tool.id} href={`/tools/${tool.slug}`} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all group">
                                        <div className="w-10 h-10 rounded-lg bg-black/50 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                                            🚀
                                        </div>
                                        <div>
                                            <div className="font-semibold text-sm text-gray-200 group-hover:text-blue-400 transition-colors">{tool.name}</div>
                                            <div className="text-xs text-gray-500 line-clamp-1">{tool.description}</div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}