"use client";

import Link from "next/link";
import { useState } from "react";
import Reveal from "./Reveal";
import type { WorkRow } from "@/lib/types";

const FILTERS = ["ALL", "AI", "DATA", "COMMERCE", "FINTECH", "CROSS-MAJOR"];

export default function WorksLibrary({ works }: { works: WorkRow[] }) {
  const [f, setF] = useState("ALL");
  const filtered =
    f === "ALL" ? works : f === "CROSS-MAJOR" ? works.filter((w) => w.crossMajor) : works.filter((w) => w.majorCodes.includes(f));

  return (
    <div>
      {/* 专业筛选（原地筛选，不跳转） */}
      <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="专业筛选">
        {FILTERS.map((k) => (
          <button
            key={k}
            role="tab"
            aria-selected={f === k}
            onClick={() => setF(k)}
            className={`rounded-xl border px-4 py-2 font-mono text-xs transition-all ${
              f === k
                ? "border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-500/25"
                : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-600"
            }`}
          >
            {k}
          </button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((w, i) => (
          <Reveal key={w.slug} delay={(i % 3) * 70}>
            <Link
              href={`/works/${w.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg"
            >
              <div className="relative h-44 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={w.cover ?? "/images/brand/logo-round.png"}
                  alt={w.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <span className="absolute left-3 top-3 rounded bg-slate-900/70 px-2 py-0.5 font-mono text-[10px] text-white backdrop-blur-sm">
                  {w.code}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h2 className="font-bold leading-6 text-slate-900 transition-colors group-hover:text-blue-600">{w.title}</h2>
                <p className="mt-2 line-clamp-2 text-xs text-slate-500">{w.summary}</p>
                <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
                  <span className="tag tag-light">{w.majorCodes.join(" × ")}</span>
                  {w.crossMajor && (
                    <span className="rounded bg-cyan-50 px-2 py-0.5 font-mono text-[10px] text-cyan-700">CROSS-MAJOR</span>
                  )}
                  {w.commercialUse && (
                    <span className="rounded bg-emerald-50 px-2 py-0.5 font-mono text-[10px] text-emerald-700">COMMERCIAL USE</span>
                  )}
                  {w.type.slice(0, 1).map((t) => (
                    <span key={t} className="tag tag-light">{t}</span>
                  ))}
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-16 text-center text-sm text-slate-400">该筛选下暂无作品</p>
      )}
    </div>
  );
}
