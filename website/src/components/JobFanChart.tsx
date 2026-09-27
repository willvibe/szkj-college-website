"use client";

import { useMemo, useState } from "react";
import { MATRIX_RING_COLORS, type MatrixNode } from "@/lib/abilityMatrix";

// ===== 几何常量（120° 扇形，顶点在左下，开口向上偏右，与示意图一致）=====
const W = 920;
const H = 780;
const CX = 180; // 顶点（圆心）
const CY = 515;
const R = 500; // 最大半径
const A0 = -90; // 起始角：正上（扇形左缘）
const SPAN = 120; // 扇形总角度
const D2R = Math.PI / 180;

// 五层弧带（环宽与全图旭日图的岗位视图一致）
const BANDS = [
  { r0: 0, r1: 0.14, color: MATRIX_RING_COLORS[1], fs: 12 }, // 核心岗位
  { r0: 0.14, r1: 0.3, color: MATRIX_RING_COLORS[2], fs: 10.5 }, // 主要职责
  { r0: 0.3, r1: 0.52, color: MATRIX_RING_COLORS[3], fs: 9.5 }, // 典型任务
  { r0: 0.52, r1: 0.78, color: MATRIX_RING_COLORS[4], fs: 9 }, // 核心技能
  { r0: 0.78, r1: 1.0, color: MATRIX_RING_COLORS[5], fs: 8 }, // 职业素养
];
// 各层扇段间的留白角度（度）
const GAPS = [0, 0.8, 0.4, 0.25, 0.15];
const LINE_H = [15, 12.5, 11, 10.5, 9.5];

const DIM_LABELS = ["核心岗位", "主要职责", "典型任务", "核心技能", "职业素养"];

// 中心岗位名折行
function wrapName(text: string, maxW: number) {
  const lines: string[] = [];
  let line = "";
  let w = 0;
  for (const ch of [...text]) {
    const cw = /[\x00-\xff]/.test(ch) ? 0.55 : 1;
    if (line && w + cw > maxW) {
      lines.push(line);
      line = "";
      w = 0;
    }
    line += ch;
    w += cw;
  }
  if (line) lines.push(line);
  return lines.join("\n");
}

function leafCount(n: MatrixNode): number {
  if (!n.children || n.children.length === 0) return Math.max(1, n.value ?? 1);
  return n.children.reduce((a, c) => a + leafCount(c), 0);
}

type Seg = {
  depth: number; // 0=岗位中心盘 1=职责 2=任务 3=技能 4=素养
  a0: number;
  a1: number;
  name: string; // 已折行
  full: string;
};

function pt(r: number, a: number): [number, number] {
  return [CX + r * Math.cos(a * D2R), CY + r * Math.sin(a * D2R)];
}

function sectorPath(r0: number, r1: number, a0: number, a1: number) {
  const [x0o, y0o] = pt(r1, a0);
  const [x1o, y1o] = pt(r1, a1);
  const [x1i, y1i] = pt(r0, a1);
  const [x0i, y0i] = pt(r0, a0);
  return `M${x0o.toFixed(2)},${y0o.toFixed(2)} A${r1.toFixed(2)},${r1.toFixed(2)} 0 0 1 ${x1o.toFixed(2)},${y1o.toFixed(2)} L${x1i.toFixed(2)},${y1i.toFixed(2)} A${r0.toFixed(2)},${r0.toFixed(2)} 0 0 0 ${x0i.toFixed(2)},${y0i.toFixed(2)} Z`;
}

export default function JobFanChart({ job }: { job: MatrixNode }) {
  const [hover, setHover] = useState<{ x: number; y: number; text: string } | null>(null);

  const segs = useMemo<Seg[]>(() => {
    const out: Seg[] = [];
    const total = leafCount(job);
    let a = A0;
    // 中心岗位盘
    out.push({ depth: 0, a0: A0, a1: A0 + SPAN, name: wrapName(job.full, 5), full: job.full });
    for (const duty of job.children ?? []) {
      const dutySpan = (leafCount(duty) / total) * SPAN;
      let ad = a;
      out.push({ depth: 1, a0: a, a1: a + dutySpan, name: duty.name, full: duty.full });
      for (const task of duty.children ?? []) {
        const taskSpan = (leafCount(task) / leafCount(duty)) * dutySpan;
        let at = ad;
        out.push({ depth: 2, a0: ad, a1: ad + taskSpan, name: task.name, full: task.full });
        for (const skill of task.children ?? []) {
          const skillSpan = (leafCount(skill) / leafCount(task)) * taskSpan;
          let ask = at;
          out.push({ depth: 3, a0: at, a1: at + skillSpan, name: skill.name, full: skill.full });
          for (const lit of skill.children ?? []) {
            const litSpan = ((lit.value ?? 1) / leafCount(skill)) * skillSpan;
            out.push({ depth: 4, a0: ask, a1: ask + litSpan, name: lit.name, full: lit.full });
            ask += litSpan;
          }
          at += skillSpan;
        }
        ad += taskSpan;
      }
      a += dutySpan;
    }
    return out;
  }, [job]);

  return (
    <div
      className="relative h-[560px] w-full md:h-[700px]"
      onMouseLeave={() => setHover(null)}
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label={`${job.full}岗位120度扇形展开图`}>
        {/* 左侧维度标注（对准各弧带左缘中径） */}
        {BANDS.map((b, i) => {
          const rMid = (b.r0 + b.r1) / 2 * R;
          const y = CY - rMid;
          return (
            <g key={b.color}>
              <rect x={8} y={y - 12} width={112} height={24} rx={5} fill={b.color} />
              <text x={64} y={y + 4.5} textAnchor="middle" fontSize={13} fontWeight={700} fill="#fff" letterSpacing={1}>
                {DIM_LABELS[i]}
              </text>
              <line x1={126} y1={y} x2={CX - 10} y2={y} stroke={b.color} strokeWidth={1.5} strokeDasharray="5 4" />
              <circle cx={CX - 10} cy={y} r={3.5} fill={b.color} />
            </g>
          );
        })}

        {/* 扇段 */}
        {segs.map((s, i) => {
          const band = BANDS[s.depth];
          const gap = GAPS[s.depth];
          const r0 = band.r0 * R + (s.depth === 0 ? 0 : 1.5);
          const r1 = band.r1 * R - 1;
          const a0 = s.a0 + gap / 2;
          const a1 = s.a1 - gap / 2;
          const mid = (a0 + a1) / 2;
          const rm = (r0 + r1) / 2;
          const [tx, ty] = s.depth === 0 ? pt(40, A0 + SPAN / 2) : pt(rm, mid);
          const lines = s.name.split("\n");
          const lh = LINE_H[s.depth];
          const y0 = -((lines.length - 1) / 2) * lh;
          const dim = hover && hover.text !== s.full && s.depth > 0;
          return (
            <g key={i}>
              <path
                d={sectorPath(s.depth === 0 ? 0 : r0, s.depth === 0 ? 70 : r1, a0, a1)}
                fill={band.color}
                stroke="#fff"
                strokeWidth={1.2}
                opacity={dim ? 0.45 : 1}
                onMouseMove={(e) => {
                  const rect = (e.currentTarget.ownerSVGElement!.parentElement as HTMLElement).getBoundingClientRect();
                  setHover({ x: e.clientX - rect.left, y: e.clientY - rect.top, text: s.full });
                }}
                onMouseLeave={() => setHover(null)}
              />
              <text
                transform={`rotate(${s.depth === 0 ? A0 + SPAN / 2 : mid}, ${tx}, ${ty})`}
                textAnchor="middle"
                fontSize={band.fs}
                fontWeight={s.depth === 0 ? 700 : 400}
                fill="#fff"
                style={{ pointerEvents: "none" }}
              >
                {lines.map((ln, li) => (
                  <tspan key={li} x={tx} y={ty + y0 + li * lh + band.fs * 0.35}>
                    {ln}
                  </tspan>
                ))}
              </text>
            </g>
          );
        })}
      </svg>

      {/* tooltip */}
      {hover && (
        <div
          className="pointer-events-none absolute z-10 max-w-[300px] rounded-lg px-3 py-2 text-xs leading-5 text-slate-200"
          style={{ left: Math.min(hover.x + 14, 600), top: hover.y + 14, background: "rgba(15,23,42,0.94)" }}
        >
          {hover.text}
        </div>
      )}
    </div>
  );
}
