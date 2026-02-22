const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const jsonFormatterContent = `
<h2>JSON Formatter — Công cụ định dạng JSON trực tuyến miễn phí</h2>
<p><strong>JSON Formatter</strong> của ToolHub là công cụ định dạng, làm đẹp (beautify) và nén (minify) mã JSON trực tuyến hoàn toàn miễn phí. Mọi xử lý diễn ra <strong>100% tại trình duyệt</strong> của bạn, không gửi dữ liệu lên bất kỳ server nào — đảm bảo bảo mật tuyệt đối cho API keys, tokens và dữ liệu nhạy cảm.</p>

<h3>JSON là gì?</h3>
<p>JSON (JavaScript Object Notation) là một định dạng trao đổi dữ liệu nhẹ, dễ đọc và dễ viết cho con người, đồng thời dễ phân tích và tạo cho máy. JSON được sử dụng rộng rãi trong các API REST, tệp cấu hình, và giao tiếp giữa client-server trong phát triển web hiện đại.</p>

<h3>Tại sao cần format JSON?</h3>
<p>Khi làm việc với API hoặc tệp cấu hình, dữ liệu JSON thường được nén thành một dòng duy nhất (minified) để giảm kích thước truyền tải. Điều này khiến việc đọc và debug trở nên rất khó khăn. JSON Formatter giúp bạn:</p>
<ul>
<li><strong>Beautify</strong>: Chuyển đổi JSON nén thành dạng có cấu trúc với indentation rõ ràng, giúp dễ đọc và phân tích</li>
<li><strong>Minify</strong>: Nén JSON có cấu trúc thành một dòng, loại bỏ khoảng trắng thừa để giảm kích thước file</li>
<li><strong>Validate</strong>: Kiểm tra cú pháp JSON tự động, phát hiện lỗi nhanh chóng như thiếu dấu ngoặc, dấu phẩy thừa</li>
<li><strong>Copy nhanh</strong>: Sao chép kết quả vào clipboard chỉ với một click</li>
</ul>

<h3>Hướng dẫn sử dụng</h3>
<p>Sử dụng JSON Formatter cực kỳ đơn giản:</p>
<ol>
<li>Dán (paste) mã JSON của bạn vào ô "Input JSON"</li>
<li>Nhấn nút <strong>"Beautify"</strong> để làm đẹp hoặc <strong>"Minify"</strong> để nén</li>
<li>Kết quả sẽ hiện ngay ở ô "Output"</li>
<li>Nhấn <strong>"Copy"</strong> để sao chép kết quả</li>
</ol>

<h3>Ứng dụng thực tế</h3>
<p>JSON Formatter đặc biệt hữu ích cho các developer khi:</p>
<ul>
<li>Debug response từ API REST hoặc GraphQL</li>
<li>Đọc và chỉnh sửa file cấu hình như <code>package.json</code>, <code>tsconfig.json</code></li>
<li>Kiểm tra dữ liệu từ database exports</li>
<li>So sánh cấu trúc giữa hai đối tượng JSON</li>
<li>Chuẩn bị dữ liệu cho Postman hoặc Insomnia</li>
</ul>

<h3>Câu hỏi thường gặp (FAQ)</h3>
<div class="faq-accordion">
    <div class="faq-item">
        <h4>1. JSON Formatter của ToolHub có lưu trữ dữ liệu của tôi không?</h4>
        <p>Không. Tại ToolHub, mọi quá trình xử lý JSON (beautify, minify, validate) đều diễn ra cục bộ trên trình duyệt của bạn (client-side). Chúng tôi không gửi, không lưu trữ và không có quyền truy cập vào dữ liệu của bạn, đảm bảo an toàn tuyệt đối 100%.</p>
    </div>
    <div class="faq-item">
        <h4>2. Công cụ này xử lý định dạng file JSON lớn đến mức nào?</h4>
        <p>Giới hạn dung lượng phụ thuộc hoàn toàn vào cấu hình máy tính của bạn vì việc tính toán diễn ra ở frontend bằng JavaScript. Thông thường, máy tính có thể thoải mái xử lý các file JSON từ vài KB đến hàng chục MB một cách cực nhanh (zero-latency).</p>
    </div>
    <div class="faq-item">
        <h4>3. Tôi có thể sử dụng JSON Formatter miễn phí mãi mãi không?</h4>
        <p>Hoàn toàn miễn phí. ToolHub cam kết toàn bộ công cụ cốt lõi dành cho Developer và SEO đều miễn phí trọn đời mà không cần đăng ký tài khoản.</p>
    </div>
</div>
`;

const passwordGenContent = `
<h2>Password Generator — Tạo mật khẩu mạnh và an toàn</h2>
<p><strong>Password Generator</strong> của ToolHub giúp bạn tạo mật khẩu ngẫu nhiên, mạnh mẽ với độ bảo mật cao nhất. Công cụ sử dụng <strong>Web Crypto API</strong> — chuẩn mã hóa của trình duyệt — để đảm bảo tính ngẫu nhiên thực sự, không thể đoán trước.</p>

<h3>Tại sao cần mật khẩu mạnh?</h3>
<p>Theo thống kê bảo mật năm 2024, hơn 80% các vụ rò rỉ dữ liệu liên quan đến mật khẩu yếu hoặc bị tái sử dụng. Một mật khẩu mạnh cần đáp ứng các tiêu chí:</p>
<ul>
<li>Độ dài tối thiểu <strong>12 ký tự</strong> (khuyến nghị 16+)</li>
<li>Kết hợp <strong>chữ hoa, chữ thường, số và ký tự đặc biệt</strong></li>
<li>Không chứa thông tin cá nhân (tên, ngày sinh, số điện thoại)</li>
<li>Không sử dụng các từ phổ biến trong từ điển</li>
<li>Mỗi tài khoản sử dụng một mật khẩu riêng biệt</li>
</ul>

<h3>Tính năng nổi bật</h3>
<ul>
<li><strong>Tùy chỉnh linh hoạt</strong>: Chọn độ dài từ 4-64 ký tự, bật/tắt chữ hoa, chữ thường, số, ký tự đặc biệt</li>
<li><strong>Đánh giá độ mạnh</strong>: Hiển thị mức độ bảo mật (Yếu → Trung bình → Mạnh → Rất mạnh) theo thời gian thực</li>
<li><strong>Copy nhanh</strong>: Sao chép mật khẩu vào clipboard chỉ với một click</li>
<li><strong>Crypto API</strong>: Sử dụng <code>crypto.getRandomValues()</code> thay vì <code>Math.random()</code> cho tính ngẫu nhiên cao hơn</li>
</ul>

<h3>Hướng dẫn sử dụng</h3>
<ol>
<li>Điều chỉnh <strong>độ dài mật khẩu</strong> bằng thanh trượt (khuyến nghị 16+)</li>
<li>Chọn các <strong>loại ký tự</strong> muốn bao gồm</li>
<li>Nhấn <strong>"Tạo mật khẩu"</strong></li>
<li>Nhấn <strong>"Copy"</strong> để sao chép và sử dụng</li>
</ol>

<h3>Mẹo bảo mật</h3>
<p>Ngoài việc sử dụng mật khẩu mạnh, bạn cũng nên:</p>
<ul>
<li>Kích hoạt <strong>xác thực hai yếu tố (2FA)</strong> cho mọi tài khoản quan trọng</li>
<li>Sử dụng <strong>trình quản lý mật khẩu</strong> (Password Manager) để lưu trữ an toàn</li>
<li>Thay đổi mật khẩu định kỳ, đặc biệt sau các sự cố bảo mật</li>
<li>Không bao giờ chia sẻ mật khẩu qua tin nhắn hoặc email</li>
</ul>

<h3>Bảo mật tuyệt đối</h3>
<p>Mật khẩu được tạo hoàn toàn trên trình duyệt của bạn. ToolHub không lưu trữ, không ghi log và không gửi bất kỳ mật khẩu nào lên server. Mã nguồn xử lý là JavaScript chạy client-side, bạn có thể kiểm chứng bằng DevTools.</p>

<h3>Câu hỏi thường gặp (FAQ)</h3>
<div class="faq-accordion">
    <div class="faq-item">
        <h4>1. Password Generator tạo mật khẩu an toàn mức nào?</h4>
        <p>Chúng tôi ứng dụng chuẩn cấp độ bảo mật cao nhất dành cho trình duyệt (Web Crypto API - <code>crypto.getRandomValues</code>) thay thế hàm random mặc định của Javascript, triệt tiêu rủi ro mật khẩu có thể bị đoán được bởi các thuật toán Brute-force hiện tại.</p>
    </div>
    <div class="faq-item">
        <h4>2. Có nên dùng cùng một mật khẩu mạnh cho nhiều tài khoản?</h4>
        <p>Khuyến cáo là không bao giờ dùng chung. Việc dùng một mật khẩu cho hàng chục tài khoản (dù rất mạnh) vẫn làm gia tăng rủi ro khi một dịch vụ bất kỳ của bạn bị lộ lọt (Data breach). Thay vào đó, bạn hãy dùng Password Generator này tạo riêng cho từng tài khoản và kết hợp trình quản lý mật khẩu.</p>
    </div>
    <div class="faq-item">
        <h4>3. Mật khẩu tạo ra có bị gửi về máy chủ ToolHub không?</h4>
        <p>Không. Tất cả được tính toán bằng tài nguyên máy tính (local processor) của bạn và lưu trên RAM của bạn. Server của ToolHub không biết bạn vừa tạo mật khẩu gì.</p>
    </div>
</div>
`;

const base64Content = `
<h2>Base64 Encoder/Decoder — Mã hóa và giải mã Base64 trực tuyến</h2>
<p><strong>Base64 Encoder/Decoder</strong> của ToolHub giúp bạn chuyển đổi giữa text thường và chuỗi Base64 một cách nhanh chóng. Hỗ trợ đầy đủ <strong>Unicode và UTF-8</strong> — bao gồm tiếng Việt, emoji và ký tự đặc biệt.</p>

<h3>Base64 là gì?</h3>
<p>Base64 là một phương pháp mã hóa dữ liệu nhị phân thành chuỗi ký tự ASCII. Tên gọi "Base64" vì sử dụng 64 ký tự: A-Z, a-z, 0-9, + và /. Base64 được thiết kế để truyền dữ liệu nhị phân qua các kênh chỉ hỗ trợ text.</p>

<h3>Khi nào sử dụng Base64?</h3>
<ul>
<li><strong>Nhúng hình ảnh</strong> trực tiếp vào HTML/CSS (Data URI: <code>data:image/png;base64,...</code>)</li>
<li><strong>Gửi file đính kèm</strong> qua email (MIME encoding)</li>
<li><strong>Lưu trữ dữ liệu</strong> trong JSON hoặc XML khi cần truyền binary</li>
<li><strong>Mã hóa credentials</strong> cho HTTP Basic Authentication (<code>Authorization: Basic ...</code>)</li>
<li><strong>Truyền dữ liệu</strong> qua URL khi cần encode ký tự đặc biệt</li>
</ul>

<h3>Hướng dẫn sử dụng</h3>
<ol>
<li>Chọn chế độ <strong>Encode</strong> hoặc <strong>Decode</strong></li>
<li>Nhập hoặc dán nội dung vào ô input</li>
<li>Nhấn nút <strong>Encode/Decode</strong></li>
<li>Nhấn <strong>"Đảo ngược"</strong> để đổi input ↔ output nhanh</li>
<li>Nhấn <strong>"Copy"</strong> để sao chép kết quả</li>
</ol>

<h3>Lưu ý quan trọng</h3>
<p>Base64 <strong>không phải là mã hóa bảo mật</strong> (encryption). Bất kỳ ai có chuỗi Base64 đều có thể giải mã ngược lại. Đừng sử dụng Base64 để "ẩn" dữ liệu nhạy cảm — hãy dùng các thuật toán mã hóa thực sự như AES hoặc RSA.</p>

<h3>Đặc điểm kỹ thuật</h3>
<ul>
<li>Hỗ trợ UTF-8 đầy đủ qua <code>TextEncoder</code>/<code>TextDecoder</code> API</li>
<li>Xử lý tiếng Việt có dấu, emoji và ký tự Unicode</li>
<li>Hiển thị số ký tự input/output để theo dõi overhead</li>
<li>Xử lý 100% client-side, không gửi dữ liệu lên server</li>
</ul>

<h3>Câu hỏi thường gặp (FAQ)</h3>
<div class="faq-accordion">
    <div class="faq-item">
        <h4>1. Thuật toán mã hóa Base64 có thực sự bảo mật không?</h4>
        <p>Base64 KHÔNG PHẢI là một thuật toán mã hóa dữ liệu (Encryption) để gia tăng bảo mật, nó chỉ là kỹ thuật mã hóa ký tự (Encoding) để xử lý dữ liệu nhị phân thành văn bản. Bạn tuyệt đối không sử dụng Base64 thay thế tiêu chuẩn mã hóa như AES hoặc RSA để cất giữ thông tin bí mật.</p>
    </div>
    <div class="faq-item">
        <h4>2. Công cụ của ToolHub có Decode được văn bản tiếng Việt/Emoji không?</h4>
        <p>Có. Base64 Encoder/Decoder của chúng tôi giải quyết toàn triệt để vấn đề mất dấu ký tự Unicode. Hệ thống sử dụng <code>TextDecoder</code> API để đảm bảo cấu trúc UTF-8 nguyên vẹn khi dịch ngược trở lại nội dung (như Emoji hoặc tiếng đa ngôn ngữ).</p>
    </div>
    <div class="faq-item">
        <h4>3. Tại sao chuỗi Base64 thường dài hơn so với dữ liệu gốc?</h4>
        <p>Biên dịch Base64 sẽ tự động làm tăng ~33% dung lượng ban đầu của chuỗi do cơ chế sử dụng 4 ký tự mảng ASCII để biểu diễn thay cho 3 byte nhị phân dữ liệu thực.</p>
    </div>
</div>
`;

const metaTagCheckerContent = `
<h2>Meta Tag Checker — Kiểm tra và phân tích SEO on-page</h2>
<p><strong>Meta Tag Checker</strong> của ToolHub giúp bạn phân tích nhanh các thẻ meta và đánh giá SEO on-page cho bất kỳ trang web nào. Chỉ cần dán mã nguồn HTML, công cụ sẽ trích xuất và đánh giá theo các tiêu chuẩn SEO mới nhất.</p>

<h3>Meta Tags là gì?</h3>
<p>Meta tags là các thẻ HTML nằm trong phần <code>&lt;head&gt;</code> của trang web, cung cấp thông tin về trang cho các công cụ tìm kiếm (Google, Bing) và mạng xã hội (Facebook, Twitter). Các meta tags quan trọng nhất gồm:</p>
<ul>
<li><strong>Title tag</strong>: Tiêu đề hiển thị trên kết quả tìm kiếm (nên 30-60 ký tự)</li>
<li><strong>Meta description</strong>: Mô tả ngắn gọn nội dung trang (nên 120-160 ký tự)</li>
<li><strong>Open Graph tags</strong>: Quyết định cách trang hiển thị khi chia sẻ trên Facebook, Zalo</li>
<li><strong>Canonical URL</strong>: Chỉ định URL chính thức, tránh trùng lặp nội dung</li>
<li><strong>Viewport</strong>: Cần có để Google đánh giá trang mobile-friendly</li>
</ul>

<h3>Công cụ đánh giá những gì?</h3>
<p>Meta Tag Checker phân tích và chấm điểm theo 8 tiêu chí:</p>
<ol>
<li><strong>Title</strong>: Kiểm tra sự tồn tại và độ dài tối ưu (30-60 ký tự)</li>
<li><strong>Meta Description</strong>: Kiểm tra độ dài (120-160 ký tự)</li>
<li><strong>OG Title &amp; Description</strong>: Kiểm tra Open Graph cho social sharing</li>
<li><strong>OG Image</strong>: Kiểm tra ảnh đại diện khi share</li>
<li><strong>Viewport</strong>: Đảm bảo trang responsive</li>
<li><strong>Canonical URL</strong>: Tránh duplicate content</li>
<li><strong>H1 tag</strong>: Kiểm tra cấu trúc heading (nên có đúng 1 H1)</li>
</ol>

<h3>Hướng dẫn sử dụng</h3>
<ol>
<li>Mở trang web bạn muốn kiểm tra trên trình duyệt</li>
<li>Nhấn <strong>Ctrl+U</strong> (Windows) hoặc <strong>Cmd+U</strong> (Mac) để xem mã nguồn HTML</li>
<li>Chọn tất cả (<strong>Ctrl+A</strong>) và sao chép (<strong>Ctrl+C</strong>)</li>
<li>Dán vào ô "Mã HTML" trong Meta Tag Checker</li>
<li>Nhấn <strong>"Phân tích SEO"</strong> để xem kết quả</li>
</ol>

<h3>Mẹo SEO on-page</h3>
<ul>
<li>Luôn viết title tag chứa <strong>từ khóa chính</strong> ở đầu</li>
<li>Meta description nên là một câu hấp dẫn, kêu gọi hành động (CTA)</li>
<li>Mỗi trang chỉ nên có <strong>đúng 1 thẻ H1</strong></li>
<li>Sử dụng H2, H3 theo thứ tự phân cấp để cấu trúc nội dung</li>
<li>Thêm <strong>OG Image</strong> có kích thước 1200x630px cho social sharing đẹp</li>
</ul>

<h3>Câu hỏi thường gặp (FAQ)</h3>
<div class="faq-accordion">
    <div class="faq-item">
        <h4>1. Tại sao thẻ Open Graph (OG Tags) quan trọng cho SEO?</h4>
        <p>Mặc dù Google không lấy OG Tags làm tiêu chí xếp hạng cốt lõi (Core Ranking), tuy nhiên OG Tags định nghĩa rất rõ ràng cách website của bạn được thể hiện (Tiêu đề, ảnh nổi bật, mô tả) khi người dùng chia sẻ lên Zalo, Facebook, Twitter. CTR (tỷ lệ nhấp) từ các MXH này có tương quan mật thiết tới tín hiệu Social Sign của nền tảng.</p>
    </div>
    <div class="faq-item">
        <h4>2. Thẻ Canonical URL có vai trò như thế nào?</h4>
        <p>Canonical là một cấu trúc thuộc thẻ khai báo <code>&lt;link rel="canonical" href="..." /&gt;</code> để nói với Google Bot đâu là đường dẫn trang (nội dung) nguyên bản chính thức duy nhất, khi Website của bạn có rất nhiều trang có nội dung trùng lặp do phân trang hoặc phân bộ lọc tham số URL (Parameters).</p>
    </div>
    <div class="faq-item">
        <h4>3. ToolHub có thể quét trực tiếp thẻ meta thông qua đường dẫn URL không?</h4>
        <p>Ở phiên bản hiện tại, Meta Tag Checker của ToolHub ưu tiên việc phân tích nguyên vật liệu qua mã nguồn DOM (HTML code) nhằm phòng tránh việc một số Website chặn IP Bot hoặc cơ chế Crawl tự động. Điều này trả về kết quả chuẩn xác và tức thì nhất. Việc bạn cần làm là nhấn Ctr+U tại web mục tiêu -> copy mãng nguồn HTML và paste vào công cụ.</p>
    </div>
</div>
`;

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

    // Create/Update tools with rich content
    await prisma.tool.upsert({
        where: { slug: 'json-formatter' },
        update: { content: jsonFormatterContent, description: 'Định dạng, làm đẹp và nén mã JSON trực tuyến. Hỗ trợ beautify, minify và validate JSON nhanh chóng. Xử lý 100% tại trình duyệt.' },
        create: {
            name: 'JSON Formatter',
            slug: 'json-formatter',
            categoryId: devTools.id,
            componentKey: 'json-formatter-logic',
            description: 'Định dạng, làm đẹp và nén mã JSON trực tuyến. Hỗ trợ beautify, minify và validate JSON nhanh chóng. Xử lý 100% tại trình duyệt.',
            content: jsonFormatterContent,
            isPublished: true,
            createdAt: new Date('2026-02-22T10:00:00Z'),
        },
    });

    await prisma.tool.upsert({
        where: { slug: 'password-generator' },
        update: { content: passwordGenContent, description: 'Tạo mật khẩu mạnh, ngẫu nhiên với Web Crypto API. Tùy chỉnh độ dài, loại ký tự. Đánh giá độ mạnh theo thời gian thực.' },
        create: {
            name: 'Password Generator',
            slug: 'password-generator',
            categoryId: securityTools.id,
            componentKey: 'password-gen-logic',
            description: 'Tạo mật khẩu mạnh, ngẫu nhiên với Web Crypto API. Tùy chỉnh độ dài, loại ký tự. Đánh giá độ mạnh theo thời gian thực.',
            content: passwordGenContent,
            isPublished: true,
            createdAt: new Date('2026-02-22T09:00:00Z'),
        },
    });

    await prisma.tool.upsert({
        where: { slug: 'meta-tag-checker' },
        update: { content: metaTagCheckerContent, description: 'Kiểm tra và phân tích meta tags SEO on-page. Đánh giá Title, Description, Open Graph, Heading structure và chấm điểm tổng thể.' },
        create: {
            name: 'Meta Tag Checker',
            slug: 'meta-tag-checker',
            categoryId: seoTools.id,
            componentKey: 'meta-tag-checker-logic',
            description: 'Kiểm tra và phân tích meta tags SEO on-page. Đánh giá Title, Description, Open Graph, Heading structure và chấm điểm tổng thể.',
            content: metaTagCheckerContent,
            isPublished: true,
            createdAt: new Date('2026-02-22T08:00:00Z'),
        },
    });

    await prisma.tool.upsert({
        where: { slug: 'base64-encoder' },
        update: { content: base64Content, description: 'Mã hóa và giải mã Base64 trực tuyến. Hỗ trợ UTF-8, tiếng Việt, emoji. Chuyển đổi text ↔ Base64 nhanh chóng.' },
        create: {
            name: 'Base64 Encoder/Decoder',
            slug: 'base64-encoder',
            categoryId: devTools.id,
            componentKey: 'base64-logic',
            description: 'Mã hóa và giải mã Base64 trực tuyến. Hỗ trợ UTF-8, tiếng Việt, emoji. Chuyển đổi text ↔ Base64 nhanh chóng.',
            content: base64Content,
            isPublished: true,
            createdAt: new Date('2026-02-22T07:00:00Z'),
        },
    });

    console.log('✅ Seed completed!');
    console.log(`  - ${3} categories`);
    console.log(`  - ${4} tools with rich SEO content`);
}

seed()
    .catch((e) => {
        console.error('❌ Seed error:', e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
