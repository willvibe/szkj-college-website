"use client";

import { useMemo, useState } from "react";
import Reveal from "./Reveal";
import TrainingBase3D from "./TrainingBase3D";
import { ROOMS } from "@/lib/trainingBase3D";
import type { SpaceRow } from "@/lib/types";

export default function BaseDigitalTwinSection({ spaces }: { spaces: SpaceRow[] }) {
  const [activeCode, setActiveCode] = useState<string>(ROOMS[0].code);
  const room = useMemo(() => ROOMS.find((r) => r.code === activeCode) ?? ROOMS[0], [activeCode]);
  const space = useMemo(() => spaces.find((s) => s.roomNo === room.code), [spaces, room]);

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
                依据实训基地布局图还原空间关系，按各实训室实景照片提取的配色与家具布置建模。
                可旋转、缩放查看整层空间，点击任一房间查看工位、设备与实景照片。
              </p>
            </div>
            <div className="flex shrink-0 items-baseline gap-2">
              <span className="font-mono text-4xl font-black text-cyan-400 sm:text-5xl">{ROOMS.length}</span>
              <span className="font-mono text-base font-bold text-slate-300">个实训空间</span>
            </div>
          </div>
        </Reveal>

        {/* 3D 视图：整宽展示（长条形楼层需要宽画幅） */}
        <Reveal>
          <TrainingBase3D onSelect={setActiveCode} activeCode={activeCode} />
        </Reveal>

        {/* 详情条：房间信息 / 设备与项目 / 实景照片 */}
        <Reveal delay={120} className="mt-6">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur sm:p-8">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span
                  className="rounded px-2.5 py-1 font-mono text-xs font-bold text-white"
                  style={{ background: room.accent }}
                >
                  ROOM {room.code}
                </span>
                <h3 className="text-xl font-bold text-white sm:text-2xl">{room.name}</h3>
              </div>
              <span className="flex items-center gap-1 font-mono text-[11px] font-semibold text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden />
                正常运行中
              </span>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* 指标 + 描述 */}
              <div className="lg:col-span-4">
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { k: "面积", v: space?.area ? `${space.area}㎡` : "—" },
                    { k: "工位", v: space?.capacity ? `${space.capacity}` : room.seats ? `${room.seats}` : "—" },
                    { k: "开间", v: `${room.rect.w.toFixed(1)}×${room.rect.d.toFixed(1)}m` },
                  ].map((item) => (
                    <div key={item.k} className="rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2.5">
                      <p className="text-[10px] text-slate-500">{item.k}</p>
                      <p className="mt-0.5 font-mono text-sm font-bold text-cyan-300">{item.v}</p>
                    </div>
                  ))}
                </div>
                {space && <p className="mt-4 text-xs leading-relaxed text-slate-400">{space.description}</p>}

                {/* 快速切换 */}
                <div className="mt-4">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">快速切换空间</p>
                  <div className="flex flex-wrap gap-1.5">
                    {ROOMS.map((r) => (
                      <button
                        key={r.code}
                        type="button"
                        onClick={() => setActiveCode(r.code)}
                        className={`rounded-lg px-2.5 py-1.5 text-[11px] font-semibold transition-all ${
                          r.code === activeCode
                            ? "text-white shadow-lg"
                            : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                        }`}
                        style={r.code === activeCode ? { background: r.accent } : undefined}
                      >
                        {r.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 设备 / 项目 / 课程 */}
              <div className="grid gap-3 sm:grid-cols-3 lg:col-span-5">
                {space &&
                  [
                    { label: "硬件设备", value: space.equipmentSummary.join("、") },
                    { label: "支撑项目", value: space.projects.join("、") },
                    { label: "核心课程", value: space.courses.join("、") },
                  ].map((row) => (
                    <div key={row.label} className="rounded-xl border border-white/10 bg-slate-900/40 p-3.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{row.label}</p>
                      <p className="mt-1.5 text-xs leading-relaxed text-slate-300">{row.value}</p>
                    </div>
                  ))}
              </div>

              {/* 实景照片 */}
              <div className="lg:col-span-3">
                <p className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <span className="h-1 w-1 rounded-full bg-cyan-400" aria-hidden />
                  实景照片
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {room.photos.map((src) => (
                    <figure key={src} className="overflow-hidden rounded-xl border border-white/10">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt={room.name}
                        className="h-24 w-full object-cover transition-transform duration-500 hover:scale-105"
                        loading="lazy"
                      />
                    </figure>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* 图纸对照 */}
        <Reveal delay={160} className="mt-8">
          <details className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
              <span className="font-mono text-xs uppercase tracking-wider text-slate-400">
                ▸ 实训基地布局图（建模依据）
              </span>
              <span className="font-mono text-[10px] text-slate-500">CAD 原图 · 点击展开</span>
            </summary>
            <figure className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-white p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/base/room-plan.jpg"
                alt="实训基地布局图"
                className="mx-auto w-full max-w-full object-contain"
                loading="lazy"
              />
              <figcaption className="mt-2 text-center font-mono text-[10px] text-slate-400">
                实训基地布局图 · 3D 模型按此还原房间位置、开间与走廊关系
              </figcaption>
            </figure>
          </details>
        </Reveal>
      </div>
    </section>
  );
}