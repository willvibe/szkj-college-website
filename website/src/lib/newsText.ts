import type { NewsBlock } from "./parse";

// 新闻正文块（旧数据）↔ 后台编辑文本互转（兼容旧数据载入）
export function newsTextOf(contentJson: string): string {
  let blocks: NewsBlock[] = [];
  try {
    blocks = JSON.parse(contentJson);
  } catch {
    return "";
  }
  return blocks
    .map((b) => {
      if (b.t === "h") return `# ${b.text ?? ""}`;
      if (b.t === "img") return `img ${b.src ?? ""}`;
      return b.text ?? "";
    })
    .join("\n");
}

// 旧 blocks → 富文本 HTML（编辑旧新闻时载入编辑器）
export function blocksToHtml(contentJson: string): string {
  let blocks: NewsBlock[] = [];
  try {
    blocks = JSON.parse(contentJson);
  } catch {
    return "";
  }
  return blocks
    .map((b) => {
      if (b.t === "h") return `<h2>${esc(b.text ?? "")}</h2>`;
      if (b.t === "img" && b.src) return `<p style="text-align:center;"><img src="${b.src}" style="max-width:100%;border-radius:8px;" /></p>`;
      return `<p>${esc(b.text ?? "")}</p>`;
    })
    .join("");
}

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// 判断正文是否为 HTML（富文本），用于前台渲染分流
export function isHtmlContent(content: string): boolean {
  const t = content.trim();
  return t.startsWith("<");
}
