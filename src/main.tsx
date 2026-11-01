import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "../index.css";

type Scene = { sceneNumber: number; title: string; voiceover: string; visualDescription: string };
type Project = { id: string; title: string; hook: string; scenes: Scene[]; voiceProfile?: { voiceName: string; styleDescription: string } };

function App() {
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState("30");
  const [aspectRatio, setAspectRatio] = useState("9:16");
  const [project, setProject] = useState<Project | null>(null);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [error, setError] = useState("");

  async function createVideo() {
    if (!prompt.trim() || busy) return;
    setBusy(true); setError(""); setStatus("Đang tạo kịch bản...");
    setProject(null); setDownloadUrl("");
    try {
      const scriptResponse = await fetch("/api/generate-script", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: prompt.trim(), duration: Number(duration), aspectRatio }),
      });
      const scriptData = await scriptResponse.json();
      if (!scriptResponse.ok || !scriptData.success) throw new Error(scriptData.error || "Không tạo được kịch bản.");
      const nextProject = scriptData.project as Project;
      setProject(nextProject);
      setStatus("Đã tạo kịch bản. Đang gửi mô tả hình ảnh sang Google Veo...");
      const visualPrompt = [
        "Create a polished cinematic video, no text, no subtitles, no logos.",
        "Subject and story: " + prompt.trim() + ".",
        "Visual direction: " + nextProject.scenes.map((scene) => scene.visualDescription).join(" "),
        "Camera: smooth cinematic movement, realistic lighting, coherent scene, high detail.",
        "Format: " + aspectRatio + ".",
      ].join(" ");
      const veoResponse = await fetch("/api/veo/generate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: visualPrompt, aspectRatio }),
      });
      const veoData = await veoResponse.json();
      if (!veoResponse.ok || !veoData.success) throw new Error(veoData.error || "Không gửi được yêu cầu Google Veo.");
      let finished = false;
      for (let attempt = 0; attempt < 60; attempt++) {
        await new Promise((resolve) => setTimeout(resolve, 10000));
        setStatus("Google Veo đang tạo video... (" + (attempt + 1) + "/60)");
        const poll = await fetch("/api/veo/generate/" + encodeURIComponent(veoData.id));
        const data = await poll.json();
        if (!poll.ok || !data.success) throw new Error(data.error || "Lỗi khi kiểm tra tiến trình Veo.");
        if (data.status === "completed" && data.downloadUrl) {
          setDownloadUrl(data.downloadUrl); setStatus("Video đã tạo xong! Bạn có thể tải về.");
          finished = true; break;
        }
      }
      if (!finished) throw new Error("Video đang xử lý lâu hơn dự kiến. Vui lòng thử kiểm tra lại sau.");

      // Generate Vietnamese voiceover for every scene, then mux it into the Veo video.
      setStatus("Đang tạo giọng đọc tiếng Việt cho từng phân cảnh...");
      for (let i = 0; i < nextProject.scenes.length; i++) {
        const scene = nextProject.scenes[i];
        const tts = await fetch("/api/tts/synthesize-scene", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectId: nextProject.id,
            sceneIndex: i,
            text: scene.voiceover,
            gender: nextProject.voiceProfile?.voiceName?.toLowerCase().includes("nữ") ? "female" : "male",
          }),
        });
        const ttsData = await tts.json();
        if (!tts.ok || !ttsData.success) throw new Error(ttsData.error || "Không tạo được giọng đọc phân cảnh " + (i + 1));
      }
      const finalize = await fetch("/api/tts/finalize-project", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: nextProject.id }),
      });
      const finalizeData = await finalize.json();
      if (!finalize.ok || !finalizeData.success) throw new Error(finalizeData.error || "Không hoàn tất được âm thanh.");

      setStatus("Đang ghép giọng đọc vào video và xuất MP4...");
      const generatedVideo = await fetch(downloadUrl || ("/api/veo/video/" + encodeURIComponent(veoData.id)));
      if (!generatedVideo.ok) throw new Error("Không tải được video gốc từ Google Veo.");
      const videoBlob = await generatedVideo.blob();
      const mux = await fetch("/api/video/mux-final-mp4", {
        method: "POST",
        headers: { "Content-Type": "video/webm", "x-project-id": nextProject.id },
        body: videoBlob,
      });
      const muxData = await mux.json();
      if (!mux.ok || !muxData.success) throw new Error(muxData.error || "Không ghép được giọng đọc vào MP4.");
      setDownloadUrl(muxData.downloadUrl); setStatus("Video đã tạo xong, có giọng đọc tiếng Việt! Bạn có thể tải MP4.");

    } catch (e) {
      setError(e instanceof Error ? e.message : "Đã xảy ra lỗi không xác định.");
      setStatus("");
    } finally { setBusy(false); }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-5 sm:p-6">
      <div className="max-w-3xl mx-auto py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-amber-400">HẢI AI VIDEO PRO</h1>
        <p className="text-slate-400 mt-3">Trình tạo video AI · Gemini + Google Veo</p>
        <section className="mt-8 rounded-2xl bg-slate-900 p-5 sm:p-7 shadow-xl">
          <h2 className="text-2xl font-semibold mb-4">Tạo video bằng AI</h2>
          <label className="block text-sm text-slate-300 mb-2" htmlFor="prompt">Mô tả video bạn muốn tạo</label>
          <textarea id="prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ví dụ: Một người công nhân trở về nhà lúc hoàng hôn, câu chuyện truyền cảm hứng..."
            className="w-full min-h-36 rounded-xl bg-slate-800 p-4 text-white outline-none focus:ring-2 focus:ring-amber-400" />
          <div className="grid grid-cols-2 gap-3 mt-4">
            <label className="text-sm text-slate-300">Thời lượng kịch bản
              <select value={duration} onChange={(e) => setDuration(e.target.value)} className="mt-2 w-full rounded-lg bg-slate-800 p-3 text-white">
                <option value="30">30 giây</option><option value="60">60 giây</option><option value="180">3 phút</option>
              </select>
            </label>
            <label className="text-sm text-slate-300">Khung hình
              <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} className="mt-2 w-full rounded-lg bg-slate-800 p-3 text-white">
                <option value="9:16">Dọc 9:16</option><option value="16:9">Ngang 16:9</option>
              </select>
            </label>
          </div>
          <button onClick={createVideo} disabled={!prompt.trim() || busy}
            className="mt-5 w-full rounded-xl bg-amber-500 p-4 font-bold text-slate-950 disabled:opacity-40">
            {busy ? "Đang xử lý..." : "Tạo kịch bản và video AI"}
          </button>
          {status && <p className="mt-4 rounded-lg bg-slate-800 p-3 text-amber-300" aria-live="polite">{status}</p>}
          {error && <p className="mt-4 rounded-lg bg-red-950 p-3 text-red-200">{error}</p>}
          {downloadUrl && <a href={downloadUrl} className="mt-4 block rounded-xl bg-emerald-600 p-4 text-center font-bold text-white" download>Tải video MP4 về điện thoại</a>}
        </section>
        {project && <section className="mt-6 rounded-2xl bg-slate-900 p-5">
          <h2 className="text-xl font-semibold">{project.title}</h2>
          <p className="mt-2 text-amber-300">{project.hook}</p>
          <p className="mt-2 text-sm text-slate-400">Kịch bản gồm {project.scenes.length} phân cảnh{project.voiceProfile ? " · Giọng đọc đề xuất: " + project.voiceProfile.voiceName : ""}</p>
          <div className="mt-4 space-y-3">{project.scenes.map((scene) => <article key={scene.sceneNumber} className="rounded-lg bg-slate-800 p-3">
            <h3 className="font-semibold">{scene.title}</h3><p className="mt-1 text-sm text-slate-300">{scene.voiceover}</p>
          </article>)}</div>
        </section>}
        <p className="mt-5 text-xs text-slate-500">Google Veo có thể yêu cầu tài khoản được cấp quyền và thanh toán/billing. Thời gian tạo và giới hạn phụ thuộc quyền truy cập của Google.</p>
      </div>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<React.StrictMode><App /></React.StrictMode>);
