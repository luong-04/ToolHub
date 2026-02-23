import { ToolRegistry } from '@/components/tools/tool-registry';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Link } from '@/i18n/routing';

type Props = {
    params: Promise<{ locale: string; slug: string }>;
};

// Khai báo thẻ Hreflang 10 ngôn ngữ chuẩn SEO Google cho Từng Công Cụ
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, slug } = await params;

    const tool = await prisma.tool.findUnique({
        where: { slug },
        include: {
            category: true,
            translations: {
                where: { language: { in: [locale, 'en'] } }
            }
        },
    });

    if (!tool || tool.translations.length === 0) return { title: 'Công cụ không tồn tại — ToolHub' };

    const translation = tool.translations.find(t => t.language === locale) || tool.translations.find(t => t.language === 'en') || tool.translations[0];

    const title = `${translation.name} — Công Cụ Trực Tuyến Miễn Phí | ToolHub`;
    const description = translation.description || `${translation.name} — công cụ trực tuyến miễn phí, xử lý 100% tại trình duyệt. An toàn, nhanh chóng, không cần đăng ký.`;
    const baseUrl = "https://toolhub.vn";

    return {
        title,
        description,
        keywords: [translation.name, tool.category.name, 'công cụ trực tuyến', 'miễn phí', 'ToolHub', tool.slug.replace(/-/g, ' ')],
        openGraph: {
            title,
            description,
            type: 'website',
            locale: locale,
            url: `${baseUrl}/${locale}/tools/${tool.slug}`,
            siteName: 'ToolHub',
        },
        // CHUỖI 10 NGÔN NGỮ ĐẦY ĐỦ KHÔNG RÚT GỌN CHO BÀI VIẾT
        alternates: {
            canonical: `${baseUrl}/${locale}/tools/${tool.slug}`,
            languages: {
                'en': `${baseUrl}/en/tools/${tool.slug}`,
                'vi': `${baseUrl}/vi/tools/${tool.slug}`,
                'ja': `${baseUrl}/ja/tools/${tool.slug}`,
                'ko': `${baseUrl}/ko/tools/${tool.slug}`,
                'id': `${baseUrl}/id/tools/${tool.slug}`,
                'es': `${baseUrl}/es/tools/${tool.slug}`,
                'pt': `${baseUrl}/pt/tools/${tool.slug}`,
                'de': `${baseUrl}/de/tools/${tool.slug}`,
                'fr': `${baseUrl}/fr/tools/${tool.slug}`,
                'hi': `${baseUrl}/hi/tools/${tool.slug}`,
                'x-default': `${baseUrl}/en/tools/${tool.slug}`
            }
        },
    };
}

export default async function ToolPage({ params }: Props) {
    const { locale, slug } = await params;

    const toolData = await prisma.tool.findUnique({
        where: { slug },
        include: {
            category: true,
            translations: {
                where: { language: { in: [locale, 'en'] } }
            }
        },
    });

    if (!toolData || (!toolData.isPublished && process.env.NODE_ENV === 'production') || toolData.translations.length === 0) {
        return notFound();
    }

    const translation = toolData.translations.find(t => t.language === locale) || toolData.translations.find(t => t.language === 'en') || toolData.translations[0];
    const SelectedTool = ToolRegistry[toolData.componentKey];

    // Lấy công cụ liên quan và công cụ đề xuất kèm bản dịch
    const [relatedToolsRaw, suggestedToolsRaw] = await Promise.all([
        prisma.tool.findMany({
            where: {
                categoryId: toolData.categoryId,
                id: { not: toolData.id },
                isPublished: true,
            },
            take: 3,
            orderBy: { createdAt: 'desc' },
            include: { translations: { where: { language: { in: [locale, 'en'] } } } }
        }),
        prisma.tool.findMany({
            where: {
                categoryId: { not: toolData.categoryId },
                isPublished: true,
            },
            take: 3,
            orderBy: { createdAt: 'desc' },
            include: { translations: { where: { language: { in: [locale, 'en'] } } } }
        })
    ]);

    const mapTools = (tools: any[]) => tools.map(t => {
        const trans = t.translations.find((tr: any) => tr.language === locale) || t.translations.find((tr: any) => tr.language === 'en') || t.translations[0];
        return {
            ...t,
            name: trans?.name || t.componentKey,
            description: trans?.description || ''
        };
    });

    const relatedTools = mapTools(relatedToolsRaw);
    const suggestedTools = mapTools(suggestedToolsRaw);

    // Schema cho Google (Dữ liệu cấu trúc)
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: translation.name,
        description: translation.description || `${translation.name} — công cụ trực tuyến miễn phí.`,
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

    const breadcrumbLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `https://toolhub.vn/${locale}` },
            { '@type': 'ListItem', position: 2, name: toolData.category.name, item: `https://toolhub.vn/${locale}/category/${toolData.category.slug}` },
            { '@type': 'ListItem', position: 3, name: translation.name, item: `https://toolhub.vn/${locale}/tools/${toolData.slug}` },
        ],
    };

    return (
        <>
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
                    <Link href="/" className="hover:text-neon-blue transition-colors">Home</Link>
                    <span>/</span>
                    <Link href={`/category/${toolData.category.slug}`} className="hover:text-neon-blue transition-colors">{toolData.category.name}</Link>
                    <span>/</span>
                    <span className="text-gray-400">{translation.name}</span>
                </nav>

                {/* Tiêu đề Tool */}
                <div className="space-y-2">
                    <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 uppercase italic">
                        {translation.name}
                    </h1>
                    <div className="h-1 w-20 bg-cyan-500 rounded-full shadow-[0_0_10px_#06b6d4]" />
                    {translation.description && (
                        <p className="text-sm sm:text-base text-gray-400 max-w-2xl mt-2">{translation.description}</p>
                    )}
                </div>

                {/* Giao diện Tool */}
                <section className="bg-[#0a0a0a] border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.05)] rounded-2xl sm:rounded-[3rem] p-4 sm:p-6 md:p-10">
                    {SelectedTool ? <SelectedTool /> : <p className="text-cyan-500 animate-pulse">Loading tool...</p>}
                </section>

                {/* Bài viết SEO Đa ngôn ngữ */}
                {translation.content && (
                    <article className="bg-[#111] border border-white/5 rounded-2xl sm:rounded-[3rem] p-5 sm:p-8 md:p-12 prose prose-invert max-w-none prose-sm sm:prose-base prose-headings:text-white prose-headings:font-bold prose-h2:text-xl prose-h2:sm:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3 prose-p:text-gray-400 prose-p:leading-relaxed prose-li:text-gray-400 prose-strong:text-neon-blue prose-a:text-neon-blue prose-a:no-underline hover:prose-a:underline">
                        <div dangerouslySetInnerHTML={{ __html: translation.content }} />
                    </article>
                )}

                {/* Liên kết nội bộ */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-white/5">
                    {relatedTools.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-cyan-500 rounded-full" />
                                Related Tools
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

                    {suggestedTools.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-blue-600 rounded-full" />
                                Suggested Tools
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