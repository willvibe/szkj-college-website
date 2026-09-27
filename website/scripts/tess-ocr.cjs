// Tesseract.js 中文识别：能力图谱旭日图（多预处理变体）
const { createWorker } = require("tesseract.js");
const fs = require("node:fs");
const path = require("node:path");

const OUT = "g:\\数智科技产业学院官网\\_tmp\\tess-out.txt";

async function main() {
  const worker = await createWorker("chi_sim", 1);
  const sb = [];
  const variants = [
    { name: "data-white(白字反相3x)", file: "g:\\数智科技产业学院官网\\_tmp\\ocr\\data-white.png", scale: 3, ox: 0, oy: 0 },
    { name: "data-original(原图)", file: "g:\\数智科技产业学院官网\\website\\public\\images\\ppt\\ability-map-data.png", scale: 1, ox: 0, oy: 0 },
    { name: "ai-bw(裁剪二值化3x)", file: "g:\\数智科技产业学院官网\\_tmp\\ocr\\ai-bw.png", scale: 3, ox: 4, oy: 4 },
    { name: "ai-original(原图)", file: "g:\\数智科技产业学院官网\\website\\public\\images\\ppt\\ability-map-ai-model.png", scale: 1, ox: 0, oy: 0 },
  ];
  for (const v of variants) {
    if (!fs.existsSync(v.file)) { sb.push(`### ${v.name}: FILE MISSING`); continue; }
    const { data } = await worker.recognize(v.file);
    sb.push(`### ${v.name} — words: ${(data.words || []).length}`);
    for (const w of data.words || []) {
      const t = (w.text || "").trim();
      if (!t) continue;
      const x = (w.bbox.x0 / v.scale + v.ox).toFixed(1);
      const y = (w.bbox.y0 / v.scale + v.oy).toFixed(1);
      const h = ((w.bbox.y1 - w.bbox.y0) / v.scale).toFixed(1);
      const wpx = ((w.bbox.x1 - w.bbox.x0) / v.scale).toFixed(1);
      sb.push(`x=${x} y=${y} w=${wpx} h=${h} conf=${Math.round(w.confidence)} | ${t}`);
    }
  }
  await worker.terminate();
  fs.writeFileSync(OUT, sb.join("\n"), "utf8");
  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); });
