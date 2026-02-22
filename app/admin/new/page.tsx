import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export default async function NewToolPage() {
    // Lấy danh sách danh mục để đổ vào Dropdown
    const categories = await prisma.category.findMany();

    async function createTool(formData: FormData) {
        "use server";

        const name = formData.get("name") as string;
        const slug = formData.get("slug") as string;
        const categoryId = formData.get("categoryId") as string;
        const componentKey = formData.get("componentKey") as string;
        const content = formData.get("content") as string;
        const isPublished = formData.get("isPublished") === "on";

        // 1. Lưu vào Database [cite: 9, 207]
        await prisma.tool.create({
            data: {
                name,
                slug,
                categoryId,
                componentKey,
                content,
                isPublished,
                publishAt: new Date(), // Mặc định là thời điểm bấm nút [cite: 32]
            }
        });

        // 2. Làm mới dữ liệu trang chủ và admin
        revalidatePath("/");
        revalidatePath("/admin");

        // 3. Quay lại danh sách
        redirect("/admin");
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Thêm Tool Mới</h1>
                <p className="text-gray-500">Đăng ký logic code và viết bài SEO cho tool[cite: 14, 21].</p>
            </div>

            <form action={createTool} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tên Tool [cite: 10]</label>
                            <input name="name" type="text" placeholder="Ví dụ: JSON Formatter" className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500" required />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">URL Slug [cite: 11]</label>
                            <input name="slug" type="text" placeholder="json-formatter" className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500" required />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nội dung bài viết SEO (HTML/Markdown) [cite: 14, 42]</label>
                            <textarea name="content" rows={12} placeholder="Viết 500-1000 chữ về công cụ này..." className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500" required></textarea>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Danh mục [cite: 12, 43]</label>
                            <select name="categoryId" className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500">
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Component Key [cite: 13, 214]</label>
                            <input name="componentKey" type="text" placeholder="json-formatter-logic" className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500" required />
                            <p className="text-xs text-gray-400 mt-1 italic italic">Phải khớp với tên trong tool-registry.tsx[cite: 23, 222].</p>
                        </div>

                        <div className="flex items-center">
                            <input name="isPublished" type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                            <label className="ml-2 block text-sm text-gray-900 font-semibold">Công khai ngay (Publish) [cite: 15, 44]</label>
                        </div>

                        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg shadow-lg hover:bg-blue-700 transition">
                            Lưu & Kích hoạt [cite: 53]
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}