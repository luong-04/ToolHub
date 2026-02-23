import "@/app/globals.css";
// Thay thế import Link cũ bằng Link của next-intl hỗ trợ i18n
import { Link } from "@/i18n/routing";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

import prisma from "@/lib/prisma";
import type { Metadata } from "next";
import ToolHubLogo from "@/components/ToolHubLogo";
import MobileMenu from "@/components/MobileMenu";
import SearchBar from "@/components/SearchBar";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { getTranslations } from "next-intl/server";

// Chuyển sang generateMetadata để SEO tốt hơn với nhiều ngôn ngữ
export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;

  // Dùng file JSON để tự động dịch Tiêu đề Meta SEO
  const t = await getTranslations({ locale, namespace: "HomePage" });
  const baseUrl = "https://toolhub.vn";

  return {
    title: t('hero_title_1') + t('hero_title_2') + " | ToolHub",
    description: t('hero_desc'),
    // THẺ HREFLANG CHUẨN SEO 10 NGÔN NGỮ
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        'en': `${baseUrl}/en`,
        'vi': `${baseUrl}/vi`,
        'ja': `${baseUrl}/ja`,
        'ko': `${baseUrl}/ko`,
        'id': `${baseUrl}/id`,
        'es': `${baseUrl}/es`,
        'pt': `${baseUrl}/pt`,
        'de': `${baseUrl}/de`,
        'fr': `${baseUrl}/fr`,
        'hi': `${baseUrl}/hi`,
        'x-default': `${baseUrl}/en` // Mặc định nếu Google không biết IP ở đâu
      },
    },
    openGraph: {
      title: "ToolHub",
      description: t('hero_desc'),
      type: "website",
      locale: locale,
      url: `${baseUrl}/${locale}`,
      siteName: "ToolHub",
    },
    metadataBase: new URL(baseUrl),
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Await params cho Next.js 15
  const { locale } = await params;

  // Tải bộ dịch dựa trên locale hiện tại
  const messages = await getMessages({ locale });

  // 1. Lấy dữ liệu Category và Tool kèm theo bản dịch (translations)
  const rawCategories = await prisma.category.findMany({
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

  // 2. Format lại dữ liệu: Lồng `name` từ bản dịch ra ngoài object tool để UI dễ đọc
  const categories = rawCategories.map((cat) => ({
    ...cat,
    tools: cat.tools.map((tool) => {
      // Ưu tiên ngôn ngữ hiện tại, nếu không có lấy tiếng Anh, nếu không lấy cái đầu tiên
      const trans =
        tool.translations.find((t) => t.language === locale) ||
        tool.translations.find((t) => t.language === "en") ||
        tool.translations[0];

      return {
        ...tool,
        name: trans?.name || tool.componentKey, // Bơm `name` vào lại tool
      };
    }),
  }));

  // 3. Sort: categories with newest tools first
  const sortedCategories = [...categories].sort((a, b) => {
    const aNewest = a.tools[0]?.createdAt.getTime() || 0;
    const bNewest = b.tools[0]?.createdAt.getTime() || 0;
    return bNewest - aNewest;
  });

  return (
    // Sử dụng locale động ở thẻ html
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-screen flex-col bg-[var(--color-dark-bg)]">
        {/* Bọc toàn bộ ứng dụng bằng Provider của next-intl */}
        <NextIntlClientProvider messages={messages} locale={locale}>

          {/* ═══════════════════ HEADER ═══════════════════ */}
          <header className="sticky top-0 z-50 border-b border-white/5 bg-[var(--color-dark-bg)]/80 backdrop-blur-xl">
            {/* Thêm relative để làm gốc căn giữa tuyệt đối cho Danh mục */}
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 relative">

              {/* 1. TRÁI: Logo */}
              <div className="flex items-center shrink-0 z-20">
                <Link href="/" className="flex items-center gap-2">
                  <ToolHubLogo size="sm" />
                </Link>
              </div>

              {/* 2. GIỮA: Danh mục (Căn giữa tuyệt đối, ẩn trên mobile) */}
              <nav className="hidden lg:flex items-center justify-center absolute left-1/2 -translate-x-1/2 w-full max-w-3xl pointer-events-none z-10">
                <div className="pointer-events-auto flex items-center gap-2">
                  {sortedCategories.map((cat) => (
                    <div key={cat.id} className="group relative">
                      <Link
                        href={`/category/${cat.slug}`}
                        className="flex items-center gap-1.5 px-4 py-5 text-xs font-semibold uppercase tracking-widest text-gray-400 hover:text-neon-blue transition-colors duration-300"
                      >
                        {cat.name}
                        <svg className="w-3 h-3 opacity-40 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </Link>
                      {/* Dropdown */}
                      <div className="absolute left-1/2 -translate-x-1/2 top-full pt-1 hidden group-hover:block z-50">
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
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7-7" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </nav>

              {/* 3. PHẢI: Search + Đổi ngôn ngữ + Menu Mobile */}
              <div className="flex items-center justify-end gap-2 sm:gap-3 shrink-0 z-20">
                <SearchBar />
                <LanguageSwitcher />
                <MobileMenu categories={sortedCategories} />
              </div>

            </div>
          </header>

          {/* ═══════════════════ MAIN ═══════════════════ */}
          <main className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6 py-8 sm:py-12">
            {children}
          </main>

          {/* ═══════════════════ FOOTER ═══════════════════ */}
          <footer className="mt-20 border-t border-white/5 bg-[#08080c]">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-14">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">

                {/* Brand column */}
                <div className="space-y-5 lg:col-span-1">
                  <ToolHubLogo size="sm" />
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Nền tảng công cụ trực tuyến miễn phí dành cho Developer & SEO.
                    Mọi dữ liệu được xử lý 100% tại trình duyệt, đảm bảo bảo mật tuyệt đối.
                  </p>
                  <div className="flex gap-3">
                    {/* Social icons */}
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-neon-blue/10 hover:text-neon-blue transition-all">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                    </a>
                  </div>
                </div>

                {/* Category columns */}
                {sortedCategories.slice(0, 3).map((cat) => (
                  <div key={cat.id} className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">
                      {cat.name}
                    </h4>
                    <ul className="space-y-2.5">
                      {cat.tools.slice(0, 5).map((tool) => (
                        <li key={tool.id}>
                          <Link href={`/tools/${tool.slug}`} className="text-sm text-gray-500 hover:text-neon-blue transition-colors duration-200">
                            {tool.name}
                          </Link>
                        </li>
                      ))}
                      <li>
                        <Link href={`/category/${cat.slug}`} className="inline-flex items-center gap-1.5 text-xs font-semibold text-neon-blue/60 hover:text-neon-blue transition-colors mt-1">
                          Khám phá thêm
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </Link>
                      </li>
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-white/5">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 py-5 sm:py-6 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 text-xs text-gray-600">
                <p>© {new Date().getFullYear()} ToolHub. All rights reserved.</p>
                <p className="text-center">Built with ❤️ for Developers & SEO</p>
                <div className="flex gap-6">
                  <Link href="/about" className="hover:text-neon-blue transition-colors">Về chúng tôi</Link>
                  <Link href="/contact" className="hover:text-neon-blue transition-colors">Liên hệ</Link>
                </div>
              </div>
            </div>
          </footer>

        </NextIntlClientProvider>
      </body>
    </html>
  );
}