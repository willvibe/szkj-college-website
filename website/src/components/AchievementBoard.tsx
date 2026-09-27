"use client";

import { useState } from "react";
import { ACH_META, ACH_TABS } from "@/lib/achievements";
import type { AchievementRow } from "@/lib/types";

export default function AchievementBoard({ achievements }: { achievements: AchievementRow[] }) {
  const [tab, setTab] = useState("ALL");
  const filtered = tab === "ALL" ? achievements : achievements.filter((a) => a.category === tab);

  return (
    <div>
      {/* 分类标签 */}
      <div className="mb-8 flex flex-wrap gap-2.5" role="tablist" aria-label="成果分类">
        {ACH_TABS.map((t) => {
          const count = t.key === "ALL" ? achievements.length : achievements.filter((a) => a.category === t.key).length;
          return (
            <button
              key={t.key}
              role="tab"
              aria-selected={tab === t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                tab === t.key
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-600"
              }`}
            >
              {t.label}
              <span className={`ml-1.5 font-mono text-[10px] ${tab === t.key ? "text-white/70" : "text-slate-400"}`}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* 成果卡片 */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((a) => {
          const meta = ACH_META[a.category];
          return (
            <article
              key={a.slug}
              className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg"
            >
              <div className="mb-3 flex items-center justify-between font-mono text-xs">
                <span className="text-slate-400">{a.code}</span>
                <span className={`rounded px-2 py-0.5 text-[11px] font-semibold ${meta?.chip ?? "bg-slate-100 text-slate-600"}`}>
                  {meta?.label ?? a.category}
                </span>
              </div>
              {a.cover && (
                <div className="relative mb-4 overflow-hidden rounded-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={a.cover}
                    alt={a.title}
                    className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <span className="absolute right-3 top-3 rounded bg-slate-900/70 px-2 py-0.5 font-mono text-[10px] text-white backdrop-blur-sm">
                    {a.year}
                  </span>
                </div>
              )}
              <h3 className="mb-2 text-base font-bold leading-snug text-slate-900 transition-colors group-hover:text-blue-600">{a.title}</h3>
              <p className="mb-4 line-clamp-3 text-xs leading-relaxed text-slate-500">{a.summary}</p>
              <div className="mt-auto space-y-1.5 border-t border-slate-100 pt-4">
                <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400">RESULTS · 成果清单</p>
                {a.results.slice(0, 3).map((r) => (
                  <p key={r} className="flex items-start gap-1.5 text-xs text-slate-600">
                    <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-blue-500" aria-hidden />
                    {r}
                  </p>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
