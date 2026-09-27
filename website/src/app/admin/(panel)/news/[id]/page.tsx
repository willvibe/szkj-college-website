import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { blocksToHtml, isHtmlContent } from "@/lib/newsText";
import { saveNews } from "@/app/admin/actions";
import RichTextEditor from "@/components/admin/RichTextEditor";

export const dynamic = "force-dynamic";

const input = "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400";
const area = `${input} min-h-28 leading-6`;

const CATEGORIES = ["学院动态", "专业建设", "产教融合", "学生成长", "招生就业"];

export default async function AdminNewsEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const isNew = id === "new";
  const n = isNew ? null : await prisma.news.findUnique({ where: { id: Number(id) } });
  if (!isNew && !n) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/admin/news" className="hover:text-blue-600">学院动态新闻</Link> / {isNew ? "新建" : "编辑"}
      </div>
      <p className="mono-label text-brand">ADMIN · NEWS {isNew ? "CREATE" : "EDIT"}</p>
      <h1 className="mt-2 text-2xl font-extrabold tracking-tight">{isNew ? "新建新闻" : "编辑新闻"}</h1>

      <form action={saveNews} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
        {!isNew && <input type="hidden" name="id" value={n!.id} />}
        <label className="block">
          <span className="text-[11px] font-semibold text-slate-500">标题 *</span>
          <input name="title" defaultValue={n?.title ?? ""} className={input} required />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-[11px] font-semibold text-slate-500">URL 标识（留空自动生成）</span>
            <input name="slug" defaultValue={n?.slug ?? ""} className={input} placeholder="news-slug" />
          </label>
          <label className="block">
            <span className="text-[11px] font-semibold text-slate-500">分类</span>
            <select name="category" defaultValue={n?.category ?? "学院动态"} className={input}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
        </div>
        <label className="block">
          <span className="text-[11px] font-semibold text-slate-500">摘要</span>
          <textarea name="summary" defaultValue={n?.summary ?? ""} className={area} rows={2} />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-[11px] font-semibold text-slate-500">封面图 URL</span>
            <input name="cover" defaultValue={n?.cover ?? ""} className={input} placeholder="/images/..." />
          </label>
          <label className="block">
            <span className="text-[11px] font-semibold text-slate-500">发布日期</span>
            <input
              name="publishedAt"
              type="date"
              defaultValue={(n?.publishedAt ?? new Date()).toISOString().slice(0, 10)}
              className={input}
            />
          </label>
        </div>
        <label className="block">
          <span className="text-[11px] font-semibold text-slate-500">原文地址（可选）</span>
          <input name="sourceUrl" defaultValue={n?.sourceUrl ?? ""} className={input} />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input name="featured" type="checkbox" defaultChecked={n?.featured ?? false} className="h-4 w-4" />
          <span className="text-slate-600">首页置顶推荐</span>
        </label>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">正文（富文本）</span>
            <p className="text-[10px] text-slate-400">
              支持直接从微信公众号 / Word 复制粘贴，保留原样式；可插入图片、视频、Office/PDF 附件
            </p>
          </div>
          <RichTextEditor
            name="content"
            initialHtml={n ? (isHtmlContent(n.content) ? n.content : blocksToHtml(n.content)) : ""}
            placeholder="在此输入正文，或从微信公众号直接粘贴…"
          />
        </div>
        <div className="flex items-center gap-3 pt-2">
          <button className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-bold text-white hover:bg-blue-700">
            {isNew ? "发布新闻" : "保存修改"}
          </button>
          <Link href="/admin/news" className="text-xs text-slate-400 hover:text-blue-600">
            取消返回
          </Link>
        </div>
      </form>
    </div>
  );
}
