"use client";

import Link from "next/link";
import { useState } from "react";
import Reveal from "./Reveal";
import type { MajorRow, ProjectRow } from "@/lib/types";

const MAJOR_THEME: Record<string, { text: string; bg: string; border: string; iconBg: string; label: string }> = {
  AI: { text: "text-blue-600", bg: "bg-blue-50", border: "hover:border-blue-500", iconBg: "group-hover:bg-blue-600", label: "INTELLIGENCE CAPABILITY" },
  DATA: { text: "text-cyan-600", bg: "bg-cyan-50", border: "hover:border-cyan-500", iconBg: "group-hover:bg-cyan-600", label: "DATA CAPABILITY" },
  COMMERCE: { text: "text-amber-600", bg: "bg-amber-50", border: "hover:border-amber-500", iconBg: "group-hover:bg-amber-600", label: "COMMERCE CAPABILITY" },
  FINTECH: { text: "text-indigo-600", bg: "bg-indigo-50", border: "hover:border-indigo-500", iconBg: "group-hover:bg-indigo-600", label: "FINANCIAL TECH" },
};

const MAJOR_ICON: Record<string, React.ReactNode> = {
  AI: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  DATA: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
    </svg>
  ),
  COMMERCE: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  ),
  FINTECH: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

const MAJOR_LAB: Record<string, string> = {
  AI: "LAB / 人工智能实训室",
  DATA: "LAB / 大数据实训室",
  COMMERCE: "LAB / 直播电商实训室",
  FINTECH: "LAB / 金融科技实训室",
};

const INTERESTS = [
  {
    key: "aigc",
    icon: "🎬",
    label: "AI短剧与智能内容制作",
    title: "AI短剧与智能内容创作综合项目",
    desc: "由人工智能专业提供AIGC分镜与声音克隆，大数据专业进行观众画像与热点抓取，电子商务专业负责投流运营与商业化变现。",
    majors: ["AI应用", "大数据", "电子商务"],
  },
  {
    key: "annotation",
    icon: "🏷️",
    label: "企业真实多模态数据标注",
    title: "自动驾驶与工业质检高精数据标注实盘",
    desc: "大数据技术与人工智能专业深度协同，针对自动驾驶场景采集点云数据并进行多模态清洗标定，对接头部数据生态企业。",
    majors: ["大数据技术", "人工智能"],
  },
  {
    key: "cross-border",
    icon: "🌐",
    label: "跨境电商独立站与出海",
    title: "跨境电商独立站与出海品牌孵化实训",
    desc: "电子商务专业负责 Shopify 独立站建站与海外社媒多语言运营，大数据专业负责海外选品趋势分析与海关清关数据核算。",
    majors: ["电子商务", "大数据技术"],
  },
  {
    key: "live",
    icon: "🎙️",
    label: "品牌直播间操盘与中控",
    title: "全域直播电商多机位中控与主播运营",
    desc: "在专业直播电商实训间完成真实选品、主播话术把控、中控推流、投流与销售复盘全链路操盘。",
    majors: ["电子商务"],
  },
  {
    key: "risk",
    icon: "🛡️",
    label: "智能普惠金融风控系统",
    title: "区域小微企业智能普惠信贷风控系统",
    desc: "金融科技应用专业结合大数据技术，运用机器学习算法构建银行级反欺诈规则库与风险信用评分卡模型。",
    majors: ["金融科技", "大数据技术"],
  },
];

export default function MajorsSection({
  majors,
  projects,
  entry = true,
}: {
  majors: MajorRow[];
  projects: ProjectRow[];
  entry?: boolean;
}) {
  const [interestKey, setInterestKey] = useState("aigc");
  const active = INTERESTS.find((i) => i.key === interestKey)!;

  return (
    <section id="majors" className="relative overflow-hidden bg-slate-100 py-24">
      <div className="shell">
        {/* 头部 */}
        <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <Reveal>
            <div className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-blue-600">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600" aria-hidden />
              MAJORS / 02 · 核心赛道
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">数智专业建设</h2>
            <p className="mt-2 text-base font-medium text-slate-600">以专业构建能力，以项目打破边界。</p>
          </Reveal>
          <Reveal delay={100}>
            <p className="max-w-md text-xs text-slate-500">
              学生拥有明确的专业能力底座，同时根据个人兴趣与项目需求，跨专业参与真实数据清洗、AI内容创作、电商直播、金融风控等综合项目。
            </p>
            {entry && (
              <Link href="/majors" className="mt-3 inline-block text-sm font-semibold text-blue-600 hover:text-blue-700">
                进入专业建设 →
              </Link>
            )}
          </Reveal>
        </div>

        {/* 四专业卡片 */}
        <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {majors.map((m, i) => {
            const t = MAJOR_THEME[m.code];
            return (
              <Reveal key={m.slug} delay={i * 80}>
                <Link
                  href={`/majors/${m.slug}`}
                  className={`group flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-xl ${t?.border ?? ""}`}
                >
                  <div>
                    <div
                      className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl transition-all group-hover:scale-110 group-hover:text-white ${t?.bg ?? ""} ${t?.text ?? ""} ${t?.iconBg ?? ""}`}
                    >
                      {MAJOR_ICON[m.code]}
                    </div>
                    <span className={`mb-1 block font-mono text-[11px] font-semibold uppercase tracking-wider ${t?.text ?? ""}`}>
                      {t?.label}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 transition-colors group-hover:text-blue-600">{m.name}</h3>
                    <p className="mt-1 mb-4 text-xs italic text-slate-500">“{m.tagline}”</p>
                    <p className="mb-5 line-clamp-3 text-xs leading-relaxed text-slate-600">{m.description}</p>
                    <div className="mb-6 flex flex-wrap gap-1.5">
                      {m.abilities.slice(0, 4).map((a) => (
                        <span key={a} className="rounded bg-slate-100 px-2 py-0.5 font-mono text-[10px] text-slate-700">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs">
                    <span className="font-mono text-slate-400">{MAJOR_LAB[m.code]}</span>
                    <span className={`font-semibold group-hover:underline ${t?.text ?? ""}`}>详情 →</span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>

        {/* 跨专业兴趣探索 */}
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 text-white shadow-2xl sm:p-12">
            <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" aria-hidden />
            <div className="relative z-10">
              <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-center">
                <div>
                  <span className="block font-mono text-xs uppercase tracking-widest text-cyan-400">INTERACTIVE PROJECT MAP</span>
                  <h3 className="mt-1 text-2xl font-extrabold text-white sm:text-3xl">你想在大学里做什么？</h3>
                  <p className="mt-1 text-sm text-slate-400">点击下方兴趣标签，查看跨专业团队如何协同攻克真实产业项目：</p>
                </div>
                <div className="inline-block rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-xs text-slate-400">
                  “专业是起点，项目没有边界”
                </div>
              </div>

              {/* 兴趣标签 */}
              <div className="mb-8 flex flex-wrap gap-2.5" role="tablist" aria-label="兴趣方向">
                {INTERESTS.map((it) => (
                  <button
                    key={it.key}
                    role="tab"
                    aria-selected={interestKey === it.key}
                    onClick={() => setInterestKey(it.key)}
                    className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                      interestKey === it.key
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                        : "bg-white/10 text-slate-300 hover:bg-white/20"
                    }`}
                  >
                    {it.icon} {it.label}
                  </button>
                ))}
              </div>

              {/* 动态输出 */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="text-lg font-bold text-white">{active.title}</span>
                      <span className="rounded bg-cyan-400/20 px-2 py-0.5 font-mono text-[10px] text-cyan-300">CROSS-MAJOR PBL</span>
                    </div>
                    <p className="max-w-2xl text-xs leading-relaxed text-slate-300 sm:text-sm">{active.desc}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <div className="text-right">
                      <div className="text-[11px] text-slate-400">协同参与专业</div>
                      <div className="mt-1 flex flex-wrap justify-end gap-1.5">
                        {active.majors.map((m) => (
                          <span key={m} className="rounded bg-cyan-500/20 px-2 py-0.5 font-mono text-xs text-cyan-300">
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Link
                      href="/works"
                      className="whitespace-nowrap rounded-xl bg-white px-4 py-2 text-xs font-bold text-slate-900 transition-colors hover:bg-slate-200"
                    >
                      查看落地作品 →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* 跨专业项目关系 */}
        <Reveal className="mt-16">
          <h3 className="text-2xl font-bold text-slate-900 md:text-3xl">专业是起点，项目没有边界</h3>
          <p className="mt-3 text-sm text-slate-500">多个真实产业项目持续接入，每个都由跨专业团队协同完成。</p>
        </Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {projects.map((p, i) => (
            <Reveal key={p.slug} delay={i * 70}>
              <div className="group h-full rounded-2xl bg-slate-900 p-5 text-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
                <p className="font-mono text-xs text-cyan-400">{p.code}</p>
                <p className="mt-3 text-base font-bold">{p.name}</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-slate-400">{p.englishName}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.majorCodes.map((c) => (
                    <span key={c} className="rounded bg-white/10 px-2 py-0.5 font-mono text-[10px] text-slate-200">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
