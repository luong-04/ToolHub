import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboard() {
    // Lấy dữ liệu danh mục và tool từ Database
    const categories = await prisma.category.findMany();
    const tools = await prisma.tool.findMany({
        include: { category: true },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-500">Quản lý hệ thống 100 tools của bạn</p>
                </div>
                <Link
                    href="/admin/new"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition"
                >
                    + Thêm Tool Mới
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* BỘ LỌC DANH MỤC [cite: 41, 43] */}
                <aside className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
                    <h2 className="font-semibold mb-4 text-gray-700">Bộ lọc Danh mục</h2>
                    <ul className="space-y-2">
                        <li className="text-blue-600 font-medium cursor-pointer">Tất cả Tool</li>
                        {categories.map((cat) => (
                            <li key={cat.id} className="text-gray-600 hover:text-blue-500 cursor-pointer transition">
                                {cat.name}
                            </li>
                        ))}
                    </ul>
                </aside>

                {/* DANH SÁCH TOOL [cite: 40] */}
                <div className="md:col-span-3 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Tên Tool</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Danh mục</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Ngày tạo</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Trạng thái</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {tools.map((tool) => (
                                <tr key={tool.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 font-medium text-gray-900">{tool.name}</td>
                                    <td className="px-6 py-4 text-gray-600">{tool.category.name}</td>
                                    <td className="px-6 py-4 text-gray-500 text-sm">
                                        {new Date(tool.createdAt).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tool.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {tool.isPublished ? 'Public' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="text-blue-600 hover:text-blue-800 font-medium">Sửa</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {tools.length === 0 && (
                        <div className="p-12 text-center text-gray-500">Chưa có tool nào. Hãy bấm "Thêm Tool Mới".</div>
                    )}
                </div>
            </div>
        </div>
    );
}