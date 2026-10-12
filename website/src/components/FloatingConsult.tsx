"use client";

import { useActionState, useEffect, useState } from "react";
import { submitConsult, type ConsultState } from "@/lib/consultAction";

export default function FloatingConsult() {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState<ConsultState, FormData>(submitConsult, null);

  // Esc 关闭
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  // 提交成功：延迟自动关闭
  useEffect(() => {
    if (state?.ok) {
      const t = setTimeout(() => {
        setOpen(false);
      }, 2600);
      return () => clearTimeout(t);
    }
  }, [state, setOpen]);

  return (
    <>
      {/* Floating Quick Consultant Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-full border border-white/20 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 px-4 py-3 text-xs font-semibold text-white shadow-2xl transition-all hover:scale-105 active:scale-95"
        >
          <span className="h-2 w-2 rounded-full bg-cyan-300 animate-ping" aria-hidden />
          <span>数智导学 · 智能咨询</span>
        </button>
      </div>

      {/* Modal: 招生与专业咨询弹窗 */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false); // 点遮罩关闭
          }}
        >
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-700"
              aria-label="关闭"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {state?.ok ? (
              <div className="py-10 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
                  <svg className="h-7 w-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900">提交成功</h3>
                <p className="mx-auto mt-2 max-w-xs text-xs leading-5 text-slate-500">
                  您的咨询信息已录入学院招考服务库，专职招考老师将在 24 小时内与您联系。也可直接拨打 0531-87207750。
                </p>
              </div>
            ) : (
              <>
                <span className="mb-1 block font-mono text-xs font-bold uppercase tracking-wider text-blue-600">ADMISSION CONSULTING</span>
                <h3 className="mb-2 text-2xl font-bold text-slate-900">报考意向与专业咨询</h3>
                <p className="mb-6 text-xs text-slate-500">
                  填写您的联系方式与心仪专业，学院专职招考老师将在 24 小时内为您解读单招政策、历年录取位次及培养方案。
                </p>

                <form action={action} className="space-y-4">
                  {/* 蜜罐：对用户隐藏，机器人误填则丢弃 */}
                  <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-700" htmlFor="consult-name">考生姓名 / 称呼</label>
                    <input
                      id="consult-name"
                      name="name"
                      required
                      maxLength={40}
                      type="text"
                      placeholder="例如：李同学"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-700" htmlFor="consult-tel">联系电话 / 微信</label>
                    <input
                      id="consult-tel"
                      name="contact"
                      required
                      maxLength={60}
                      type="tel"
                      placeholder="用于接收招生简章与答疑"
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-700" htmlFor="consult-major">意向关注专业</label>
                    <select
                      id="consult-major"
                      name="major"
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option>人工智能技术应用</option>
                      <option>大数据技术</option>
                      <option>电子商务</option>
                      <option>金融科技应用</option>
                      <option>尚未决定，需老师推荐</option>
                    </select>
                  </div>
                  {state?.error && (
                    <p className="rounded-lg bg-rose-50 px-3 py-2 text-[11px] font-semibold text-rose-600">{state.error}</p>
                  )}
                  <button
                    type="submit"
                    disabled={pending}
                    className="w-full rounded-xl bg-blue-600 py-3 text-xs font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-700 disabled:opacity-50"
                  >
                    {pending ? "提交中…" : "提交咨询信息"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
