import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { getAdminUser } from "@/lib/auth";

// 上传目录放在 public 外（生产模式 public 清单启动时固化，运行时新增文件不可见），由 /api/uploads 动态serve
const UPLOAD_ROOT = path.join(process.cwd(), "uploads");

// 类型白名单
const IMAGE_EXT = new Set(["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp", "ico"]);
const MEDIA_EXT = new Set(["mp4", "webm", "mp3", "wav", "m4a"]);
const DOC_EXT = new Set(["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "zip", "rar", "7z", "txt", "csv"]);
const MAX_SIZE = 60 * 1024 * 1024; // 60MB

function extOf(name: string) {
  return (name.split(".").pop() ?? "").toLowerCase();
}

function safeName(ext: string) {
  return `${Date.now()}-${crypto.randomBytes(4).toString("hex")}${ext ? `.${ext}` : ""}`;
}

async function save(buf: Buffer, ext: string) {
  const dir = path.join(UPLOAD_ROOT, "news");
  await mkdir(dir, { recursive: true });
  const name = safeName(ext);
  await writeFile(path.join(dir, name), buf);
  return `/api/uploads/news/${name}`;
}

export async function POST(req: Request) {
  if (!(await getAdminUser())) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "缺少文件" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "文件超过 60MB 限制" }, { status: 413 });
  }
  const ext = extOf(file.name);
  if (!IMAGE_EXT.has(ext) && !MEDIA_EXT.has(ext) && !DOC_EXT.has(ext)) {
    return NextResponse.json({ error: `不支持的文件类型 .${ext}` }, { status: 415 });
  }
  const buf = Buffer.from(await file.arrayBuffer());
  const url = await save(buf, ext);
  return NextResponse.json({ url, name: file.name, size: file.size, ext });
}

// GET ?url= —— 外链图片代理转存（微信公众号图片有防盗链，转存到本地才能稳定显示）
export async function GET(req: Request) {
  if (!(await getAdminUser())) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }
  const target = new URL(req.url).searchParams.get("url");
  if (!target || !/^https?:\/\//i.test(target)) {
    return NextResponse.json({ error: "非法地址" }, { status: 400 });
  }
  try {
    const res = await fetch(target, {
      headers: {
        // 公众号图片校验 UA / Referer
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        Referer: "https://mp.weixin.qq.com/",
      },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) {
      return NextResponse.json({ error: `下载失败 HTTP ${res.status}` }, { status: 502 });
    }
    const type = (res.headers.get("content-type") ?? "").split(";")[0].trim();
    const typeExt: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/gif": "gif",
      "image/webp": "webp",
      "image/svg+xml": "svg",
      "image/bmp": "bmp",
    };
    const ext = typeExt[type] ?? extOf(new URL(target).pathname);
    if (!IMAGE_EXT.has(ext)) {
      return NextResponse.json({ error: "目标不是图片" }, { status: 415 });
    }
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length > MAX_SIZE) {
      return NextResponse.json({ error: "图片超过大小限制" }, { status: 413 });
    }
    const url = await save(buf, ext);
    return NextResponse.json({ url });
  } catch {
    return NextResponse.json({ error: "转存失败" }, { status: 502 });
  }
}
