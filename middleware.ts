import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
    // Bỏ qua các đường dẫn API và file tĩnh
    matcher: ['/', '/(en|vi|ja|ko|id|es|pt|de|fr|hi)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
};