
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "../index.css";

function App() {
  const [prompt, setPrompt] = useState("");

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-3xl mx-auto py-10">
        <h1 className="text-3xl font-bold text-amber-400">
          HẢI AI VIDEO PRO
        </h1>

        <p className="text-slate-400 mt-3">
          Trình tạo video AI chuyên nghiệp
        </p>

        <div className="mt-10 rounded-2xl bg-slate-900 p-5">
          <h2 className="text-xl font-semibold mb-4">
            Tạo video bằng AI
          </h2>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Mô tả video bạn muốn tạo..."
            className="w-full h-36 rounded-xl bg-slate-800 p-4 text-white"
          />

          <button
            disabled={!prompt.trim()}
            className="mt-5 w-full rounded-xl bg-amber-500 p-4 font-bold text-black disabled:opacity-40"
          >
            Tạo video
          </button>

          <p className="text-sm text-slate-400 mt-4">
            Hệ thống giao diện đã sẵn sàng.
            Cần kết nối API tạo video để sử dụng chức năng.
          </p>
        </div>
      </div>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
