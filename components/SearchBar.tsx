"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

type SearchResult = {
    name: string;
    slug: string;
    description: string | null;
    category: { name: string };
};

export default function SearchBar() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [showInput, setShowInput] = useState(false);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Fetch results with debounce
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        if (query.trim().length < 1) {
            setResults([]);
            setIsOpen(false);
            return;
        }

        setLoading(true);
        debounceRef.current = setTimeout(async () => {
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                const data = await res.json();
                setResults(data);
                setIsOpen(true);
            } catch {
                setResults([]);
            }
            setLoading(false);
        }, 200);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [query]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setIsOpen(false);
                setShowInput(false);
                setQuery("");
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    // Focus input when shown
    useEffect(() => {
        if (showInput && inputRef.current) {
            inputRef.current.focus();
        }
    }, [showInput]);

    // Highlight matching text
    const highlight = (text: string) => {
        if (!query.trim()) return text;
        const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
        const parts = text.split(regex);
        return parts.map((part, i) =>
            regex.test(part) ? (
                <span key={i} className="text-cyan-400 font-bold">{part}</span>
            ) : (
                part
            )
        );
    };

    return (
        <div ref={wrapperRef} className="relative">
            {/* Search icon button (mobile + desktop) */}
            {!showInput && (
                <button
                    onClick={() => setShowInput(true)}
                    className="p-2 text-gray-400 hover:text-neon-blue transition-colors"
                    aria-label="Tìm kiếm"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </button>
            )}

            {/* Search input */}
            {showInput && (
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Tìm công cụ..."
                            className="w-[180px] sm:w-[240px] pl-9 pr-3 py-2 text-sm bg-[#0d1520] border border-[#1a2535] rounded-xl text-white placeholder-gray-500 outline-none focus:border-cyan-500/50 transition-all"
                            onKeyDown={(e) => {
                                if (e.key === "Escape") {
                                    setShowInput(false);
                                    setQuery("");
                                    setIsOpen(false);
                                }
                            }}
                        />
                        {loading && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
                        )}
                    </div>
                    <button
                        onClick={() => { setShowInput(false); setQuery(""); setIsOpen(false); }}
                        className="p-1.5 text-gray-500 hover:text-white transition-colors"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}

            {/* Results dropdown */}
            {isOpen && results.length > 0 && (
                <div className="absolute right-0 top-full mt-2 w-[300px] sm:w-[360px] bg-[#0d1520] border border-[#1a2535] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.7)] overflow-hidden z-50 animate-[fadeIn_0.15s_ease]">
                    <div className="px-4 py-2 border-b border-[#1a2535]">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                            {results.length} kết quả
                        </span>
                    </div>
                    {results.map((tool) => (
                        <Link
                            key={tool.slug}
                            href={`/tools/${tool.slug}`}
                            onClick={() => { setIsOpen(false); setShowInput(false); setQuery(""); }}
                            className="flex items-start gap-3 px-4 py-3 hover:bg-[#142030] transition-colors border-b border-[#1a2535] last:border-b-0"
                        >
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center shrink-0 mt-0.5">
                                <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                </svg>
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="text-sm font-semibold text-white truncate">
                                    {highlight(tool.name)}
                                </div>
                                <div className="text-[11px] text-gray-500 mt-0.5 truncate">
                                    {tool.category.name}
                                    {tool.description && ` · ${tool.description.slice(0, 50)}`}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* No results */}
            {isOpen && query.trim().length > 0 && results.length === 0 && !loading && (
                <div className="absolute right-0 top-full mt-2 w-[280px] bg-[#0d1520] border border-[#1a2535] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.7)] p-6 text-center z-50">
                    <div className="text-2xl mb-2">🔍</div>
                    <p className="text-sm text-gray-400">Không tìm thấy công cụ nào</p>
                    <p className="text-xs text-gray-600 mt-1">Thử từ khóa khác</p>
                </div>
            )}
        </div>
    );
}
