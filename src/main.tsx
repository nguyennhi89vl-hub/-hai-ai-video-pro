import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Link2, Clapperboard, ShoppingBag, Film, Clock3, Smartphone, Monitor,
  Square, UserRound, UserRoundCheck, Languages, Captions, Type, WandSparkles,
  Play, Pause, Download, Trash2, Plus, Search, Settings2, Sparkles,
  CheckCircle2, Circle, AlertCircle, Menu, X, ChevronDown, ExternalLink,
  Video, Mic2, ImagePlus, ListVideo, LayoutDashboard, ShieldCheck
} from "lucide-react";
import "../index.css";

type Platform = "Shopee" | "TikTok Shop" | "Chưa xác định";
type Job = { id:number; title:string; platform:Platform; status:"Chưa bắt đầu"|"Đang chuẩn bị"|"Chờ tạo video"; duration:number; created:string; };
const initialJobs:Job[] = [
  {id:69,title:"Áo khoác nam nữ – sản phẩm mẫu",platform:"Shopee",status:"Chưa bắt đầu",duration:30,created:"Mẫu giao diện"},
  {id:68,title:"Áo thun nam ngắn tay – sản phẩm mẫu",platform:"TikTok Shop",status:"Chưa bắt đầu",duration:30,created:"Mẫu giao diện"},
  {id:67,title:"Quần tây nam Big Size – sản phẩm mẫu",platform:"Shopee",status:"Chưa bắt đầu",duration:30,created:"Mẫu giao diện"},
];
const durations=[10,20,30,40,50,60];
function detectPlatform(url:string):Platform {
  if (/shopee\./i.test(url)) return "Shopee";
  if (/tiktok\.com|tiktokshop/i.test(url)) return "TikTok Shop";
  return "Chưa xác định";
}
function App(){
  const [links,setLinks]=useState("");
  const [duration,setDuration]=useState(30);
  const [ratio,setRatio]=useState("9:16");
  const [presenter,setPresenter]=useState("Tự động");
  const [kol,setKol]=useState("Khánh");
  const [language,setLanguage]=useState("Tiếng Việt");
  const [subtitles,setSubtitles]=useState(true);
  const [headline,setHeadline]=useState(false);
  const [script,setScript]=useState("");
  const [tab,setTab]=useState("Tất cả");
  const [jobs,setJobs]=useState(initialJobs);
  const [notice,setNotice]=useState("Đây là bản giao diện thử nghiệm. Chưa kết nối dịch vụ tạo video Veo/Flow.");
  const [mobileMenu,setMobileMenu]=useState(false);
  const parsed=useMemo(()=>links.split(/\n+/).map(x=>x.trim()).filter(Boolean).map((url,i)=>({url,platform:detectPlatform(url),id:i})),[links]);
  const counts={ "Tất cả":jobs.length,"Chưa bắt đầu":jobs.filter(j=>j.status==="Chưa bắt đầu").length,"Đang làm":jobs.filter(j=>j.status==="Đang chuẩn bị"||j.status==="Chờ tạo video").length,"Hoàn thành":0 };
  const filtered=tab==="Tất cả"?jobs:jobs.filter(j=>j.status===tab);
  function addProducts(){
    if(!parsed.length){setNotice("Bạn hãy dán ít nhất một link Shopee hoặc TikTok Shop.");return;}
    const fresh=parsed.map((p,i)=>({id:Date.now()+i,title:"Sản phẩm từ "+p.platform+" · "+p.url.replace(/^https?:\/\//,"").slice(0,48),platform:p.platform,status:"Chưa bắt đầu" as const,duration,created:"Vừa thêm"}));
    setJobs(old=>[...fresh,...old]); setNotice("Đã thêm "+fresh.length+" sản phẩm vào danh sách. Bản hiện tại lưu trạng thái trong phiên trình duyệt."); setLinks("");
  }
  function prepare(job:Job){
    setJobs(old=>old.map(j=>j.id===job.id?{...j,status:"Đang chuẩn bị"}:j));
    setNotice("Đã tạo cấu hình/kịch bản nháp cho: "+job.title+". Để tạo video thật cần cấu hình máy chủ và quyền truy cập dịch vụ Veo/Flow.");
  }
  return <div className="min-h-screen bg-[#080d17] text-slate-100">
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0b1220]/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1500px] items-center justify-between px-4 py-3 lg:px-7">
        <div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-amber-300 to-orange-600 text-slate-950 shadow-lg shadow-orange-900/30"><Clapperboard size={21}/></div><div><div className="font-black tracking-wide text-amber-300" style={{fontFamily:"var(--font-display)"}}>HẢI AI VIDEO PRO</div><div className="text-[10px] tracking-[.22em] text-slate-500">SHOP VIDEO STUDIO</div></div></div>
        <div className="hidden items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1.5 text-xs text-amber-200 sm:flex"><span className="h-2 w-2 rounded-full bg-amber-400"/ >BẢN THỬ NGHIỆM GIAO DIỆN</div>
        <button onClick={()=>setMobileMenu(!mobileMenu)} className="rounded-lg border border-white/10 p-2 lg:hidden" aria-label="Mở menu">{mobileMenu?<X/>:<Menu/>}</button>
        <div className="hidden items-center gap-3 lg:flex"><span className="text-xs text-slate-400">Không gian làm việc</span><div className="h-8 w-8 rounded-full bg-gradient-to-br from-fuchsia-500 to-indigo-600 grid place-items-center text-xs font-bold">H</div></div>
      </div>
      {mobileMenu&&<div className="border-t border-white/10 px-4 py-3 text-sm text-slate-300 lg:hidden">Tổng quan　·　Sản phẩm　·　Danh sách video　·　Cài đặt</div>}
    </header>
    <main className="mx-auto max-w-[1500px] px-4 py-5 lg:px-7 lg:py-7">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><div className="mb-2 flex items-center gap-2 text-xs text-slate-500"><LayoutDashboard size={14}/> / Dự án / <span className="text-slate-300">Dự án bán hàng</span></div><h1 className="text-2xl font-bold md:text-3xl" style={{fontFamily:"var(--font-display)"}}>Trung tâm tạo video</h1><p className="mt-1 text-sm text-slate-400">Quản lý sản phẩm Shopee, TikTok Shop và nội dung video AI tại một nơi.</p></div><div className="grid grid-cols-3 gap-2 text-center">{[{n:jobs.length,l:"Sản phẩm"},{n:0,l:"Đã xuất MP4"},{n:jobs.filter(j=>j.status==="Chưa bắt đầu").length,l:"Chờ xử lý"}].map(x=><div key={x.l} className="rounded-xl border border-white/10 bg-white/[.03] px-3 py-2"><div className="text-xl font-bold text-white">{x.n}</div><div className="text-[10px] text-slate-500">{x.l}</div></div>)}</div></div>
      <div className="grid gap-5 xl:grid-cols-[390px_minmax(0,1fr)]">
        <section className="h-fit rounded-2xl border border-white/10 bg-[#101827] p-4 shadow-2xl shadow-black/20 md:p-5">
          <div className="mb-4 flex items-center justify-between"><h2 className="flex items-center gap-2 font-bold"><WandSparkles size={18} className="text-amber-300"/> Thêm video mới</h2><span className="rounded-md bg-white/5 px-2 py-1 text-[10px] text-slate-400">BƯỚC 01</span></div>
          <label className="mb-2 block text-xs font-semibold text-slate-300">Link sản phẩm Shopee hoặc TikTok Shop</label>
          <textarea value={links} onChange={e=>setLinks(e.target.value)} placeholder={"Dán link sản phẩm vào đây, mỗi link một dòng.\nVí dụ: https://shopee.vn/...\nhttps://www.tiktok.com/..."} className="h-32 w-full resize-y rounded-xl border border-white/10 bg-[#080f1c] p-3 text-sm text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-amber-400/60"/>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">{parsed.length>0?parsed.map(p=><span key={p.id} className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 text-emerald-300">{p.platform}</span>):<span className="text-slate-500">Hỗ trợ nhập nhiều đường dẫn cùng lúc</span>}</div>
          <div className="my-4 h-px bg-white/10"/>
          <label className="mb-2 block text-xs font-semibold text-slate-300">Độ dài video (giây)</label><div className="grid grid-cols-6 gap-1.5">{durations.map(n=><button key={n} onClick={()=>setDuration(n)} className={"rounded-lg border py-2 text-xs font-semibold "+(duration===n?"border-amber-400 bg-amber-400 text-slate-950":"border-white/10 bg-white/[.03] text-slate-400 hover:border-white/30")}>{n}</button>)}</div>
          <label className="mb-2 mt-4 block text-xs font-semibold text-slate-300">Khung hình</label><div className="grid grid-cols-3 gap-1.5">{[{v:"9:16",l:"Dọc 9:16",I:Smartphone},{v:"16:9",l:"Ngang 16:9",I:Monitor},{v:"1:1",l:"Vuông 1:1",I:Square}].map(o=><button key={o.v} onClick={()=>setRatio(o.v)} className={"flex flex-col items-center gap-1 rounded-lg border p-2 text-[11px] "+(ratio===o.v?"border-amber-400/60 bg-amber-400/10 text-amber-200":"border-white/10 text-slate-400")}><o.I size={17}/>{o.l}</button>)}</div>
          <label className="mb-2 mt-4 block text-xs font-semibold text-slate-300">Người dẫn</label><div className="grid grid-cols-3 gap-1.5">{["Tự động","Có người dẫn","Chỉ sản phẩm"].map(x=><button key={x} onClick={()=>setPresenter(x)} className={"rounded-lg border px-1 py-2 text-[11px] "+(presenter===x?"border-amber-400/60 bg-amber-400/10 text-amber-200":"border-white/10 text-slate-400")}>{x}</button>)}</div>
          {presenter!=="Chỉ sản phẩm"&&<><label className="mb-2 mt-4 block text-xs font-semibold text-slate-300">KOL dẫn video</label><select value={kol} onChange={e=>setKol(e.target.value)} className="w-full rounded-lg border border-white/10 bg-[#080f1c] px-3 py-2.5 text-sm text-slate-200 outline-none"><option>Khánh</option><option>Người dẫn nam</option><option>Người dẫn nữ</option><option>Chọn sau</option></select></>}
          <label className="mb-2 mt-4 block text-xs font-semibold text-slate-300">Ngôn ngữ / giọng đọc</label><select value={language} onChange={e=>setLanguage(e.target.value)} className="w-full rounded-lg border border-white/10 bg-[#080f1c] px-3 py-2.5 text-sm text-slate-200 outline-none"><option>Tiếng Việt</option><option>English</option><option>Tiếng Thái</option></select>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3">{[{v:subtitles,set:setSubtitles,l:"Phụ đề chạy chữ",I:Captions},{v:headline,set:setHeadline,l:"Tiêu đề",I:Type}].map(x=><label key={x.l} className="flex cursor-pointer items-center gap-2 text-xs text-slate-300"><input type="checkbox" checked={x.v} onChange={e=>x.set(e.target.checked)} className="accent-amber-400"/><x.I size={15} className="text-slate-400"/>{x.l}</label>)}</div>
          <label className="mb-2 mt-4 block text-xs font-semibold text-slate-300">Yêu cầu thêm cho kịch bản</label><textarea value={script} onChange={e=>setScript(e.target.value)} placeholder="Ví dụ: nhấn mạnh độ bền, giọng vui nhộn, mở đầu gây chú ý..." className="h-20 w-full resize-y rounded-xl border border-white/10 bg-[#080f1c] p-3 text-xs outline-none placeholder:text-slate-600 focus:border-amber-400/60"/>
          <button onClick={addProducts} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-300 to-orange-500 py-3.5 font-bold text-slate-950 shadow-lg shadow-orange-950/30 transition hover:brightness-110"><Plus size={18}/> Thêm sản phẩm vào dự án</button>
          <p className="mt-3 flex items-start gap-2 text-[10px] leading-relaxed text-slate-500"><ShieldCheck size={14} className="mt-0.5 shrink-0 text-emerald-400"/>Không yêu cầu mật khẩu Shopee/TikTok. Không nhập mã OTP hoặc thông tin đăng nhập vào ứng dụng.</p>
        </section>
        <section className="min-w-0">
          <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">{[{I:ShoppingBag,t:"Nguồn sản phẩm",v:"2 nền tảng",c:"text-orange-300"},{I:Film,t:"Phong cách",v:"Người thật + phim",c:"text-fuchsia-300"},{I:Mic2,t:"Âm thanh",v:"Giọng AI tiếng Việt",c:"text-sky-300"},{I:Captions,t:"Phụ đề",v:subtitles?"Đang bật":"Đang tắt",c:"text-emerald-300"}].map(x=><div key={x.t} className="rounded-xl border border-white/10 bg-[#101827] p-3"><x.I size={18} className={x.c}/><div className="mt-3 text-[10px] text-slate-500">{x.t}</div><div className="mt-0.5 text-xs font-semibold text-slate-200">{x.v}</div></div>)}</div>
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#101827]">
            <div className="flex flex-col justify-between gap-3 border-b border-white/10 p-4 sm:flex-row sm:items-center"><div><h2 className="flex items-center gap-2 font-bold"><ListVideo size={18} className="text-amber-300"/> Danh sách video</h2><p className="mt-1 text-xs text-slate-500">{jobs.length} sản phẩm trong dự án</p></div><div className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#080f1c] px-3 py-2 text-xs text-slate-500"><Search size={14}/><span>Tìm kiếm sản phẩm</span></div></div>
            <div className="flex gap-1 overflow-x-auto border-b border-white/10 px-3 pt-2">{["Tất cả","Chưa bắt đầu","Đang làm","Hoàn thành"].map(x=><button key={x} onClick={()=>setTab(x)} className={"shrink-0 rounded-t-lg px-3 py-2 text-xs "+(tab===x?"border-b-2 border-amber-400 bg-amber-400/5 font-semibold text-amber-200":"text-slate-500 hover:text-slate-200")}>{x} <span className="ml-1 text-[10px] opacity-60">{counts[x as keyof typeof counts]}</span></button>)}</div>
            <div className="divide-y divide-white/[.07]">{filtered.length===0?<div className="p-10 text-center text-sm text-slate-500">Chưa có sản phẩm trong mục này.</div>:filtered.map(job=><article key={job.id} className="flex flex-col gap-3 p-4 transition hover:bg-white/[.02] sm:flex-row sm:items-center"><div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl border border-white/10 bg-gradient-to-br from-slate-700 to-slate-900">{job.platform==="Shopee"?<ShoppingBag className="text-orange-300"/>:<Video className="text-sky-300"/>}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="text-xs font-bold text-slate-500">#{job.id%1000}</span><span className="text-sm font-semibold text-slate-200">{job.title}</span></div><div className="mt-1.5 flex flex-wrap items-center gap-2 text-[10px] text-slate-500"><span>{job.platform}</span><span>·</span><span>{duration} giây</span><span>·</span><span>{ratio}</span><span>·</span><span>{job.created}</span></div><div className="mt-2 flex items-center gap-1.5 text-[10px] text-amber-300"><Circle size={8}/>{job.status}</div></div><div className="flex shrink-0 gap-2"><button onClick={()=>prepare(job)} className="flex items-center gap-1.5 rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs font-semibold text-amber-200 hover:bg-amber-400/20"><WandSparkles size={14}/> Tạo kịch bản</button><button onClick={()=>setJobs(old=>old.filter(j=>j.id!==job.id))} className="rounded-lg border border-white/10 p-2 text-slate-500 hover:border-red-400/30 hover:text-red-300" aria-label="Xóa sản phẩm"><Trash2 size={15}/></button></div></article>)}</div>
            <div className="border-t border-white/10 bg-[#0b1321] p-3 text-[10px] leading-relaxed text-slate-500"><AlertCircle size={13} className="mr-1 inline text-amber-300"/>Các mục mẫu chỉ minh họa giao diện. Trạng thái “Đang chuẩn bị” hiện chưa có nghĩa là Veo đã tạo video.</div>
          </div>
          <div className="mt-4 rounded-xl border border-amber-400/20 bg-amber-400/[.06] p-4"><div className="flex items-start gap-3"><Sparkles size={18} className="mt-0.5 shrink-0 text-amber-300"/><div><div className="text-sm font-semibold text-amber-100">Thông báo hệ thống</div><p className="mt-1 text-xs leading-relaxed text-slate-300">{notice}</p></div></div></div>
          <div className="mt-4 grid gap-3 md:grid-cols-2"><div className="rounded-xl border border-white/10 bg-[#101827] p-4"><div className="flex items-center gap-2 text-sm font-semibold"><Settings2 size={16} className="text-slate-400"/> Kết nối AI</div><p className="mt-2 text-xs leading-relaxed text-slate-500">Cần máy chủ trung gian bảo mật để kết nối Gemini, Veo và dịch vụ giọng đọc. Google Flow hiện chưa được tích hợp API điều khiển tự động trong bản giao diện này.</p><span className="mt-3 inline-flex rounded-full bg-amber-400/10 px-2 py-1 text-[10px] text-amber-200">Chưa cấu hình</span></div><div className="rounded-xl border border-white/10 bg-[#101827] p-4"><div className="flex items-center gap-2 text-sm font-semibold"><Download size={16} className="text-slate-400"/> Xuất video MP4</div><p className="mt-2 text-xs leading-relaxed text-slate-500">Mục tiêu xuất H.264 + AAC, tối ưu video dọc 9:16, có phụ đề và âm thanh đã cân chỉnh.</p><span className="mt-3 inline-flex rounded-full bg-slate-700/60 px-2 py-1 text-[10px] text-slate-300">Chờ tích hợp bộ dựng</span></div></div>
        </section>
      </div>
      <footer className="pb-safe mt-8 border-t border-white/10 pt-4 text-center text-[10px] text-slate-600">HẢI AI VIDEO PRO · Bản dựng giao diện khởi đầu · Không liên kết chính thức với Shopee, TikTok hoặc Google</footer>
    </main>
  </div>
}
createRoot(document.getElementById("root")!).render(<React.StrictMode><App/></React.StrictMode>);
