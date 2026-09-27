import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteNews } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function AdminNewsPage() {
  const news = await prisma.news.findMany({ orderBy: { publishedAt: "desc" } });

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="mono-label text-brand">ADMIN · NEWS</p>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight">学院动态新闻</h1>
          <p className="mt-1 text-sm text-slate-500">发布、编辑学院动态与新闻稿，保存后前台即时生效。</p>
        </div>
        <Link
          href="/admin/news/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
        >
          + 新建新闻
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-left text-[11px] uppercase tracking-wider text-slate-400">
              <th className="px-4 py-3">标题</th>
              <th className="px-4 py-3">分类</th>
              <th className="px-4 py-3">发布日期</th>
              <th className="px-4 py-3">置顶</th>
              <th className="px-4 py-3 text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            {news.map((n) => (
              <tr key={n.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                <td className="max-w-md px-4 py-3">
                  <Link href={`/admin/news/${n.id}`} className="font-semibold text-slate-800 hover:text-blue-600">
                    {n.title}
                  </Link>
                  <p className="mt-0.5 font-mono text-[10px] text-slate-400">/news/{n.slug}</p>
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">{n.category}</td>
                <td className="px-4 py-3 text-xs text-slate-500">
                  {n.publishedAt.toISOString().slice(0, 10)}
                </td>
                <td className="px-4 py-3 text-xs">{n.featured ? "★" : "-"}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/news/${n.id}`}
                      className="rounded-md border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:border-blue-300 hover:text-blue-600"
                    >
                      编辑
                    </Link>
                    <Link
                      href={`/news/${n.slug}`}
                      target="_blank"
                      className="rounded-md border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:border-blue-300 hover:text-blue-600"
                    >
                      预览
                    </Link>
                    <form action={deleteNews}>
                      <input type="hidden" name="id" value={n.id} />
                      <button className="rounded-md border border-rose-200 px-2.5 py-1 text-[11px] font-semibold text-rose-500 hover:bg-rose-50">
                        删除
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
