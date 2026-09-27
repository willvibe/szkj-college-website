// Tesseract 识别能力矩阵图谱白字提取图
const { createWorker } = require("tesseract.js");

async function main() {
  const worker = await createWorker("chi_sim", 1);
  for (const f of [
    { p: "g:\\数智科技产业学院官网\\_tmp\\ocr\\matrix-w-2x-t200.png", s: 2, psm: "11" },
    { p: "g:\\数智科技产业学院官网\\_tmp\\ocr\\matrix-w-2x-t200.png", s: 2, psm: "6" },
    { p: "g:\\数智科技产业学院官网\\_tmp\\ocr\\matrix-w-1x-t215.png", s: 1, psm: "6" },
  ]) {
    await worker.setParameters({ tessedit_pageseg_mode: f.psm });
    const { data } = await worker.recognize(f.p);
    const text = (data.text || "").replace(/\n+/g, " / ").trim();
    console.log(`=== ${f.p.split("\\").pop()} PSM${f.psm} conf=${data.confidence} len=${text.length}`);
    console.log(text.slice(0, 600));
  }
  await worker.terminate();
}
main().catch((e) => { console.error("ERR", e.message); process.exit(1); });
