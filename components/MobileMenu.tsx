"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

type CategoryWithTools = {
    id: string;
    name: string;
    slug: string;
    tools: { id: string; name: string; slug: string }[];
};

export default function MobileMenu({
    categories,
}: {
    categories: CategoryWithTools[];
}) {
    const [open, setOpen] = useState(false);
    const [expandedCat, setExpandedCat] = useState<string | null>(null);

    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    return (
        <>
            <button
                onClick={() => setOpen(!open)}
                className="md:hidden text-gray-400 hover:text-neon-blue transition-colors p-2 -mr-2"
                aria-label="Menu"
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {open && (
                <>
                    {/* Overlay with fade */}
                    <div
                        className="fixed inset-0 bg-black/80 z-40 md:hidden animate-[fadeIn_0.2s_ease]"
                        onClick={() => setOpen(false)}
                    />

                    {/* Drawer with slide */}
                    <div
                        className="fixed top-0 right-0 h-full w-[300px] z-50 md:hidden bg-[#0d1520] border-l border-[#1a2535] shadow-[-10px_0_40px_rgba(0,0,0,0.9)] animate-[slideIn_0.25s_ease-out]"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-[#1a2535] bg-[#0d1520]">
                            <div className="flex items-center gap-2.5">
                                <div className="w-1.5 h-5 rounded-full bg-gradient-to-b from-cyan-400 to-blue-600" />
                                <span className="text-sm font-bold uppercase tracking-[0.2em] text-gray-300">
                                    Menu
                                </span>
                            </div>
                            <button
                                onClick={() => setOpen(false)}
                                className="w-8 h-8 rounded-lg bg-[#142030] flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#1a2840] transition-all"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Navigation */}
                        <nav className="overflow-y-auto max-h-[calc(100vh-72px)] bg-[#0d1520]">
                            {/* Categories */}
                            <div className="py-3 px-3">
                                {categories.map((cat) => (
                                    <div key={cat.id} className="mb-1 bg-[#0d1520]">
                                        {/* Category button */}
                                        <button
                                            onClick={() =>
                                                setExpandedCat(expandedCat === cat.id ? null : cat.id)
                                            }
                                            className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-[13px] font-bold uppercase tracking-wider text-gray-200 hover:bg-[#142030] active:bg-[#182840] transition-all duration-200"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="w-2 h-2 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500" />
                                                {cat.name}
                                            </div>
                                            <svg
                                                className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-300 ease-out ${expandedCat === cat.id ? "rotate-180" : ""
                                                    }`}
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>

                                        {/* Expanded tools with smooth height transition */}
                                        <div
                                            className={`overflow-hidden transition-all duration-300 ease-out ${expandedCat === cat.id ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                                                }`}
                                        >
                                            <div className="ml-4 mr-2 mb-2 rounded-xl bg-[#111c28] border border-[#1a2535]">
                                                {cat.tools.slice(0, 3).map((tool) => (
                                                    <Link
                                                        key={tool.id}
                                                        href={`/tools/${tool.slug}`}
                                                        onClick={() => setOpen(false)}
                                                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white active:text-neon-blue transition-colors border-b border-[#1a2535] last:border-b-0"
                                                    >
                                                        <svg className="w-3 h-3 text-cyan-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                        {tool.name}
                                                    </Link>
                                                ))}
                                                <Link
                                                    href={`/category/${cat.slug}`}
                                                    onClick={() => setOpen(false)}
                                                    className="flex items-center gap-2 px-4 py-3 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
                                                >
                                                    Xem tất cả
                                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                    </svg>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-[#1a2535] mx-6 my-1" />

                            {/* Home link */}
                            <div className="px-3 py-3">
                                <Link
                                    href="/"
                                    onClick={() => setOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-300 hover:bg-[#142030] hover:text-white transition-all"
                                >
                                    <svg className="w-4 h-4 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                    Trang chủ
                                </Link>
                            </div>
                        </nav>
                    </div>
                </>
            )}
        </>
    );
}
