"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  name: string;
  initialHtml: string;
  placeholder?: string;
};

const BTNS: Array<{ cmd: string; arg?: string; label: string; title: string; cls?: string }> = [
  { cmd: "bold", label: "B", title: "加粗", cls: "font-extrabold" },
  { cmd: "italic", label: "I", title: "斜体", cls: "italic font-serif" },
  { cmd: "underline", label: "U", title: "下划线", cls: "underline" },
  { cmd: "strikeThrough", label: "S", title: "删除线", cls: "line-through" },
  { cmd: "formatBlock", arg: "h2", label: "H2", title: "二级标题", cls: "font-bold text-[11px]" },
  { cmd: "formatBlock", arg: "h3", label: "H3", title: "三级标题", cls: "font-bold text-[10px]" },
  { cmd: "formatBlock", arg: "p", label: "正文", title: "正文段落", cls: "text-[11px]" },
  { cmd: "formatBlock", arg: "blockquote", label: "❝", title: "引用", cls: "text-base" },
  { cmd: "insertUnorderedList", label: "•", title: "无序列表", cls: "text-base" },
  { cmd: "insertOrderedList", label: "1.", title: "有序列表", cls: "text-[11px]" },
  { cmd: "justifyLeft", label: "⯇", title: "左对齐", cls: "text-xs" },
  { cmd: "justifyCenter", label: "≡", title: "居中", cls: "text-xs" },
  { cmd: "removeFormat", label: "⌫", title: "清除格式", cls: "text-xs" },
];

export default function RichTextEditor({ name, initialHtml, placeholder }: Props) {
  const editRef = useRef<HTMLDivElement>(null);
  const imgInputRef = useRef<HTMLInputElement>(null);
  const attachInputRef = useRef<HTMLInputElement>(null);
  const [source, setSource] = useState(false);
  const [html, setHtml] = useState(initialHtml);
  const [status, setStatus] = useState("");
  const [chars, setChars] = useState(0);
  const pasteTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 隐藏字段随编辑同步（保存时随表单提交）
  useEffect(() => {
    if (editRef.current && !source) {
      editRef.current.innerHTML = initialHtml;
      setChars(countChars(initialHtml));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sync = useCallback(() => {
    if (!editRef.current) return;
    const v = editRef.current.innerHTML;
    setHtml(v);
    setChars(countChars(v));
  }, []);

  function countChars(v: string) {
    return v.replace(/<[^>]*>/g, "").replace(/\s/g, "").length;
  }

  function exec(cmd: string, arg?: string) {
    editRef.current?.focus();
    document.execCommand(cmd, false, arg);
    sync();
  }

  // ===== 上传 =====
  async function uploadFile(file: File): Promise<{ url: string; name: string } | null> {
    setStatus(`上传中：${file.name}`);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setStatus(`上传失败：${data.error ?? res.status}`);
        return null;
      }
      return { url: data.url, name: file.name };
    } catch {
      setStatus("上传失败：网络错误");
      return null;
    }
  }

  async function insertImage() {
    const files = imgInputRef.current?.files;
    if (!files?.length) return;
    for (const f of Array.from(files)) {
      const up = await uploadFile(f);
      if (up) exec("insertHTML", `<img src="${up.url}" alt="${up.name}" style="max-width:100%;border-radius:8px;" />`);
    }
    setStatus("图片已插入");
    if (imgInputRef.current) imgInputRef.current.value = "";
  }

  async function insertAttach() {
    const files = attachInputRef.current?.files;
    if (!files?.length) return;
    for (const f of Array.from(files)) {
      const up = await uploadFile(f);
      if (up) {
        const ext = up.name.split(".").pop()?.toUpperCase() ?? "FILE";
        exec(
          "insertHTML",
          `<p><a class="rich-attach" href="${up.url}" download="${up.name}">📎 <strong>[${ext}]</strong> ${up.name}（点击下载）</a></p>`
        );
      }
    }
    setStatus("附件已插入");
    if (attachInputRef.current) attachInputRef.current.value = "";
  }

  function insertVideo() {
    const v = window.prompt("请输入视频地址或嵌入代码：\n· MP4 视频直链（http…/xx.mp4）\n· 或 <iframe> 嵌入代码（公众号/腾讯/B站）");
    if (!v) return;
    if (/<iframe/i.test(v)) {
      const srcMatch = v.match(/src=["']([^"']+)["']/i);
      const src = srcMatch?.[1] ?? "";
      if (src) {
        exec(
          "insertHTML",
          `<p style="text-align:center;"><iframe src="${src}" scrolling="no" frameborder="0" style="width:100%;max-width:640px;aspect-ratio:16/9;border-radius:8px;" allowfullscreen="true"></iframe></p>`
        );
      }
    } else if (/^https?:\/\//i.test(v)) {
      exec(
        "insertHTML",
        `<p style="text-align:center;"><video src="${v}" controls playsinline style="width:100%;max-width:640px;border-radius:8px;"></video></p>`
      );
    } else {
      setStatus("视频地址无效");
    }
  }

  function insertLink() {
    const url = window.prompt("链接地址（https://…）");
    if (!url) return;
    exec("createLink", url);
  }

  // ===== 公众号粘贴：保留内联样式 + 外链图片自动转存 =====
  function onPaste() {
    // 默认粘贴已保留公众号内联样式；随后扫描外链图片转存到本地（规避防盗链）
    if (pasteTimer.current) clearTimeout(pasteTimer.current);
    pasteTimer.current = setTimeout(async () => {
      const root = editRef.current;
      if (!root) return;
      const imgs = Array.from(root.querySelectorAll("img[src^='http']")).filter(
        (i) =>
          !(i as HTMLImageElement).dataset.transloaded &&
          (i as HTMLImageElement).src.includes(".qpic.cn")
      ) as HTMLImageElement[];
      if (imgs.length) setStatus(`检测到 ${imgs.length} 张公众号图片，转存中…`);
      for (const img of imgs) {
        try {
          const res = await fetch(`/api/admin/upload?url=${encodeURIComponent(img.src)}`);
          const data = await res.json();
          if (res.ok && data.url) {
            img.src = data.url;
            img.dataset.transloaded = "1";
          }
        } catch {
          /* 转存失败保留原图外链 */
        }
      }
      sync();
      setStatus(imgs.length ? "公众号图片转存完成" : "");
    }, 300);
  }

  function clearAll() {
    if (window.confirm("清空全部内容？")) {
      if (editRef.current) editRef.current.innerHTML = "";
      setHtml("");
      setChars(0);
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      {/* 工具栏 */}
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-100 bg-slate-50 px-2 py-1.5">
        {BTNS.map((b) => (
          <button
            key={b.title}
            type="button"
            title={b.title}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => exec(b.cmd, b.arg)}
            className={`h-7 min-w-7 rounded px-1.5 text-xs text-slate-600 hover:bg-white hover:text-brand hover:shadow-sm ${b.cls ?? ""}`}
          >
            {b.label}
          </button>
        ))}
        <span className="mx-1 h-4 w-px bg-slate-200" aria-hidden />
        <button type="button" title="插入链接" onMouseDown={(e) => e.preventDefault()} onClick={insertLink} className="h-7 rounded px-1.5 text-xs text-slate-600 hover:bg-white hover:text-brand">
          🔗
        </button>
        <button type="button" title="插入图片（可多选）" onMouseDown={(e) => e.preventDefault()} onClick={() => imgInputRef.current?.click()} className="h-7 rounded px-1.5 text-xs text-slate-600 hover:bg-white hover:text-brand">
          图片
        </button>
        <button type="button" title="插入视频 / 嵌入代码" onMouseDown={(e) => e.preventDefault()} onClick={insertVideo} className="h-7 rounded px-1.5 text-xs text-slate-600 hover:bg-white hover:text-brand">
          视频
        </button>
        <button type="button" title="插入 Office/PDF 等附件" onMouseDown={(e) => e.preventDefault()} onClick={() => attachInputRef.current?.click()} className="h-7 rounded px-1.5 text-xs text-slate-600 hover:bg-white hover:text-brand">
          附件
        </button>
        <span className="mx-1 h-4 w-px bg-slate-200" aria-hidden />
        <button type="button" onClick={() => setSource((v) => !v)} className={`h-7 rounded px-2 text-[11px] font-semibold ${source ? "bg-brand text-white" : "text-slate-500 hover:bg-white"}`}>
          源码
        </button>
        <button type="button" onClick={clearAll} className="h-7 rounded px-2 text-[11px] text-slate-400 hover:bg-white hover:text-rose-500">
          清空
        </button>
        <span className="ml-auto text-[10px] text-slate-400">
          {status || `${chars} 字`}
        </span>
      </div>

      {/* 编辑区 */}
      {source ? (
        <textarea
          value={html}
          onChange={(e) => {
            setHtml(e.target.value);
            setChars(countChars(e.target.value));
          }}
          onBlur={() => {
            if (editRef.current) editRef.current.innerHTML = html;
          }}
          className="h-96 w-full resize-y rounded-b-xl bg-slate-50 p-3 font-mono text-xs leading-5 outline-none"
          spellCheck={false}
        />
      ) : (
        <div
          ref={editRef}
          contentEditable
          suppressContentEditableWarning
          onInput={sync}
          onBlur={sync}
          onPaste={onPaste}
          data-placeholder={placeholder}
          className="rich-content h-96 overflow-y-auto rounded-b-xl p-4 text-sm leading-7 outline-none empty:before:text-slate-300 empty:before:content-[attr(data-placeholder)]"
        />
      )}

      {/* 隐藏表单字段与文件选择器 */}
      <input type="hidden" name={name} value={html} />
      <input ref={imgInputRef} type="file" accept="image/*" multiple hidden onChange={insertImage} />
      <input ref={attachInputRef} type="file" multiple hidden onChange={insertAttach} />
    </div>
  );
}
