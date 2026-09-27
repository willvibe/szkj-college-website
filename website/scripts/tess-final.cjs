// 最后一轮：AI 图全分辨率裁剪 + 像素采样 + Tesseract PSM 稀疏模式
const { createWorker } = require("tesseract.js");
const { execSync } = require("node:child_process");
const fs = require("node:fs");

function ps(script) { execSync(`powershell -ExecutionPolicy Bypass -Command "${script}"`, { stdio: "pipe" }); }

async function main() {
  // 1. 从 PPTX 重新提取 image29.png 全分辨率
  ps(`Add-Type -AssemblyName System.IO.Compression.FileSystem; $zip=[System.IO.Compression.ZipFile]::OpenRead('g:\\数智科技产业学院官网\\培养模式&课程体系\\最美职教新示范V7.0 - 副本.pptx'); $e=$zip.GetEntry('ppt/media/image29.png'); $fs=[System.IO.File]::Create('g:\\数智科技产业学院官网\\_tmp\\ocr\\image29-full.png'); $s=$e.Open(); $s.CopyTo($fs); $s.Close(); $fs.Close(); $zip.Dispose(); Write-Output ok`);

  // 2. 全分辨率裁剪 l=62.01% b=10.943%（PowerShell System.Drawing）
  ps(`Add-Type -AssemblyName System.Drawing; $img=[System.Drawing.Image]::FromFile('g:\\数智科技产业学院官网\\_tmp\\ocr\\image29-full.png'); $x0=[int]($img.Width*0.6201); $cw=$img.Width-$x0; $ch=[int]($img.Height*0.89057); $bmp=New-Object System.Drawing.Bitmap($cw,$ch); $g=[System.Drawing.Graphics]::FromImage($bmp); $g.DrawImage($img,(New-Object System.Drawing.Rectangle(0,0,$cw,$ch)),(New-Object System.Drawing.Rectangle($x0,0,$cw,$ch)),[System.Drawing.GraphicsUnit]::Pixel); $g.Dispose(); $bmp.Save('g:\\数智科技产业学院官网\\_tmp\\ocr\\ai-full-crop.png',[System.Drawing.Imaging.ImageFormat]::Png); $bmp.Dispose(); $img.Dispose(); Write-Output cropped`);

  // 3. 采样文字像素（取图中部一行）
  const samplePs = `Add-Type -AssemblyName System.Drawing; $b=New-Object System.Drawing.Bitmap('g:\\数智科技产业学院官网\\_tmp\\ocr\\ai-full-crop.png'); $ys=@(200,600,1000,1400); foreach($y in $ys){ $vals=@(); foreach($x in @(100,300,500,700,900,1100,1300)){ $c=$b.GetPixel($x,$y); $vals += "($($c.R),$($c.G),$($c.B))" }; Write-Output "y=$y : $($vals -join ' ')" }; $b.Dispose()`;
  ps(samplePs);

  // 4. Tesseract：AI 全分辨率裁剪，PSM 11 稀疏
  const worker = await createWorker("chi_sim", 1);
  await worker.setParameters({ tessedit_pageseg_mode: "11" });
  const { data } = await worker.recognize("g:\\数智科技产业学院官网\\_tmp\\ocr\\ai-full-crop.png");
  console.log("=== ai-full-crop PSM11 ===");
  console.log("conf:", data.confidence, "textLen:", (data.text || "").length);
  console.log(JSON.stringify((data.text || "").slice(0, 500)));

  // 5. 大数据图 PSM 11
  await worker.setParameters({ tessedit_pageseg_mode: "11" });
  const r2 = await worker.recognize("g:\\数智科技产业学院官网\\_tmp\\ocr\\data-white.png");
  console.log("=== data-white PSM11 ===");
  console.log("conf:", r2.data.confidence, "textLen:", (r2.data.text || "").length);
  console.log(JSON.stringify((r2.data.text || "").slice(0, 500)));

  await worker.terminate();
}
main().catch((e) => { console.error("ERR", e.message); process.exit(1); });
