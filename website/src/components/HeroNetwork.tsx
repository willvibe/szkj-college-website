"use client";

import { useEffect, useRef } from "react";

type Node = {
  id: string;
  label: string;
  kind: "major" | "project";
  x: number; // -1..1
  y: number; // -1..1
};

const NODES: Node[] = [
  { id: "AI", label: "AI", kind: "major", x: -0.42, y: -0.5 },
  { id: "DATA", label: "DATA", kind: "major", x: 0.42, y: -0.5 },
  { id: "COMMERCE", label: "COMMERCE", kind: "major", x: -0.42, y: 0.5 },
  { id: "FINTECH", label: "FINTECH", kind: "major", x: 0.42, y: 0.5 },
  { id: "ANNOTATION", label: "DATA ANNOTATION", kind: "project", x: 0, y: -0.95 },
  { id: "AICONTENT", label: "AI CONTENT", kind: "project", x: -0.95, y: -0.15 },
  { id: "LIVE", label: "LIVE COMMERCE", kind: "project", x: -0.9, y: 0.85 },
  { id: "CROSS", label: "CROSS-BORDER", kind: "project", x: 0, y: 0.98 },
  { id: "ANALYTICS", label: "DATA ANALYTICS", kind: "project", x: 0.9, y: 0.85 },
  { id: "FINDATA", label: "FINANCIAL DATA", kind: "project", x: 0.95, y: -0.15 },
];

const EDGES: Array<[string, string]> = [
  ["AI", "DATA"],
  ["COMMERCE", "FINTECH"],
  ["AI", "COMMERCE"],
  ["DATA", "FINTECH"],
  ["ANNOTATION", "AI"],
  ["ANNOTATION", "DATA"],
  ["AICONTENT", "AI"],
  ["AICONTENT", "COMMERCE"],
  ["LIVE", "COMMERCE"],
  ["LIVE", "DATA"],
  ["CROSS", "COMMERCE"],
  ["CROSS", "DATA"],
  ["ANALYTICS", "DATA"],
  ["ANALYTICS", "FINTECH"],
  ["FINDATA", "FINTECH"],
  ["FINDATA", "DATA"],
];

export default function HeroNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let w = 0;
    let h = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    let hover: string | null = null;
    let t = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const pos = (n: Node) => {
      const cx = w / 2;
      const cy = h / 2;
      const rx = Math.min(w, h) * 0.42;
      // 视差：最大约 5°
      const px = mouse.x * 14 * (n.kind === "major" ? 1 : 1.6);
      const py = mouse.y * 10 * (n.kind === "major" ? 1 : 1.6);
      const float = reduced ? 0 : Math.sin(t / 60 + n.x * 3 + n.y * 2) * 4;
      return { x: cx + n.x * rx + px, y: cy + n.y * rx * 0.82 + py + float };
    };

    const connected = (id: string) => {
      if (!hover) return false;
      return EDGES.some(([a, b]) => (a === hover && b === id) || (b === hover && a === id)) || hover === id;
    };

    const draw = () => {
      t++;
      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;
      ctx.clearRect(0, 0, w, h);

      // 背景网格坐标点
      ctx.fillStyle = "rgba(255,255,255,0.05)";
      const gap = 56;
      for (let gx = gap / 2; gx < w; gx += gap) {
        for (let gy = gap / 2; gy < h; gy += gap) {
          ctx.fillRect(gx, gy, 1.5, 1.5);
        }
      }

      // 连线
      for (const [a, b] of EDGES) {
        const na = NODES.find((n) => n.id === a)!;
        const nb = NODES.find((n) => n.id === b)!;
        const pa = pos(na);
        const pb = pos(nb);
        const hot = hover && (a === hover || b === hover);
        ctx.strokeStyle = hot ? "rgba(41,171,226,0.9)" : "rgba(255,255,255,0.16)";
        ctx.lineWidth = hot ? 1.6 : 1;
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.stroke();
        // 数据流点
        if (!reduced) {
          const p = ((t / 140 + (pa.x + pb.x) / 997) % 1 + 1) % 1;
          const dx = pa.x + (pb.x - pa.x) * p;
          const dy = pa.y + (pb.y - pa.y) * p;
          ctx.fillStyle = hot ? "rgba(163,230,53,0.95)" : "rgba(41,171,226,0.5)";
          ctx.beginPath();
          ctx.arc(dx, dy, hot ? 2.4 : 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 节点
      for (const n of NODES) {
        const p = pos(n);
        const hot = connected(n.id);
        const isMajor = n.kind === "major";
        const r = isMajor ? (hover === n.id ? 30 : 26) : hover === n.id ? 10 : 7;
        if (isMajor) {
          ctx.fillStyle = hot ? "rgba(30,111,217,0.95)" : "rgba(30,111,217,0.75)";
          ctx.strokeStyle = "rgba(41,171,226,0.8)";
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = "#fff";
          ctx.font = "600 12px Consolas, monospace";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(n.label, p.x, p.y);
        } else {
          ctx.fillStyle = hot ? "rgba(163,230,53,0.95)" : "rgba(41,171,226,0.8)";
          ctx.beginPath();
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = hot ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.55)";
          ctx.font = "10px Consolas, monospace";
          ctx.textAlign = "center";
          ctx.fillText(n.label, p.x, p.y + r + 14);
        }
      }

      if (!reduced) raf = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.tx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouse.ty = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      // hover 命中
      hover = null;
      for (const n of NODES) {
        const p = pos(n);
        const r = n.kind === "major" ? 30 : 14;
        if (Math.hypot(e.clientX - rect.left - p.x, e.clientY - rect.top - p.y) < r) {
          hover = n.id;
          break;
        }
      }
      canvas.style.cursor = hover ? "pointer" : "default";
      if (reduced) draw();
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    canvas.addEventListener("pointermove", onMove);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="h-full w-full" aria-label="数智产业网络：AI、DATA、COMMERCE、FINTECH 四大专业与真实项目连接" role="img" />;
}
