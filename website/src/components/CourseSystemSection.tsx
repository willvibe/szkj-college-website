import dynamic from "next/dynamic";
import Reveal from "./Reveal";
import GkczDiagram from "./GkczDiagram";
import { GKCS } from "@/lib/gkczDiagrams";
import { GKCZ_META, type CourseSystem } from "@/lib/courseSystems";

const SunburstChart = dynamic(() => import("./SunburstChart"));

const KEY_COLOR: Record<string, string> = {
  courses: "bg-blue-500",
  jobs: "bg-amber-500",
  contests: "bg-rose-500",
  certificates: "bg-emerald-500",
};

export default function CourseSystemSection({ system }: { system: CourseSystem }) {
  const diagramData = system.diagram ? GKCS[system.diagram] : undefined;

  return (
    <Reveal>
      <section className="relative mt-16 overflow-hidden rounded-3xl bg-slate-900 p-6 text-white shadow-xl sm:p-10">
        <div className="grid-pattern absolute inset-0 opacity-20" aria-hidden />
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-500/15 blur-3xl" aria-hidden />

        <div className="relative z-10">
          {/* 头部 */}
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <div className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-cyan-400">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" aria-hidden />
                JOB · COURSE · COMPETITION · CERTIFICATE
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">岗课赛证融通 · 课程体系与能力图谱</h2>
              <p className="mt-2 max-w-xl text-sm text-slate-400">
                基于上方能力图谱逆向设计：以三大核心能力为轴，课程对接岗位、大赛检验技能、证书认证水平。
                {diagramData ? " 下图按 PPT 原始矢量数据（坐标/字号/配色）1:1 重绘。" : " 内圈为能力，中圈为四维融通，外圈为具体要素，悬停查看明细。"}
              </p>
            </div>
            {diagramData && (
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1.5 font-mono text-[10px] text-cyan-300">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" aria-hidden />
                SVG 矢量重绘 · 1:1
              </span>
            )}
          </div>

          {diagramData ? (
            /* PPT 矢量图 1:1 原生重绘 */
            <figure className="overflow-hidden rounded-2xl border border-white/10 bg-white p-4 sm:p-6">
              <GkczDiagram data={diagramData} />
              <figcaption className="mt-2 text-center font-mono text-[11px] text-slate-500">
                《最美职教新示范V7.0》P{system.diagram === "ai" ? "11" : "8"} 专业特征/技能要求图 · 矢量 1:1 重绘
              </figcaption>
            </figure>
          ) : (
            /* 交互旭日图兜底（PPT 未提供原图的专业） */
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <SunburstChart abilities={system.abilities} />
              </div>
              <div className="lg:col-span-5">
                <div className="mb-6 grid grid-cols-2 gap-3">
                  {GKCZ_META.map((g) => (
                    <div key={g.key} className="rounded-xl border border-white/10 bg-white/5 p-3">
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${KEY_COLOR[g.key]}`} aria-hidden />
                        <span className="text-xs font-bold text-white">
                          {g.label}
                          <span className="ml-1 font-mono text-[9px] text-slate-500">{g.en}</span>
                        </span>
                      </div>
                      <p className="mt-1 text-[10px] leading-4 text-slate-400">{g.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 能力明细 */}
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {system.abilities.map((a, i) => (
              <div key={a.name} className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-sm font-bold text-white">
                  <span className="mr-2 font-mono text-xs text-cyan-400">0{i + 1}</span>
                  {a.name}
                </p>
                <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] leading-5 text-slate-400">
                  <p>
                    <span className="font-mono text-blue-400">课</span> {a.courses.length} 门
                  </p>
                  <p>
                    <span className="font-mono text-amber-400">岗</span> {a.jobs.length} 类
                  </p>
                  <p>
                    <span className="font-mono text-rose-400">赛</span> {a.contests.length} 项
                  </p>
                  <p>
                    <span className="font-mono text-emerald-400">证</span> {a.certificates.length} 种
                  </p>
                </div>
                <details className="group mt-3">
                  <summary className="cursor-pointer list-none font-mono text-[10px] text-cyan-400 hover:text-cyan-300">
                    展开明细 ▾
                  </summary>
                  <div className="mt-2 space-y-2 text-[11px] leading-5 text-slate-300">
                    <p><span className="font-mono text-blue-400">课：</span>{a.courses.join(" / ")}</p>
                    <p><span className="font-mono text-amber-400">岗：</span>{a.jobs.join(" / ")}</p>
                    <p><span className="font-mono text-rose-400">赛：</span>{a.contests.join(" / ")}</p>
                    <p><span className="font-mono text-emerald-400">证：</span>{a.certificates.join(" / ")}</p>
                  </div>
                </details>
              </div>
            ))}
          </div>

          {/* 专业基础课与训练营 */}
          <div className="mt-8 grid grid-cols-1 gap-6 border-t border-white/10 pt-6 md:grid-cols-2">
            <div>
              <p className="mb-3 font-mono text-xs uppercase tracking-widest text-cyan-400">FOUNDATION · 专业基础课</p>
              <div className="flex flex-wrap gap-1.5">
                {system.foundationCourses.map((c) => (
                  <span key={c} className="rounded border border-white/15 bg-white/5 px-2 py-1 font-mono text-[10px] text-slate-300">
                    {c}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-3 font-mono text-xs uppercase tracking-widest text-cyan-400">TRAINING CAMP · 训练营</p>
              <div className="flex flex-wrap gap-1.5">
                {system.trainings.map((t) => (
                  <span key={t} className="rounded border border-cyan-400/30 bg-cyan-400/10 px-2 py-1 font-mono text-[10px] text-cyan-300">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <p className="mt-6 font-mono text-[10px] text-slate-500">数据来源：{system.source}</p>
        </div>
      </section>
    </Reveal>
  );
}
