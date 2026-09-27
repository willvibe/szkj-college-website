"use client";

import { useEffect, useRef, useState } from "react";
import * as echarts from "echarts/core";
import { SunburstChart as EChartsSunburst } from "echarts/charts";
import { TooltipComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { DATA_MATRIX, type MatrixNode } from "@/lib/abilityMatrix";
import JobFanChart from "./JobFanChart";

echarts.use([EChartsSunburst, TooltipComponent, CanvasRenderer]);

type Mode = { type: "full" } | { type: "job"; idx: number };

// levels 结构 1:1 复刻「能力矩阵旭日图代码复用模板.html」（环宽按本专业数据微调：压缩外层、扩展内层）
const LEVELS_FULL = [
  {},
  {
    // 中心盘：岗位群
    r0: "0%", r: "10%",
    itemStyle: { color: "#0000ff", borderWidth: 0 },
    label: { align: "center", rotate: "tangential", fontSize: 13, position: "inside", color: "#ffffff", fontWeight: "bold" },
  },
  {
    // 核心岗位
    r0: "10%", r: "20%",
    itemStyle: { color: "#3300ff" },
    label: { align: "center", rotate: "tangential" },
  },
  {
    // 主要职责
    r0: "20%", r: "34%",
    itemStyle: { color: "#3333ff" },
    label: { align: "center", rotate: "tangential" },
  },
  {
    // 典型任务（径向）
    r0: "34%", r: "56%",
    itemStyle: { color: "#3366ff" },
    label: { align: "center" },
  },
  {
    // 核心技能（径向）
    r0: "56%", r: "82%",
    itemStyle: { color: "#3399ff" },
    label: { align: "center" },
  },
  {
    // 职业素养（径向右对齐）
    r0: "82%", r: "100%",
    itemStyle: { color: "#33ccff" },
    label: { align: "right" },
  },
];

export default function AbilityMatrixSunburst({ data = DATA_MATRIX }: { data?: MatrixNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>({ type: "full" });

  // 核心岗位节点
  const jobs = data.children ?? [];

  // ?job=N 深链：直接进入第 N 个岗位的扇形展开图
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("job");
    const idx = q === null ? NaN : Number(q);
    if (Number.isInteger(idx) && idx >= 0 && idx < jobs.length) setMode({ type: "job", idx });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 全图模式：初始化 / 注销 echarts 实例
  useEffect(() => {
    if (mode.type !== "full") return;
    const el = ref.current;
    if (!el) return;
    const chart = echarts.init(el);
    chart.setOption(
      {
        animation: true,
        animationDuration: 600,
        animationEasing: "cubicOut",
        tooltip: {
          trigger: "item",
          triggerOn: "mousemove|click",
          borderWidth: 0,
          backgroundColor: "rgba(15,23,42,0.94)",
          textStyle: { color: "#e2e8f0", fontSize: 13 },
          extraCssText: "max-width:340px;white-space:normal;line-height:1.6;",
          formatter: (p: { data?: MatrixNode; name?: string }) => {
            const d = p?.data;
            if (!d) return String(p?.name ?? "");
            return d.full.replace(/\n/g, "<br/>");
          },
        },
        series: [
          {
            type: "sunburst",
            data: [data],
            center: ["50%", "50%"],
            radius: [0, "100%"],
            highlightPolicy: "ancestor",
            nodeClick: false,
            sort: null,
            label: { show: true, margin: 8, fontSize: 10, color: "#fff", formatter: "{b}" },
            levels: LEVELS_FULL,
          },
        ],
      },
      true
    );
    chart.on("click", (p) => {
      const idx = jobs.findIndex((j) => j.name === (p as { name?: string }).name);
      if (idx >= 0) setMode({ type: "job", idx });
    });
    const ro = new ResizeObserver(() => chart.resize());
    ro.observe(el);
    return () => {
      ro.disconnect();
      chart.dispose();
    };
  }, [mode.type, data, jobs]);

  const job = mode.type === "job" ? jobs[mode.idx] : null;

  return (
    <div>
      {/* 工具栏：扇形视图下显示返回按钮 */}
      <div className="mb-2 flex min-h-8 items-center justify-between gap-2">
        {mode.type === "job" && job ? (
          <>
            <button
              type="button"
              onClick={() => setMode({ type: "full" })}
              className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600 transition-colors hover:bg-blue-100"
            >
              ← 返回完整能力矩阵
            </button>
            <p className="text-xs font-semibold text-slate-600">
              核心岗位 · {job.full}（120° 扇形展开图）
            </p>
          </>
        ) : (
          <p className="text-[11px] text-slate-400">
            提示：点击「核心岗位」环上的任一岗位扇区，可切换为该岗位的 120° 扇形展开图（左侧标注各层维度名称）。
          </p>
        )}
      </div>

      {mode.type === "job" && job ? (
        <JobFanChart job={job} />
      ) : (
        <div
          ref={ref}
          className="h-[620px] w-full md:h-[760px]"
          role="img"
          aria-label="大数据专业能力矩阵图谱旭日图"
        />
      )}
    </div>
  );
}
