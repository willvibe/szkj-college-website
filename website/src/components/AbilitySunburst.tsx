"use client";

import { useEffect, useRef } from "react";
import * as echarts from "echarts/core";
import { SunburstChart as EChartsSunburst } from "echarts/charts";
import { TooltipComponent, GraphicComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import type { AbilityMap } from "@/lib/abilityMaps";

echarts.use([EChartsSunburst, TooltipComponent, GraphicComponent, CanvasRenderer]);

const DIMS = [
  { key: "duties", label: "岗位职责", color: "#1D6FB8" },
  { key: "tasks", label: "典型任务", color: "#2E86C1" },
  { key: "skills", label: "核心技能", color: "#0E7C86" },
  { key: "literacies", label: "核心素养", color: "#F69744" },
] as const;

type Node = { name: string; value?: number; itemStyle?: { color: string }; children?: Node[] };

function toData(map: AbilityMap): Node[] {
  return map.jobs.map((j) => ({
    name: j.name,
    itemStyle: { color: "#0070C0" },
    children: DIMS.map((d) => ({
      name: d.label,
      itemStyle: { color: d.color },
      children: j[d.key].map((t) => ({ name: t, value: 1 })),
    })),
  }));
}

export default function AbilitySunburst({ map }: { map: AbilityMap }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const chart = echarts.init(el);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    chart.setOption({
      animation: !reduced,
      tooltip: {
        trigger: "item",
        borderWidth: 0,
        backgroundColor: "rgba(15,23,42,0.92)",
        textStyle: { color: "#e2e8f0", fontSize: 12 },
        extraCssText: "max-width:260px;white-space:normal;",
      },
      graphic: [
        {
          type: "text",
          left: "center",
          top: "middle",
          style: {
            text: map.center.replace(/\n/g, "\n"),
            fill: "#0f172a",
            font: "600 15px 'PingFang SC','Microsoft YaHei',sans-serif",
            lineHeight: 22,
            textAlign: "center",
          },
        },
      ],
      series: [
        {
          type: "sunburst",
          data: toData(map),
          radius: ["24%", "92%"],
          center: ["50%", "50%"],
          sort: null,
          nodeClick: false,
          minAngle: 3,
          emphasis: { focus: "ancestor" },
          label: { color: "#fff" },
          levels: [
            {},
            {
              // 岗位环（1:1）
              r0: "24%",
              r: "44%",
              label: { rotate: "tangential", fontSize: 12, fontWeight: "bold", color: "#fff", minAngle: 14 },
            },
            {
              // 维度环：岗位职责/典型任务/核心技能/核心素养
              r0: "44%",
              r: "64%",
              itemStyle: { borderWidth: 2, borderColor: "#fff" },
              label: { rotate: "tangential", fontSize: 11, fontWeight: "bold", color: "#fff", minAngle: 10 },
            },
            {
              // 明细环
              r0: "64%",
              r: "90%",
              itemStyle: { borderWidth: 1.5, borderColor: "#fff" },
              label: { rotate: "radial", fontSize: 10, color: "#fff", minAngle: 6 },
            },
          ],
        },
      ],
    });

    const onResize = () => chart.resize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      chart.dispose();
    };
  }, [map]);

  return <div ref={ref} className="h-[480px] w-full md:h-[560px]" role="img" aria-label="专业岗位能力素养模型旭日图" />;
}
