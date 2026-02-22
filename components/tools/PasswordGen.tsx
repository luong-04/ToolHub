"use client";
import React, { useState, useCallback } from "react";

export default function PasswordGen() {
    const [password, setPassword] = useState("");
    const [length, setLength] = useState(16);
    const [includeUpper, setIncludeUpper] = useState(true);
    const [includeLower, setIncludeLower] = useState(true);
    const [includeNumbers, setIncludeNumbers] = useState(true);
    const [includeSymbols, setIncludeSymbols] = useState(true);
    const [copied, setCopied] = useState(false);

    const generatePassword = useCallback(() => {
        let chars = "";
        if (includeLower) chars += "abcdefghijklmnopqrstuvwxyz";
        if (includeUpper) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        if (includeNumbers) chars += "0123456789";
        if (includeSymbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";
        if (!chars) chars = "abcdefghijklmnopqrstuvwxyz";

        let result = "";
        const array = new Uint32Array(length);
        crypto.getRandomValues(array);
        for (let i = 0; i < length; i++) {
            result += chars[array[i] % chars.length];
        }
        setPassword(result);
        setCopied(false);
    }, [length, includeUpper, includeLower, includeNumbers, includeSymbols]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(password);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const strengthLabel = () => {
        if (length >= 20 && includeSymbols && includeNumbers) return { text: "Rất mạnh", color: "text-emerald-400", bg: "bg-emerald-400" };
        if (length >= 14) return { text: "Mạnh", color: "text-cyan-400", bg: "bg-cyan-400" };
        if (length >= 8) return { text: "Trung bình", color: "text-yellow-400", bg: "bg-yellow-400" };
        return { text: "Yếu", color: "text-red-400", bg: "bg-red-400" };
    };

    const strength = strengthLabel();

    return (
        <div className="space-y-6">
            {/* Generated password display */}
            <div className="relative">
                <div className="w-full p-5 font-mono text-lg bg-black/50 border border-white/10 rounded-xl text-neon-blue tracking-wider text-center min-h-[60px] flex items-center justify-center break-all">
                    {password || <span className="text-gray-600 text-sm font-sans">Nhấn nút bên dưới để tạo mật khẩu...</span>}
                </div>
                {password && (
                    <div className="absolute top-2 right-2 flex items-center gap-2">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${strength.color}`}>
                            {strength.text}
                        </span>
                        <div className={`w-2 h-2 rounded-full ${strength.bg}`} />
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Length slider */}
                <div className="space-y-3">
                    <label className="flex items-center justify-between text-xs font-semibold text-gray-400 uppercase tracking-widest">
                        Độ dài
                        <span className="text-neon-blue font-mono text-sm">{length}</span>
                    </label>
                    <input
                        type="range"
                        min={4}
                        max={64}
                        value={length}
                        onChange={(e) => setLength(Number(e.target.value))}
                        className="w-full accent-[#00f3ff] h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-gray-600">
                        <span>4</span>
                        <span>64</span>
                    </div>
                </div>

                {/* Checkboxes */}
                <div className="space-y-3">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                        Ký tự
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        {[
                            { label: "Chữ hoa (A-Z)", checked: includeUpper, set: setIncludeUpper },
                            { label: "Chữ thường (a-z)", checked: includeLower, set: setIncludeLower },
                            { label: "Số (0-9)", checked: includeNumbers, set: setIncludeNumbers },
                            { label: "Ký tự đặc biệt", checked: includeSymbols, set: setIncludeSymbols },
                        ].map((opt) => (
                            <label
                                key={opt.label}
                                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border cursor-pointer transition-all duration-200 text-sm ${opt.checked
                                        ? "border-neon-blue/30 bg-neon-blue/5 text-white"
                                        : "border-white/5 bg-white/[0.02] text-gray-500"
                                    }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={opt.checked}
                                    onChange={(e) => opt.set(e.target.checked)}
                                    className="sr-only"
                                />
                                <div
                                    className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${opt.checked ? "bg-neon-blue border-neon-blue" : "border-gray-600"
                                        }`}
                                >
                                    {opt.checked && (
                                        <svg className="w-2.5 h-2.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                                {opt.label}
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3">
                <button
                    onClick={generatePassword}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm hover:shadow-[0_0_30px_rgba(0,243,255,0.2)] transition-all duration-300"
                >
                    🔑 Tạo mật khẩu
                </button>
                {password && (
                    <button
                        onClick={copyToClipboard}
                        className="px-6 py-3 rounded-xl border border-neon-blue/30 text-neon-blue font-semibold text-sm hover:bg-neon-blue/10 transition-all duration-300"
                    >
                        {copied ? "✅ Đã copy!" : "📋 Copy"}
                    </button>
                )}
            </div>
        </div>
    );
}