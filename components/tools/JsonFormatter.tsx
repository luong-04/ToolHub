"use client";
import React, { useState } from 'react';

export default function JsonFormatter() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleBeautify = () => {
        try {
            const obj = JSON.parse(input);
            setOutput(JSON.stringify(obj, null, 4));
            setError(null);
        } catch (err: any) {
            setError("Lỗi định dạng JSON: " + err.message);
        }
    };

    const handleMinify = () => {
        try {
            const obj = JSON.parse(input);
            setOutput(JSON.stringify(obj));
            setError(null);
        } catch (err: any) {
            setError("Lỗi định dạng JSON: " + err.message);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(output);
        alert("Đã copy vào bộ nhớ!");
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Input JSON</label>
                    <textarea
                        className="w-full h-64 p-3 font-mono text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Dán mã JSON vào đây..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Output</label>
                    <textarea
                        className="w-full h-64 p-3 font-mono text-sm bg-gray-50 border border-gray-300 rounded-lg outline-none"
                        readOnly
                        value={output}
                        placeholder="Kết quả sẽ hiển thị ở đây..."
                    />
                </div>
            </div>

            {error && <p className="text-red-500 text-sm font-medium">⚠️ {error}</p>}

            <div className="flex flex-wrap gap-3">
                <button onClick={handleBeautify} className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition font-medium">
                    Làm đẹp (Beautify)
                </button>
                <button onClick={handleMinify} className="bg-gray-600 text-white px-5 py-2 rounded-lg hover:bg-gray-700 transition font-medium">
                    Nén mã (Minify)
                </button>
                <button onClick={copyToClipboard} className="border border-blue-600 text-blue-600 px-5 py-2 rounded-lg hover:bg-blue-50 transition font-medium">
                    Copy kết quả
                </button>
                <button onClick={() => { setInput(''); setOutput(''); setError(null); }} className="text-gray-500 hover:text-red-500">
                    Xóa hết
                </button>
            </div>
        </div>
    );
}