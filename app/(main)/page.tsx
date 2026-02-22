import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function HomePage() {
    // Get all categories with published tools, sorted by newest tool
    const categories = await prisma.category.findMany({
        include: {
            tools: {
                where: { isPublished: true },
                orderBy: { createdAt: "desc" },
            },
        },
    });

    const sortedCategories = [...categories]
        .filter((c) => c.tools.length > 0)
        .sort((a, b) => {
            const aNewest = a.tools[0]?.createdAt.getTime() || 0;
            const bNewest = b.tools[0]?.createdAt.getTime() || 0;
            return bNewest - aNewest;
        });

    // All tools flat, newest first
    const allToolsNewest = sortedCategories
        .flatMap((c) => c.tools.map((t) => ({ ...t, categoryName: c.name, categorySlug: c.slug })))
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const newestTools = allToolsNewest.slice(0, 6);

    return (
        <div className="space-y-24">
            {/* ═══════════════════ HERO ═══════════════════ */}
            <section className="relative text-center space-y-8 max-w-4xl mx-auto pt-8">
                {/* Background decorative elements */}
                <div className="absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-blue/[0.03] rounded-full blur-[120px]" />
                    <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-600/[0.03] rounded-full blur-[80px]" />
                </div>

                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neon-blue/20 bg-neon-blue/5 text-xs font-medium text-neon-blue">
                    <span className="w-1.5 h-1.5 rounded-full bg-neon-blue animate-pulse" />
                    Miễn phí · Bảo mật · Xử lý tại trình duyệt
                </div>

                {/* Title */}
                <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1]">
                    <span className="text-white">Công cụ </span>
                    <span className="gradient-text">trực tuyến</span>
                    <br />
                    <span className="text-white">cho </span>
                    <span className="gradient-text">Developer</span>
                    <span className="text-white"> & </span>
                    <span className="gradient-text">SEO</span>
                </h1>

                {/* Description */}
                <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                    ToolHub cung cấp bộ công cụ xử lý dữ liệu mạnh mẽ — format JSON, tạo mật khẩu,
                    encode/decode, phân tích SEO và nhiều hơn nữa. Mọi thao tác được xử lý{" "}
                    <span className="text-neon-blue font-semibold">100% tại trình duyệt</span>, bảo mật tuyệt đối.
                </p>

                {/* CTA */}
                <div className="flex flex-wrap justify-center gap-4 pt-2">
                    <a
                        href="#newest-tools"
                        className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm hover:shadow-[0_0_30px_rgba(0,243,255,0.3)] transition-all duration-300 hover:-translate-y-0.5"
                    >
                        Khám phá công cụ
                    </a>
                    <a
                        href="#about"
                        className="px-8 py-3 rounded-xl border border-white/10 text-gray-400 font-semibold text-sm hover:border-neon-blue/30 hover:text-white transition-all duration-300"
                    >
                        Tìm hiểu thêm
                    </a>
                </div>

                {/* Stats */}
                <div className="flex justify-center gap-12 pt-6">
                    <div className="text-center">
                        <div className="text-2xl font-black text-white">{allToolsNewest.length}+</div>
                        <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">Công cụ</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-black text-white">{sortedCategories.length}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">Danh mục</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-black text-white">100%</div>
                        <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">Bảo mật</div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════ NEWEST TOOLS ═══════════════════ */}
            <section id="newest-tools" className="space-y-8">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-neon-blue animate-pulse" />
                        <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400">
                            Công cụ mới nhất
                        </h2>
                    </div>
                    <div className="section-divider flex-1" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {newestTools.map((tool, i) => (
                        <Link
                            href={`/tools/${tool.slug}`}
                            key={tool.id}
                            className="glass-card group relative"
                        >
                            {/* New badge for first 3 */}
                            {i < 3 && (
                                <div className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-neon-blue/10 border border-neon-blue/20 text-[10px] font-bold text-neon-blue uppercase tracking-wider">
                                    Mới
                                </div>
                            )}
                            <span className="text-[10px] font-bold text-neon-blue/50 uppercase tracking-widest">
                                {tool.categoryName}
                            </span>
                            <h3 className="text-lg font-bold mt-2 text-white group-hover:text-neon-blue transition-colors duration-300">
                                {tool.name}
                            </h3>
                            <p className="mt-3 text-sm text-gray-500 line-clamp-2">
                                {tool.description || "Công cụ xử lý dữ liệu thông minh, nhanh chóng và bảo mật."}
                            </p>
                            {/* Arrow */}
                            <div className="mt-4 flex items-center gap-2 text-xs text-neon-blue/40 group-hover:text-neon-blue transition-all duration-300">
                                Sử dụng ngay
                                <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ═══════════════════ CATEGORIES ═══════════════════ */}
            {sortedCategories.map((cat) => (
                <section key={cat.id} id={`cat-${cat.slug}`} className="space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-1 h-8 rounded-full bg-gradient-to-b from-neon-blue to-blue-600" />
                            <h2 className="text-xl font-bold text-white">{cat.name}</h2>
                            <span className="text-xs text-gray-500 bg-white/5 px-2.5 py-1 rounded-full">
                                {cat.tools.length} công cụ
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {cat.tools.map((tool) => (
                            <Link
                                href={`/tools/${tool.slug}`}
                                key={tool.id}
                                className="glass-card group"
                            >
                                <h3 className="text-base font-semibold text-white group-hover:text-neon-blue transition-colors duration-300">
                                    {tool.name}
                                </h3>
                                <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                                    {tool.description || "Công cụ xử lý dữ liệu thông minh và bảo mật."}
                                </p>
                                <div className="mt-3 flex items-center gap-2 text-xs text-neon-blue/40 group-hover:text-neon-blue transition-all duration-300">
                                    Mở công cụ
                                    <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            ))}

            {/* ═══════════════════ ABOUT / SEO SECTION ═══════════════════ */}
            <section id="about" className="relative">
                <div className="glass-card !rounded-3xl !p-10 md:!p-14 space-y-8">
                    {/* Background glow */}
                    <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-neon-blue/[0.03] rounded-full blur-[80px] -z-10" />

                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-2 h-2 rounded-full bg-neon-blue" />
                        <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400">
                            Giới thiệu
                        </h2>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
                        Tại sao chọn <span className="gradient-text">ToolHub</span>?
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-400 leading-relaxed">
                        <div className="space-y-4">
                            <p>
                                <strong className="text-white">ToolHub</strong> là nền tảng công cụ trực tuyến miễn phí
                                được thiết kế dành riêng cho <strong className="text-neon-blue">Developer</strong>,{" "}
                                <strong className="text-neon-blue">SEO Specialist</strong> và những người làm việc với
                                dữ liệu hàng ngày. Chúng tôi tin rằng các công cụ hữu ích nên được tiếp cận dễ dàng,
                                nhanh chóng và hoàn toàn miễn phí.
                            </p>
                            <p>
                                Mọi dữ liệu bạn nhập vào ToolHub được xử lý{" "}
                                <strong className="text-white">100% tại trình duyệt</strong> (client-side), không gửi
                                lên bất kỳ server nào. Điều này đảm bảo bảo mật tuyệt đối cho dữ liệu nhạy cảm như
                                API keys, mật khẩu, hay JSON configuration.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <p>
                                Với giao diện tối giản, hiện đại và tốc độ xử lý tức thì, ToolHub giúp bạn tiết kiệm
                                thời gian đáng kể trong các tác vụ lặp đi lặp lại: format JSON, tạo mật khẩu mạnh,
                                encode/decode Base64, kiểm tra SEO, minify code, và nhiều công cụ khác.
                            </p>
                            <p>
                                Chúng tôi liên tục cập nhật và bổ sung các công cụ mới dựa trên nhu cầu thực tế
                                của cộng đồng developer Việt Nam. ToolHub được xây dựng trên nền tảng{" "}
                                <strong className="text-white">Next.js</strong> và <strong className="text-white">React</strong>,
                                đảm bảo hiệu suất tối ưu trên mọi thiết bị.
                            </p>
                        </div>
                    </div>

                    {/* Feature highlights */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                        {[
                            { icon: "⚡", title: "Siêu nhanh", desc: "Xử lý tức thì" },
                            { icon: "🔒", title: "Bảo mật", desc: "100% client-side" },
                            { icon: "🆓", title: "Miễn phí", desc: "Không giới hạn" },
                            { icon: "📱", title: "Responsive", desc: "Mọi thiết bị" },
                        ].map((f) => (
                            <div
                                key={f.title}
                                className="text-center p-4 rounded-xl bg-white/[0.02] border border-white/5"
                            >
                                <div className="text-2xl mb-2">{f.icon}</div>
                                <div className="text-sm font-bold text-white">{f.title}</div>
                                <div className="text-xs text-gray-500 mt-1">{f.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}