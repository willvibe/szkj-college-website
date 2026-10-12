"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CarouselRow } from "@/lib/types";

const DURATION = 5600; // 每帧停留（与进度条动画时长一致）

/**
 * hero 全宽海报轮播：铺满整个 hero 作为背景层
 * 文字叠加在右下角，进度/计数胶囊在左下角，互不遮挡
 */
export default function HeroCarousel({ items }: { items: CarouselRow[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const total = items.length;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const go = useCallback(
    (next: number) => {
      setIndex((next + total) % total);
    },
    [total]
  );

  // 无障碍：用户开启"减少动态效果"时停止自动轮播（与全站动画策略一致）
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // 自动播放（悬停暂停 / reduced-motion 停播；恢复播放时进度条随 key 重启，与定时器同步）
  useEffect(() => {
    if (paused || reduced || total <= 1) return;
    timer.current = setTimeout(() => go(index + 1), DURATION);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [index, paused, reduced, go, total]);

  if (total === 0) return null;

  return (
    <div
      className="group/car absolute inset-0 z-0 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="region"
      aria-label="学院海报轮播"
    >
      {/* 海报帧（全部渲染，透明度过渡） */}
      {items.map((it, i) => (
        <div
          key={it.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
            i === index ? "z-10 opacity-100" : "z-0 opacity-0"
          }`}
          aria-hidden={i !== index}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={it.image}
            alt={it.title}
            draggable={false}
            className={`h-full w-full object-cover ${i === index ? "carousel-zoom" : ""}`}
            style={i === index ? { animationPlayState: paused ? "paused" : "running" } : undefined}
          />
        </div>
      ))}

      {/* 内置渐变遮罩：左侧淡出融入 hero 底色（保证左侧文案区可读）+ 顶部/底部轻压暗 */}
      <div
        className="pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(90deg,#0A1120_0%,rgba(10,17,32,0.94)_36%,rgba(10,17,32,0.55)_58%,rgba(10,17,32,0)_82%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(180deg,rgba(10,17,32,0.4)_0%,rgba(10,17,32,0)_30%,rgba(10,17,32,0)_62%,rgba(10,17,32,0.65)_100%)]"
        aria-hidden
      />

      {/* 帧文字（右下角，避开左侧 hero 文案） */}
      {items.map((it, i) => (
        <div
          key={`t-${it.id}`}
          className={`absolute inset-y-0 right-0 z-30 flex w-full max-w-xl items-end p-5 transition-all duration-1000 ease-out sm:p-8 lg:p-12 ${
            i === index ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
          }`}
          aria-hidden={i !== index}
        >
          <div className="ml-auto w-full text-left">
            {it.badge && (
              <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-cyan-300/30 bg-slate-950/60 px-2.5 py-1 font-mono text-[10px] font-semibold tracking-wider text-cyan-300 backdrop-blur-md sm:text-[11px]">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" aria-hidden />
                {it.badge}
              </span>
            )}
            <h3 className="text-lg font-extrabold leading-snug tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] sm:text-2xl lg:text-3xl">
              {it.title}
            </h3>
            {it.subtitle && (
              <p className="mt-2 line-clamp-2 max-w-md text-[11px] leading-relaxed text-slate-200 drop-shadow-[0_1px_8px_rgba(0,0,0,0.9)] sm:text-sm">
                {it.subtitle}
              </p>
            )}
            {it.link && (
              <Link
                href={it.link}
                tabIndex={i === index ? 0 : -1}
                className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-white/95 px-4 py-2 text-xs font-bold text-slate-900 shadow-lg backdrop-blur transition-all hover:bg-white hover:gap-2.5"
              >
                {it.btnText || "了解更多"}
                <span aria-hidden>→</span>
              </Link>
            )}
          </div>
        </div>
      ))}

      {/* 左右切换（悬停显示） */}
      {total > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="上一张"
            className="absolute left-4 top-1/2 z-40 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-slate-950/50 text-white opacity-0 backdrop-blur-md transition-all hover:bg-slate-900/80 group-hover/car:opacity-100 sm:h-10 sm:w-10"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="下一张"
            className="absolute right-4 top-1/2 z-40 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-slate-950/50 text-white opacity-0 backdrop-blur-md transition-all hover:bg-slate-900/80 group-hover/car:opacity-100 sm:h-10 sm:w-10"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* 进度 + 计数（左下角胶囊） */}
      {total > 1 && (
        <div className="absolute bottom-6 left-4 z-40 flex items-center gap-3 rounded-full border border-white/10 bg-slate-950/70 px-3.5 py-2 backdrop-blur-md sm:left-8">
          <div className="flex items-center gap-1.5" role="tablist" aria-label="轮播帧">
            {items.map((it, i) => (
              <button
                key={it.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={it.title}
                onClick={() => go(i)}
                className="group/ind flex h-4 w-6 items-center"
              >
                <span
                  className={`h-1 w-full overflow-hidden rounded-full transition-colors ${
                    i === index ? "bg-white/25" : "bg-white/15 hover:bg-white/30"
                  }`}
                >
                  {/* key 含 paused：悬停暂停后恢复时进度条从 0 重启，与 JS 定时器同一步调 */}
                  {i === index && (
                    <span
                      key={`p-${index}-${paused}-${reduced}`}
                      className="carousel-progress block h-full w-full rounded-full bg-cyan-300"
                      style={{ animationPlayState: paused || reduced ? "paused" : "running" }}
                    />
                  )}
                </span>
              </button>
            ))}
          </div>
          <span className="font-mono text-[10px] tracking-wider text-slate-300">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>
      )}
    </div>
  );
}