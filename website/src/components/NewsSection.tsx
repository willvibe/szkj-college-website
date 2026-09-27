import Link from "next/link";
import Reveal from "./Reveal";
import type { NewsRow } from "@/lib/types";

const CAT_STYLE: Record<string, string> = {
  学院动态: "bg-blue-50 text-blue-700",
  专业建设: "bg-amber-50 text-amber-700",
  产教融合: "bg-emerald-50 text-emerald-700",
  学生成长: "bg-purple-50 text-purple-700",
  招生就业: "bg-cyan-50 text-cyan-700",
};

const fmt = (d: string) => d.slice(0, 10);

export default function NewsSection({ news }: { news: NewsRow[] }) {
  const featured = news.find((n) => n.featured) ?? news[0];
  const list = news.filter((n) => n !== featured).slice(0, 4);

  return (
    <section id="news" className="relative bg-slate-100 py-24">
      <div className="shell">
        {/* Section Header */}
        <div className="mb-12 flex items-center justify-between">
          <Reveal>
            <div className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-blue-600">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600" aria-hidden />
              NEWS &amp; UPDATES / 07 · 学院动态
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">资讯中心与公告</h2>
          </Reveal>
          <Reveal delay={80}>
            <Link href="/news" className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline">
              <span>查看历史动态</span> →
            </Link>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Featured Big News Card (7 Cols) */}
          {featured && (
            <Reveal className="lg:col-span-7">
              <Link
                href={`/news/${featured.slug}`}
                className="group flex h-full flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg sm:p-8"
              >
                <div>
                  <div className="relative mb-6 flex h-64 items-end overflow-hidden rounded-2xl bg-slate-900 p-6 text-white sm:h-80">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={featured.cover ?? "/images/brand/logo-round.png"}
                      alt={featured.title}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
                    <div className="grid-pattern absolute inset-0 z-10 opacity-30" />
                    <div className="relative z-20">
                      <span className="mb-2 inline-block rounded bg-blue-600 px-2.5 py-1 font-mono text-[10px] text-white">
                        {featured.category}
                      </span>
                      <h3 className="text-xl font-bold tracking-tight text-white transition-colors group-hover:text-blue-300 sm:text-2xl">
                        {featured.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">{featured.summary}</p>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-400">
                  <span>发布日期：{fmt(featured.publishedAt)}</span>
                  <span className="font-semibold text-blue-600 transition-transform group-hover:translate-x-1">阅读全文 →</span>
                </div>
              </Link>
            </Reveal>
          )}

          {/* Latest News List (5 Cols) */}
          <div className="flex flex-col justify-between gap-3.5 lg:col-span-5">
            {list.map((n, i) => (
              <Reveal key={n.slug} delay={i * 70}>
                <Link
                  href={`/news/${n.slug}`}
                  className="block cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-blue-400 hover:shadow-md"
                >
                  <div className="mb-1.5 flex items-center justify-between font-mono text-[11px] text-slate-400">
                    <span className={`rounded px-2 py-0.5 font-semibold ${CAT_STYLE[n.category] ?? "bg-slate-100 text-slate-600"}`}>
                      {n.category}
                    </span>
                    <span>{fmt(n.publishedAt)}</span>
                  </div>
                  <h4 className="line-clamp-1 text-sm font-bold text-slate-900 transition-colors hover:text-blue-600">{n.title}</h4>
                  <p className="mt-1 line-clamp-1 text-xs text-slate-500">{n.summary}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
