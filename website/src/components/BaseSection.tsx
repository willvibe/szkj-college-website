"use client";

import Link from "next/link";
import { useState } from "react";
import Reveal from "./Reveal";
import type { SpaceRow } from "@/lib/types";

const ROOM_COLORS: Record<string, string> = {
  "T-01": "text-cyan-400",
  "T-02": "text-blue-400",
  "T-03": "text-amber-400",
  "T-04": "text-indigo-400",
  "T-05": "text-emerald-400",
  "T-06": "text-purple-400",
};

const GALLERY = [
  { src: "/images/base/overview.jpg", label: "实训基地总览" },
  { src: "/images/base/live-commerce-2.jpg", label: "电商直播现场" },
  { src: "/images/base/newmedia-1.jpg", label: "新媒体短视频制作" },
  { src: "/images/base/newmedia-2.jpg", label: "短视频拍摄现场" },
];

export default function BaseSection({ spaces, entry = true }: { spaces: SpaceRow[]; entry?: boolean }) {
  const [activeId, setActiveId] = useState(spaces[0]?.id);
  const active = spaces.find((s) => s.id === activeId) ?? spaces[0];
  if (!active) return null;

  return (
    <section id="training-base" className="relative bg-white py-24">
      <div className="shell">
        {/* 头部 */}
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <Reveal>
            <div className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-blue-600">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600" aria-hidden />
              TRAINING BASE / 04 · 空间条件
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">生产型公共实训基地</h2>
            <p className="mt-2 text-base text-slate-600">让课程、项目和产业实践发生在同一个空间。</p>
            {entry && (
              <Link href="/base" className="mt-3 inline-block text-sm font-semibold text-blue-600 hover:text-blue-700">
                进入实训基地 →
              </Link>
            )}
          </Reveal>
          <Reveal delay={100}>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-4xl font-black text-blue-600 sm:text-5xl">1500</span>
              <span className="font-mono text-xl font-bold text-slate-900">㎡+ 总建筑面积</span>
            </div>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* 数字楼层 */}
          <Reveal className="lg:col-span-7">
            <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-6 text-white shadow-xl sm:p-8">
              <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" aria-hidden />
                  <span className="font-mono text-xs uppercase tracking-wider text-slate-300">DIGITAL FLOOR PLAN · 实训楼层平面拓扑</span>
                </div>
                <span className="font-mono text-[11px] text-slate-400">点击房间查看详情</span>
              </div>

              <div className="mb-6 grid grid-cols-2 gap-3.5 sm:grid-cols-3" role="tablist" aria-label="实训空间">
                {spaces.map((s) => {
                  const isActive = s.id === active.id;
                  return (
                    <button
                      key={s.id}
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActiveId(s.id)}
                      className={`rounded-xl border p-4 text-left transition-all ${
                        isActive
                          ? "border-blue-400/50 bg-blue-600 text-white"
                          : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
                      }`}
                    >
                      <span className={`block font-mono text-[10px] ${isActive ? "opacity-80" : ROOM_COLORS[s.roomNo ?? ""] ?? "text-cyan-400"}`}>
                        ROOM / {s.roomNo}
                      </span>
                      <div className="mt-1 text-sm font-bold">{s.name}</div>
                      <div className={`mt-2 text-[10px] ${isActive ? "opacity-75" : "text-slate-400"}`}>
                        {s.capacity ? `${s.capacity}工位` : ""}{s.area ? ` · ${s.area}㎡` : ""}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-slate-400">
                <span>实训基地环境：千兆光纤骨干网 / 智能环境温控 / 统一身份工位签到</span>
                <span className="font-mono text-cyan-400">1:1 企业生产标准</span>
              </div>
            </div>
          </Reveal>

          {/* 信息面板 */}
          <Reveal delay={120} className="lg:col-span-5">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
              <div className="mb-4 flex items-center justify-between">
                <span className="rounded bg-blue-100 px-2.5 py-1 font-mono text-xs font-bold text-blue-600">
                  ROOM {active.roomNo} · 核心实训区
                </span>
                <span className="flex items-center gap-1 font-mono text-xs font-semibold text-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden />
                  当前正常运行中
                </span>
              </div>
              <h3 className="mb-2 text-2xl font-bold text-slate-900">{active.name}</h3>
              <p className="mb-6 text-xs leading-relaxed text-slate-600 sm:text-sm">{active.description}</p>

              <div className="mb-6 space-y-3.5">
                {[
                  { label: "硬件设备概览", value: active.equipmentSummary.join("、") },
                  { label: "支撑真实项目", value: active.projects.join("、") },
                  { label: "对应核心课程", value: active.courses.join("、") },
                ].map((row, i) => (
                  <div key={row.label} className="flex items-start gap-3">
                    <div
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded text-xs font-bold ${
                        ["bg-blue-100 text-blue-600", "bg-cyan-100 text-cyan-600", "bg-indigo-100 text-indigo-600"][i]
                      }`}
                    >
                      {i + 1}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800">{row.label}</span>
                      <p className="text-xs text-slate-500">{row.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {active.cover && (
                <div className="mb-6 overflow-hidden rounded-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={active.cover} alt={active.name} className="h-40 w-full object-cover" loading="lazy" />
                </div>
              )}

              <Link
                href="/admission"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-xs font-semibold text-white transition-colors hover:bg-slate-800"
              >
                <span>申请参观或实训对接</span>
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </Reveal>
        </div>

        {/* 实训现场照片墙 */}
        <Reveal className="mt-16">
          <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-6 text-white shadow-xl sm:p-8">
            <div className="grid-pattern absolute inset-0 opacity-20" aria-hidden />
            <div className="relative z-10">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs uppercase tracking-widest text-cyan-400">TRAINING BASE LIVE</span>
                  <h3 className="mt-1 text-2xl font-bold text-white">实训现场</h3>
                </div>
                <span className="font-mono text-xs text-slate-400">1:1 还原企业真实工作场景</span>
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {GALLERY.map((g) => (
                  <figure key={g.src} className="group relative overflow-hidden rounded-2xl border border-white/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={g.src}
                      alt={g.label}
                      className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" aria-hidden />
                    <figcaption className="absolute bottom-3 left-3 text-xs font-semibold text-white">{g.label}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
