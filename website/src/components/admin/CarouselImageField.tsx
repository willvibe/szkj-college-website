"use client";

import { useRef, useState } from "react";

/**
 * 海报图上传字段：点击上传 → POST /api/admin/upload → 回填 URL + 预览
 * 也可直接粘贴已有图片地址（如 /images/base/room-ai-1.jpg）
 */
export default function CarouselImageField({
  name,
  defaultValue = "",
}: {
  name: string;
  defaultValue?: string;
}) {
  const [url, setUrl] = useState(defaultValue);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    setBusy(true);
    setErr("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "上传失败");
      setUrl(data.url);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "上传失败");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* 预览 */}
      <div className="relative h-14 w-24 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="海报预览" className="h-full w-full object-cover" />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-[10px] text-slate-400">暂无图片</span>
        )}
        {busy && (
          <span className="absolute inset-0 flex items-center justify-center bg-white/70 text-[10px] font-semibold text-blue-600">
            上传中…
          </span>
        )}
      </div>
      <div className="flex-1 space-y-1">
        <input type="hidden" name={name} value={url} />
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={busy}
            className="rounded-lg border border-blue-600 px-2.5 py-1 text-[11px] font-bold text-blue-600 hover:bg-blue-50 disabled:opacity-50"
          >
            上传海报图
          </button>
          <button
            type="button"
            onClick={() => setUrl("")}
            className="rounded-lg border border-slate-300 px-2.5 py-1 text-[11px] font-semibold text-slate-500 hover:bg-slate-50"
          >
            清空
          </button>
        </div>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="图片地址（上传自动填入，或粘贴 /images/base/… 地址）"
          className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1 font-mono text-[10px] outline-none focus:border-blue-400"
        />
        {err && <p className="text-[10px] font-semibold text-rose-500">{err}</p>}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) upload(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}