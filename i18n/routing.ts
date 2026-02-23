import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
    locales: ['en', 'vi', 'ja', 'ko', 'id', 'es', 'pt', 'de', 'fr', 'hi'],
    defaultLocale: 'en'
});

// Tự động bọc Link, useRouter để nó tự thêm /vi hoặc /en vào URL
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);