import { NextResponse } from "next/server";
import { readFile, stat } from "fs/promises";
import path from "path";

// 动态文件服务：后台上传的图片/视频/附件（uploads 目录在 public 外，实时读取）
const UPLOAD_ROOT = path.join(process.cwd(), "uploads");

const MIME: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  svg: "image/svg+xml",
  bmp: "image/bmp",
  ico: "image/x-icon",
  mp4: "video/mp4",
  webm: "video/webm",
  mp3: "audio/mpeg",
  wav: "audio/wav",
  m4a: "audio/mp4",
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  zip: "application/zip",
  rar: "application/vnd.rar",
  "7z": "application/x-7z-compressed",
  txt: "text/plain; charset=utf-8",
  csv: "text/csv; charset=utf-8",
};

export async function GET(_req: Request, ctx: { params: Promise<{ path: string[] }> }) {
  const { path: parts } = await ctx.params;
  // 防目录穿越：去除分隔与 ..
  const safe = (parts ?? []).map((p) => p.replace(/[/\\]/g, "")).filter((p) => p && p !== "." && p !== "..");
  const file = path.join(UPLOAD_ROOT, ...safe);
  if (!path.normalize(file).startsWith(path.normalize(UPLOAD_ROOT))) {
    return NextResponse.json({ error: "非法路径" }, { status: 400 });
  }
  const ext = (file.split(".").pop() ?? "").toLowerCase();
  const type = MIME[ext];
  if (!type) {
    return NextResponse.json({ error: "不支持的文件类型" }, { status: 415 });
  }
  try {
    const st = await stat(file);
    if (!st.isFile()) throw new Error("not file");
    const buf = await readFile(file);
    return new NextResponse(new Uint8Array(buf), {
      headers: {
        "Content-Type": type,
        "Content-Length": String(st.size),
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
        // SVG 是可执行活动文档：同源直接打开会在站点源执行脚本，强制沙箱化
        ...(ext === "svg"
          ? { "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; sandbox" }
          : {}),
        // 附件类文件点击下载；图片/视频内联展示
        ...(!type.startsWith("image/") && !type.startsWith("video/") && !type.startsWith("audio/")
          ? { "Content-Disposition": `attachment; filename="file.${ext}"` }
          : {}),
      },
    });
  } catch {
    return NextResponse.json({ error: "文件不存在" }, { status: 404 });
  }
}
