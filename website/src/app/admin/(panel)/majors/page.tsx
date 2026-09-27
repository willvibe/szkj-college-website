import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminMajorsPage() {
  const majors = await prisma.major.findMany({ orderBy: { sort: "asc" } });

  return (
    <div>
      <div className="mb-6">
        <p className="mono-label text-brand">ADMIN · MAJORS</p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight">专业内容管理</h1>
        <p className="mt-1 text-sm text-slate-500">
          管理各专业页内容：基本信息、能力矩阵图谱（旭日图 + 120° 岗位扇形图）、岗课赛证课程体系、人才培养体系图。
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {majors.map((m) => (
          <Link
            key={m.id}
            href={`/admin/majors/${m.slug}`}
            className="rounded-2xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-[10px] tracking-widest text-blue-500">{m.code}</p>
                <h2 className="mt-1 text-lg font-bold">{m.name}</h2>
                <p className="text-xs text-slate-400">{m.englishName} · /{m.slug}</p>
              </div>
              <span className="text-slate-300">→</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <StatusTag ok={!!m.abilityMatrixJson} label="能力矩阵" />
              <StatusTag ok={!!m.courseSystemJson} label="课程体系" />
              <StatusTag ok={!!m.trainingSystemJson} label="培养体系" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function StatusTag({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${
        ok ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"
      }`}
    >
      {label}：{ok ? "已自定义" : "内置"}
    </span>
  );
}
