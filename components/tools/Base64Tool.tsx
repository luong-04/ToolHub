"use client";
import React, { useState } from "react";

export default function Base64Tool() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [mode, setMode] = useState<"encode" | "decode">("encode");
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState("");

    const handleConvert = () => {
        setError("");
        setCopied(false);
        try {
            if (mode === "encode") {
                // Use TextEncoder for proper UTF-8 handling
                const encoder = new TextEncoder();
                const data = encoder.encode(input);
                let binary = "";
                data.forEach((byte) => (binary += String.fromCharCode(byte)));
                setOutput(btoa(binary));
            } else {
                // Decode Base64 → UTF-8
                const binary = atob(input.trim());
                const bytes = new Uint8Array(binary.length);
                for (let i = 0; i < binary.length; i++) {
                    bytes[i] = binary.charCodeAt(i);
                }
                const decoder = new TextDecoder();
                setOutput(decoder.decode(bytes));
            }
        } catch {
            setError(
                mode === "encode"
                    ? "Không thể mã hóa nội dung này."
                    : "Chuỗi Base64 không hợp lệ. Vui lòng kiểm tra lại."
            );
            setOutput("");
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSwap = () => {
        setMode(mode === "encode" ? "decode" : "encode");
        setInput(output);
        setOutput("");
        setError("");
        setCopied(false);
    };

    const handleClear = () => {
        setInput("");
        setOutput("");
        setError("");
        setCopied(false);
    };

    return (
        <div className="space-y-6">
            {/* Mode switcher */}
            <div className="flex items-center gap-2 p-1 bg-black/40 rounded-xl w-fit">
                <button
                    onClick={() => { setMode("encode"); setOutput(""); setError(""); }}
                    className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${mode === "encode"
                            ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg"
                            : "text-gray-400 hover:text-white"
                        }`}
                >
                    Encode
                </button>
                <button
                    onClick={() => { setMode("decode"); setOutput(""); setError(""); }}
                    className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${mode === "decode"
                            ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg"
                            : "text-gray-400 hover:text-white"
                        }`}
                >
                    Decode
                </button>
            </div>

            {/* Input */}
            <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                    {mode === "encode" ? "Text gốc" : "Chuỗi Base64"}
                </label>
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={mode === "encode" ? "Nhập text cần mã hóa..." : "Dán chuỗi Base64 vào đây..."}
                    className="w-full h-40 p-4 font-mono text-sm bg-black/50 border border-white/10 rounded-xl text-white placeholder-gray-600 outline-none focus:border-cyan-500/50 resize-none transition-all"
                />
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3">
                <button
                    onClick={handleConvert}
                    disabled={!input.trim()}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm hover:shadow-[0_0_30px_rgba(0,243,255,0.2)] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    {mode === "encode" ? "🔒 Encode" : "🔓 Decode"}
                </button>
                <button
                    onClick={handleSwap}
                    disabled={!output}
                    className="px-5 py-3 rounded-xl border border-white/10 text-gray-400 font-semibold text-sm hover:border-neon-blue/30 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    🔄 Đảo ngược
                </button>
                <button
                    onClick={handleClear}
                    className="px-5 py-3 rounded-xl border border-white/10 text-gray-400 font-semibold text-sm hover:border-red-500/30 hover:text-red-400 transition-all"
                >
                    🗑️ Xóa
                </button>
            </div>

            {/* Error */}
            {error && (
                <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    ⚠️ {error}
                </div>
            )}

            {/* Output */}
            {output && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                            {mode === "encode" ? "Base64" : "Text gốc"}
                        </label>
                        <button
                            onClick={handleCopy}
                            className="text-xs font-semibold text-neon-blue/60 hover:text-neon-blue transition-colors"
                        >
                            {copied ? "✅ Đã copy!" : "📋 Copy"}
                        </button>
                    </div>
                    <div className="w-full p-4 font-mono text-sm bg-black/50 border border-neon-blue/20 rounded-xl text-neon-blue break-all whitespace-pre-wrap">
                        {output}
                    </div>
                    <div className="text-[11px] text-gray-600">
                        Input: {input.length} ký tự → Output: {output.length} ký tự
                    </div>
                </div>
            )}
        </div>
    );
}
