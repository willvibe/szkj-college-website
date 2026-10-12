"use client";

import { useRef, useState } from "react";
import type { MatrixNode } from "@/lib/abilityMatrix";
import { MATRIX_GUIDE_ROWS, MATRIX_HEADERS, MATRIX_SAMPLE_ROWS, rowsToMatrix } from "@/lib/matrixExcel";

/**
 * 能力矩阵 Excel 工具：下载标准模板 / 上传解析导入
 * 解析成功后通过 onImport 回填树形编辑器预览，点"保存"才写库
 */
export default function MatrixExcelTools({ onImport }: { onImport: (tree: MatrixNode, stats: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function downloadTemplate() {
    setMsg(null);
    const XLSX = await import("xlsx");
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([MATRIX_HEADERS, ...MATRIX_SAMPLE_ROWS]);
    ws["!cols"] = [{ wch: 26 }, { wch: 20 }, { wch: 18 }, { wch: 40 }, { wch: 40 }, { wch: 14 }];
    XLSX.utils.book_append_sheet(wb, ws, "能力矩阵");
    const guide = XLSX.utils.aoa_to_sheet(MATRIX_GUIDE_ROWS.map((r) => [r[0] ?? ""]));
    guide["!cols"] = [{ wch: 80 }];
    XLSX.utils.book_append_sheet(wb, guide, "填写说明");
    XLSX.writeFile(wb, "专业能力矩阵模板.xlsx");
  }

  async function importFile(file: File) {
    setMsg(null);
    if (file.size > 5 * 1024 * 1024) {
      setMsg({ ok: false, text: "文件超过 5MB 限制，请检查是否选择了正确的模板文件（仅含能力矩阵表格，不含图片）" });
      return;
    }
    setBusy(true);
    try {
      const XLSX = await import("xlsx");
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      if (!ws) throw new Error("Excel 中没有工作表");
      const rows = XLSX.utils.sheet_to_json<string[]>(ws, { header: 1, defval: "", raw: false });
      const r = rowsToMatrix(rows);
      if (!r.ok) {
        setMsg({ ok: false, text: r.error });
        return;
      }
      const { jobs, duties, tasks, skills, lits } = r.stats;
      onImport(r.tree, `${jobs} 岗位 · ${duties} 职责 · ${tasks} 任务 · ${skills} 技能 · ${lits} 素养`);
      setMsg({ ok: true, text: `解析成功：${jobs} 岗位 · ${duties} 职责 · ${tasks} 任务 · ${skills} 技能 · ${lits} 素养（已载入预览，确认后点"保存"生效）` });
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? `读取失败：${e.message}` : "读取失败，请确认是有效的 .xlsx 文件" });
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="mb-3 rounded-xl border border-blue-100 bg-blue-50/50 p-3">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={downloadTemplate}
          className="rounded-lg border border-blue-300 bg-white px-3 py-1.5 text-[11px] font-bold text-blue-600 hover:bg-blue-50"
        >
          ⬇ 下载 Excel 标准模板
        </button>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="rounded-lg bg-blue-600 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {busy ? "解析中…" : "⬆ 导入 Excel"}
        </button>
        <span className="text-[10px] leading-4 text-slate-500">
          每行一条完整路径（岗位群 → 职业素养），相同上层节点自动聚合；导入后先预览，点"保存"才生效
        </span>
      </div>
      {msg && (
        <p className={`mt-2 rounded-lg px-3 py-1.5 text-[11px] font-semibold ${msg.ok ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
          {msg.text}
        </p>
      )}
      <input
        ref={fileRef}
        type="file"
        accept=".xlsx,.xls"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) importFile(f);
        }}
      />
    </div>
  );
}
