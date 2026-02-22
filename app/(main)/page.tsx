import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function HomePage() {
    // Lấy 6 tool mới nhất đã được cho phép hiển thị (isPublished)
    const newestTools = await prisma.tool.findMany({
        where: { isPublished: true },
        include: { category: true },
        orderBy: { createdAt: 'desc' },
        take: 6
    });

    return (
        <div className="max-w-6xl mx-auto py-10">
            {/* Hero Section */}
            <section className="text-center mb-16">
                <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
                    ToolHub <span className="text-blue-600">Hệ Thống Công Cụ Hiện Đại</span>
                </h1>
                <p className="text-xl text-gray-500">Tổng hợp 100+ công cụ hữu ích cho Developer và Marketer</p>
            </section>

            {/* Grid hiển thị Tool mới nhất */}
            <section>
                <div className="flex justify-between items-end mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">🚀 Tool mới cập nhật</h2>
                    <Link href="/categories" className="text-blue-600 hover:underline">Xem tất cả →</Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {newestTools.map((tool) => (
                        <Link
                            href={`/tools/${tool.slug}`}
                            key={tool.id}
                            className="group p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full uppercase">
                                    {tool.category.name}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {tool.name}
                            </h3>
                            <p className="mt-3 text-gray-500 text-sm line-clamp-2 italic">
                                {tool.description || "Công cụ hỗ trợ xử lý dữ liệu nhanh chóng và hiệu quả."}
                            </p>
                            <div className="mt-6 flex items-center text-blue-600 font-medium text-sm">
                                Sử dụng ngay
                                <svg className="w-4 h-4 ml-1 group-hover:ml-2 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </Link>
                    ))}
                </div>

                {newestTools.length === 0 && (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed">
                        <p className="text-gray-400">Chưa có tool nào được Publish. Hãy vào Admin để đăng bài!</p>
                    </div>
                )}
            </section>
        </div>
    );
}