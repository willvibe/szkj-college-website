import Link from "next/link";
import Reveal from "./Reveal";
import { ACH_META } from "@/lib/achievements";
import type { AchievementRow, WorkRow } from "@/lib/types";

const CAT_SUMMARY = [
  { key: "COMPETITION", num: "30+", title: "省级以上竞赛奖项", desc: "国家级奖项 4 项，覆盖机器人、计算机设计、直播电商、智慧金融等赛道" },
  { key: "TEACHING", num: "100+", title: "省级及以上项目", desc: "省教学创新团队、精品课程、产教融合示范专业群、考核机构" },
  { key: "ACTIVITY", num: "12天", title: "乡村振兴专项实践", desc: "直播助农、数字夜校、中马国际赛事、校企双选会持续开展" },
];

function AchCard({ a, delay }: { a: AchievementRow; delay?: number }) {
  const meta = ACH_META[a.category];
  return (
    <Reveal delay={delay}>
      <div className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg">
        <div className="mb-3 flex items-center justify-between">
          <span className={`rounded px-2 py-0.5 text-[11px] font-semibold ${meta?.chip ?? "bg-slate-100 text-slate-600"}`}>
            {meta?.label ?? a.category}
          </span>
          <span className="font-mono text-[11px] text-slate-400">{a.year}</span>
        </div>
        {a.cover && (
          <div className="relative mb-4 overflow-hidden rounded-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={a.cover}
              alt={a.title}
              className="h-36 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        )}
        <h4 className="mb-1.5 text-base font-bold leading-snug text-slate-900 transition-colors group-hover:text-blue-600">{a.title}</h4>
        <p className="line-clamp-2 text-xs leading-relaxed text-slate-500">{a.summary}</p>
        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px]">
          <span className="font-mono text-slate-400">{a.results.length} 项成果</span>
          <Link href="/works" className="font-semibold text-blue-600 hover:underline">
            详情 →
          </Link>
        </div>
      </div>
    </Reveal>
  );
}

function WorkTags({ w }: { w: WorkRow }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <span className="tag tag-light">{w.majorCodes.join(" × ")}</span>
      {w.crossMajor && <span className="rounded bg-cyan-50 px-2 py-0.5 font-mono text-[10px] text-cyan-700">CROSS-MAJOR</span>}
      {w.commercialUse && <span className="rounded bg-emerald-50 px-2 py-0.5 font-mono text-[10px] text-emerald-700">COMMERCIAL USE</span>}
    </div>
  );
}

export default function ShowcaseSection({ achievements, works }: { achievements: AchievementRow[]; works: WorkRow[] }) {
  const featuredAch = achievements.filter((a) => a.featured).slice(0, 6);
  const wFeatured = works.filter((w) => w.featured);
  const hero = wFeatured[0];
  const secondary = wFeatured.slice(1, 4);

  return (
    <section id="student-works" className="relative bg-slate-100 py-24">
      <div className="shell">
        {/* Section Header */}
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <Reveal>
            <div className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-blue-600">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600" aria-hidden />
              SHOWCASE / 05 · 成果证明
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">成果展示</h2>
            <p className="mt-2 text-base text-slate-600">
              竞赛获奖 · 教学成果 · 活动成果 · 学生作品，<span className="font-semibold text-slate-800">用成果证明成长。</span>
            </p>
          </Reveal>
          <Reveal delay={100}>
            <p className="max-w-sm text-xs text-slate-500">
              学院的每一项荣誉背后，都是师生在真实项目中的持续投入。这里公开展示可验证的竞赛、教学与社会服务成果。
            </p>
            <Link href="/works" className="mt-3 inline-block text-sm font-semibold text-blue-600 hover:text-blue-700">
              进入成果展示 →
            </Link>
          </Reveal>
        </div>

        {/* 三类成果概览 */}
        <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {CAT_SUMMARY.map((c, i) => (
            <Reveal key={c.key} delay={i * 80}>
              <div className="flex h-full items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="font-mono text-3xl font-black text-blue-600">{c.num}</div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{c.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">{c.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* 精选成果 */}
        <Reveal className="mb-6">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-sm uppercase tracking-widest text-blue-600">FEATURED ACHIEVEMENTS · 精选成果</h3>
            <span className="font-mono text-xs text-slate-400">{achievements.length} ITEMS</span>
          </div>
        </Reveal>
        <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredAch.map((a, i) => (
            <AchCard key={a.slug} a={a} delay={(i % 3) * 70} />
          ))}
        </div>

        {/* 学生作品子模块 */}
        <Reveal>
          <div className="mb-8 flex items-center justify-between rounded-2xl bg-slate-900 px-6 py-5 text-white">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-cyan-400">STUDENT WORKS</span>
              <h3 className="mt-1 text-xl font-bold">学生作品库 · 用作品证明能力</h3>
            </div>
            <span className="hidden font-mono text-xs text-slate-400 sm:block">LEARN BY DOING. PROVE BY CREATING.</span>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Hero work */}
          {hero && (
            <Reveal className="lg:col-span-7">
              <Link
                href={`/works/${hero.slug}`}
                className="group flex h-full flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-xl sm:p-8"
              >
                <div>
                  <div className="mb-4 flex items-center justify-between font-mono text-xs">
                    <span className="rounded bg-blue-100 px-2.5 py-1 font-bold text-blue-700">{hero.code} · 重点交付成果</span>
                    <span className="text-slate-400">{hero.majorCodes.join(" × ")}</span>
                  </div>
                  <div className="relative mb-6 overflow-hidden rounded-2xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={hero.cover ?? "/images/brand/logo-round.png"}
                      alt={hero.title}
                      className="h-64 w-full object-cover transition-transform duration-700 group-hover:scale-[1.03] sm:h-72"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <span className="rounded border border-cyan-400/30 bg-cyan-400/20 px-2 py-0.5 font-mono text-[10px] text-cyan-300">
                        {hero.commercialUse ? "COMMERCIAL USE" : hero.type[0]}
                      </span>
                    </div>
                  </div>
                  <p className="mb-6 text-xs leading-relaxed text-slate-600 sm:text-sm">{hero.summary}</p>
                  <div className="grid grid-cols-2 gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3.5 text-center sm:grid-cols-3">
                    <div>
                      <span className="block font-mono text-[10px] text-slate-400">团队构成</span>
                      <span className="text-xs font-bold text-slate-800">{hero.team[0]?.major ?? "跨专业"}</span>
                    </div>
                    <div>
                      <span className="block font-mono text-[10px] text-slate-400">成果形态</span>
                      <span className="text-xs font-bold text-slate-800">{hero.outputs[0] ?? "作品交付"}</span>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <span className="block font-mono text-[10px] text-slate-400">获奖/成效</span>
                      <span className="line-clamp-1 text-xs font-bold text-emerald-600">{hero.results[0] ?? "—"}</span>
                    </div>
                  </div>
                </div>
                <span className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-xs font-semibold text-white shadow-md shadow-blue-500/20 transition-all group-hover:bg-blue-700">
                  阅读完整 Case Study 复盘报告 →
                </span>
              </Link>
            </Reveal>
          )}

          {/* Secondary works */}
          <div className="flex flex-col gap-6 lg:col-span-5">
            {secondary.map((w, i) => (
              <Reveal key={w.slug} delay={i * 90}>
                <Link
                  href={`/works/${w.slug}`}
                  className="block h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
                >
                  <div className="mb-2 flex items-center justify-between font-mono text-xs">
                    <span className="font-bold text-blue-600">{w.code}</span>
                    <span className="text-slate-400">{w.majorCodes.join(" × ")}</span>
                  </div>
                  <h4 className="mb-1.5 text-base font-bold text-slate-900">{w.title}</h4>
                  <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-slate-500">{w.summary}</p>
                  <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                    <WorkTags w={w} />
                    <span className="font-semibold text-blue-600 hover:underline">查看复盘 →</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal className="mt-12 text-center">
          <Link href="/works" className="btn-ghost-light">
            查看全部成果与作品库 →
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
