import Link from "next/link";
import HeroCarousel from "./HeroCarousel";
import Reveal from "./Reveal";
import CountUp from "./CountUp";
import type { CarouselRow, Stat } from "@/lib/types";

export function HeroScene({ carousel }: { carousel: CarouselRow[] }) {
  return (
    <section id="hero" className="relative flex min-h-[92vh] items-center overflow-hidden bg-[#0A1120] pt-24 pb-16 text-white">
      {/* 全宽海报轮播背景（充满整个 hero，渐变遮罩内置于组件） */}
      <HeroCarousel items={carousel} />

      <div className="shell relative z-10 grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
        {/* 左侧叙事 */}
        <div className="flex flex-col items-start lg:col-span-6">
          <Reveal>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-xs tracking-wider text-cyan-400 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping-slow" aria-hidden />
              JINAN PRESCHOOL EDUCATION COLLEGE
            </div>
            <h1 className="mb-4 whitespace-nowrap text-2xl font-extrabold leading-[1.15] tracking-tight text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.6)] sm:text-4xl lg:text-5xl xl:text-6xl">
              数智科技
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-300 bg-clip-text text-transparent">
                产业学院
              </span>
            </h1>
            <p className="mb-6 font-mono text-xs uppercase tracking-widest text-slate-400 sm:text-sm">
              School of Digital Intelligence &amp; Technology
            </p>
            <div className="relative mb-8 border-l-2 border-cyan-400 pl-4">
              <p className="text-xl font-bold tracking-tight text-white sm:text-2xl">以数智技术，连接真实产业。</p>
              <p className="mt-1 font-mono text-xs text-slate-400 sm:text-sm">CONNECT DIGITAL INTELLIGENCE WITH REAL INDUSTRY</p>
            </div>
            <p className="mb-8 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
              聚焦人工智能、大数据、数字商业与金融科技，在真实项目和产业实践中培养面向数字经济未来的高技能复合型人才。让真实产业走进课堂，让学生用作品证明成长。
            </p>
          </Reveal>
          <Reveal delay={150}>
            <div className="mb-10 flex flex-wrap gap-2">
              {["ARTIFICIAL INTELLIGENCE", "BIG DATA", "DIGITAL COMMERCE", "FINTECH"].map((t) => (
                <span key={t} className="tag tag-dark">{t}</span>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/majors" className="btn-primary">
                <span>探索专业建设</span>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
              <Link href="/works" className="btn-ghost-dark">查看成果展示</Link>
              <Link href="/admission" className="ml-1 flex items-center gap-1 font-mono text-xs text-cyan-400 hover:underline">
                <span>招生咨询指南</span> →
              </Link>
            </div>
          </Reveal>
        </div>

        {/* 右侧留给海报画面（渐变层已保证左侧可读，无需内容占位） */}
        <div className="hidden lg:col-span-6 lg:block" aria-hidden />
      </div>
    </section>
  );
}

export function StatsScene({ stats, entry = true }: { stats: Stat[]; entry?: boolean }) {
  const big = stats.find((s) => s.label.includes("实训基地"));
  const rest = stats.filter((s) => s !== big);
  const colors = ["text-blue-600", "text-indigo-600", "text-slate-900", "text-emerald-600", "text-amber-500"];
  // 说明文案统一走数据库 description（后台可编辑），不再按数组位置硬编码，避免后台增删/排序后文案错位

  return (
    <section id="about" className="relative border-b border-slate-200 bg-white py-20">
      <div className="shell">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* 左侧简介 */}
          <div className="lg:col-span-5">
            <Reveal>
              <div className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-blue-600">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600" aria-hidden />
                ABOUT / 01 · 办学定位
              </div>
              <h2 className="mb-4 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                30 秒认识数智科技产业学院
              </h2>
              <p className="mb-6 text-sm leading-relaxed text-slate-600 sm:text-base">
                数智科技产业学院是学校聚焦数字经济发展、深化产教融合与校企协同育人而设立的特色二级学院。围绕人工智能、大数据技术、电子商务、金融科技应用4个特色专业，构建“岗—课—赛—证”融通的课程体系。
              </p>
              <div className="mb-6 rounded-2xl border border-blue-100 bg-blue-50/80 p-4">
                <p className="text-xs font-medium leading-relaxed text-blue-900">
                  “以岗位定义能力，以项目组织学习，以作品证明成长。将企业生产流程1:1引入校园实训中心，打造高素质数智工匠。”
                </p>
              </div>
              {entry && (
                <Link href="/about" className="group inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700">
                  <span>了解学院概况与核心数据</span>
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              )}
            </Reveal>
          </div>

          {/* 右侧数据卡片 */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:col-span-7">
            {big && (
              <Reveal className="col-span-2 sm:col-span-3">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-6 text-white shadow-xl">
                  <div className="pointer-events-none absolute -right-8 -bottom-8 h-48 w-48 rounded-full bg-blue-500/20 blur-3xl" aria-hidden />
                  <div className="relative z-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                      <span className="mb-1 block font-mono text-xs uppercase tracking-widest text-cyan-400">{big.englishLabel}</span>
                      <div className="font-mono text-4xl font-black tracking-tight text-white sm:text-5xl">
                        <CountUp value={parseFloat(big.value)} />
                        <span className="text-cyan-400">{big.suffix}</span>
                      </div>
                      <p className="mt-2 text-sm font-medium text-slate-300">{big.description}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 font-mono text-xs text-cyan-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" aria-hidden />
                        6大核心实训室群
                      </span>
                    </div>
                  </div>
                </div>
              </Reveal>
            )}
            {rest.map((s, i) => (
              <Reveal key={s.id} delay={i * 80} className={i === 3 ? "col-span-2" : ""}>
                <div
                  className={`h-full rounded-2xl border p-5 transition-all hover:shadow-md ${
                    i === 3
                      ? "border-emerald-200/60 bg-gradient-to-r from-emerald-50 to-teal-50 hover:border-emerald-300"
                      : "border-slate-200/80 bg-slate-50 hover:border-blue-300"
                  }`}
                >
                  <div className={`mb-1 font-mono text-3xl font-extrabold ${colors[i] ?? "text-slate-900"}`}>
                    <CountUp value={parseFloat(s.value)} />
                    <span className="text-lg">{s.suffix}</span>
                  </div>
                  <div className="text-xs font-bold text-slate-800">{s.label}</div>
                  <div className="mt-1 text-[11px] text-slate-500">{s.description ?? "\u00A0"}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
