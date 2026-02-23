"use client";
import { useState, useEffect, useCallback, useRef } from "react";
// Dùng Link của i18n để đồng bộ ngôn ngữ admin
import { Link } from "@/i18n/routing";
import { useRouter, useParams } from "next/navigation";

// --- Types ---
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
    createdAt: string;
};

export default function AdminPage() {
    const [isAuth, setIsAuth] = useState(false);
    const [code, setCode] = useState("");
    const [activeTab, setActiveTab] = useState<"tools" | "categories">("tools");
    const router = useRouter();
    const params = useParams();
    const locale = params.locale as string;

    // Data states
    const [categories, setCategories] = useState<Category[]>([]);
    const [tools, setTools] = useState<Tool[]>([]);
    const [availableKeys, setAvailableKeys] = useState<AvailableKey[]>([]);
    const [loading, setLoading] = useState(false);

    // Form states
    const [catName, setCatName] = useState("");
    const [editingCat, setEditingCat] = useState<Category | null>(null);

    const [toolForm, setToolForm] = useState({
        name: "",
        slug: "",
        categoryId: "",
        componentKey: "",
        description: "",
        content: "",
    });
    const [editingTool, setEditingTool] = useState<Tool | null>(null);

    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState<{
        text: string;
        type: "success" | "error" | "info";
    } | null>(null);

    // Helpers
    const showMessage = (text: string, type: "success" | "error" | "info") => {
        setMessage({ text, type });
        setTimeout(() => setMessage(null), 5000);
    };

    const autoSlug = (name: string) => {
        return name
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
    };

    // --- Data Fetching ---
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/data");
            if (!res.ok) throw new Error("Hệ thống bận");
            const data = await res.json();
            setCategories(data.categories || []);
            setTools(data.tools || []);
            setAvailableKeys(data.availableKeys || []);
        } catch (err) {
            showMessage("Không thể kết nối cơ sở dữ liệu!", "error");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isAuth) fetchData();
    }, [isAuth, fetchData]);

    // --- Authentication ---
    const handleAuth = (e: React.FormEvent) => {
        e.preventDefault();
        if (code === "Luong2004") {
            setIsAuth(true);
            showMessage("Chào mừng Admin quay trở lại!", "success");
        } else {
            showMessage("Mã bảo mật sai. Vui lòng thử lại!", "error");
        }
    };

    // --- Category Actions ---
    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!catName.trim()) return showMessage("Tên danh mục không được để trống!", "error");

        setSubmitting(true);
        try {
            const res = await fetch("/api/admin/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: catName.trim() }),
            });
            if (res.ok) {
                showMessage(`✅ Danh mục "${catName}" đã được tạo!`, "success");
                setCatName("");
                fetchData();
            } else {
                const err = await res.json();
                showMessage(err.error || "Lỗi tạo danh mục", "error");
            }
        } catch {
            showMessage("Lỗi server!", "error");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteCategory = async (id: string, name: string) => {
        if (!confirm(`Xác nhận xóa danh mục "${name}"? Thao tác này không thể hoàn tác!`)) return;
        try {
            const res = await fetch(`/api/admin/categories?id=${id}`, { method: "DELETE" });
            if (res.ok) {
                showMessage("Đã xóa danh mục thành công.", "success");
                fetchData();
            }
        } catch {
            showMessage("Lỗi xóa danh mục!", "error");
        }
    };

    // --- Tool Actions ---
    const handleAddTool = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!toolForm.name || !toolForm.slug || !toolForm.categoryId || !toolForm.componentKey) {
            return showMessage("Vui lòng nhập các thông tin có dấu (*)", "error");
        }

        setSubmitting(true);
        showMessage("🚀 Đang tiến hành lưu và TỰ ĐỘNG DỊCH sang 9 ngôn ngữ. Vui lòng đợi...", "info");

        try {
            const res = await fetch("/api/admin/tools", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(toolForm),
            });

            if (res.ok) {
                showMessage("✨ Tuyệt vời! Công cụ đã được lưu và dịch thuật thành công.", "success");
                setToolForm({ name: "", slug: "", categoryId: "", componentKey: "", description: "", content: "" });
                fetchData();
            } else {
                const err = await res.json();
                showMessage(err.error || "Lỗi lưu công cụ", "error");
            }
        } catch {
            showMessage("Lỗi hệ thống khi dịch thuật!", "error");
        } finally {
            setSubmitting(false);
        }
    };

    const handleTogglePublish = async (toolId: string, currentStatus: boolean) => {
        try {
            const res = await fetch("/api/admin/tools", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: toolId, isPublished: !currentStatus }),
            });
            if (res.ok) {
                showMessage(!currentStatus ? "✅ Công cụ đã được công khai!" : "⏸️ Đã đưa công cụ về bản nháp.", "success");
                fetchData();
            }
        } catch {
            showMessage("Lỗi cập nhật trạng thái!", "error");
        }
    };

    const handleDeleteTool = async (id: string, name: string) => {
        if (!confirm(`Xóa vĩnh viễn "${name}" và toàn bộ dữ liệu dịch thuật liên quan?`)) return;
        try {
            const res = await fetch(`/api/admin/tools?id=${id}`, { method: "DELETE" });
            if (res.ok) {
                showMessage(`Đã xóa hoàn toàn dữ liệu của ${name}.`, "success");
                fetchData();
            }
        } catch {
            showMessage("Lỗi xóa công cụ!", "error");
        }
    };

    // ══════════════════════════════════════════════════════════
    // RENDER: LOGIN
    // ══════════════════════════════════════════════════════════
    if (!isAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-[#050505]">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />
                </div>

                <form onSubmit={handleAuth} className="glass-card !rounded-[2.5rem] w-full max-w-md space-y-8 !p-10 relative z-10 border-white/10">
                    <div className="text-center space-y-4">
                        <div className="w-20 h-20 mx-auto rounded-[2rem] bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.3)]">
                            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-white tracking-tighter">ADMIN PORTAL</h2>
                            <p className="text-gray-500 text-sm mt-1 uppercase tracking-[0.2em] font-bold">ToolHub Management</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="relative group">
                            <input
                                type="password"
                                placeholder="Mã bảo mật..."
                                className="admin-input w-full text-center text-white py-4 !rounded-2xl group-focus-within:border-cyan-500/50"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <button type="submit" className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black rounded-2xl hover:shadow-[0_0_30px_rgba(0,243,255,0.3)] transition-all duration-300 uppercase tracking-widest active:scale-[0.98]">
                            Xác thực hệ thống
                        </button>
                    </div>

                    {message && (
                        <div className={`p-4 rounded-xl text-center text-sm font-bold border ${message.type === "error" ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"}`}>
                            {message.text}
                        </div>
                    )}
                </form>
            </div>
        );
    }

    // ══════════════════════════════════════════════════════════
    // RENDER: DASHBOARD
    // ══════════════════════════════════════════════════════════
    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-black text-cyan-500 uppercase tracking-widest">
                            Admin System v2.0
                        </div>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter italic uppercase">
                        Quản lý <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Nội dung</span>
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/" className="px-5 py-2.5 rounded-xl border border-white/5 bg-white/5 text-xs font-bold text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                        ← Xem trang chủ
                    </Link>
                    <button onClick={() => window.location.reload()} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 text-xs font-bold text-red-400 hover:bg-red-500/20 transition-all">
                        Đăng xuất
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                    { label: "Tổng công cụ", value: tools.length, color: "from-blue-500 to-cyan-500" },
                    { label: "Danh mục", value: categories.length, color: "from-purple-500 to-pink-500" },
                    { label: "Đã xuất bản", value: tools.filter(t => t.isPublished).length, color: "from-emerald-500 to-teal-500" },
                    { label: "Bản nháp", value: tools.filter(t => !t.isPublished).length, color: "from-orange-500 to-yellow-500" }
                ].map((stat, i) => (
                    <div key={i} className="glass-card !p-6 flex flex-col items-center justify-center text-center group hover:border-white/20 transition-all">
                        <div className="text-4xl font-black text-white group-hover:scale-110 transition-transform duration-300">{stat.value}</div>
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2">{stat.label}</div>
                        <div className={`h-1 w-10 rounded-full bg-gradient-to-r ${stat.color} mt-4 opacity-50`} />
                    </div>
                ))}
            </div>

            {/* Notification Toast */}
            {message && (
                <div className={`fixed top-24 right-6 z-[100] px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl animate-in slide-in-from-right duration-300 ${message.type === "error" ? "bg-red-500/20 border-red-500/20 text-red-400" :
                        message.type === "info" ? "bg-cyan-500/20 border-cyan-500/20 text-cyan-400" :
                            "bg-emerald-500/20 border-emerald-500/20 text-emerald-400"
                    }`}>
                    <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full animate-ping ${message.type === "error" ? "bg-red-400" : "bg-cyan-400"}`} />
                        <span className="font-bold text-sm">{message.text}</span>
                    </div>
                </div>
            )}

            {/* Tab Navigation */}
            <div className="flex p-1.5 bg-white/5 rounded-[1.5rem] border border-white/5 max-w-md mx-auto">
                <button
                    onClick={() => setActiveTab("tools")}
                    className={`flex-1 py-4 text-xs font-black uppercase tracking-[0.2em] rounded-2xl transition-all duration-500 ${activeTab === "tools" ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20" : "text-gray-500 hover:text-gray-300"}`}
                >
                    🔧 Công cụ
                </button>
                <button
                    onClick={() => setActiveTab("categories")}
                    className={`flex-1 py-4 text-xs font-black uppercase tracking-[0.2em] rounded-2xl transition-all duration-500 ${activeTab === "categories" ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20" : "text-gray-500 hover:text-gray-300"}`}
                >
                    📂 Danh mục
                </button>
            </div>

            {loading && !submitting ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                    <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
                    <p className="text-gray-500 font-bold text-xs uppercase tracking-widest">Đang đồng bộ dữ liệu...</p>
                </div>
            ) : activeTab === "categories" ? (
                /* ══════════════ CATEGORIES TAB ══════════════ */
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-1">
                        <form onSubmit={handleAddCategory} className="glass-card !rounded-[2rem] space-y-6 sticky top-24">
                            <h3 className="text-lg font-black text-white italic uppercase tracking-tight">Thêm danh mục</h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Tên danh mục *</label>
                                    <input
                                        placeholder="Ví dụ: SEO Tools..."
                                        className="admin-input w-full"
                                        value={catName}
                                        onChange={(e) => setCatName(e.target.value)}
                                    />
                                </div>
                                <button disabled={submitting} type="submit" className="w-full py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all uppercase text-[10px] tracking-widest">
                                    {submitting ? "Đang xử lý..." : "Xác nhận thêm"}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="lg:col-span-2 space-y-4">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-3">
                            Danh sách hiện có <span className="h-[1px] flex-1 bg-white/5" />
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {categories.map((cat) => (
                                <div key={cat.id} className="glass-card !rounded-2xl !p-5 flex items-center justify-between group hover:border-cyan-500/30 transition-all">
                                    <div>
                                        <div className="font-bold text-white text-lg">{cat.name}</div>
                                        <div className="text-xs text-cyan-500/50 font-mono mt-1">/{cat.slug}</div>
                                    </div>
                                    <button onClick={() => handleDeleteCategory(cat.id, cat.name)} className="p-3 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                /* ══════════════ TOOLS TAB ══════════════ */
                <div className="space-y-12">
                    {/* Add Tool Form */}
                    <form onSubmit={handleAddTool} className="glass-card !rounded-[2.5rem] !p-10 space-y-10 border-white/10">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">
                                <span className="text-cyan-500">Tạo</span> Công cụ mới
                            </h3>
                            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
                                <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                                <span className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">Auto-Translate Enabled</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Left Col */}
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Tên công cụ (Tiếng Việt) *</label>
                                    <input
                                        placeholder="Ví dụ: Định dạng JSON"
                                        className="admin-input w-full !text-lg !font-bold"
                                        value={toolForm.name}
                                        onChange={(e) => setToolForm({ ...toolForm, name: e.target.value, slug: autoSlug(e.target.value) })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">URL Slug *</label>
                                    <input
                                        placeholder="dinh-dang-json"
                                        className="admin-input w-full font-mono text-cyan-500/70"
                                        value={toolForm.slug}
                                        onChange={(e) => setToolForm({ ...toolForm, slug: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Right Col */}
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Danh mục *</label>
                                    <select
                                        className="admin-input w-full"
                                        value={toolForm.categoryId}
                                        onChange={(e) => setToolForm({ ...toolForm, categoryId: e.target.value })}
                                    >
                                        <option value="">-- Chọn danh mục --</option>
                                        {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Component Logic *</label>
                                    <select
                                        className="admin-input w-full"
                                        value={toolForm.componentKey}
                                        onChange={(e) => setToolForm({ ...toolForm, componentKey: e.target.value })}
                                    >
                                        <option value="">-- Chọn registry key --</option>
                                        {availableKeys.map((k) => <option key={k.key} value={k.key}>{k.label}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Mô tả SEO ngắn (Tiếng Việt)</label>
                                <textarea
                                    placeholder="Dùng để hiển thị ngoài trang chủ và Meta Tag..."
                                    className="admin-input w-full h-24 resize-none"
                                    value={toolForm.description}
                                    onChange={(e) => setToolForm({ ...toolForm, description: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Bài viết chi tiết (HTML Tiếng Việt)</label>
                                <textarea
                                    placeholder="<h2>Hướng dẫn</h2><p>...</p>"
                                    className="admin-input w-full h-64 font-mono text-xs leading-relaxed"
                                    value={toolForm.content}
                                    onChange={(e) => setToolForm({ ...toolForm, content: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="pt-6">
                            <button
                                disabled={submitting}
                                type="submit"
                                className="w-full py-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black rounded-[1.5rem] shadow-[0_20px_40px_rgba(6,182,212,0.2)] hover:shadow-[0_20px_50px_rgba(6,182,212,0.4)] hover:-translate-y-1 transition-all duration-300 uppercase tracking-[0.3em] disabled:opacity-50"
                            >
                                {submitting ? (
                                    <span className="flex items-center justify-center gap-3">
                                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        Đang dịch và xử lý...
                                    </span>
                                ) : "Lưu & Tự động dịch 10 ngôn ngữ"}
                            </button>
                        </div>
                    </form>

                    {/* Tool List */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-black text-white italic uppercase tracking-tight flex items-center gap-4">
                            Kho công cụ <span className="h-[1px] flex-1 bg-white/5" />
                        </h3>

                        <div className="grid grid-cols-1 gap-4">
                            {tools.length === 0 && <div className="text-center py-20 text-gray-600 font-bold uppercase tracking-widest border-2 border-dashed border-white/5 rounded-[2rem]">Chưa có dữ liệu công cụ</div>}
                            {tools.map((tool) => (
                                <div key={tool.id} className="glass-card !rounded-[1.5rem] !p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group hover:border-white/20 transition-all border-white/5 bg-white/[0.02]">
                                    <div className="flex items-center gap-6 flex-1">
                                        {/* Toggle switch */}
                                        <button
                                            onClick={() => handleTogglePublish(tool.id, tool.isPublished)}
                                            className={`w-14 h-7 rounded-full relative transition-all duration-500 shrink-0 ${tool.isPublished ? "bg-cyan-500/20" : "bg-white/5"}`}
                                        >
                                            <div className={`absolute top-1 w-5 h-5 rounded-full transition-all duration-500 ${tool.isPublished ? "left-8 bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.8)]" : "left-1 bg-gray-600"}`} />
                                        </button>

                                        <div className="space-y-1 min-w-0">
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg font-bold text-white truncate">{tool.name}</span>
                                                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${tool.isPublished ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-orange-500/10 border-orange-500/20 text-orange-400"}`}>
                                                    {tool.isPublished ? "Active" : "Draft"}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 font-medium">
                                                <span className="text-cyan-500/60">/{tool.slug}</span>
                                                <span className="w-1 h-1 rounded-full bg-white/10" />
                                                <span>{categories.find(c => c.id === tool.categoryId)?.name}</span>
                                                <span className="w-1 h-1 rounded-full bg-white/10" />
                                                <span className="font-mono bg-white/5 px-2 py-0.5 rounded italic">{tool.componentKey}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                                        <Link href={`/tools/${tool.slug}`} className="flex-1 md:flex-none text-center px-4 py-2.5 rounded-xl bg-white/5 text-gray-400 text-[10px] font-black uppercase tracking-widest hover:text-white transition-all" target="_blank">
                                            Xem ↗
                                        </Link>
                                        <button onClick={() => handleDeleteTool(tool.id, tool.name)} className="p-2.5 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}