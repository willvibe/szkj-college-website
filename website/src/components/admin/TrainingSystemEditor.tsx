"use client";

import { useState, useTransition } from "react";
import { saveMajorContent } from "@/app/admin/actions";
import type { TrainingSystem } from "@/lib/majorContent";
import type { AbilityGroup } from "@/lib/trainingSystem";
import TrainingSystemSection from "@/components/TrainingSystemSection";

const input = "w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-blue-400";
const area = `${input} min-h-20 text-xs leading-6`;
const lines = (s: string) => s.split(/\r?\n/).map((x) => x.trim()).filter(Boolean);

const GROUP_FIELDS: Array<{ key: keyof AbilityGroup; label: string }> = [
  { key: "courses", label: "课程（每行一门）" },
  { key: "postsTop", label: "岗位（每行一个）" },
  { key: "contests", label: "大赛（每行一项）" },
  { key: "postsBottom", label: "证书/岗位（每行一项）" },
];

export default function TrainingSystemEditor({
  id,
  slug,
  initial,
}: {
  id: number;
  slug: string;
  initial: TrainingSystem;
}) {
  const [t, setT] = useState<TrainingSystem>(initial);
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const [state, setState] = useState<{ ok?: boolean; error?: string } | null>(null);
  const [pending, startTransition] = useTransition();

  function save(clear = false) {
    setState(null);
    startTransition(async () => {
      const r = await saveMajorContent(id, slug, "trainingSystemJson", clear ? null : t);
      setState(r);
    });
  }
  function patch(p: Partial<TrainingSystem>) {
    setT((s) => ({ ...s, ...p }));
  }
  function updGroup(i: number, g: AbilityGroup) {
    const abilities = [...t.core.abilities];
    abilities[i] = g;
    patch({ core: { ...t.core, abilities } });
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-slate-800">人才培养体系图（泳道图 · 三年四阶段）</h2>
          <p className="mt-1 text-[11px] text-slate-400">
            自上而下编辑：实习就业 → N+ 企业校内项目部 → 专业核心课（三能力）→ 专业基础课 → 公共基础课
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-slate-200 p-0.5 text-[11px] font-semibold">
            <button type="button" onClick={() => setTab("edit")} className={`rounded-md px-3 py-1 ${tab === "edit" ? "bg-brand text-white" : "text-slate-500"}`}>编辑</button>
            <button type="button" onClick={() => setTab("preview")} className={`rounded-md px-3 py-1 ${tab === "preview" ? "bg-brand text-white" : "text-slate-500"}`}>预览（同前台）</button>
          </div>
          <button type="button" onClick={() => save()} disabled={pending} className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50">
            {pending ? "保存中…" : "保存"}
          </button>
        </div>
      </div>

      {state?.ok && <p className="mb-3 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-600">已保存，前台即时生效</p>}
      {state?.error && <p className="mb-3 rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600">{state.error}</p>}

      {tab === "edit" ? (
        <div className="space-y-4">
          <label className="block">
            <span className="text-[10px] font-semibold text-slate-400">标题</span>
            <input value={t.title} onChange={(e) => patch({ title: e.target.value })} className={input} />
          </label>

          {/* 实习就业 */}
          <fieldset className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
            <legend className="px-1 text-xs font-bold text-slate-600">阶段四 · 实习就业</legend>
            <div className="grid gap-3 md:grid-cols-4">
              <label><span className="text-[10px] font-semibold text-slate-400">行标签</span>
                <input value={t.internship.label} onChange={(e) => patch({ internship: { ...t.internship, label: e.target.value } })} className={input} /></label>
              <label><span className="text-[10px] font-semibold text-slate-400">阶段名</span>
                <input value={t.internship.stage} onChange={(e) => patch({ internship: { ...t.internship, stage: e.target.value } })} className={input} /></label>
              <label><span className="text-[10px] font-semibold text-slate-400">学年</span>
                <input value={t.internship.years} onChange={(e) => patch({ internship: { ...t.internship, years: e.target.value } })} className={input} /></label>
              <label className="md:col-span-4"><span className="text-[10px] font-semibold text-slate-400">内容项（每行一项）</span>
                <textarea value={t.internship.items.join("\n")} onChange={(e) => patch({ internship: { ...t.internship, items: lines(e.target.value) } })} className={area} /></label>
            </div>
          </fieldset>

          {/* N+ 项目部 */}
          <fieldset className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
            <legend className="px-1 text-xs font-bold text-slate-600">阶段三 · N+ 企业校内项目部</legend>
            <div className="grid gap-3 md:grid-cols-4">
              <label><span className="text-[10px] font-semibold text-slate-400">阶段名</span>
                <input value={t.project.stage} onChange={(e) => patch({ project: { ...t.project, stage: e.target.value } })} className={input} /></label>
              <label className="md:col-span-3"><span className="text-[10px] font-semibold text-slate-400">文案</span>
                <input value={t.project.text} onChange={(e) => patch({ project: { ...t.project, text: e.target.value } })} className={input} /></label>
            </div>
          </fieldset>

          {/* 专业核心课 */}
          <fieldset className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
            <legend className="px-1 text-xs font-bold text-slate-600">阶段二 · 专业核心课（三大能力 · 岗课赛证）</legend>
            <div className="mb-3 grid gap-3 md:grid-cols-4">
              <label><span className="text-[10px] font-semibold text-slate-400">行标签</span>
                <input value={t.core.label} onChange={(e) => patch({ core: { ...t.core, label: e.target.value } })} className={input} /></label>
              <label><span className="text-[10px] font-semibold text-slate-400">阶段名</span>
                <input value={t.core.stage} onChange={(e) => patch({ core: { ...t.core, stage: e.target.value } })} className={input} /></label>
              <label><span className="text-[10px] font-semibold text-slate-400">学年</span>
                <input value={t.core.years} onChange={(e) => patch({ core: { ...t.core, years: e.target.value } })} className={input} /></label>
            </div>
            <div className="space-y-3">
              {t.core.abilities.map((g, i) => (
                <div key={i} className="rounded-lg border border-slate-200 bg-white p-3">
                  <div className="flex flex-wrap items-end gap-3">
                    <label className="w-24"><span className="text-[10px] font-semibold text-slate-400">编号</span>
                      <input value={g.tag} onChange={(e) => updGroup(i, { ...g, tag: e.target.value })} className={input} /></label>
                    <label className="min-w-44 flex-1"><span className="text-[10px] font-semibold text-slate-400">能力名称</span>
                      <input value={g.name} onChange={(e) => updGroup(i, { ...g, name: e.target.value })} className={input} /></label>
                    <button type="button" onClick={() => patch({ core: { ...t.core, abilities: t.core.abilities.filter((_, j) => j !== i) } })}
                      className="rounded-md border border-rose-200 px-2.5 py-1.5 text-[11px] font-semibold text-rose-500 hover:bg-rose-50">删除</button>
                  </div>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    {GROUP_FIELDS.map(({ key, label }) => (
                      <label key={key} className="block">
                        <span className="text-[10px] font-semibold text-slate-400">{label}</span>
                        <textarea
                          value={(g[key] as string[]).join("\n")}
                          onChange={(e) => updGroup(i, { ...g, [key]: lines(e.target.value) })}
                          className={area}
                        />
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => patch({ core: { ...t.core, abilities: [...t.core.abilities, { tag: `能力${t.core.abilities.length + 1}`, name: "", courses: [], postsTop: [], contests: [], postsBottom: [] }] } })}
                className="rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50">
                + 添加能力组
              </button>
            </div>
          </fieldset>

          {/* 专业基础课 / 公共基础课 */}
          <div className="grid gap-4 md:grid-cols-2">
            <fieldset className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
              <legend className="px-1 text-xs font-bold text-slate-600">阶段一 · 专业基础课</legend>
              <div className="grid gap-3">
                <div className="grid grid-cols-3 gap-2">
                  <label><span className="text-[10px] font-semibold text-slate-400">行标签</span>
                    <input value={t.basic.label} onChange={(e) => patch({ basic: { ...t.basic, label: e.target.value } })} className={input} /></label>
                  <label><span className="text-[10px] font-semibold text-slate-400">学年</span>
                    <input value={t.basic.years} onChange={(e) => patch({ basic: { ...t.basic, years: e.target.value } })} className={input} /></label>
                  <label><span className="text-[10px] font-semibold text-slate-400">训练营</span>
                    <input value={t.basic.camp} onChange={(e) => patch({ basic: { ...t.basic, camp: e.target.value } })} className={input} /></label>
                </div>
                <label><span className="text-[10px] font-semibold text-slate-400">课程（每行一门）</span>
                  <textarea value={t.basic.courses.join("\n")} onChange={(e) => patch({ basic: { ...t.basic, courses: lines(e.target.value) } })} className={area} /></label>
              </div>
            </fieldset>
            <fieldset className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
              <legend className="px-1 text-xs font-bold text-slate-600">阶段一 · 公共基础课</legend>
              <div className="grid gap-3">
                <div className="grid grid-cols-2 gap-2">
                  <label><span className="text-[10px] font-semibold text-slate-400">行标签</span>
                    <input value={t.public.label} onChange={(e) => patch({ public: { ...t.public, label: e.target.value } })} className={input} /></label>
                  <label><span className="text-[10px] font-semibold text-slate-400">训练营</span>
                    <input value={t.public.camp} onChange={(e) => patch({ public: { ...t.public, camp: e.target.value } })} className={input} /></label>
                </div>
                <label><span className="text-[10px] font-semibold text-slate-400">内容项（每行一项）</span>
                  <textarea value={t.public.items.join("\n")} onChange={(e) => patch({ public: { ...t.public, items: lines(e.target.value) } })} className={area} /></label>
              </div>
            </fieldset>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl">
          <TrainingSystemSection system={t} />
        </div>
      )}

      <div className="mt-3 flex items-center justify-between">
        <p className="text-[10px] text-slate-400">「预览」即专业主页「人才培养体系图」的实际渲染效果</p>
        <button type="button" onClick={() => save(true)} disabled={pending} className="text-[11px] text-slate-400 underline hover:text-rose-500">
          清空自定义，恢复内置数据
        </button>
      </div>
    </div>
  );
}
