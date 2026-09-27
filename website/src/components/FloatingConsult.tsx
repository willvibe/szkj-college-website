"use client";

import { useState } from "react";

export default function FloatingConsult() {
  const [open, setOpen] = useState(false);

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
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

            <span className="mb-1 block font-mono text-xs font-bold uppercase tracking-wider text-blue-600">ADMISSION CONSULTING</span>
            <h3 className="mb-2 text-2xl font-bold text-slate-900">报考意向与专业咨询</h3>
            <p className="mb-6 text-xs text-slate-500">
              填写您的联系方式与心仪专业，学院专职招考老师将在 24 小时内为您解读单招政策、历年录取位次及培养方案。
            </p>

            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                alert("感谢您的咨询！意向信息已成功录入数智科技产业学院招考服务库，专业导师将尽快与您联系。");
                setOpen(false);
              }}
            >
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700" htmlFor="consult-name">考生姓名 / 称呼</label>
                <input
                  id="consult-name"
                  required
                  type="text"
                  placeholder="例如：李同学"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700" htmlFor="consult-tel">联系电话 / 微信</label>
                <input
                  id="consult-tel"
                  required
                  type="tel"
                  placeholder="用于接收招生简章与答疑"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700" htmlFor="consult-major">意向关注专业</label>
                <select
                  id="consult-major"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option>人工智能技术应用</option>
                  <option>大数据技术</option>
                  <option>电子商务</option>
                  <option>金融科技应用</option>
                  <option>尚未决定，需老师推荐</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-blue-600 py-3 text-xs font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-700"
              >
                提交咨询信息
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
