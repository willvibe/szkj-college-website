import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getAdminUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [user, majors, news, stats, works, achievements] = await Promise.all([
    getAdminUser(),
    prisma.major.findMany({ orderBy: { sort: "asc" } }),
    prisma.news.count(),
    prisma.collegeStat.count(),
    prisma.studentWork.count(),
    prisma.achievement.count(),
  ]);

  const cards = [
    { label: "专业", count: majors.length, href: "/admin/majors", desc: "矩阵图谱 / 课程体系 / 基本信息" },
    { label: "新闻动态", count: news, href: "/admin/news", desc: "学院动态稿发布与管理" },
    { label: "首页核心数据", count: stats, href: "/admin/stats", desc: "首页数字指标展示" },
    { label: "成果展示", count: achievements, href: "/admin", desc: "竞赛/教学/活动成果（随前台展示）" },
  ];

  return (
    <div>
      <div className="mb-8">
        <p className="mono-label text-brand">ADMIN · DASHBOARD</p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight">仪表盘</h1>
        <p className="mt-1 text-sm text-slate-500">
          欢迎回来，{user}。在这里管理首页核心数据、各专业能力图谱与课程体系、学院动态新闻。
        </p>
      </div>

      {/* 概览卡 */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-2xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-md"
          >
            <p className="text-3xl font-extrabold text-slate-900">{c.count}</p>
            <p className="mt-1 text-sm font-semibold text-slate-700">{c.label}</p>
            <p className="mt-0.5 text-[11px] leading-4 text-slate-400">{c.desc}</p>
          </Link>
        ))}
      </div>

      {/* 专业快捷入口 */}
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-sm font-bold text-slate-800">专业内容管理</h2>
        <p className="mt-1 text-xs text-slate-400">
          点击进入对应专业编辑：基本信息、能力矩阵图谱（旭日图）、岗课赛证课程体系、人才培养体系图
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {majors.map((m) => (
            <Link
              key={m.id}
              href={`/admin/majors/${m.slug}`}
              className="rounded-xl border border-slate-100 bg-slate-50 p-4 transition-colors hover:border-blue-300 hover:bg-blue-50"
            >
              <p className="font-mono text-[10px] tracking-widest text-blue-500">{m.code}</p>
              <p className="mt-1 text-sm font-bold text-slate-800">{m.name}</p>
              <p className="mt-1 text-[11px] text-slate-400">
                矩阵图谱：{m.abilityMatrixJson ? "已自定义" : "内置"}
                {" · "}课程体系：{m.courseSystemJson ? "已自定义" : "内置"}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
