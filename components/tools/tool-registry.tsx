import dynamic from 'next/dynamic';

// Khai báo Registry để map từ database sang file code thực tế
export const ToolRegistry: Record<string, any> = {
    "json-formatter-logic": dynamic(() => import('./JsonFormatter'), {
        loading: () => <span>Đang nạp bộ xử lý JSON...</span>,
    }),
    "password-gen-logic": dynamic(() => import('./PasswordGen'), {
        loading: () => <p>Đang tải công cụ mật khẩu...</p>,
    }),
    "base64-logic": dynamic(() => import('./Base64Tool'), {
        loading: () => <p>Đang tải công cụ Base64...</p>,
    }),
    "meta-tag-checker-logic": dynamic(() => import('./MetaTagChecker'), {
        loading: () => <p>Đang tải công cụ kiểm tra SEO...</p>,
    }),
};