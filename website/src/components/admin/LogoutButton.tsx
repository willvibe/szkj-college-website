"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={loading}
      className="rounded-md border border-white/15 px-2.5 py-1 text-[11px] text-slate-300 transition-colors hover:bg-white/10 disabled:opacity-50"
    >
      {loading ? "退出中…" : "退出登录"}
    </button>
  );
}
