import Reveal from "./Reveal";
import { TRAINING_SYSTEM as DEFAULT_T, type AbilityGroup } from "@/lib/trainingSystem";
import type { TrainingSystem } from "@/lib/majorContent";

// PPT slide 9 配色（青蓝色系）
const C = {
  label: "bg-[#0d7fb8]", // 左侧行标签深蓝
  labelDark: "bg-[#0a5d8a]",
  border: "border-[#29a3dd]",
  text: "text-[#1187cf]",
  stage: "bg-[#35aee2]", // 右侧阶段条
  stageYears: "bg-[#0d7fb8]", // 学年条
  head: "bg-[#0d7fb8]", // 能力组表头
  cellBorder: "border-[#29a3dd]",
};

function RowLabel({ text, dark = false }: { text: string; dark?: boolean }) {
  return (
    <div
      className={`flex w-14 shrink-0 items-center justify-center py-2 sm:w-16 ${dark ? C.labelDark : C.label}`}
    >
      <span className="text-sm font-bold tracking-widest text-white [writing-mode:vertical-rl]">
        {text}
      </span>
    </div>
  );
}

function StageCell({ stage, years, className = "" }: { stage: string; years?: string; className?: string }) {
  return (
    <div className={`flex w-12 shrink-0 flex-col gap-1 sm:w-14 ${className}`}>
      <div className={`flex flex-1 items-center justify-center ${C.stage}`}>
        <span className="text-xs font-bold tracking-widest text-white [writing-mode:vertical-rl]">{stage}</span>
      </div>
      {years && (
        <div className={`flex items-center justify-center py-2 ${C.stageYears}`}>
          <span className="text-xs font-bold tracking-widest text-white [writing-mode:vertical-rl]">{years}</span>
        </div>
      )}
    </div>
  );
}

function AbilityCard({ g }: { g: AbilityGroup }) {
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
      {/* 左列：能力 + 课程 */}
      <div className="flex flex-col gap-2">
        <div className={`${C.head} px-3 py-2 text-center`}>
          <p className="text-sm font-bold text-white">{g.tag}</p>
          <p className="mt-1 text-[11px] leading-4 text-white/90">{g.name}</p>
        </div>
        <div className={`flex-1 border-2 ${C.cellBorder} bg-white px-2 py-2`}>
          {g.courses.map((c) => (
            <p key={c} className={`py-1 text-center text-[11px] leading-4 ${C.text}`}>
              {c}
            </p>
          ))}
        </div>
      </div>
      {/* 右列：岗位 / 大赛 / 证书 */}
      <div className="flex flex-col gap-2">
        <div className={`border-2 ${C.cellBorder} bg-white px-2 py-1.5`}>
          {g.postsTop.map((p) => (
            <p key={p} className={`py-0.5 text-center text-[11px] leading-4 ${C.text}`}>
              {p}
            </p>
          ))}
        </div>
        <div className={`flex-1 border-2 ${C.cellBorder} bg-white px-2 py-1.5`}>
          {g.contests.map((p) => (
            <p key={p} className={`py-0.5 text-center text-[11px] leading-4 ${C.text}`}>
              {p}
            </p>
          ))}
        </div>
        <div className={`border-2 ${C.cellBorder} bg-white px-2 py-1.5`}>
          {g.postsBottom.map((p) => (
            <p key={p} className={`py-0.5 text-center text-[11px] leading-4 ${C.text}`}>
              {p}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TrainingSystemSection({ system }: { system?: TrainingSystem }) {
  const T = system ?? DEFAULT_T;
  return (
    <Reveal>
      <section className="relative mt-16 overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-blue-600">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600" aria-hidden />
              TRAINING SYSTEM · 人才培养体系图
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">{T.title}</h2>
            <p className="mt-2 max-w-xl text-sm text-slate-500">
              以出口设计入口：公共基础课 → 专业基础课 → 专业核心课（三大能力·岗课赛证融通）→ 生产项目实战 → 实习就业，四年四阶段递进培养。
            </p>
          </div>
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 font-mono text-[10px] text-blue-600">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600" aria-hidden />
            PPT 1:1 重绘
          </span>
        </div>

        {/* 体系图主体（自顶向下：阶段四 → 阶段一，与 PPT 一致） */}
        <div className="space-y-2">
          {/* 实习就业 · 阶段四 */}
          <div className="flex gap-2">
            <RowLabel text={T.internship.label} dark />
            <div className={`flex flex-1 flex-wrap items-center justify-around gap-2 border-2 ${C.border} bg-white px-3 py-4`}>
              {T.internship.items.map((it) => (
                <p key={it} className={`text-xs font-medium sm:text-sm ${C.text}`}>
                  {it}
                </p>
              ))}
            </div>
            <StageCell stage={T.internship.stage} years={T.internship.years} />
          </div>

          {/* N+ 项目部 · 阶段三 */}
          <div className="flex gap-2">
            <div className={`flex-1 border-2 ${C.border} bg-white px-3 py-4 text-center`}>
              <p className={`text-sm font-bold sm:text-base ${C.text}`}>{T.project.text}</p>
            </div>
            <StageCell stage={T.project.stage} />
          </div>

          {/* 专业核心课 · 阶段二 */}
          <div className="flex gap-2">
            <RowLabel text={T.core.label} />
            <div className={`flex-1 border-2 ${C.border} bg-white p-3 sm:p-4`}>
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
                {T.core.abilities.map((g) => (
                  <AbilityCard key={g.tag} g={g} />
                ))}
              </div>
            </div>
            <StageCell stage={T.core.stage} years={T.core.years} />
          </div>

          {/* 专业基础课 · 阶段一 */}
          <div className="flex gap-2">
            <RowLabel text={T.basic.label} />
            <div className={`flex flex-1 gap-2 border-2 ${C.border} bg-white p-3`}>
              <div className="flex flex-1 flex-wrap content-center items-center justify-around gap-x-4 gap-y-2 px-2 py-3">
                {T.basic.courses.map((c) => (
                  <p key={c} className={`text-xs sm:text-sm ${C.text}`}>
                    {c}
                  </p>
                ))}
              </div>
              <div className={`flex w-32 shrink-0 items-center justify-center border-2 ${C.cellBorder} bg-white sm:w-36`}>
                <p className={`px-2 py-2 text-center text-xs font-medium sm:text-sm ${C.text}`}>{T.basic.camp}</p>
              </div>
            </div>
            <StageCell stage={T.basic.stage} years={T.basic.years} />
          </div>

          {/* 公共基础课 · 阶段一 */}
          <div className="flex gap-2">
            <RowLabel text={T.public.label} dark />
            <div className={`flex flex-1 gap-2 border-2 ${C.border} bg-white p-3`}>
              <div className="flex flex-1 items-center justify-center px-2 py-3">
                {T.public.items.map((c) => (
                  <p key={c} className={`text-xs sm:text-sm ${C.text}`}>
                    {c}
                  </p>
                ))}
              </div>
              <div className={`flex w-32 shrink-0 items-center justify-center border-2 ${C.cellBorder} bg-white sm:w-36`}>
                <p className={`px-2 py-2 text-center text-xs font-medium sm:text-sm ${C.text}`}>{T.public.camp}</p>
              </div>
            </div>
            <StageCell stage={T.basic.stage} />
          </div>
        </div>

        <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-[10px] leading-4 text-emerald-800">
          说明：本图按 PPT《最美职教新示范》"大数据专业人才培养体系图" 1:1 原生重绘；右侧为培养阶段与学年安排（阶段一 1 学年 → 阶段二 1.5 学年 → 阶段三 → 阶段四 0.5 学年）。
        </p>
      </section>
    </Reveal>
  );
}
