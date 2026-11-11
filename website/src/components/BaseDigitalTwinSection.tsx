"use client";

import Reveal from "./Reveal";

/**
 * 实训基地 3D 在线参观（精细化建模版）
 * 独立单文件应用（内嵌 Three.js，含空间目录/自由漫游/逐间导览/实景对照），
 * 以 iframe 嵌入：样式与主站互不干扰，懒加载不阻塞首屏。
 */
export default function BaseDigitalTwinSection() {
  return (
    <section id="digital-twin" className="relative bg-slate-950 py-20 sm:py-24">
      <div className="grid-pattern absolute inset-0 opacity-[0.15]" aria-hidden />
      <div className="shell relative z-10">
        {/* 头部 */}
        <Reveal>
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <div className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-cyan-400">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" aria-hidden />
                DIGITAL TWIN / 05 · 3D 空间
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">实训基地 3D 数字孪生</h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
                依据实训基地布局 CAD 图纸精细建模，逐房间还原桌椅布局、设备与装修细节。
                支持立体/平面总览、自由漫游（WASD）、逐间导览，并可与实景照片对照参观。
              </p>
            </div>
            <div className="flex shrink-0 items-baseline gap-2">
              <span className="font-mono text-4xl font-black text-cyan-400 sm:text-5xl">23</span>
              <span className="font-mono text-base font-bold text-slate-300">个实训空间</span>
            </div>
          </div>
        </Reveal>

        {/* 3D 在线参观：整宽 iframe（滚动到可视区域才加载，不拖慢页面首屏） */}
        <Reveal>
          <div className="overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-cyan-500/10">
            <iframe
              src="/3d/base-tour.html"
              title="实训基地 3D 在线参观"
              loading="lazy"
              allow="fullscreen"
              className="block h-[78vh] min-h-[560px] w-full border-0 bg-[#eef1eb]"
            />
          </div>
        </Reveal>

        {/* 操作提示 */}
        <Reveal delay={120} className="mt-4">
          <p className="text-center font-mono text-[11px] tracking-wider text-slate-500">
            左键旋转 · 右键平移 · 滚轮缩放 · 点击房间查看详情 · 支持全屏与移动端触控
          </p>
        </Reveal>
      </div>
    </section>
  );
}
