"use client";

import { useState, useTransition } from "react";
import { saveMajorContent } from "@/app/admin/actions";
import type { CourseSystem, Ability } from "@/lib/courseSystems";
import CourseSystemSection from "@/components/CourseSystemSection";

const input = "w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-blue-400";
const area = `${input} min-h-20 text-xs leading-6`;
const KEY_LABEL: Record<keyof Omit<Ability, "name">, string> = {
  courses: "课程（每行一项）",
  jobs: "岗位（每行一个）",
  contests: "大赛（每行一项）",
  certificates: "证书（每行一项）",
};

export default function CourseSystemEditor({
  id,
  slug,
  initial,
}: {
  id: number;
  slug: string;
  initial: CourseSystem;
}) {
  const [sys, setSys] = useState<CourseSystem>(initial);
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const [state, setState] = useState<{ ok?: boolean; error?: string } | null>(null);
  const [pending, startTransition] = useTransition();

  function save(clear = false) {
    setState(null);
    startTransition(async () => {
      const r = await saveMajorContent(id, slug, "courseSystemJson", clear ? null : sys);
      setState(r);
    });
  }
  function patch(p: Partial<CourseSystem>) {
    setSys((s) => ({ ...s, ...p }));
  }
  function updAbility(i: number, a: Ability) {
    const abilities = [...sys.abilities];
    abilities[i] = a;
    patch({ abilities });
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-slate-800">岗课赛证融通 · 课程体系与能力图谱</h2>
          <p className="mt-1 text-[11px] text-slate-400">
            按能力分组维护：课程 · 岗位 · 大赛 · 证书 四维融通要素
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
            <span className="text-[10px] font-semibold text-slate-400">数据来源说明</span>
            <input value={sys.source} onChange={(e) => patch({ source: e.target.value })} className={input} />
          </label>

          {sys.abilities.map((a, i) => (
            <div key={i} className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
              <div className="flex flex-wrap items-end gap-3">
                <label className="min-w-56 flex-1">
                  <span className="text-[10px] font-semibold text-slate-400">能力名称</span>
                  <input
                    value={a.name}
                    onChange={(e) => updAbility(i, { ...a, name: e.target.value })}
                    className={input}
                    placeholder="能力一：数据处理与分析能力"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => patch({ abilities: sys.abilities.filter((_, j) => j !== i) })}
                  className="rounded-md border border-rose-200 px-2.5 py-1.5 text-[11px] font-semibold text-rose-500 hover:bg-rose-50"
                >
                  删除能力
                </button>
              </div>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                {(Object.keys(KEY_LABEL) as Array<keyof Omit<Ability, "name">>).map((k) => (
                  <label key={k} className="block">
                    <span className="text-[10px] font-semibold text-slate-400">{KEY_LABEL[k]}</span>
                    <textarea
                      value={(a[k] as string[]).join("\n")}
                      onChange={(e) => updAbility(i, { ...a, [k]: e.target.value.split(/\r?\n/).map((x) => x.trim()).filter(Boolean) })}
                      className={area}
                    />
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => patch({ abilities: [...sys.abilities, { name: "", courses: [], jobs: [], contests: [], certificates: [] }] })}
              className="rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50"
            >
              + 添加能力
            </button>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="block">
              <span className="text-[10px] font-semibold text-slate-400">专业基础课（每行一门）</span>
              <textarea
                value={sys.foundationCourses.join("\n")}
                onChange={(e) => patch({ foundationCourses: e.target.value.split(/\r?\n/).map((x) => x.trim()).filter(Boolean) })}
                className={area}
              />
            </label>
            <label className="block">
              <span className="text-[10px] font-semibold text-slate-400">训练营（每行一个）</span>
              <textarea
                value={sys.trainings.join("\n")}
                onChange={(e) => patch({ trainings: e.target.value.split(/\r?\n/).map((x) => x.trim()).filter(Boolean) })}
                className={area}
              />
            </label>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl">
          <CourseSystemSection system={sys} />
        </div>
      )}

      <div className="mt-3 flex items-center justify-between">
        <p className="text-[10px] text-slate-400">「预览」即专业主页「岗课赛证融通」模块的实际渲染效果</p>
        <button type="button" onClick={() => save(true)} disabled={pending} className="text-[11px] text-slate-400 underline hover:text-rose-500">
          清空自定义，恢复内置数据
        </button>
      </div>
    </div>
  );
}
