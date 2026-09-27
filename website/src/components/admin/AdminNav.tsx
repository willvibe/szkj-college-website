"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/admin", label: "仪表盘", icon: "▦" },
  { href: "/admin/stats", label: "首页核心数据", icon: "◈" },
  { href: "/admin/majors", label: "专业内容管理", icon: "◎" },
  { href: "/admin/news", label: "学院动态新闻", icon: "▤" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 space-y-1 px-3 py-4">
      {NAV.map((n) => {
        const active = n.href === "/admin" ? pathname === "/admin" : pathname.startsWith(n.href);
        return (
          <Link
            key={n.href}
            href={n.href}
            className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors ${
              active
                ? "bg-brand/20 font-semibold text-white"
                : "text-slate-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            <span className={active ? "text-cyan-400" : "text-slate-500"} aria-hidden>
              {n.icon}
            </span>
            {n.label}
            {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-400" aria-hidden />}
          </Link>
        );
      })}
    </nav>
  );
}
