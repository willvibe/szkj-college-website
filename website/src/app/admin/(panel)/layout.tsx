import Link from "next/link";
import { getAdminUser } from "@/lib/auth";
import LogoutButton from "@/components/admin/LogoutButton";
import AdminNav from "@/components/admin/AdminNav";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const user = await getAdminUser();

  return (
    <div className="flex min-h-screen">
      {/* 侧边栏（与前台 Header 深色风格一致） */}
      <aside className="flex w-60 shrink-0 flex-col bg-ink text-slate-300">
        {/* 品牌标识（与前台 Header 同款 logo 结构） */}
        <div className="border-b border-white/10 px-5 py-5">
          <Link href="/admin" className="group flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/brand/logo-round.png"
              alt="数智科技产业学院徽标"
              className="h-10 w-10 shrink-0 transition-transform group-hover:scale-105"
            />
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-[10px] font-medium tracking-wider text-slate-500">
                济南幼儿师范高等专科学校
              </span>
              <span className="mt-0.5 flex items-center gap-1.5 text-sm font-bold text-white">
                数智科技产业学院
              </span>
              <span className="mt-1 w-fit rounded bg-brand/20 px-1.5 py-0.5 font-mono text-[9px] tracking-widest text-cyan-400">
                ADMIN CONSOLE
              </span>
            </div>
          </Link>
        </div>

        <AdminNav />

        <div className="border-t border-white/10 px-5 py-4">
          <p className="text-[11px] text-slate-500">
            当前登录：<span className="font-semibold text-slate-300">{user ?? "-"}</span>
          </p>
          <div className="mt-2 flex items-center gap-3">
            <LogoutButton />
            <Link href="/" target="_blank" className="text-[11px] text-cyan-400 hover:underline">
              查看前台 ↗
            </Link>
          </div>
        </div>
      </aside>

      {/* 主内容 */}
      <div className="min-w-0 flex-1">
        <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
