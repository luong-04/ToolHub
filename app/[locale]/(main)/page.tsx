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
        <div className="space-y-16 sm:space-y-24">
            {/* ═══════════════════ HERO ═══════════════════ */}
            <section className="relative text-center space-y-6 sm:space-y-8 max-w-4xl mx-auto pt-8 sm:pt-12">
                {/* Background decorative elements */}
                <div className="absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-blue/[0.04] rounded-full blur-[150px]" />
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/[0.04] rounded-full blur-[100px]" />
                </div>

                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-neon-blue/30 bg-neon-blue/10 text-xs font-semibold text-neon-blue shadow-[0_0_20px_rgba(0,243,255,0.1)]">
                    <span className="w-2 h-2 rounded-full bg-neon-blue animate-pulse" />
                    100% Client-side Processing · Miễn phí · Trực tuyến
                </div>

                {/* Title */}
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter leading-[1.15]">
                    <span className="text-white">Tổng hợp </span>
                    <span className="gradient-text">Công cụ trực tuyến</span>
                    <br />
                    <span className="text-white">cho </span>
                    <span className="gradient-text">Developer</span>
                    <span className="text-white"> & </span>
                    <span className="gradient-text">SEO</span>
                </h1>

                {/* Description */}
                <p className="text-base sm:text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
                    <strong>ToolHub</strong> là nền tảng cung cấp <strong className="text-gray-300">bộ công cụ trực tuyến miễn phí</strong> mạnh mẽ nhất hiện nay. Giải quyết nhanh gọn mọi nhu cầu: từ <strong>Format JSON, tạo mật khẩu ngẫu nhiên, mã hóa Base64</strong> cho đến <strong>kiểm tra SEO on-page</strong>. Điểm khác biệt? Mọi thứ được xử lý <span className="text-neon-blue font-bold">100% tại trình duyệt</span> của bạn — tốc độ siêu thực và bảo mật tuyệt đối.
                </p>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-5 pt-4">
                    <a
                        href="#newest-tools"
                        className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm sm:text-base hover:shadow-[0_0_40px_rgba(0,243,255,0.3)] transition-all duration-300 hover:-translate-y-1"
                    >
                        🚀 Khám phá công cụ ngay
                    </a>
                    <a
                        href="#about"
                        className="px-8 py-4 rounded-xl border-2 border-white/10 text-gray-300 font-bold text-sm sm:text-base hover:border-cyan-500/50 hover:text-white hover:bg-white/5 transition-all duration-300"
                    >
                        Tìm hiểu thêm ↓
                    </a>
                </div>

                {/* Stats */}
                <div className="flex justify-center gap-10 sm:gap-16 pt-8 sm:pt-12 border-t border-white/5 mt-8 max-w-3xl mx-auto">
                    <div className="text-center group">
                        <div className="text-3xl font-black text-white group-hover:text-neon-blue transition-colors">Miễn phí</div>
                        <h2 className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-2">Truy cập trọn đời</h2>
                    </div>
                    <div className="text-center group">
                        <div className="text-3xl font-black text-white group-hover:text-cyan-400 transition-colors">Siêu nhanh</div>
                        <h2 className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-2">Zero Latency</h2>
                    </div>
                    <div className="text-center group">
                        <div className="text-3xl font-black text-white group-hover:text-emerald-400 transition-colors">Bảo mật</div>
                        <h2 className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-2">Local Processing</h2>
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
                <div className="glass-card !rounded-2xl sm:!rounded-3xl !p-6 sm:!p-10 md:!p-14 space-y-6 sm:space-y-8">
                    {/* Background glow */}
                    <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-neon-blue/[0.03] rounded-full blur-[80px] -z-10" />

                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-2 h-2 rounded-full bg-neon-blue" />
                        <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400">
                            Giới thiệu
                        </h2>
                    </div>

                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight">
                        Tại sao <span className="gradient-text">ToolHub</span> là lựa chọn số 1 cho SEO & Dev?
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-400 leading-relaxed">
                        <div className="space-y-4">
                            <p>
                                <strong className="text-white">ToolHub</strong> tự hào là hệ sinh thái <strong>công cụ trực tuyến miễn phí</strong> hàng đầu Việt Nam, được thiết kế chuyên biệt cho <strong className="text-neon-blue">Lập trình viên (Developer)</strong>, <strong className="text-neon-blue">Chuyên gia SEO</strong> và Webmaster. Chúng tôi cam kết mang lại trải nghiệm mượt mà, không quảng cáo rác và không cần tạo tài khoản.
                            </p>
                            <p>
                                Vấn đề lớn nhất của các tool online hiện nay là rò rỉ dữ liệu. Tại ToolHub, mọi thao tác xử lý mã nguồn, password hay dữ liệu JSON đều diễn ra <strong>100% tại trình duyệt local</strong> của bạn. Chúng tôi hoàn toàn không lưu trữ, không thu thập và không gửi dữ liệu của bạn lên bất kỳ máy chủ nào.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <p>
                                Bộ sưu tập công cụ của chúng tôi bao gồm các <strong>Developer Tools</strong> thiết yếu (Format JSON, Encode/Decode Base64, Minifier), <strong>Security Tools</strong> (Tạo mật khẩu siêu mạnh) và <strong>SEO Tools</strong> (Phân tích Meta Tag, cấu trúc On-page). Tất cả đều tối ưu để hoạt động nhanh nhất có thể.
                            </p>
                            <p>
                                Được xây dựng trên nền tảng <strong className="text-white">Next.js 14</strong> tiên tiến nhất, ToolHub cung cấp tốc độ Zero-Latency và tương thích hoàn hảo trên mọi thiết bị di động. Hãy Bookmark trang web lại để tiết kiệm hàng giờ làm việc mỗi ngày!
                            </p>
                        </div>
                    </div>

                    {/* Feature highlights */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-4">
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