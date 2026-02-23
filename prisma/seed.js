const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// --- Nội dung HTML SEO (Tiếng Việt) ---
const jsonFormatterContentVi = `
<h2>JSON Formatter — Công cụ định dạng JSON trực tuyến miễn phí</h2>
<p><strong>JSON Formatter</strong> giúp định dạng, làm đẹp và nén mã JSON trực tuyến 100% tại trình duyệt.</p>
`;

const passwordGenContentVi = `
<h2>Password Generator — Tạo mật khẩu mạnh và an toàn</h2>
<p>Sử dụng <strong>Web Crypto API</strong> để đảm bảo tính ngẫu nhiên thực sự.</p>
`;

const base64ContentVi = `
<h2>Base64 Encoder/Decoder — Mã hóa và giải mã Base64</h2>
<p>Chuyển đổi giữa văn bản thường và chuỗi Base64 nhanh chóng, hỗ trợ UTF-8.</p>
`;

const metaTagCheckerContentVi = `
<h2>Meta Tag Checker — Phân tích SEO on-page</h2>
<p>Kiểm tra các thẻ meta Title, Description, Open Graph để tối ưu SEO.</p>
`;

// --- Nội dung HTML SEO (Tiếng Anh mẫu) ---
const jsonFormatterContentEn = `<h2>JSON Formatter — Free Online JSON Tool</h2><p>Format, beautify, and minify JSON code 100% client-side.</p>`;
const passwordGenContentEn = `<h2>Password Generator — Secure Passwords</h2><p>Generate strong passwords using Web Crypto API.</p>`;
const base64ContentEn = `<h2>Base64 Tool — Encode & Decode</h2><p>Quickly convert text to Base64 and vice versa with UTF-8 support.</p>`;
const metaTagCheckerContentEn = `<h2>Meta Tag Checker — SEO Analysis</h2><p>Analyze meta tags like Title, Description, and Open Graph.</p>`;

// Danh sách 10 mã ngôn ngữ hỗ trợ
const LANGUAGES = ['vi', 'en', 'ja', 'ko', 'id', 'es', 'pt', 'de', 'fr', 'hi'];

async function seed() {
    console.log('🌱 Đang dọn dẹp dữ liệu cũ...');
    await prisma.toolTranslation.deleteMany({});
    await prisma.tool.deleteMany({});
    await prisma.category.deleteMany({});

    console.log('🌱 Đang tạo danh mục...');
    const devTools = await prisma.category.create({ data: { name: 'Developer Tools', slug: 'developer-tools' } });
    const seoTools = await prisma.category.create({ data: { name: 'SEO Tools', slug: 'seo-tools' } });
    const securityTools = await prisma.category.create({ data: { name: 'Security Tools', slug: 'security-tools' } });

    // Hàm tạo mảng 10 bản dịch (Dùng data tiếng Anh cho các thứ tiếng khác làm mẫu)
    const get10Trans = (vi, en) => LANGUAGES.map(lang => {
        if (lang === 'vi') return { language: 'vi', ...vi };
        return { language: lang, ...en };
    });

    console.log('🌱 Đang nạp công cụ và 10 ngôn ngữ...');

    // 1. JSON Formatter
    await prisma.tool.create({
        data: {
            slug: 'json-formatter',
            categoryId: devTools.id,
            componentKey: 'json-formatter-logic',
            isPublished: true,
            translations: {
                create: get10Trans(
                    { name: 'Định dạng JSON', description: 'Làm đẹp mã JSON trực tuyến.', content: jsonFormatterContentVi },
                    { name: 'JSON Formatter', description: 'Beautify and format JSON code online.', content: jsonFormatterContentEn }
                )
            }
        }
    });

    // 2. Password Generator
    await prisma.tool.create({
        data: {
            slug: 'password-generator',
            categoryId: securityTools.id,
            componentKey: 'password-gen-logic',
            isPublished: true,
            translations: {
                create: get10Trans(
                    { name: 'Tạo mật khẩu', description: 'Tạo mật khẩu mạnh bảo mật.', content: passwordGenContentVi },
                    { name: 'Password Generator', description: 'Generate strong and secure passwords.', content: passwordGenContentEn }
                )
            }
        }
    });

    // 3. Base64 Encoder
    await prisma.tool.create({
        data: {
            slug: 'base64-encoder',
            categoryId: devTools.id,
            componentKey: 'base64-logic',
            isPublished: true,
            translations: {
                create: get10Trans(
                    { name: 'Mã hóa Base64', description: 'Mã hóa và giải mã Base64 trực tuyến.', content: base64ContentVi },
                    { name: 'Base64 Tool', description: 'Encode and decode Base64 online.', content: base64ContentEn }
                )
            }
        }
    });

    // 4. Meta Tag Checker
    await prisma.tool.create({
        data: {
            slug: 'meta-tag-checker',
            categoryId: seoTools.id,
            componentKey: 'meta-tag-checker-logic',
            isPublished: true,
            translations: {
                create: get10Trans(
                    { name: 'Kiểm tra Meta Tag', description: 'Phân tích các thẻ Meta SEO.', content: metaTagCheckerContentVi },
                    { name: 'Meta Tag Checker', description: 'Analyze SEO meta tags on-page.', content: metaTagCheckerContentEn }
                )
            }
        }
    });

    console.log('✅ Hoàn tất! Đã nạp 4 công cụ với đầy đủ 40 bản dịch.');
}

seed()
    .catch((e) => {
        console.error('❌ Lỗi Seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });