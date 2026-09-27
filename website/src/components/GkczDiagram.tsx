import type { GkczDiagramData, ContentShape } from "@/lib/gkczDiagrams";

// 按宽度估算换行（中文字宽≈字号，ASCII≈0.55倍）
function wrapLines(text: string, size: number, maxW: number): string[] {
  const width = (s: string) => {
    let w = 0;
    for (const ch of s) w += ch.charCodeAt(0) > 0xff ? size : size * 0.55;
    return w;
  };
  if (width(text) <= maxW) return [text];
  const lines: string[] = [];
  let cur = "";
  for (const ch of text) {
    if (width(cur + ch) > maxW) {
      lines.push(cur);
      cur = ch;
    } else {
      cur += ch;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

function Content({ s }: { s: ContentShape }) {
  const lineH = s.size * 1.35;
  const all: string[] = [];
  for (const l of s.lines) all.push(...wrapLines(l, s.size, s.w - 2));
  const startY = s.y + Math.max(0, (s.h - all.length * lineH) / 2);
  return (
    <g>
      {all.map((t, i) => (
        <text key={i} x={s.x} y={startY + lineH * i + s.size} fontSize={s.size} fill="#000">
          {t}
        </text>
      ))}
    </g>
  );
}

export default function GkczDiagram({ data }: { data: GkczDiagramData }) {
  const vb = data.viewBox;
  return (
    <svg
      viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}
      className="h-auto w-full"
      role="img"
      aria-label="岗课赛证专业特征技能要求图（PPT 1:1 矢量重绘）"
      fontFamily='"PingFang SC","Microsoft YaHei",sans-serif'
    >
      {data.shapes.map((s, i) => {
        if (s.kind === "title") {
          return (
            <text key={i} x={s.x} y={s.y + s.h * 0.75} fontSize={28} fontWeight={700} fill={s.color}>
              {s.text}
            </text>
          );
        }
        if (s.kind === "ability") {
          return (
            <text key={i} x={s.x} y={s.y + s.h * 0.75} fontSize={18} fontWeight={700} fill={s.color}>
              {s.text}
            </text>
          );
        }
        if (s.kind === "pill") {
          return (
            <g key={i}>
              <rect x={s.x} y={s.y} width={s.w} height={s.h} rx={5} fill={s.fill} />
              <text
                x={s.x + s.w / 2}
                y={s.y + s.h / 2 + 5.6}
                fontSize={16}
                fontWeight={700}
                fill="#fff"
                textAnchor="middle"
              >
                {s.text}
              </text>
            </g>
          );
        }
        return <Content key={i} s={s} />;
      })}
    </svg>
  );
}
