"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV = [
  { href: "/", label: "首页", desc: "品牌总览" },
  { href: "/about", label: "学院概况", desc: "30 秒认识学院" },
  { href: "/majors", label: "专业建设", desc: "四大王牌与项目图谱" },
  { href: "/industry", label: "产教融合", desc: "10步育人与真实项目" },
  { href: "/base", label: "实训基地", desc: "1500㎡+ 数字楼层" },
  { href: "/works", label: "成果展示", desc: "竞赛·教学·活动·作品" },
  { href: "/admission", label: "招生就业", desc: "三年成长时间轴" },
  { href: "/news", label: "学院动态", desc: "新闻公告" },
];

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 深色实底：滚动后 / 非首页（内页页面顶部为浅色，需实底保证全站 logo/导航与首页一致）
  const solid = scrolled || !isHome;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 px-4 sm:px-8 ${
        solid ? "py-3 bg-slate-900/90 backdrop-blur-md shadow-xl" : "py-4"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* 品牌标识：03 徽标 + 学院名（全站统一深色视觉） */}
        <Link href="/" className="group flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/brand/logo-03.png"
            alt="数智科技产业学院徽标"
            className="h-9 w-9 transition-transform group-hover:scale-105 md:h-10 md:w-10"
          />
          <span className="text-base font-bold tracking-tight text-white transition-colors sm:text-lg">
            数智科技产业学院
          </span>
        </Link>

        {/* 桌面端胶囊导航 */}
        <nav
          className="hidden items-center gap-1 rounded-full border border-white/10 px-4 py-1.5 shadow-2xl glass-panel lg:flex"
          aria-label="主导航"
        >
          {NAV.map((n) => {
            const active = pathname === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                  active
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA + 移动端按钮 */}
        <div className="flex items-center gap-3">
          <Link
            href="/admission"
            className="group hidden items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-500 hover:to-cyan-500 hover:shadow-cyan-500/30 sm:flex"
          >
            <span>招生咨询</span>
            <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
          <button
            className="rounded-xl border border-white/10 bg-slate-800/80 p-2 text-slate-300 hover:text-white lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="打开菜单"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </div>

      {/* 移动端抽屉 */}
      {open && (
        <div className="mx-auto mt-3 max-w-7xl lg:hidden">
          <div className="glass-panel rounded-2xl border border-white/10 p-5 shadow-2xl">
            <div className="flex flex-col gap-2">
              {NAV.map((n, i) => (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-baseline gap-3 rounded-lg p-2.5 text-sm transition-colors hover:bg-white/10 ${
                    pathname === n.href ? "text-cyan-400 font-semibold" : "text-slate-300"
                  }`}
                >
                  <span className="font-mono text-[10px] text-white/30">{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    {n.label}
                    <span className="ml-2 text-xs text-white/40">{n.desc}</span>
                  </span>
                </Link>
              ))}
              <div className="mt-1 border-t border-white/10 pt-3">
                <Link
                  href="/admission"
                  onClick={() => setOpen(false)}
                  className="block w-full rounded-xl bg-blue-600 py-2.5 text-center text-xs font-semibold text-white"
                >
                  招生快速通道
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
