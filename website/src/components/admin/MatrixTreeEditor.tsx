"use client";

import { useState, useTransition } from "react";
import { saveMajorContent } from "@/app/admin/actions";
import { MATRIX_RING_COLORS, type MatrixNode } from "@/lib/abilityMatrix";
import AbilityMatrixSunburst from "@/components/AbilityMatrixSunburst";

const LEVEL_NAMES = ["岗位群", "核心岗位", "主要职责", "典型任务", "核心技能", "职业素养"];
const input = "w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-blue-400";

function newNode(depth: number): MatrixNode {
  return depth >= 5 ? { name: "", full: "", value: 1 } : { name: "", full: "", children: [] };
}

function NodeCard({
  node,
  depth,
  path,
  onChange,
  onDelete,
}: {
  node: MatrixNode;
  depth: number;
  path: string;
  onChange: (n: MatrixNode) => void;
  onDelete?: () => void;
}) {
  const color = MATRIX_RING_COLORS[depth] ?? "#64748b";
  const isLeaf = depth >= 5;
  const hasChildren = !isLeaf && (node.children?.length ?? 0) > 0;

  function patch(p: Partial<MatrixNode>) {
    onChange({ ...node, ...p });
  }
  function updChild(i: number, c: MatrixNode) {
    const children = [...(node.children ?? [])];
    children[i] = c;
    patch({ children });
  }
  function addChild() {
    patch({ children: [...(node.children ?? []), newNode(depth + 1)] });
  }
  function delChild(i: number) {
    patch({ children: (node.children ?? []).filter((_, j) => j !== i) });
  }

  return (
    <details open={depth <= 1} className="group/node">
      <summary
        className="flex cursor-pointer list-none items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-50"
        style={{ borderLeft: `3px solid ${color}` }}
      >
        <span className="text-[10px] text-slate-400 transition-transform group-open/node:rotate-90" aria-hidden>▶</span>
        <span
          className="rounded px-1.5 py-0.5 text-[10px] font-bold text-white"
          style={{ background: color }}
        >
          {LEVEL_NAMES[depth]}
        </span>
        <span className="min-w-0 flex-1 truncate text-xs font-semibold text-slate-700">
          {node.full || node.name.replace(/\n/g, " ") || "（未命名）"}
        </span>
        {hasChildren && (
          <span className="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-400">
            {node.children!.length} 项
          </span>
        )}
      </summary>

      <div className="ml-3 mt-2 space-y-3 border-l border-dashed border-slate-200 pl-3">
        <div className="grid gap-2 sm:grid-cols-2">
          <label>
            <span className="text-[10px] font-semibold text-slate-400">弧面显示文本（空行=折行）</span>
            <textarea
              value={node.name}
              onChange={(e) => patch({ name: e.target.value })}
              rows={2}
              className={`${input} font-mono text-xs`}
            />
          </label>
          <label>
            <span className="text-[10px] font-semibold text-slate-400">完整名称（tooltip / 扇形图标题）</span>
            <input value={node.full} onChange={(e) => patch({ full: e.target.value })} className={input} />
          </label>
        </div>
        <div className="flex items-center gap-2">
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="rounded-md border border-rose-200 px-2.5 py-1 text-[11px] font-semibold text-rose-500 hover:bg-rose-50"
            >
              删除本{LEVEL_NAMES[depth]}
            </button>
          )}
          {!isLeaf && (
            <button
              type="button"
              onClick={addChild}
              className="rounded-md border border-blue-200 px-2.5 py-1 text-[11px] font-semibold text-blue-600 hover:bg-blue-50"
            >
              + 添加{LEVEL_NAMES[depth + 1]}
            </button>
          )}
        </div>
        {(node.children ?? []).map((c, i) => (
          <NodeCard
            key={`${path}-${i}`}
            node={c}
            depth={depth + 1}
            path={`${path}-${i}`}
            onChange={(n) => updChild(i, n)}
            onDelete={() => delChild(i)}
          />
        ))}
      </div>
    </details>
  );
}

export default function MatrixTreeEditor({
  id,
  slug,
  initial,
}: {
  id: number;
  slug: string;
  initial: MatrixNode;
}) {
  const [tree, setTree] = useState<MatrixNode>(initial);
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const [state, setState] = useState<{ ok?: boolean; error?: string } | null>(null);
  const [pending, startTransition] = useTransition();

  function save(clear = false) {
    setState(null);
    startTransition(async () => {
      const r = await saveMajorContent(id, slug, "abilityMatrixJson", clear ? null : tree);
      setState(r);
    });
  }

  const stats = (() => {
    let jobs = 0, duties = 0, tasks = 0, skills = 0, lits = 0;
    (tree.children ?? []).forEach((j) => {
      jobs++;
      (j.children ?? []).forEach((d) => {
        duties++;
        (d.children ?? []).forEach((t) => {
          tasks++;
          (t.children ?? []).forEach((s) => {
            skills++;
            lits += (s.children ?? []).length;
          });
        });
      });
    });
    return { jobs, duties, tasks, skills, lits };
  })();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-slate-800">能力矩阵图谱（旭日图 · 点击岗位切换 120° 扇形图）</h2>
          <p className="mt-1 text-[11px] text-slate-400">
            逐层展开编辑：{stats.jobs} 岗位 · {stats.duties} 职责 · {stats.tasks} 任务 · {stats.skills} 技能 · {stats.lits} 素养
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-slate-200 p-0.5 text-[11px] font-semibold">
            <button
              type="button"
              onClick={() => setTab("edit")}
              className={`rounded-md px-3 py-1 ${tab === "edit" ? "bg-brand text-white" : "text-slate-500"}`}
            >
              编辑
            </button>
            <button
              type="button"
              onClick={() => setTab("preview")}
              className={`rounded-md px-3 py-1 ${tab === "preview" ? "bg-brand text-white" : "text-slate-500"}`}
            >
              预览（同前台）
            </button>
          </div>
          <button
            type="button"
            onClick={() => save()}
            disabled={pending}
            className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {pending ? "保存中…" : "保存"}
          </button>
        </div>
      </div>

      {state?.ok && <p className="mb-3 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-600">已保存，前台即时生效</p>}
      {state?.error && <p className="mb-3 rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600">{state.error}</p>}

      {tab === "edit" ? (
        <div className="max-h-[640px] space-y-2 overflow-y-auto rounded-xl border border-slate-100 bg-slate-50/50 p-3">
          <NodeCard node={tree} depth={0} path="r" onChange={setTree} />
        </div>
      ) : (
        <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-2">
          <AbilityMatrixSunburst data={tree} />
        </div>
      )}

      <div className="mt-3 flex items-center justify-between">
        <p className="text-[10px] text-slate-400">「预览」即专业主页的实际渲染效果（旭日图 / 120° 扇形图可交互）</p>
        <button
          type="button"
          onClick={() => save(true)}
          disabled={pending}
          className="text-[11px] text-slate-400 underline hover:text-rose-500"
        >
          清空自定义，恢复内置数据
        </button>
      </div>
    </div>
  );
}
