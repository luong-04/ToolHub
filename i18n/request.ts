// i18n/request.ts
import { getRequestConfig } from 'next-intl/server';
import { routing } from '@/i18n/routing';

export default getRequestConfig(async ({ requestLocale }) => {
    const locale = await requestLocale;

    // Kiểm tra chặt chẽ và gán locale hợp lệ
    const finalLocale = locale && routing.locales.includes(locale as any)
        ? locale
        : routing.defaultLocale;

    return {
        locale: finalLocale, // Đã được TypeScript hiểu là 'string' tuyệt đối
        messages: (await import(`../messages/${finalLocale}.json`)).default
    };
});