const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
    console.log('🌱 Seeding database...');

    // Create categories
    const devTools = await prisma.category.upsert({
        where: { slug: 'developer-tools' },
        update: {},
        create: { name: 'Developer Tools', slug: 'developer-tools' },
    });

    const seoTools = await prisma.category.upsert({
        where: { slug: 'seo-tools' },
        update: {},
        create: { name: 'SEO Tools', slug: 'seo-tools' },
    });

    const securityTools = await prisma.category.upsert({
        where: { slug: 'security-tools' },
        update: {},
        create: { name: 'Security Tools', slug: 'security-tools' },
    });

    // Create tools
    await prisma.tool.upsert({
        where: { slug: 'json-formatter' },
        update: {},
        create: {
            name: 'JSON Formatter',
            slug: 'json-formatter',
            categoryId: devTools.id,
            componentKey: 'json-formatter-logic',
            description: 'Định dạng, làm đẹp và nén mã JSON trực tuyến. Hỗ trợ beautify, minify và validate JSON nhanh chóng.',
            content: '<h2>JSON Formatter - Công cụ định dạng JSON trực tuyến</h2><p>JSON Formatter giúp bạn định dạng, làm đẹp (beautify) và nén (minify) mã JSON một cách nhanh chóng. Mọi xử lý diễn ra 100% tại trình duyệt, đảm bảo bảo mật dữ liệu tuyệt đối.</p><h3>Tính năng chính</h3><ul><li>Beautify JSON với indentation chuẩn</li><li>Minify JSON để giảm kích thước</li><li>Validate cú pháp JSON tự động</li><li>Copy kết quả nhanh chóng</li></ul>',
            isPublished: true,
            createdAt: new Date('2026-02-22T10:00:00Z'),
        },
    });

    await prisma.tool.upsert({
        where: { slug: 'password-generator' },
        update: {},
        create: {
            name: 'Password Generator',
            slug: 'password-generator',
            categoryId: securityTools.id,
            componentKey: 'password-gen-logic',
            description: 'Tạo mật khẩu mạnh, ngẫu nhiên với các tùy chọn ký tự. Sử dụng crypto API cho bảo mật tối đa.',
            content: '<h2>Password Generator - Tạo mật khẩu mạnh</h2><p>Công cụ tạo mật khẩu ngẫu nhiên sử dụng Web Crypto API, đảm bảo tính bảo mật cao nhất. Tùy chỉnh độ dài và loại ký tự theo nhu cầu.</p>',
            isPublished: true,
            createdAt: new Date('2026-02-22T09:00:00Z'),
        },
    });

    await prisma.tool.upsert({
        where: { slug: 'meta-tag-checker' },
        update: {},
        create: {
            name: 'Meta Tag Checker',
            slug: 'meta-tag-checker',
            categoryId: seoTools.id,
            componentKey: 'meta-tag-checker-logic',
            description: 'Kiểm tra và phân tích meta tags của website. Đánh giá SEO on-page nhanh chóng.',
            content: '<h2>Meta Tag Checker</h2><p>Phân tích meta tags và đánh giá SEO on-page cho website của bạn.</p>',
            isPublished: true,
            createdAt: new Date('2026-02-22T08:00:00Z'),
        },
    });

    await prisma.tool.upsert({
        where: { slug: 'base64-encoder' },
        update: {},
        create: {
            name: 'Base64 Encoder/Decoder',
            slug: 'base64-encoder',
            categoryId: devTools.id,
            componentKey: 'base64-logic',
            description: 'Mã hóa và giải mã Base64 trực tuyến. Hỗ trợ text và file.',
            content: '<h2>Base64 Encoder/Decoder</h2><p>Chuyển đổi text sang Base64 và ngược lại. Hỗ trợ cả text và file encoding.</p>',
            isPublished: true,
            createdAt: new Date('2026-02-22T07:00:00Z'),
        },
    });

    console.log('✅ Seed completed!');
    console.log(`  - ${3} categories`);
    console.log(`  - ${4} tools`);
}

seed()
    .catch((e) => {
        console.error('❌ Seed error:', e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
