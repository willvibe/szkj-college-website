import Link from "next/link";
import { notFound } from "next/navigation";
import { getMajors, getProjects, getWorks } from "@/lib/queries";
import { getMajorContent } from "@/lib/majorContent";
import Reveal from "@/components/Reveal";
import CourseSystemSection from "@/components/CourseSystemSection";
import AbilityMapSection from "@/components/AbilityMapSection";

export const dynamic = "force-dynamic"; // 后台管理保存后前台即时生效

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const majors = await getMajors();
  const m = majors.find((x) => x.slug === slug);
  return { title: m ? `${m.name} - 专业建设 - 数智科技产业学院` : "专业建设" };
}

export default async function MajorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [majors, projects, works, content] = await Promise.all([
    getMajors(),
    getProjects(),
    getWorks(),
    getMajorContent(slug),
  ]);
  const m = majors.find((x) => x.slug === slug);
  if (!m) notFound();

  const relProjects = projects.filter((p) => p.majorCodes.includes(m.code));
  const relWorks = works.filter((w) => w.majorCodes.includes(m.code));

  const blocks: Array<[string, string]> = [
    ["专业定位", `${m.positioning} —— ${m.tagline}`],
    ["师资力量", m.faculty],
    ["校企合作与产教融合", m.cooperation],
    ["实践教学体系", m.practice],
    ["科研情况", m.research],
  ];

  return (
    <div className="bg-paper pt-28 pb-20">
      <div className="shell">
        <nav className="mono-label text-ink/40" aria-label="breadcrumb">
          <Link href="/" className="hover:text-brand">首页</Link> / <Link href="/#majors" className="hover:text-brand">专业建设</Link> / {m.name}
        </nav>
        <Reveal>
          <p className="mono-label mt-6 text-brand">{m.code} / {m.englishName}</p>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold">{m.name}</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-ink/65">{m.description}</p>
          <div className="mt-6 flex flex-wrap gap-1.5">
            {m.abilities.map((a) => (
              <span key={a} className="tag tag-light">{a}</span>
            ))}
          </div>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {blocks.map(([t, c], i) => (
            <Reveal key={t} delay={i * 60} className={i === 0 ? "lg:col-span-2" : ""}>
              <section className="h-full rounded-xl border border-ink/10 bg-white p-6 md:p-8">
                <h2 className="text-lg font-bold">{t}</h2>
                <p className="mt-3 text-sm leading-7 text-ink/65">{c}</p>
              </section>
            </Reveal>
          ))}
          <Reveal delay={300}>
            <section className="h-full rounded-xl bg-ink p-6 md:p-8 text-white">
              <h2 className="text-lg font-bold">核心课程</h2>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {m.coreCourses.map((c) => (
                  <span key={c} className="tag tag-dark">{c}</span>
                ))}
              </div>
              <h2 className="mt-8 text-lg font-bold">未来岗位</h2>
              <ul className="mt-3 space-y-1.5 text-sm text-white/70">
                {m.careers.map((c) => (
                  <li key={c}>· {c}</li>
                ))}
              </ul>
              <h2 className="mt-8 text-lg font-bold">历年荣誉</h2>
              <ul className="mt-3 space-y-1.5 text-sm text-white/70">
                {m.honors.map((h) => (
                  <li key={h}>· {h}</li>
                ))}
              </ul>
            </section>
          </Reveal>
        </div>

        {/* 01 岗位调研 → 能力图谱旭日图（先形成，后台可编辑） */}
        <AbilityMapSection slug={slug} matrix={content.matrix} training={content.trainingSystem} />

        {/* 02 基于能力图谱逆向设计 → 岗课赛证课程体系（后台可编辑） */}
        {content.courseSystem && <CourseSystemSection system={content.courseSystem} />}

        {relProjects.length > 0 && (
          <Reveal className="mt-16">
            <h2 className="text-2xl font-bold">可参与的真实项目</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {relProjects.map((p) => (
                <div key={p.slug} className="rounded-xl bg-ink p-5 text-white">
                  <p className="mono-label text-white/40">{p.code}</p>
                  <p className="mt-2 font-mono text-sm text-brand-cyan">{p.englishName}</p>
                  <p className="font-semibold">{p.name}</p>
                  <p className="mt-2 text-xs text-white/55">{p.majorCodes.join(" × ")}</p>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        {relWorks.length > 0 && (
          <Reveal className="mt-16">
            <h2 className="text-2xl font-bold">代表作品</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {relWorks.map((w) => (
                <Link key={w.slug} href={`/works/${w.slug}`} className="group flex gap-4 rounded-xl border border-ink/10 bg-white p-4 transition-all hover:border-brand/40 hover:shadow-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={w.cover ?? "/images/brand/logo-round.png"} alt={w.title} className="h-24 w-32 shrink-0 rounded-lg object-cover" />
                  <div>
                    <p className="mono-label text-ink/40">{w.code}</p>
                    <h3 className="mt-1 font-bold group-hover:text-brand transition-colors">{w.title}</h3>
                    <p className="mt-1 line-clamp-2 text-xs text-ink/55">{w.summary}</p>
                  </div>
                </Link>
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
}
