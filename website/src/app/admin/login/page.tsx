"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "登录失败");
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("网络错误，请重试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink px-4">
      {/* 背景光晕（与前台首页 hero 风格一致） */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-brand/25 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-cyan-500/15 blur-3xl" aria-hidden />
      <div className="grid-pattern absolute inset-0 opacity-40" aria-hidden />

      <div className="relative z-10 w-full max-w-md">
        {/* 品牌标识（与前台 Header 同款） */}
        <div className="mb-8 flex flex-col items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/brand/logo-round.png" alt="数智科技产业学院徽标" className="h-16 w-16" />
          <p className="mt-4 text-xs font-medium tracking-wider text-slate-400">
            济南幼儿师范高等专科学校
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white">数智科技产业学院</h1>
          <span className="mt-2 rounded bg-brand/20 px-2 py-0.5 font-mono text-[10px] tracking-[0.25em] text-cyan-400">
            ADMIN CONSOLE · 后台管理
          </span>
        </div>

        <form onSubmit={onSubmit} className="glass-panel rounded-2xl p-8">
          <label className="block text-xs font-semibold text-slate-300">
            用户名
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              className="mt-1.5 w-full rounded-lg border border-white/10 bg-ink/70 px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-cyan-400"
            />
          </label>
          <label className="mt-4 block text-xs font-semibold text-slate-300">
            密码
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="mt-1.5 w-full rounded-lg border border-white/10 bg-ink/70 px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-cyan-400"
            />
          </label>
          {error && <p className="mt-3 text-xs text-rose-400">{error}</p>}
          <button
            type="submit"
            disabled={loading || !username || !password}
            className="mt-6 w-full rounded-lg bg-gradient-to-r from-brand to-cyan-600 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand/30 transition-opacity disabled:opacity-40"
          >
            {loading ? "登录中…" : "登 录"}
          </button>
          <p className="mt-4 text-center text-[11px] leading-5 text-slate-500">
            账号由系统管理员分配；连续失败 5 次将锁定 10 分钟
          </p>
        </form>
      </div>
    </div>
  );
}
