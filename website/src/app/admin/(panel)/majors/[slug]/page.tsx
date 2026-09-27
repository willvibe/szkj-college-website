import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { parse } from "@/lib/parse";
import { DATA_MATRIX, type MatrixNode } from "@/lib/abilityMatrix";
import { COURSE_SYSTEMS, type CourseSystem } from "@/lib/courseSystems";
import { TRAINING_SYSTEM } from "@/lib/trainingSystem";
import type { TrainingSystem } from "@/lib/majorContent";
import { saveMajorBasic } from "@/app/admin/actions";
import MatrixTreeEditor from "@/components/admin/MatrixTreeEditor";
import CourseSystemEditor from "@/components/admin/CourseSystemEditor";
import TrainingSystemEditor from "@/components/admin/TrainingSystemEditor";

export const dynamic = "force-dynamic";

const input = "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400";
const area = `${input} min-h-24 leading-6`;

export default async function AdminMajorEditPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const m = await prisma.major.findUnique({ where: { slug } });
  if (!m) notFound();

  const abilities = parse<string[]>(m.abilities, []);
  const coreCourses = parse<string[]>(m.coreCourses, []);
  const careers = parse<string[]>(m.careers, []);
  const honors = parse<string[]>(m.honors, []);

  // 三块内容初始值：数据库自定义 → 内置默认 → 空白模板（任何专业都可编辑矩阵图谱）
  const matrix =
    (m.abilityMatrixJson ? parse<MatrixNode | null>(m.abilityMatrixJson, null) : null) ??
    (slug === "data" ? DATA_MATRIX : null) ?? {
      name: `${m.name}\n岗位群`,
      full: `${m.name}岗位群`,
      children: [{ name: "", full: "", children: [] }],
    };
  const courseSystem = (m.courseSystemJson ? parse<CourseSystem | null>(m.courseSystemJson, null) : null) ??
    COURSE_SYSTEMS[slug] ?? null;
  const trainingSystem = (m.trainingSystemJson ? parse<TrainingSystem | null>(m.trainingSystemJson, null) : null) ??
    (slug === "data" ? (TRAINING_SYSTEM as TrainingSystem) : null);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/admin/majors" className="hover:text-blue-600">专业内容管理</Link> / {m.name}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="mono-label text-brand">ADMIN · MAJOR CONTENT</p>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight">{m.name} · 内容编辑</h1>
          <p className="mt-1 text-sm text-slate-500">
            各模块支持表格化编辑与「预览（同前台）」实时查看渲染效果，保存后专业页即时生效。
            <Link href={`/majors/${slug}`} target="_blank" className="ml-1 text-brand hover:underline">
              查看前台 ↗
            </Link>
          </p>
        </div>
      </div>

      {/* 基本信息 */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-sm font-bold text-slate-800">基本信息</h2>
        <form action={saveMajorBasic} className="mt-4 grid gap-4 md:grid-cols-2">
          <input type="hidden" name="id" value={m.id} />
          <input type="hidden" name="slug" value={m.slug} />
          <label>
            <span className="text-[11px] font-semibold text-slate-500">专业名称</span>
            <input name="name" defaultValue={m.name} className={input} required />
          </label>
          <label>
            <span className="text-[11px] font-semibold text-slate-500">英文名</span>
            <input name="englishName" defaultValue={m.englishName} className={input} />
          </label>
          <label>
            <span className="text-[11px] font-semibold text-slate-500">定位（能力标签前缀）</span>
            <input name="positioning" defaultValue={m.positioning} className={input} />
          </label>
          <label>
            <span className="text-[11px] font-semibold text-slate-500">兴趣描述语</span>
            <input name="tagline" defaultValue={m.tagline} className={input} />
          </label>
          <label className="md:col-span-2">
            <span className="text-[11px] font-semibold text-slate-500">专业简介</span>
            <textarea name="description" defaultValue={m.description} className={area} rows={3} />
          </label>
          <label>
            <span className="text-[11px] font-semibold text-slate-500">能力标签（每行一个）</span>
            <textarea name="abilities" defaultValue={abilities.join("\n")} className={area} rows={4} />
          </label>
          <label>
            <span className="text-[11px] font-semibold text-slate-500">核心课程（每行一门）</span>
            <textarea name="coreCourses" defaultValue={coreCourses.join("\n")} className={area} rows={4} />
          </label>
          <label>
            <span className="text-[11px] font-semibold text-slate-500">未来岗位（每行一个）</span>
            <textarea name="careers" defaultValue={careers.join("\n")} className={area} rows={4} />
          </label>
          <label>
            <span className="text-[11px] font-semibold text-slate-500">历年荣誉（每行一项）</span>
            <textarea name="honors" defaultValue={honors.join("\n")} className={area} rows={4} />
          </label>
          <label>
            <span className="text-[11px] font-semibold text-slate-500">校企合作与产教融合</span>
            <textarea name="cooperation" defaultValue={m.cooperation} className={area} rows={3} />
          </label>
          <label>
            <span className="text-[11px] font-semibold text-slate-500">实践教学体系</span>
            <textarea name="practice" defaultValue={m.practice} className={area} rows={3} />
          </label>
          <label>
            <span className="text-[11px] font-semibold text-slate-500">师资力量</span>
            <textarea name="faculty" defaultValue={m.faculty} className={area} rows={3} />
          </label>
          <label>
            <span className="text-[11px] font-semibold text-slate-500">科研情况</span>
            <textarea name="research" defaultValue={m.research} className={area} rows={3} />
          </label>
          <div className="md:col-span-2">
            <button className="rounded-lg bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-700">
              保存基本信息
            </button>
          </div>
        </form>
      </section>

      {/* 能力矩阵图谱：树形编辑 + 预览（所有专业可编辑） */}
      <MatrixTreeEditor id={m.id} slug={m.slug} initial={matrix} />

      {/* 岗课赛证课程体系：卡片编辑 + 预览 */}
      {courseSystem && <CourseSystemEditor id={m.id} slug={m.slug} initial={courseSystem} />}

      {/* 人才培养体系图：分块编辑 + 预览 */}
      {trainingSystem ? (
        <TrainingSystemEditor id={m.id} slug={m.slug} initial={trainingSystem} />
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-6 text-center text-xs text-slate-400">
          本专业暂无人才培养体系图数据
        </div>
      )}
    </div>
  );
}
