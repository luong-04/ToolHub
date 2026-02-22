import "./globals.css";
import Link from "next/link";
import prisma from "@/lib/prisma";
import type { Metadata } from "next";
import ToolHubLogo from "@/components/ToolHubLogo";

export const metadata: Metadata = {
  title: "ToolHub — Công Cụ Trực Tuyến Miễn Phí Cho Developer & SEO",
  description:
    "ToolHub cung cấp bộ công cụ trực tuyến miễn phí: JSON Formatter, Password Generator, Base64, Minifier, SEO Checker và nhiều hơn nữa. Xử lý 100% tại trình duyệt, bảo mật tuyệt đối.",
  keywords: [
    "công cụ trực tuyến",
    "developer tools",
    "SEO tools",
    "JSON formatter",
    "password generator",
    "toolhub",
  ],
  openGraph: {
    title: "ToolHub — Công Cụ Trực Tuyến Miễn Phí",
    description:
      "Bộ công cụ trực tuyến miễn phí cho Developer & SEO. Xử lý 100% tại trình duyệt.",
    type: "website",
    locale: "vi_VN",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await prisma.category.findMany({
    include: {
      tools: {
        where: { isPublished: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  // Sort: categories with newest tools first
  const sortedCategories = [...categories].sort((a, b) => {
    const aNewest = a.tools[0]?.createdAt.getTime() || 0;
    const bNewest = b.tools[0]?.createdAt.getTime() || 0;
    return bNewest - aNewest;
  });

  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-screen flex-col bg-[var(--color-dark-bg)]">
        {/* ═══════════════════ HEADER ═══════════════════ */}
        <header className="sticky top-0 z-50 border-b border-white/5 bg-[var(--color-dark-bg)]/80 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <ToolHubLogo size="sm" />
            </Link>

            {/* Nav — category dropdowns */}
            <nav className="hidden md:flex items-center gap-1">
              {sortedCategories.map((cat) => (
                <div key={cat.id} className="group relative">
                  <Link
                    href={`/category/${cat.slug}`}
                    className="flex items-center gap-1.5 px-4 py-5 text-xs font-semibold uppercase tracking-widest text-gray-400 hover:text-neon-blue transition-colors duration-300"
                  >
                    {cat.name}
                    <svg
                      className="w-3 h-3 opacity-40 group-hover:opacity-100 transition-opacity"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </Link>
                  {/* Dropdown */}
                  <div className="absolute left-0 top-full pt-1 hidden group-hover:block z-50">
                    <div className="w-64 rounded-2xl border border-white/10 bg-[#0c0c10]/95 backdrop-blur-xl p-3 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
                      <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-3 py-2">
                        {cat.name}
                      </div>
                      {cat.tools.slice(0, 5).map((tool) => (
                        <Link
                          key={tool.id}
                          href={`/tools/${tool.slug}`}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-neon-blue transition-all duration-200"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-neon-blue/40 shrink-0" />
                          {tool.name}
                        </Link>
                      ))}
                      <div className="section-divider my-2" />
                      <Link
                        href={`/category/${cat.slug}`}
                        className="flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold text-neon-blue/70 hover:text-neon-blue hover:bg-neon-blue/5 transition-all"
                      >
                        Xem tất cả công cụ
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </nav>

            {/* Mobile menu button */}
            <button className="md:hidden text-gray-400 hover:text-neon-blue transition-colors p-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </header>

        {/* ═══════════════════ MAIN ═══════════════════ */}
        <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-12">
          {children}
        </main>

        {/* ═══════════════════ FOOTER ═══════════════════ */}
        <footer className="mt-20 border-t border-white/5 bg-[#08080c]">
          {/* Top footer — Logo + Categories with tools */}
          <div className="mx-auto max-w-7xl px-6 py-14">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              {/* Brand column */}
              <div className="space-y-5 md:col-span-1">
                <ToolHubLogo size="sm" />
                <p className="text-sm text-gray-500 leading-relaxed">
                  Nền tảng công cụ trực tuyến miễn phí dành cho Developer & SEO.
                  Mọi dữ liệu được xử lý 100% tại trình duyệt, đảm bảo bảo mật tuyệt đối.
                </p>
                {/* Social icons placeholder */}
                <div className="flex gap-3">
                  {/* X (Twitter) */}
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-neon-blue/10 hover:text-neon-blue transition-all"
                    title="Theo dõi trên X"
                  >
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.045 4.126H5.078z" /></svg>
                  </a>

                  {/* Facebook */}
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-neon-blue/10 hover:text-neon-blue transition-all"
                    title="Theo dõi trên Facebook"
                  >
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" /></svg>
                  </a>

                  {/* Pinterest */}
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-neon-blue/10 hover:text-neon-blue transition-all"
                    title="Theo dõi trên Pinterest"
                  >
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.017 0c-6.627 0-12 5.373-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.261 7.929-7.261 4.162 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" /></svg>
                  </a>

                  {/* GitHub */}
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-neon-blue/10 hover:text-neon-blue transition-all"
                    title="Xem mã nguồn trên GitHub"
                  >
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                  </a>
                </div>
              </div>

              {/* Category columns — show 5 newest tools each */}
              {sortedCategories.slice(0, 3).map((cat) => (
                <div key={cat.id} className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    {cat.name}
                  </h4>
                  <ul className="space-y-2.5">
                    {cat.tools.slice(0, 5).map((tool) => (
                      <li key={tool.id}>
                        <Link
                          href={`/tools/${tool.slug}`}
                          className="text-sm text-gray-500 hover:text-neon-blue transition-colors duration-200"
                        >
                          {tool.name}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link
                        href={`/category/${cat.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-neon-blue/60 hover:text-neon-blue transition-colors mt-1"
                      >
                        Khám phá thêm công cụ
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </Link>
                    </li>
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom footer */}
          <div className="border-t border-white/5">
            <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-600">
              <p>© {new Date().getFullYear()} ToolHub. All rights reserved.</p>
              <p className="text-center">
                Built with ❤️ for Developers & SEO Specialists
              </p>
              <div className="flex gap-6">
                {/* Thay đổi tại đây */}
                <Link href="/about" className="hover:text-neon-blue cursor-pointer transition-colors">
                  Về chúng tôi
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}