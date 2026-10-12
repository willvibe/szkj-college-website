import { prisma } from "@/lib/prisma";
import { toggleConsultHandled, deleteConsult } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function AdminConsultPage() {
  const leads = await prisma.consultLead.findMany({ orderBy: { createdAt: "desc" } });
  const pendingCount = leads.filter((l) => !l.handled).length;

  return (
    <div>
      <div className="mb-6">
        <p className="mono-label text-brand">ADMIN · CONSULT LEADS</p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight">招生咨询线索</h1>
        <p className="mt-1 text-sm text-slate-500">
          前台「数智导学 · 智能咨询」表单提交的报考意向，共 {leads.length} 条，待跟进 {pendingCount} 条。
        </p>
      </div>

      {leads.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-10 text-center text-sm text-slate-400">
          暂无咨询线索，考生在官网提交后将显示在这里
        </div>
      ) : (
        <div className="space-y-2.5">
          {leads.map((l) => (
            <div
              key={l.id}
              className={`flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl border p-4 ${
                l.handled ? "border-slate-100 bg-white/60 opacity-75" : "border-blue-200 bg-white"
              }`}
            >
              <span className="font-mono text-[10px] text-slate-400">#{l.id}</span>
              <div className="min-w-24">
                <p className="text-sm font-bold text-slate-800">{l.name}</p>
                <p className="font-mono text-xs text-blue-600">{l.contact}</p>
              </div>
              <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">{l.major}</span>
              <span className="font-mono text-[11px] text-slate-400">
                {l.createdAt.toLocaleString("zh-CN", { hour12: false })}
              </span>
              <div className="ml-auto flex items-center gap-2">
                <form action={toggleConsultHandled}>
                  <input type="hidden" name="id" value={l.id} />
                  <input type="hidden" name="handled" value={l.handled ? "off" : "on"} />
                  <button
                    className={`rounded-lg px-3 py-1.5 text-[11px] font-bold ${
                      l.handled
                        ? "border border-slate-200 text-slate-500 hover:bg-slate-50"
                        : "bg-emerald-600 text-white hover:bg-emerald-700"
                    }`}
                  >
                    {l.handled ? "标记待跟进" : "标记已跟进"}
                  </button>
                </form>
                <form action={deleteConsult}>
                  <input type="hidden" name="id" value={l.id} />
                  <button className="rounded-lg border border-rose-200 px-3 py-1.5 text-[11px] font-bold text-rose-500 hover:bg-rose-50">
                    删除
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
