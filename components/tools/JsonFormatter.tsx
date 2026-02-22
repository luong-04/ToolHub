"use client";
import React, { useState } from "react";

export default function JsonFormatter() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const handleBeautify = () => {
        try {
            const obj = JSON.parse(input);
            setOutput(JSON.stringify(obj, null, 4));
            setError(null);
        } catch (err: any) {
            setError("Lỗi định dạng JSON: " + err.message);
        }
    };

    const handleMinify = () => {
        try {
            const obj = JSON.parse(input);
            setOutput(JSON.stringify(obj));
            setError(null);
        } catch (err: any) {
            setError("Lỗi định dạng JSON: " + err.message);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-semibold mb-2 text-gray-400 uppercase tracking-widest">
                        Input JSON
                    </label>
                    <textarea
                        className="w-full h-64 p-4 font-mono text-sm bg-black/50 border border-white/10 rounded-xl text-gray-200 placeholder-gray-600 outline-none focus:border-neon-blue/40 focus:shadow-[0_0_20px_rgba(0,243,255,0.05)] transition-all duration-300 resize-none"
                        placeholder="Dán mã JSON vào đây..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold mb-2 text-gray-400 uppercase tracking-widest">
                        Output
                    </label>
                    <textarea
                        className="w-full h-64 p-4 font-mono text-sm bg-black/30 border border-white/10 rounded-xl text-emerald-400 placeholder-gray-600 outline-none resize-none"
                        readOnly
                        value={output}
                        placeholder="Kết quả sẽ hiển thị ở đây..."
                    />
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    {error}
                </div>
            )}

            <div className="flex flex-wrap gap-3">
                <button
                    onClick={handleBeautify}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm hover:shadow-[0_0_20px_rgba(0,243,255,0.2)] transition-all duration-300"
                >
                    ✨ Làm đẹp (Beautify)
                </button>
                <button
                    onClick={handleMinify}
                    className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-semibold text-sm hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                >
                    📦 Nén mã (Minify)
                </button>
                <button
                    onClick={copyToClipboard}
                    className="px-6 py-2.5 rounded-xl border border-neon-blue/30 text-neon-blue font-semibold text-sm hover:bg-neon-blue/10 transition-all duration-300"
                >
                    {copied ? "✅ Đã copy!" : "📋 Copy kết quả"}
                </button>
                <button
                    onClick={() => {
                        setInput("");
                        setOutput("");
                        setError(null);
                    }}
                    className="px-4 py-2.5 text-sm text-gray-500 hover:text-red-400 transition-colors"
                >
                    🗑️ Xóa hết
                </button>
            </div>
        </div>
    );
}