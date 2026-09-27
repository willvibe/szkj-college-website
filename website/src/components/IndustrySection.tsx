import Link from "next/link";
import Reveal from "./Reveal";
import type { ProjectRow, StepRow } from "@/lib/types";

const STEP_SHORT: Record<string, string> = {
  "01": "NEED",
  "02": "MENTOR",
  "03": "COURSE",
  "04": "PBL",
  "05": "4-IN-1",
  "06": "CROSS",
  "07": "PROJECT",
  "08": "WORK-STUDY",
  "09": "DELIVERY",
  "10": "CAPABILITY",
};

export default function IndustrySection({
  steps,
  projects,
  entry = true,
}: {
  steps: StepRow[];
  projects: ProjectRow[];
  entry?: boolean;
}) {
  return (
    <section id="industry" className="relative overflow-hidden bg-[#0F172A] py-24 text-white">
      <div className="grid-pattern absolute inset-0 opacity-20" aria-hidden />
      <div className="shell relative z-10">
        {/* 头部 */}
        <div className="mb-16 max-w-3xl">
          <Reveal>
            <div className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-cyan-400">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" aria-hidden />
              INDUSTRY × EDUCATION / 03 · 育人模式
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">产教深度融合</h2>
            <p className="mt-2 text-lg font-bold text-slate-200 sm:text-xl">让产业进入教学，让学习发生在真实项目中。</p>
            <p className="mt-1 font-mono text-xs text-slate-400 sm:text-sm">以岗位定义能力，以项目组织学习，以作品证明成长。</p>
            {entry && (
              <Link href="/industry" className="mt-4 inline-block text-sm font-semibold text-cyan-400 hover:text-cyan-300">
                进入产教融合 →
              </Link>
            )}
          </Reveal>
        </div>

        {/* 10步育人链路 */}
        <div className="mb-20">
          <Reveal>
            <h3 className="mb-6 font-mono text-sm uppercase tracking-widest text-cyan-400">
              10-STEP CAPABILITY CULTIVATION PIPELINE · 十步进阶育人链路
            </h3>
          </Reveal>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {steps.map((s, i) => (
              <Reveal key={s.code} delay={i * 50}>
                <div
                  className={`h-full rounded-xl border p-4 transition-all ${
                    s.code === "10"
                      ? "border-cyan-300/40 bg-gradient-to-br from-blue-600 to-cyan-600 shadow-lg shadow-blue-500/20"
                      : "glass-panel border-white/10 hover:border-cyan-400/50"
                  }`}
                >
                  <span className={`font-mono text-xs ${s.code === "10" ? "text-white/90" : "text-cyan-400"}`}>
                    {s.code} / {STEP_SHORT[s.code] ?? ""}
                  </span>
                  <div className="mt-1 text-sm font-bold text-white">{s.name}</div>
                  <p className={`mt-1 text-[11px] leading-snug ${s.code === "10" ? "text-white/80" : "text-slate-400"}`}>
                    {s.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* 真实产业项目 */}
        <div className="mb-12">
          <Reveal>
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-mono text-sm uppercase tracking-widest text-cyan-400">
                REAL INDUSTRY PROJECTS · 正在校园发生的真实产业项目
              </h3>
              <span className="font-mono text-xs text-slate-400">STATUS: {projects.length} ACTIVE</span>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {projects.map((p, i) => (
              <Reveal key={p.slug} delay={i * 80}>
                <div className="glass-panel flex h-full flex-col justify-between rounded-2xl border border-white/10 p-6 transition-all hover:border-cyan-400/50">
                  <div>
                    <div className="mb-3 flex items-center justify-between font-mono text-xs">
                      <span className="text-cyan-400">{p.code}</span>
                      <span className="rounded border border-emerald-500/30 bg-emerald-500/20 px-2 py-0.5 text-emerald-400">
                        STATUS: {p.status === "active" ? "ACTIVE" : "DONE"}
                      </span>
                    </div>
                    <h4 className="mb-2 text-xl font-bold text-white">{p.name}</h4>
                    <p className="mb-4 text-xs leading-relaxed text-slate-300">{p.summary}</p>
                    <div className="mb-4 flex flex-wrap gap-2">
                      <span className="rounded border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-slate-300">
                        {p.majorCodes.join(" × ")}
                      </span>
                      {p.projectType.map((t) => (
                        <span key={t} className="rounded border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-slate-300">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-white/10 pt-4 text-xs">
                    <span className="text-slate-400">合作方：{p.learningModel[0] ?? "行业合作企业"}</span>
                    <span className="font-mono text-cyan-400">学生任务：{p.studentRoles.slice(0, 2).join(" / ")}…</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* 合作伙伴 */}
        <Reveal>
          <div className="flex flex-wrap items-center justify-between gap-6 border-t border-white/10 pt-8 opacity-75">
            <span className="font-mono text-xs text-slate-400">STRATEGIC PARTNERS:</span>
            {["北京凯文教育集团", "小鸭集团", "山东镁辰智能科技有限公司", "易运盈网络科技", "山东百易智能装备"].map((n) => (
              <span key={n} className="text-sm font-semibold text-slate-300">{n}</span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
