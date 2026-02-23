// app/contact/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Liên Hệ Khách Hàng & Báo Lỗi | ToolHub",
    description: "Liên hệ với ToolHub để báo lỗi công cụ, hợp tác quảng cáo, đề xuất tính năng mới. Gửi email trực tiếp đến toolhub@gmail.com.",
};

export default function ContactPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-10 py-10">
            {/* Header */}
            <div className="space-y-4 text-center">
                <h1 className="text-4xl sm:text-5xl font-black text-white">Liên Hệ <span className="gradient-text">ToolHub</span></h1>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                    Cảm ơn bạn đã sử dụng ToolHub. Chúng tôi luôn lắng nghe phản hồi từ cộng đồng để cải thiện chất lượng công cụ mỗi ngày.
                </p>
                <div className="inline-flex items-center gap-3 px-6 py-3 mt-4 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-bold text-lg">
                    ✉️ toolhub@gmail.com
                </div>
            </div>

            {/* Content List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Liên hệ chung */}
                <div className="bg-[#111] border border-white/5 rounded-2xl p-6 sm:p-8 hover:border-cyan-500/30 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 text-2xl mb-4">
                        👋
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Liên hệ chung</h2>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        Bạn có câu hỏi về cách sử dụng một công cụ cụ thể hoặc cần hỗ trợ kỹ thuật? Đừng ngần ngại gửi email cho chúng tôi. Chúng tôi sẽ cố gắng phản hồi sớm nhất có thể.
                    </p>
                </div>

                {/* Báo lỗi */}
                <div className="bg-[#111] border border-white/5 rounded-2xl p-6 sm:p-8 hover:border-red-500/30 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 text-2xl mb-4">
                        🚨
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Báo lỗi (Thưởng Bug Bounty)</h2>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        Nếu bạn phát hiện lỗi hệ thống, hiển thị sai, hoặc lỗ hổng bảo mật, xin vui lòng chụp ảnh màn hình và gửi mô tả chi tiết cho chúng tôi qua email.
                    </p>
                </div>

                {/* Đề xuất tính năng */}
                <div className="bg-[#111] border border-white/5 rounded-2xl p-6 sm:p-8 hover:border-emerald-500/30 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 text-2xl mb-4">
                        💡
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Đề xuất tính năng mới</h2>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        Thiếu một công cụ nào đó làm gián đoạn luồng làm việc của bạn? Gửi ngay ý tưởng của bạn, ToolHub sẽ đánh giá và phát triển nó hoàn toàn miễn phí cho cộng đồng!
                    </p>
                </div>

                {/* Hợp tác quảng cáo */}
                <div className="bg-[#111] border border-white/5 rounded-2xl p-6 sm:p-8 hover:border-purple-500/30 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 text-2xl mb-4">
                        🤝
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Hợp tác & Quảng cáo</h2>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        ToolHub có hàng ngàn lượt truy cập từ lập trình viên và chuyên gia hàng ngày. Nếu bạn muốn đặt banner quảng cáo hoặc hợp tác phát triển dự án, hãy gửi email với tiêu đề [Hợp tác].
                    </p>
                </div>
            </div>

            {/* Bottom Form Note */}
            <div className="p-6 sm:p-8 bg-gradient-to-r from-cyan-500/5 to-blue-600/5 border border-cyan-500/20 rounded-2xl text-center">
                <p className="text-gray-300 font-medium">Bạn cần giải quyết nhanh gọn?</p>
                <p className="text-gray-500 text-sm mt-2">Sao chép địa chỉ email và gửi nội dung yêu cầu của bạn bằng ứng dụng Mail yêu thích.</p>
                <a href="mailto:toolhub@gmail.com" className="inline-block mt-4 px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors font-semibold border border-white/10">
                    Soạn Email ngay
                </a>
            </div>
        </div>
    );
}
