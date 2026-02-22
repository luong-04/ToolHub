"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

type Category = { id: string; name: string; slug: string };
type AvailableKey = { key: string; label: string };
type Tool = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    componentKey: string;
    isPublished: boolean;
    categoryId: string;
    category?: Category;
    createdAt: string;
};

export default function AdminPage() {
    const [isAuth, setIsAuth] = useState(false);
    const [code, setCode] = useState("");
    const [activeTab, setActiveTab] = useState<"tools" | "categories">("tools");

    // Data states
    const [categories, setCategories] = useState<Category[]>([]);
    const [tools, setTools] = useState<Tool[]>([]);
    const [availableKeys, setAvailableKeys] = useState<AvailableKey[]>([]);
    const [loading, setLoading] = useState(false);

    // Form states
    const [catName, setCatName] = useState("");
    const [toolForm, setToolForm] = useState({
        name: "",
        slug: "",
        categoryId: "",
        componentKey: "",
        description: "",
        content: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState<{
        text: string;
        type: "success" | "error";
    } | null>(null);

    const showMessage = (text: string, type: "success" | "error") => {
        setMessage({ text, type });
        setTimeout(() => setMessage(null), 4000);
    };

    // Fetch data
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/data");
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setCategories(data.categories || []);
            setTools(data.tools || []);
            setAvailableKeys(data.availableKeys || []);
        } catch (err) {
            console.error(err);
            showMessage("Lỗi tải dữ liệu!", "error");
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        if (isAuth) fetchData();
    }, [isAuth, fetchData]);

    const handleAuth = (e: React.FormEvent) => {
        e.preventDefault();
        if (code === "Luong2004") {
            setIsAuth(true);
        } else {
            showMessage("Mã bảo mật không chính xác!", "error");
        }
    };

    // Auto-generate slug
    const autoSlug = (name: string) => {
        return name
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
    };

    // ─── Add category ───
    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!catName.trim()) {
            showMessage("Vui lòng nhập tên danh mục!", "error");
            return;
        }
        setSubmitting(true);
        try {
            const res = await fetch("/api/admin/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: catName.trim() }),
            });
            const data = await res.json();
            if (res.ok) {
                showMessage(`✅ Đã thêm danh mục "${catName}"!`, "success");
                setCatName("");
                fetchData();
            } else {
                showMessage(data.error || "Lỗi thêm danh mục!", "error");
            }
        } catch {
            showMessage("Lỗi kết nối server!", "error");
        }
        setSubmitting(false);
    };

    // ─── Delete category ───
    const handleDeleteCategory = async (id: string, name: string) => {
        if (!confirm(`Xóa danh mục "${name}"?`)) return;
        try {
            const res = await fetch(`/api/admin/categories?id=${id}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (res.ok) {
                showMessage(`Đã xóa danh mục "${name}"!`, "success");
                fetchData();
            } else {
                showMessage(data.error || "Lỗi xóa!", "error");
            }
        } catch {
            showMessage("Lỗi kết nối!", "error");
        }
    };

    // ─── Add tool ───
    const handleAddTool = async (e: React.FormEvent) => {
        e.preventDefault();
        if (
            !toolForm.name ||
            !toolForm.slug ||
            !toolForm.categoryId ||
            !toolForm.componentKey
        ) {
            showMessage("Vui lòng điền đầy đủ: tên, slug, danh mục, component!", "error");
            return;
        }
        setSubmitting(true);
        try {
            const res = await fetch("/api/admin/tools", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(toolForm),
            });
            const data = await res.json();
            if (res.ok) {
                showMessage(`✅ Đã thêm tool "${toolForm.name}"! (Chờ xuất bản)`, "success");
                setToolForm({
                    name: "",
                    slug: "",
                    categoryId: "",
                    componentKey: "",
                    description: "",
                    content: "",
                });
                fetchData();
            } else {
                showMessage(data.error || "Lỗi thêm tool!", "error");
            }
        } catch {
            showMessage("Lỗi kết nối server!", "error");
        }
        setSubmitting(false);
    };

    // ─── Toggle publish ───
    const handleTogglePublish = async (toolId: string, current: boolean) => {
        try {
            const res = await fetch("/api/admin/tools", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: toolId, isPublished: !current }),
            });
            if (res.ok) {
                showMessage(
                    !current ? "✅ Đã xuất bản công cụ!" : "⏸️ Đã ẩn công cụ!",
                    "success"
                );
                fetchData();
            }
        } catch {
            showMessage("Lỗi cập nhật!", "error");
        }
    };

    // ─── Delete tool ───
    const handleDeleteTool = async (id: string, name: string) => {
        if (!confirm(`Xóa công cụ "${name}"?`)) return;
        try {
            const res = await fetch(`/api/admin/tools?id=${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                showMessage(`Đã xóa "${name}"!`, "success");
                fetchData();
            } else {
                showMessage("Lỗi xóa!", "error");
            }
        } catch {
            showMessage("Lỗi kết nối!", "error");
        }
    };

    // Filter: which registry keys are not yet used by any tool
    const usedKeys = new Set(tools.map((t) => t.componentKey));
    const unusedKeys = availableKeys.filter((k) => !usedKeys.has(k.key));

    // ══════════════════════════════════════════════════════════
    // LOGIN SCREEN
    // ══════════════════════════════════════════════════════════
    if (!isAuth) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <form
                    onSubmit={handleAuth}
                    className="glass-card !rounded-3xl w-full max-w-sm space-y-6 !p-8"
                >
                    <div className="text-center space-y-2">
                        <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                            <svg
                                className="w-7 h-7 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                            </svg>
                        </div>
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">
                            Security Portal
                        </div>
                        <h2 className="text-xl font-black text-white">Xác minh Admin</h2>
                    </div>
                    <input
                        type="password"
                        placeholder="Nhập mã truy cập..."
                        className="admin-input w-full text-center text-white"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        autoFocus
                    />
                    <button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:shadow-[0_0_30px_rgba(0,243,255,0.2)] transition-all duration-300 uppercase text-sm"
                    >
                        Truy cập hệ thống
                    </button>
                    {message && (
                        <p
                            className={`text-center text-sm ${message.type === "error" ? "text-red-400" : "text-emerald-400"
                                }`}
                        >
                            {message.text}
                        </p>
                    )}
                </form>
            </div>
        );
    }

    // ══════════════════════════════════════════════════════════
    // DASHBOARD
    // ══════════════════════════════════════════════════════════
    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                        <svg
                            className="w-5 h-5 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-white">Admin Dashboard</h1>
                        <p className="text-xs text-gray-500">Quản lý công cụ và danh mục</p>
                    </div>
                </div>
                <Link
                    href="/"
                    className="text-xs text-gray-500 hover:text-neon-blue transition-colors"
                >
                    ← Về trang chủ
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="glass-card !p-4 text-center">
                    <div className="text-2xl font-black text-white">{tools.length}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">
                        Công cụ
                    </div>
                </div>
                <div className="glass-card !p-4 text-center">
                    <div className="text-2xl font-black text-white">
                        {categories.length}
                    </div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">
                        Danh mục
                    </div>
                </div>
                <div className="glass-card !p-4 text-center">
                    <div className="text-2xl font-black text-emerald-400">
                        {tools.filter((t) => t.isPublished).length}
                    </div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">
                        Đã xuất bản
                    </div>
                </div>
                <div className="glass-card !p-4 text-center">
                    <div className="text-2xl font-black text-yellow-400">
                        {tools.filter((t) => !t.isPublished).length}
                    </div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">
                        Bản nháp
                    </div>
                </div>
            </div>

            {/* Toast message */}
            {message && (
                <div
                    className={`fixed top-20 right-6 z-[999] px-5 py-3 rounded-xl text-sm font-medium shadow-2xl transition-all animate-in slide-in-from-right ${message.type === "success"
                        ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400"
                        : "bg-red-500/20 border border-red-500/30 text-red-400"
                        }`}
                >
                    {message.text}
                </div>
            )}

            {/* Tabs */}
            <div className="flex gap-1 bg-white/5 rounded-xl p-1">
                {(["tools", "categories"] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${activeTab === tab
                            ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                            : "text-gray-500 hover:text-gray-300"
                            }`}
                    >
                        {tab === "tools" ? "🔧 Công cụ" : "📂 Danh mục"}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="text-center py-10 text-gray-500 animate-pulse">
                    Đang tải dữ liệu...
                </div>
            ) : activeTab === "categories" ? (
                /* ══════════════ CATEGORIES TAB ══════════════ */
                <div className="space-y-6">
                    {/* Add category form */}
                    <form
                        onSubmit={handleAddCategory}
                        className="glass-card !rounded-2xl"
                    >
                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
                            Thêm danh mục mới
                        </h3>
                        <div className="flex gap-3">
                            <input
                                placeholder="Tên danh mục mới (VD: SEO Tools, Encoding)..."
                                className="admin-input flex-1 text-white"
                                value={catName}
                                onChange={(e) => setCatName(e.target.value)}
                            />
                            <button
                                type="submit"
                                disabled={submitting || !catName.trim()}
                                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl text-xs uppercase tracking-widest hover:shadow-[0_0_20px_rgba(0,243,255,0.2)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? "..." : "Thêm"}
                            </button>
                        </div>
                    </form>

                    {/* Category list */}
                    <div className="space-y-2">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">
                            Danh sách danh mục ({categories.length})
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {categories.map((cat) => {
                                const toolCount = tools.filter(
                                    (t) => t.categoryId === cat.id
                                ).length;
                                return (
                                    <div
                                        key={cat.id}
                                        className="glass-card !rounded-xl !p-4 flex items-center justify-between"
                                    >
                                        <div>
                                            <div className="font-semibold text-white">{cat.name}</div>
                                            <div className="text-xs text-gray-500">
                                                /{cat.slug} · {toolCount} công cụ
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteCategory(cat.id, cat.name)}
                                            className="text-gray-600 hover:text-red-400 transition-colors p-2"
                                            title="Xóa danh mục"
                                        >
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                );
                            })}
                            {categories.length === 0 && (
                                <p className="text-gray-500 text-sm col-span-2 text-center py-8">
                                    Chưa có danh mục nào. Thêm danh mục đầu tiên ở trên!
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                /* ══════════════ TOOLS TAB ══════════════ */
                <div className="space-y-8">
                    {/* Add tool form */}
                    <form
                        onSubmit={handleAddTool}
                        className="glass-card !rounded-2xl space-y-5"
                    >
                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">
                            Thêm công cụ mới
                        </h3>

                        {/* Component key dropdown — only shows unused registry keys */}
                        <div>
                            <label className="block text-xs text-gray-500 mb-2">
                                Component (từ Tool Registry) *
                            </label>
                            <select
                                className="admin-input w-full text-white"
                                value={toolForm.componentKey}
                                onChange={(e) => {
                                    const selected = availableKeys.find(
                                        (k) => k.key === e.target.value
                                    );
                                    if (selected) {
                                        setToolForm({
                                            ...toolForm,
                                            componentKey: selected.key,
                                            name: toolForm.name || selected.label,
                                            slug: toolForm.slug || autoSlug(selected.label),
                                        });
                                    } else {
                                        setToolForm({ ...toolForm, componentKey: e.target.value });
                                    }
                                }}
                            >
                                <option value="">-- Chọn component --</option>
                                {availableKeys.map((k) => {
                                    const isUsed = usedKeys.has(k.key);
                                    return (
                                        <option
                                            key={k.key}
                                            value={k.key}
                                            disabled={isUsed}
                                        >
                                            {k.label} ({k.key}){isUsed ? " — đã sử dụng" : ""}
                                        </option>
                                    );
                                })}
                            </select>
                            {unusedKeys.length === 0 && (
                                <p className="text-xs text-yellow-400 mt-2">
                                    ⚠️ Tất cả component đã được sử dụng. Thêm component mới vào{" "}
                                    <code className="text-neon-blue">
                                        components/tools/available-keys.ts
                                    </code>{" "}
                                    và{" "}
                                    <code className="text-neon-blue">
                                        components/tools/tool-registry.tsx
                                    </code>
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-gray-500 mb-2">
                                    Tên công cụ *
                                </label>
                                <input
                                    placeholder="VD: JSON Formatter"
                                    className="admin-input w-full text-white"
                                    value={toolForm.name}
                                    onChange={(e) =>
                                        setToolForm({
                                            ...toolForm,
                                            name: e.target.value,
                                            slug: autoSlug(e.target.value),
                                        })
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-2">
                                    URL Slug *
                                </label>
                                <input
                                    placeholder="json-formatter"
                                    className="admin-input w-full text-white font-mono text-xs"
                                    value={toolForm.slug}
                                    onChange={(e) =>
                                        setToolForm({ ...toolForm, slug: e.target.value })
                                    }
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs text-gray-500 mb-2">
                                Danh mục *
                            </label>
                            <select
                                className="admin-input w-full text-white"
                                value={toolForm.categoryId}
                                onChange={(e) =>
                                    setToolForm({ ...toolForm, categoryId: e.target.value })
                                }
                            >
                                <option value="">-- Chọn danh mục --</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                            {categories.length === 0 && (
                                <p className="text-xs text-yellow-400 mt-2">
                                    ⚠️ Chưa có danh mục — hãy thêm danh mục trước ở tab "Danh
                                    mục"
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs text-gray-500 mb-2">
                                Mô tả ngắn (SEO)
                            </label>
                            <textarea
                                placeholder="Mô tả ngắn về công cụ cho SEO..."
                                className="admin-input w-full text-white resize-none h-20"
                                value={toolForm.description}
                                onChange={(e) =>
                                    setToolForm({ ...toolForm, description: e.target.value })
                                }
                            />
                        </div>

                        <div>
                            <label className="block text-xs text-gray-500 mb-2">
                                Nội dung HTML (bài viết SEO)
                            </label>
                            <textarea
                                placeholder="<h2>Tiêu đề</h2><p>Nội dung bài viết...</p>"
                                className="admin-input w-full text-white resize-none h-32 font-mono text-xs"
                                value={toolForm.content}
                                onChange={(e) =>
                                    setToolForm({ ...toolForm, content: e.target.value })
                                }
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={
                                submitting ||
                                !toolForm.name ||
                                !toolForm.slug ||
                                !toolForm.categoryId ||
                                !toolForm.componentKey
                            }
                            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:shadow-[0_0_30px_rgba(0,243,255,0.2)] transition-all duration-300 uppercase text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? "Đang thêm..." : "➕ Thêm công cụ (Bản nháp)"}
                        </button>
                        <p className="text-xs text-gray-600 text-center">
                            Tool sẽ ở trạng thái bản nháp. Nhấn nút publish ở danh sách bên
                            dưới để công khai.
                        </p>
                    </form>

                    {/* Tool list */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">
                            Tất cả công cụ ({tools.length})
                        </h3>
                        {tools.length === 0 && (
                            <p className="text-gray-500 text-sm text-center py-8">
                                Chưa có công cụ nào. Thêm công cụ đầu tiên ở trên!
                            </p>
                        )}
                        {tools.map((tool) => (
                            <div
                                key={tool.id}
                                className="glass-card !rounded-xl !p-4 flex items-center justify-between"
                            >
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    {/* Publish toggle */}
                                    <button
                                        onClick={() =>
                                            handleTogglePublish(tool.id, tool.isPublished)
                                        }
                                        className={`shrink-0 w-10 h-5 rounded-full relative transition-all duration-300 ${tool.isPublished ? "bg-emerald-500/30" : "bg-gray-700"
                                            }`}
                                        title={
                                            tool.isPublished
                                                ? "Đang công khai — nhấn để ẩn"
                                                : "Bản nháp — nhấn để công khai"
                                        }
                                    >
                                        <div
                                            className={`absolute top-0.5 w-4 h-4 rounded-full transition-all duration-300 ${tool.isPublished
                                                ? "left-5 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"
                                                : "left-0.5 bg-gray-500"
                                                }`}
                                        />
                                    </button>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-white truncate">
                                                {tool.name}
                                            </span>
                                            <span
                                                className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${tool.isPublished
                                                    ? "bg-emerald-500/20 text-emerald-400"
                                                    : "bg-yellow-500/20 text-yellow-400"
                                                    }`}
                                            >
                                                {tool.isPublished ? "Live" : "Draft"}
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-500 truncate">
                                            /{tool.slug} ·{" "}
                                            {categories.find((c) => c.id === tool.categoryId)?.name ||
                                                "N/A"}{" "}
                                            ·{" "}
                                            <span className="font-mono text-neon-blue/60">
                                                {tool.componentKey}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                    <Link
                                        href={`/tools/${tool.slug}`}
                                        className="text-xs text-gray-500 hover:text-neon-blue transition-colors px-2 py-1 rounded-lg hover:bg-white/5"
                                        target="_blank"
                                    >
                                        Xem ↗
                                    </Link>
                                    <button
                                        onClick={() => handleDeleteTool(tool.id, tool.name)}
                                        className="text-gray-600 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-white/5"
                                        title="Xóa công cụ"
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}