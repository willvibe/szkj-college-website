import Link from "next/link";
import { notFound } from "next/navigation";
import { getWorks } from "@/lib/queries";
import Reveal from "@/components/Reveal";

export const dynamic = "force-dynamic"; // 后台管理保存后前台即时生效（不依赖构建期数据库）

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const works = await getWorks();
  const w = works.find((x) => x.slug === slug);
  return { title: w ? `${w.title} - 成果展示 - 数智科技产业学院` : "成果展示" };
}

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const works = await getWorks();
  const w = works.find((x) => x.slug === slug);
  if (!w) notFound();

  const sections: Array<[string, string, React.ReactNode]> = [
    ["01", "OVERVIEW / 项目概述", <p key="o" className="text-sm leading-7 text-ink/70">{w.summary}</p>],
    ["02", "CHALLENGE / 真实问题", <p key="c" className="text-sm leading-7 text-ink/70">{w.challenge}</p>],
    ["03", "BRIEF / 项目任务", <p key="b" className="text-sm leading-7 text-ink/70">{w.brief}</p>],
    [
      "04",
      "PROCESS / 过程",
      <div key="p" className="flex flex-wrap gap-2">
        {w.process.map((p, i) => (
          <span key={p} className="flex items-center gap-2 text-sm text-ink/70">
            {i > 0 && <span className="text-brand">→</span>}
            <span className="rounded-lg border border-ink/15 bg-white px-3 py-1.5">{p}</span>
          </span>
        ))}
      </div>,
    ],
    [
      "05",
      "TOOLS & TECHNOLOGY / 技术",
      <div key="t" className="flex flex-wrap gap-1.5">
        {w.tools.map((t) => (
          <span key={t} className="tag tag-light">{t}</span>
        ))}
        {w.tags.map((t) => (
          <span key={t} className="tag tag-light">{t}</span>
        ))}
      </div>,
    ],
    [
      "06",
      "TEAM / 团队",
      <div key="tm" className="space-y-2">
        {w.team.map((t) => (
          <p key={t.name} className="text-sm text-ink/70">
            <span className="font-semibold text-ink">{t.name}</span>
            <span className="ml-2 font-mono text-[11px] text-brand">{t.major}</span>
            <span className="ml-2 text-ink/50">{t.role}</span>
          </p>
        ))}
        {w.mentor && <p className="text-sm text-ink/50">指导教师：{w.mentor}</p>}
      </div>,
    ],
    [
      "07",
      "OUTPUT / 成果",
      <ul key="ou" className="space-y-1 text-sm text-ink/70">
        {w.outputs.map((o) => (
          <li key={o}>· {o}</li>
        ))}
      </ul>,
    ],
    [
      "08",
      "RESULT / 结果",
      <ul key="r" className="space-y-1 text-sm text-ink/70">
        {w.results.map((r) => (
          <li key={r}>· {r}</li>
        ))}
      </ul>,
    ],
  ];

  return (
    <div className="bg-paper pt-28 pb-20">
      <div className="shell">
        <nav className="mono-label text-ink/40" aria-label="breadcrumb">
          <Link href="/" className="hover:text-brand">首页</Link> / <Link href="/works" className="hover:text-brand">成果展示</Link> / {w.title}
        </nav>

        <Reveal>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="mono-label text-brand">{w.code}</span>
            <span className="tag tag-light">{w.majorCodes.join(" × ")}</span>
            {w.crossMajor && <span className="tag tag-accent">CROSS-MAJOR</span>}
            {w.commercialUse && <span className="tag tag-accent">COMMERCIAL USE</span>}
            {w.type.map((t) => (
              <span key={t} className="tag tag-light">{t}</span>
            ))}
          </div>
          <h1 className="mt-4 text-3xl md:text-5xl font-bold leading-tight">{w.title}</h1>
        </Reveal>

        <Reveal className="mt-8">
          <div className="overflow-hidden rounded-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={w.cover ?? "/images/brand/logo-round.png"} alt={w.title} className="max-h-[520px] w-full object-cover" />
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {sections.map(([no, title, node], i) => (
            <Reveal key={no} delay={(i % 2) * 70} className={i < 2 ? "md:col-span-1" : ""}>
              <section className="h-full rounded-xl border border-ink/10 bg-white p-6">
                <p className="mono-label text-ink/40">{no}</p>
                <h2 className="mt-1 text-base font-bold">{title}</h2>
                <div className="mt-4">{node}</div>
              </section>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10">
          <Link href="/works" className="btn-ghost-light">← 返回作品列表</Link>
        </Reveal>
      </div>
    </div>
  );
}
