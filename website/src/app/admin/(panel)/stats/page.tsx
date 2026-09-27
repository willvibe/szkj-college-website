import { prisma } from "@/lib/prisma";
import { saveStat, addStat, deleteStat } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

const input = "w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-blue-400";

export default async function AdminStatsPage() {
  const stats = await prisma.collegeStat.findMany({ orderBy: { sort: "asc" } });

  return (
    <div>
      <div className="mb-6">
        <p className="mono-label text-brand">ADMIN · SITE STATS</p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight">首页核心数据</h1>
        <p className="mt-1 text-sm text-slate-500">
          管理首页「学院数据」模块的各项指标（数值 + 后缀 + 标签），保存后前台即时生效。
        </p>
      </div>

      <div className="space-y-3">
        {stats.map((st) => (
          <form
            key={st.id}
            action={saveStat}
            className="grid grid-cols-2 items-end gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-12"
          >
            <input type="hidden" name="id" value={st.id} />
            <label className="md:col-span-2">
              <span className="text-[11px] font-semibold text-slate-500">数值</span>
              <input name="value" defaultValue={st.value} className={input} required />
            </label>
            <label className="md:col-span-1">
              <span className="text-[11px] font-semibold text-slate-500">后缀</span>
              <input name="suffix" defaultValue={st.suffix ?? ""} className={input} placeholder="+" />
            </label>
            <label className="md:col-span-2">
              <span className="text-[11px] font-semibold text-slate-500">标签</span>
              <input name="label" defaultValue={st.label} className={input} required />
            </label>
            <label className="md:col-span-2">
              <span className="text-[11px] font-semibold text-slate-500">英文标签</span>
              <input name="englishLabel" defaultValue={st.englishLabel ?? ""} className={input} />
            </label>
            <label className="md:col-span-3">
              <span className="text-[11px] font-semibold text-slate-500">说明</span>
              <input name="description" defaultValue={st.description ?? ""} className={input} />
            </label>
            <label className="md:col-span-1">
              <span className="text-[11px] font-semibold text-slate-500">排序</span>
              <input name="sort" type="number" defaultValue={st.sort} className={input} />
            </label>
            <div className="col-span-2 flex gap-2 md:col-span-1 md:justify-end">
              <button className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700">
                保存
              </button>
            </div>
          </form>
        ))}
      </div>

      {/* 新增 */}
      <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white/60 p-4">
        <h2 className="text-sm font-bold text-slate-700">新增指标</h2>
        <form action={addStat} className="mt-3 grid grid-cols-2 items-end gap-3 md:grid-cols-12">
          <label className="md:col-span-2">
            <span className="text-[11px] font-semibold text-slate-500">数值 *</span>
            <input name="value" className={input} required placeholder="300" />
          </label>
          <label className="md:col-span-1">
            <span className="text-[11px] font-semibold text-slate-500">后缀</span>
            <input name="suffix" className={input} placeholder="+" />
          </label>
          <label className="md:col-span-2">
            <span className="text-[11px] font-semibold text-slate-500">标签 *</span>
            <input name="label" className={input} required placeholder="实训工位" />
          </label>
          <label className="md:col-span-2">
            <span className="text-[11px] font-semibold text-slate-500">英文标签</span>
            <input name="englishLabel" className={input} placeholder="WORKSTATIONS" />
          </label>
          <label className="md:col-span-3">
            <span className="text-[11px] font-semibold text-slate-500">说明</span>
            <input name="description" className={input} />
          </label>
          <label className="md:col-span-1">
            <span className="text-[11px] font-semibold text-slate-500">排序</span>
            <input name="sort" type="number" defaultValue={99} className={input} />
          </label>
          <div className="col-span-2 md:col-span-1 md:justify-end">
            <button className="w-full rounded-lg border border-blue-600 px-3 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-50">
              新增
            </button>
          </div>
        </form>
      </div>

      <p className="mt-4 text-[11px] text-slate-400">
        提示：删除指标请在下方输入指标 ID 提交（或联系技术支持处理）。
      </p>
      <form action={deleteStat} className="mt-2 flex items-center gap-2">
        <input name="id" type="number" placeholder="指标 ID" className="w-32 rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm" required />
        <button className="rounded-lg border border-rose-300 px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50">
          删除该指标
        </button>
      </form>
    </div>
  );
}
