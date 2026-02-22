import dynamic from 'next/dynamic';

// Khai báo Registry để map từ database sang file code thực tế [cite: 23, 222]
export const ToolRegistry: Record<string, any> = {
    "json-formatter-logic": dynamic(() => import('./JsonFormatter'), {
        loading: () => <span>Đang nạp bộ xử lý JSON...</span>,
    }),
    "password-gen-logic": dynamic(() => import('./PasswordGen'), {
        loading: () => <p>Đang tải công cụ mật khẩu...</p>,
    }),
};