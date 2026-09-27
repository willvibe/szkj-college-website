// Tesseract 基准测试：验证中文识别管线是否可用
const { createWorker } = require("tesseract.js");

async function main() {
  const worker = await createWorker("chi_sim", 1);
  const { data } = await worker.recognize("g:\\数智科技产业学院官网\\_tmp\\ocr\\data-white.png");
  console.log("confidence:", data.confidence);
  console.log("text len:", (data.text || "").length);
  console.log("text sample:", JSON.stringify((data.text || "").slice(0, 300)));
  console.log("words:", (data.words || []).length);
  console.log("lines:", (data.lines || []).length);
  await worker.terminate();
}
main().catch((e) => { console.error("ERR", e.message); process.exit(1); });
