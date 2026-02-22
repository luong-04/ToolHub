// app/layout.tsx
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="flex min-h-screen bg-gray-50 text-gray-900">
        {/* SIDEBAR - Tab bên trái */}
        <aside className="w-64 bg-white border-r border-gray-200 sticky top-0 h-screen p-4 overflow-y-auto">
          <h1 className="text-2xl font-bold text-blue-600 mb-8">ToolHub</h1>

          <nav className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Developer Stack</h3>
              <ul className="mt-2 space-y-2">
                <li><a href="/tools/json-formatter" className="hover:text-blue-500">JSON Formatter</a></li>
                <li><a href="/tools/base64" className="hover:text-blue-500">Base64 Encode</a></li>
              </ul>
            </div>
            {/* Các danh mục khác sẽ load từ Database sau này */}
          </nav>
        </aside>

        {/* MAIN CONTENT - Màn hình to bên phải */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </body>
    </html>
  );
}