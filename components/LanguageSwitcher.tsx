"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "@/i18n/routing";
import { useParams } from "next/navigation";

const languages = [
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
    { code: "ja", label: "日本語", flag: "🇯🇵" },
    { code: "ko", label: "한국어", flag: "🇰🇷" },
    { code: "id", label: "Bahasa Indonesia", flag: "🇮🇩" },
    { code: "es", label: "Español", flag: "🇪🇸" },
    { code: "pt", label: "Português", flag: "🇵🇹" },
    { code: "de", label: "Deutsch", flag: "🇩🇪" },
    { code: "fr", label: "Français", flag: "🇫🇷" },
    { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
];

export default function LanguageSwitcher() {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();

    // Lấy locale hiện tại từ URL params
    const currentLocale = (params.locale as string) || "en";
    const currentLang = languages.find((l) => l.code === currentLocale) || languages[0];

    const ref = useRef<HTMLDivElement>(null);

    // Đóng dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLanguageChange = (newLocale: string) => {
        setIsOpen(false);
        // Chuyển hướng giữ nguyên đường dẫn hiện tại nhưng thay đổi locale
        router.replace(
            // @ts-expect-error - next-intl type check
            { pathname, params },
            { locale: newLocale }
        );
    };

    return (
        <div className="relative z-50" ref={ref}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-neon-blue/50 transition-all text-sm text-gray-300 hover:text-white"
                title="Đổi ngôn ngữ"
            >
                <span className="text-base leading-none">{currentLang.flag}</span>
                <span className="hidden sm:inline-block font-bold uppercase text-[10px] tracking-widest">{currentLang.code}</span>
                <svg
                    className={`w-3.5 h-3.5 opacity-70 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-white/10 bg-[#0c0c10]/95 backdrop-blur-xl p-2 shadow-[0_8px_32px_rgba(0,0,0,0.8)] animate-in fade-in zoom-in-95">
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-3 py-2 border-b border-white/5 mb-1">
                        Ngôn ngữ / Language
                    </div>
                    <div className="max-h-[300px] overflow-y-auto space-y-1 custom-scrollbar">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => handleLanguageChange(lang.code)}
                                className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${currentLocale === lang.code
                                        ? "bg-neon-blue/10 text-neon-blue font-semibold"
                                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                                    }`}
                            >
                                <span className="text-base leading-none">{lang.flag}</span>
                                {lang.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}