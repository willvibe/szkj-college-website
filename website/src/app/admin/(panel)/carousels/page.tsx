import { prisma } from "@/lib/prisma";
import { saveCarousel, addCarousel, deleteCarousel } from "@/app/admin/actions";
import CarouselImageField from "@/components/admin/CarouselImageField";

export const dynamic = "force-dynamic";

const input = "w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-blue-400";

export default async function AdminCarouselsPage() {
  const items = await prisma.carouselItem.findMany({ orderBy: { sort: "asc" } });

  return (
    <div>
      <div className="mb-6">
        <p className="mono-label text-brand">ADMIN · HOME CAROUSEL</p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight">首页轮播海报</h1>
        <p className="mt-1 text-sm text-slate-500">
          管理首页顶部海报轮播（建议横版大图 16:9 / 3:2，当前 hero 面板约 560×500）。排序小的在前；下架后前台不再显示。
        </p>
      </div>

      <div className="space-y-4">
        {items.map((it) => (
          <form key={it.id} action={saveCarousel} className="rounded-2xl border border-slate-200 bg-white p-4">
            <input type="hidden" name="id" value={it.id} />
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
              {/* 海报图 */}
              <div className="lg:col-span-4">
                <span className="text-[11px] font-semibold text-slate-500">海报图（ID {it.id}）</span>
                <div className="mt-1">
                  <CarouselImageField name="image" defaultValue={it.image} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 lg:col-span-7 lg:grid-cols-4">
                <label className="col-span-2 lg:col-span-2">
                  <span className="text-[11px] font-semibold text-slate-500">标题 *</span>
                  <input name="title" defaultValue={it.title} className={input} required />
                </label>
                <label>
                  <span className="text-[11px] font-semibold text-slate-500">角标</span>
                  <input name="badge" defaultValue={it.badge ?? ""} className={input} placeholder="专业巡礼 · 01" />
                </label>
                <label>
                  <span className="text-[11px] font-semibold text-slate-500">排序</span>
                  <input name="sort" type="number" defaultValue={it.sort} className={input} />
                </label>
                <label className="col-span-2 lg:col-span-2">
                  <span className="text-[11px] font-semibold text-slate-500">副标题</span>
                  <input name="subtitle" defaultValue={it.subtitle ?? ""} className={input} />
                </label>
                <label>
                  <span className="text-[11px] font-semibold text-slate-500">跳转链接</span>
                  <input name="link" defaultValue={it.link ?? ""} className={input} placeholder="/majors/ai" />
                </label>
                <label>
                  <span className="text-[11px] font-semibold text-slate-500">按钮文字</span>
                  <input name="btnText" defaultValue={it.btnText ?? ""} className={input} placeholder="了解更多" />
                </label>
              </div>
              {/* 操作 */}
              <div className="flex flex-col items-stretch justify-between gap-2 lg:col-span-1 lg:items-end">
                <label className="flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-slate-600">
                  <input type="checkbox" name="active" defaultChecked={it.active} className="h-4 w-4 accent-blue-600" />
                  上架
                </label>
                <div className="flex gap-2">
                  <button className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700">
                    保存
                  </button>
                  <button
                    formAction={deleteCarousel}
                    className="rounded-lg border border-rose-300 px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50"
                  >
                    删除
                  </button>
                </div>
              </div>
            </div>
          </form>
        ))}
      </div>

      {/* 新增 */}
      <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white/60 p-4">
        <h2 className="text-sm font-bold text-slate-700">新增海报</h2>
        <form action={addCarousel} className="mt-3">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <span className="text-[11px] font-semibold text-slate-500">海报图 *</span>
              <div className="mt-1">
                <CarouselImageField name="image" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 lg:col-span-7 lg:grid-cols-4">
              <label className="col-span-2 lg:col-span-2">
                <span className="text-[11px] font-semibold text-slate-500">标题 *</span>
                <input name="title" className={input} required placeholder="人工智能技术应用" />
              </label>
              <label>
                <span className="text-[11px] font-semibold text-slate-500">角标</span>
                <input name="badge" className={input} placeholder="专业巡礼 · 01" />
              </label>
              <label>
                <span className="text-[11px] font-semibold text-slate-500">排序</span>
                <input name="sort" type="number" defaultValue={99} className={input} />
              </label>
              <label className="col-span-2 lg:col-span-2">
                <span className="text-[11px] font-semibold text-slate-500">副标题</span>
                <input name="subtitle" className={input} placeholder="一句话亮点描述" />
              </label>
              <label>
                <span className="text-[11px] font-semibold text-slate-500">跳转链接</span>
                <input name="link" className={input} placeholder="/majors/ai" />
              </label>
              <label>
                <span className="text-[11px] font-semibold text-slate-500">按钮文字</span>
                <input name="btnText" className={input} placeholder="了解更多" />
              </label>
            </div>
            <div className="flex items-end justify-end lg:col-span-1">
              <button className="w-full rounded-lg border border-blue-600 px-3 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-50">
                新增
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}