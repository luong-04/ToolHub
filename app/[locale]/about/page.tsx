import ToolHubLogo from "@/components/ToolHubLogo";

export default function AboutPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-16 py-10">
            {/* Hero Section */}
            <section className="text-center space-y-6">
                <div className="flex justify-center">
                    <ToolHubLogo size="lg" />
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                    Sứ mệnh tối ưu hóa <span className="gradient-text">quy trình làm việc</span>
                </h1>
                <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                    ToolHub là nền tảng cung cấp các giải pháp kỹ thuật số tối giản, mạnh mẽ và hoàn toàn miễn phí,
                    giúp các Developer và chuyên gia SEO tiết kiệm thời gian quý báu mỗi ngày.
                </p>
            </section>

            {/* Core Values */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card !p-8 space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-neon-blue">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-white">Bảo mật Tuyệt đối</h3>
                    <p className="text-sm text-gray-500">
                        Dữ liệu của bạn được xử lý 100% tại trình duyệt (Client-side). Chúng tôi không lưu trữ bất kỳ nội dung nhạy cảm nào trên server.
                    </p>
                </div>

                <div className="glass-card !p-8 space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-white">Tốc độ & Hiệu quả</h3>
                    <p className="text-sm text-gray-500">
                        Giao diện tối giản, không quảng cáo làm phiền, giúp bạn hoàn thành công việc chỉ trong vài giây.
                    </p>
                </div>

                <div className="glass-card !p-8 space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-white">100% Miễn phí</h3>
                    <p className="text-sm text-gray-500">
                        Mọi công cụ trên ToolHub đều miễn phí vĩnh viễn. Chúng tôi xây dựng cộng đồng dựa trên sự chia sẻ giá trị.
                    </p>
                </div>
            </div>

            {/* Story Section */}
            <section className="glass-card !p-10">
                <div className="grid md:grid-cols-2 gap-10 items-center">
                    <div className="space-y-4">
                        <h2 className="text-2xl font-black text-white uppercase tracking-wider">Câu chuyện của chúng tôi</h2>
                        <div className="h-1 w-12 bg-neon-blue"></div>
                        <p className="text-gray-400 leading-relaxed">
                            ToolHub khởi nguồn từ mong muốn tạo ra một "hộp dụng cụ" đa năng cho giới lập trình viên.
                            Thay vì phải mở hàng chục tab trình duyệt khác nhau cho từng tác vụ nhỏ,
                            chúng tôi tập hợp tất cả tại một nơi duy nhất với trải nghiệm người dùng hiện đại và mượt mà.
                        </p>
                        <p className="text-gray-400 leading-relaxed">
                            Dự án được phát triển bằng những công nghệ mới nhất như <strong>Next.js 15</strong>,
                            <strong>TypeScript</strong> và <strong>Tailwind CSS</strong> để đảm bảo hiệu suất tối ưu nhất cho người dùng.
                        </p>
                    </div>
                    <div className="bg-white/5 rounded-3xl p-8 border border-white/10 text-center space-y-4">
                        <div className="text-5xl font-black text-neon-blue">0.0s</div>
                        <div className="text-sm font-bold text-gray-500 uppercase">Thời gian lưu trữ dữ liệu</div>
                        <p className="text-xs text-gray-600 italic">
                            "Sự riêng tư của bạn là ưu tiên hàng đầu của chúng tôi."
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}