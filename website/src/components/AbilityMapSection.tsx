import dynamic from "next/dynamic";
import Reveal from "./Reveal";
import { ABILITY_MAPS } from "@/lib/abilityMaps";
import { MATRIX_RING_COLORS, type MatrixNode } from "@/lib/abilityMatrix";
import type { TrainingSystem } from "@/lib/majorContent";
import TrainingSystemSection from "./TrainingSystemSection";

const AbilitySunburst = dynamic(() => import("./AbilitySunburst"));
const AbilityMatrixSunburst = dynamic(() => import("./AbilityMatrixSunburst"));

// 旧五环模型图例（AI 等专业）
const RING_META = [
  { label: "岗位", color: "#0070C0", desc: "环内文字 1:1 取自 PPT P8/P11 矢量数据" },
  { label: "岗位职责", color: "#1D6FB8", desc: "结构取自 PPT 五环模型" },
  { label: "典型任务", color: "#2E86C1", desc: "结构取自 PPT 五环模型" },
  { label: "核心技能", color: "#0E7C86", desc: "技能项与 PPT 课程/技能要求对应" },
  { label: "核心素养", color: "#F69744", desc: "PPT 强调色（橙）" },
];

// 6 层矩阵图例（按矩阵数据动态统计）
function buildMatrixMeta(matrix: MatrixNode) {
  const jobs = matrix.children ?? [];
  const duties = jobs.flatMap((j) => j.children ?? []);
  const tasks = duties.flatMap((d) => d.children ?? []);
  const skills = tasks.flatMap((t) => t.children ?? []);
  const lits = skills.reduce((a, s) => a + (s.children ?? []).length, 0);
  const avg = (a: number, b: number) => (b ? (a / b).toFixed(1) : "0");
  return {
    meta: [
      { label: "岗位群", color: MATRIX_RING_COLORS[0], desc: matrix.full.replace(/\n/g, "") },
      {
        label: `核心岗位 ×${jobs.length}`,
        color: MATRIX_RING_COLORS[1],
        desc: jobs.map((j) => j.full.replace(/\n/g, " ")).join(" · ") || "待完善",
      },
      { label: `主要职责 ×${duties.length}`, color: MATRIX_RING_COLORS[2], desc: `平均每岗位 ${avg(duties.length, jobs.length)} 项职责` },
      { label: `典型任务 ×${tasks.length}`, color: MATRIX_RING_COLORS[3], desc: `平均每职责 ${avg(tasks.length, duties.length)} 项任务` },
      { label: `核心技能 ×${skills.length}`, color: MATRIX_RING_COLORS[4], desc: `平均每任务 ${avg(skills.length, tasks.length)} 项技能` },
      { label: `职业素养 ×${lits}`, color: MATRIX_RING_COLORS[5], desc: "按技能逐项拆分" },
    ],
    total: 1 + jobs.length + duties.length + tasks.length + skills.length + lits,
    counts: `${jobs.length} 岗位 · ${duties.length} 职责 · ${tasks.length} 任务 · ${skills.length} 技能 · ${lits} 素养`,
  };
}

const ORIG_IMAGES: Record<string, { src: string; caption: string }[]> = {
  data: [{ src: "/images/ppt/ability-map-data.png", caption: "PPT P7 原图（对照参考）" }],
  ai: [
    { src: "/images/ppt/ability-map-ai-groups.png", caption: "PPT P10 岗位群图谱原图（对照参考）" },
    { src: "/images/ppt/ability-map-ai-model.png", caption: "PPT P10 能力素养模型原图（对照参考）" },
  ],
};

const FLOW = [
  { step: "STEP 1", title: "岗位调研", desc: "采集海量企业招聘岗位信息与用人数据" },
  { step: "STEP 2", title: "统计分析", desc: "归纳岗位职责、典型任务、核心技能与素养" },
  { step: "STEP 3", title: "能力图谱", desc: "形成岗位能力素养模型旭日图（下图）" },
  { step: "STEP 4", title: "课程体系", desc: "以图谱定课程，逆向设计岗课赛证体系（见下）" },
];

export default function AbilityMapSection({
  slug,
  matrix,
  training,
}: {
  slug: string;
  matrix?: MatrixNode | null;
  training?: TrainingSystem | null;
}) {
  const isMatrix = !!matrix; // 有矩阵数据（后台编辑保存）即使用 6 层矩阵图谱展示
  const map = ABILITY_MAPS[slug];
  const origs = ORIG_IMAGES[slug];
  if (!isMatrix && !map) return null;

  const m = isMatrix && matrix ? buildMatrixMeta(matrix) : null;
  const legend = m ? m.meta : RING_META;

  return (
    <Reveal>
      <section className="relative mt-16 overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-blue-600">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600" aria-hidden />
              ABILITY MAP · 能力图谱旭日图
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              {isMatrix ? "专业能力矩阵图谱" : "专业岗位能力素养模型"}
            </h2>
            <p className="mt-2 max-w-xl text-sm text-slate-500">
              先通过岗位调研采集海量相关岗位数据，经统计分析形成能力图谱，再据此逆向设计岗课赛证课程体系。
              {isMatrix ? "图表按官方模板与源数据 1:1 重绘，悬停查看完整明细，点击扇区可下钻。" : "图表为原生重绘，悬停查看明细。"}
            </p>
          </div>
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 font-mono text-[10px] text-blue-600">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600" aria-hidden />
            {isMatrix ? "SUNBURST · 官方模板 1:1" : "SUNBURST · 原生重绘"}
          </span>
        </div>

        {/* 方法论链条（PPT P6：企业招聘岗位信息 → 岗位技能图谱 → 课程体系） */}
        <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {FLOW.map((f, i) => (
            <div key={f.step} className="relative rounded-xl border border-slate-100 bg-slate-50 p-3">
              <p className="font-mono text-[9px] tracking-widest text-blue-500">{f.step}</p>
              <p className="mt-1 text-xs font-bold text-slate-800">
                {f.title}
                {i < FLOW.length - 1 && <span className="ml-1 text-blue-400" aria-hidden>→</span>}
              </p>
              <p className="mt-0.5 text-[10px] leading-4 text-slate-500">{f.desc}</p>
            </div>
          ))}
        </div>

        {isMatrix ? (
          <>
            {/* 官方模板 1:1 矩阵旭日图：整行大尺寸 */}
            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/60 p-2">
              <AbilityMatrixSunburst data={matrix!} />
            </div>
            {/* 六环图例（横排，数量按当前数据统计） */}
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
              {legend.map((r) => (
                <div key={r.label} className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <span className="mt-0.5 h-3 w-3 shrink-0 rounded-sm" style={{ background: r.color }} aria-hidden />
                  <div>
                    <p className="text-xs font-bold text-slate-800">{r.label}</p>
                    <p className="mt-0.5 text-[10px] leading-4 text-slate-500">{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-[10px] leading-4 text-emerald-800">
              说明：图表按官方模板 6 层结构绘制，当前共 {m!.total} 节点（{m!.counts}），内容可在后台「专业内容管理」中维护；点击「核心岗位」环上的任一岗位扇区，切换为该岗位的 120° 扇形展开图（左侧标注核心岗位/主要职责/典型任务/核心技能/职业素养五层维度），点击「返回完整能力矩阵」恢复全图。
            </p>

            {/* 大数据专业人才培养体系图（PPT slide 9 1:1 原生重绘，后台可编辑） */}
            {training && <TrainingSystemSection system={training} />}
          </>
        ) : (
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <AbilitySunburst map={map!} />
            </div>
            <div className="lg:col-span-4">
              <div className="space-y-3">
                {legend.map((r) => (
                  <div key={r.label} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <span className="mt-0.5 h-3 w-3 shrink-0 rounded-sm" style={{ background: r.color }} aria-hidden />
                    <div>
                      <p className="text-xs font-bold text-slate-800">{r.label}</p>
                      <p className="mt-0.5 text-[10px] leading-4 text-slate-500">{r.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-[10px] leading-4 text-amber-800">
                说明：{map!.note}。原图为位图，环内明细文字无法程序化识别；如可提供图表源数据（Excel/制作工具导出），可替换为逐字 1:1。
              </p>
            </div>
          </div>
        )}

        {origs && (
          <details className="group mt-8">
            <summary className="cursor-pointer list-none font-mono text-[11px] text-slate-400 hover:text-blue-600">
              ▸ 对照参考：PPT 原图（位图）
            </summary>
            <div className={`mt-4 grid gap-4 ${origs.length > 1 ? "md:grid-cols-2" : ""}`}>
              {origs.map((o) => (
                <figure key={o.src} className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={o.src} alt={o.caption} className="mx-auto max-h-[420px] w-auto max-w-full object-contain" loading="lazy" />
                  <figcaption className="mt-1 text-center font-mono text-[10px] text-slate-400">{o.caption}</figcaption>
                </figure>
              ))}
            </div>
          </details>
        )}
      </section>
    </Reveal>
  );
}
