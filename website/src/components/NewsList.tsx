"use client";

import Link from "next/link";
import { useState } from "react";
import Reveal from "./Reveal";
import type { NewsRow } from "@/lib/types";

const CATS = ["全部", "学院动态", "专业建设", "产教融合", "学生成长", "招生就业"];

export default function NewsList({ news }: { news: NewsRow[] }) {
  const [c, setC] = useState("全部");
  const filtered = c === "全部" ? news : news.filter((n) => n.category === c);

  return (
    <div>
      {/* 分类筛选（原地筛选，不跳转） */}
      <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="新闻分类">
        {CATS.map((k) => (
          <button
            key={k}
            role="tab"
            aria-selected={c === k}
            onClick={() => setC(k)}
            className={`rounded-lg border px-4 py-2 text-sm transition-all ${
              c === k
                ? "border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-500/25"
                : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-600"
            }`}
          >
            {k}
          </button>
        ))}
      </div>

      <div className="mt-10 space-y-4">
        {filtered.map((n, i) => (
          <Reveal key={n.slug} delay={(i % 4) * 50}>
            <Link
              href={`/news/${n.slug}`}
              className="group flex gap-5 rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-blue-300 hover:shadow-lg md:p-5"
            >
              <div className="hidden h-28 w-40 shrink-0 overflow-hidden rounded-lg md:block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={n.cover ?? "/images/brand/logo-round.png"}
                  alt={n.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  loading="lazy"
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-3 font-mono text-[10px] text-slate-400">
                  <span className="tag tag-light">{n.category}</span>
                  <time dateTime={n.publishedAt.slice(0, 10)}>{n.publishedAt.slice(0, 10)}</time>
                </div>
                <h2 className="mt-2 text-base font-bold leading-7 text-slate-900 transition-colors group-hover:text-blue-600 md:text-lg">
                  {n.title}
                </h2>
                <p className="mt-2 line-clamp-2 text-sm text-slate-500">{n.summary}</p>
              </div>
            </Link>
          </Reveal>
        ))}
        {filtered.length === 0 && <p className="py-16 text-center text-sm text-slate-400">该分类下暂无动态</p>}
      </div>
    </div>
  );
}
