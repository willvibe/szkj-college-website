"use client";

import { useEffect, useRef } from "react";
import * as echarts from "echarts/core";
import { SunburstChart as EChartsSunburst } from "echarts/charts";
import { TooltipComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import type { Ability } from "@/lib/courseSystems";

echarts.use([EChartsSunburst, TooltipComponent, CanvasRenderer]);

const ABILITY_COLORS = ["#2563eb", "#06b6d4", "#8b5cf6"];

type Node = { name: string; value?: number; itemStyle?: { color: string }; children?: Node[] };

function toSunburstData(abilities: Ability[]): Node[] {
  return abilities.map((a, i) => ({
    name: a.name,
    itemStyle: { color: ABILITY_COLORS[i % ABILITY_COLORS.length] },
    children: [
      { name: "课程", children: a.courses.map((c) => ({ name: c, value: 1 })) },
      { name: "岗位", children: a.jobs.map((j) => ({ name: j, value: 1 })) },
      { name: "大赛", children: a.contests.map((c) => ({ name: c, value: 1 })) },
      { name: "证书", children: a.certificates.map((c) => ({ name: c, value: 1 })) },
    ],
  }));
}

export default function SunburstChart({ abilities }: { abilities: Ability[] }) {
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
      series: [
        {
          type: "sunburst",
          data: toSunburstData(abilities),
          radius: ["12%", "92%"],
          center: ["50%", "50%"],
          sort: null,
          nodeClick: false,
          minAngle: 3,
          emphasis: { focus: "ancestor" },
          levels: [
            {},
            {
              r0: "12%",
              r: "36%",
              label: {
                rotate: "tangential",
                fontSize: 12,
                fontWeight: "bold",
                color: "#fff",
                minAngle: 12,
              },
            },
            {
              r0: "36%",
              r: "62%",
              itemStyle: { borderWidth: 2, borderColor: "#0f172a" },
              label: { rotate: "tangential", fontSize: 11, color: "#fff" },
            },
            {
              r0: "62%",
              r: "88%",
              itemStyle: { borderWidth: 1.5, borderColor: "#0f172a" },
              label: {
                rotate: "radial",
                fontSize: 9.5,
                color: "#fff",
                minAngle: 8,
              },
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
  }, [abilities]);

  return <div ref={ref} className="h-[440px] w-full md:h-[520px]" role="img" aria-label="岗课赛证融通能力图谱旭日图" />;
}
