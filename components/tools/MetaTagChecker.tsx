"use client";
import React, { useState } from "react";

type MetaResult = {
    title: string;
    description: string;
    keywords: string;
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
    canonical: string;
    robots: string;
    viewport: string;
    charset: string;
    h1Tags: string[];
    h2Tags: string[];
};

type ScoreItem = {
    label: string;
    status: "good" | "warning" | "bad";
    message: string;
};

export default function MetaTagChecker() {
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [result, setResult] = useState<MetaResult | null>(null);
    const [scores, setScores] = useState<ScoreItem[]>([]);
    const [htmlInput, setHtmlInput] = useState("");
    const [mode, setMode] = useState<"html" | "manual">("html");

    const analyzeHtml = (html: string): MetaResult => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const getMeta = (name: string) => {
            const el =
                doc.querySelector(`meta[name="${name}"]`) ||
                doc.querySelector(`meta[property="${name}"]`);
            return el?.getAttribute("content") || "";
        };

        return {
            title: doc.querySelector("title")?.textContent || "",
            description: getMeta("description"),
            keywords: getMeta("keywords"),
            ogTitle: getMeta("og:title"),
            ogDescription: getMeta("og:description"),
            ogImage: getMeta("og:image"),
            canonical: doc.querySelector('link[rel="canonical"]')?.getAttribute("href") || "",
            robots: getMeta("robots"),
            viewport: getMeta("viewport"),
            charset: doc.querySelector("meta[charset]")?.getAttribute("charset") || "",
            h1Tags: Array.from(doc.querySelectorAll("h1")).map((el) => el.textContent || ""),
            h2Tags: Array.from(doc.querySelectorAll("h2")).map((el) => el.textContent || ""),
        };
    };

    const generateScores = (meta: MetaResult): ScoreItem[] => {
        const items: ScoreItem[] = [];

        // Title
        if (!meta.title) items.push({ label: "Title", status: "bad", message: "Thiếu thẻ <title>" });
        else if (meta.title.length < 30) items.push({ label: "Title", status: "warning", message: `Quá ngắn (${meta.title.length} ký tự, nên 30-60)` });
        else if (meta.title.length > 60) items.push({ label: "Title", status: "warning", message: `Quá dài (${meta.title.length} ký tự, nên 30-60)` });
        else items.push({ label: "Title", status: "good", message: `Tốt (${meta.title.length} ký tự)` });

        // Description
        if (!meta.description) items.push({ label: "Meta Description", status: "bad", message: "Thiếu meta description" });
        else if (meta.description.length < 120) items.push({ label: "Meta Description", status: "warning", message: `Hơi ngắn (${meta.description.length} ký tự, nên 120-160)` });
        else if (meta.description.length > 160) items.push({ label: "Meta Description", status: "warning", message: `Quá dài (${meta.description.length} ký tự, nên 120-160)` });
        else items.push({ label: "Meta Description", status: "good", message: `Tốt (${meta.description.length} ký tự)` });

        // Open Graph
        items.push({ label: "OG Title", status: meta.ogTitle ? "good" : "warning", message: meta.ogTitle ? "Có" : "Không tìm thấy og:title" });
        items.push({ label: "OG Description", status: meta.ogDescription ? "good" : "warning", message: meta.ogDescription ? "Có" : "Không tìm thấy og:description" });
        items.push({ label: "OG Image", status: meta.ogImage ? "good" : "warning", message: meta.ogImage ? "Có" : "Không tìm thấy og:image" });

        // Technical
        items.push({ label: "Viewport", status: meta.viewport ? "good" : "bad", message: meta.viewport ? "Có (mobile-friendly)" : "Thiếu thẻ viewport!" });
        items.push({ label: "Canonical URL", status: meta.canonical ? "good" : "warning", message: meta.canonical ? "Có" : "Không tìm thấy canonical" });

        // H1
        if (meta.h1Tags.length === 0) items.push({ label: "H1", status: "bad", message: "Không có thẻ H1" });
        else if (meta.h1Tags.length > 1) items.push({ label: "H1", status: "warning", message: `Có ${meta.h1Tags.length} thẻ H1 (nên chỉ 1)` });
        else items.push({ label: "H1", status: "good", message: "Có 1 thẻ H1" });

        return items;
    };

    const handleAnalyze = () => {
        setError("");
        setResult(null);
        setScores([]);

        if (mode === "html") {
            if (!htmlInput.trim()) {
                setError("Vui lòng dán mã HTML của trang web.");
                return;
            }
            const meta = analyzeHtml(htmlInput);
            setResult(meta);
            setScores(generateScores(meta));
        }
    };

    const getScoreOverall = () => {
        if (scores.length === 0) return 0;
        const good = scores.filter((s) => s.status === "good").length;
        return Math.round((good / scores.length) * 100);
    };

    const statusIcon = (status: string) => {
        if (status === "good") return "✅";
        if (status === "warning") return "⚠️";
        return "❌";
    };

    const statusColor = (status: string) => {
        if (status === "good") return "text-emerald-400";
        if (status === "warning") return "text-yellow-400";
        return "text-red-400";
    };

    return (
        <div className="space-y-6">
            {/* Instructions */}
            <div className="px-4 py-3 rounded-xl bg-cyan-500/5 border border-cyan-500/10 text-sm text-gray-400">
                💡 Dán mã nguồn HTML (Ctrl+U trên trình duyệt) của trang web bạn muốn phân tích vào ô bên dưới.
            </div>

            {/* HTML Input */}
            <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                    Mã HTML
                </label>
                <textarea
                    value={htmlInput}
                    onChange={(e) => setHtmlInput(e.target.value)}
                    placeholder="Dán toàn bộ mã HTML của trang web vào đây..."
                    className="w-full h-44 p-4 font-mono text-xs bg-black/50 border border-white/10 rounded-xl text-white placeholder-gray-600 outline-none focus:border-cyan-500/50 resize-none transition-all"
                />
            </div>

            {/* Analyze button */}
            <button
                onClick={handleAnalyze}
                disabled={loading || !htmlInput.trim()}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm hover:shadow-[0_0_30px_rgba(0,243,255,0.2)] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
            >
                {loading ? "Đang phân tích..." : "🔍 Phân tích SEO"}
            </button>

            {error && (
                <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    ⚠️ {error}
                </div>
            )}

            {/* Results */}
            {result && (
                <div className="space-y-6">
                    {/* Score overview */}
                    <div className="flex items-center gap-6 p-5 rounded-xl bg-black/40 border border-white/10">
                        <div className="relative w-20 h-20 shrink-0">
                            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                                <circle cx="40" cy="40" r="35" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                                <circle
                                    cx="40" cy="40" r="35" fill="none"
                                    stroke={getScoreOverall() >= 70 ? "#34d399" : getScoreOverall() >= 40 ? "#fbbf24" : "#f87171"}
                                    strokeWidth="6" strokeLinecap="round"
                                    strokeDasharray={`${(getScoreOverall() / 100) * 220} 220`}
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center text-lg font-black text-white">
                                {getScoreOverall()}
                            </div>
                        </div>
                        <div>
                            <div className="text-lg font-bold text-white">Điểm SEO</div>
                            <div className="text-sm text-gray-500">
                                {scores.filter((s) => s.status === "good").length}/{scores.length} tiêu chí đạt
                            </div>
                        </div>
                    </div>

                    {/* Score details */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                            Chi tiết đánh giá
                        </label>
                        <div className="rounded-xl border border-white/10 overflow-hidden">
                            {scores.map((item, i) => (
                                <div
                                    key={item.label}
                                    className={`flex items-center justify-between px-4 py-3 text-sm ${i > 0 ? "border-t border-white/5" : ""}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span>{statusIcon(item.status)}</span>
                                        <span className="font-medium text-gray-300">{item.label}</span>
                                    </div>
                                    <span className={`text-xs ${statusColor(item.status)}`}>{item.message}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Extracted meta data */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                            Dữ liệu meta đã trích xuất
                        </label>
                        <div className="rounded-xl border border-white/10 overflow-hidden">
                            {[
                                { label: "Title", value: result.title },
                                { label: "Description", value: result.description },
                                { label: "Keywords", value: result.keywords },
                                { label: "OG Title", value: result.ogTitle },
                                { label: "OG Description", value: result.ogDescription },
                                { label: "OG Image", value: result.ogImage },
                                { label: "Canonical", value: result.canonical },
                                { label: "Robots", value: result.robots },
                                { label: "Viewport", value: result.viewport },
                                { label: "Charset", value: result.charset },
                            ]
                                .filter((item) => item.value)
                                .map((item, i) => (
                                    <div
                                        key={item.label}
                                        className={`px-4 py-3 ${i > 0 ? "border-t border-white/5" : ""}`}
                                    >
                                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                                            {item.label}
                                        </div>
                                        <div className="text-sm text-gray-300 break-all">{item.value}</div>
                                    </div>
                                ))}
                        </div>
                    </div>

                    {/* Headings */}
                    {(result.h1Tags.length > 0 || result.h2Tags.length > 0) && (
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                                Cấu trúc Heading
                            </label>
                            <div className="rounded-xl border border-white/10 p-4 space-y-2">
                                {result.h1Tags.map((h, i) => (
                                    <div key={`h1-${i}`} className="flex items-center gap-3 text-sm">
                                        <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-[10px] font-bold">H1</span>
                                        <span className="text-gray-300">{h}</span>
                                    </div>
                                ))}
                                {result.h2Tags.slice(0, 5).map((h, i) => (
                                    <div key={`h2-${i}`} className="flex items-center gap-3 text-sm">
                                        <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] font-bold">H2</span>
                                        <span className="text-gray-300">{h}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
