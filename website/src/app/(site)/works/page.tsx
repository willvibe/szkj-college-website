export const dynamic = "force-dynamic"; // 后台管理保存后前台即时生效

import PageHero from "@/components/PageHero";
import AchievementBoard from "@/components/AchievementBoard";
import WorksLibrary from "@/components/WorksLibrary";
import Reveal from "@/components/Reveal";
import { getAchievements, getWorks } from "@/lib/queries";

export const metadata = { title: "成果展示 - 数智科技产业学院" };

export default async function ShowcasePage() {
  const [achievements, works] = await Promise.all([getAchievements(), getWorks()]);

  return (
    <div className="min-h-screen bg-slate-100">
      <PageHero
        index="05"
        en="ACHIEVEMENTS & WORKS"
        title="成果展示"
        desc="竞赛获奖 · 教学成果 · 活动成果 · 学生作品，用成果证明成长。"
      />

      {/* 学院成果 */}
      <section className="py-16 md:py-20">
        <div className="shell">
          <Reveal className="mb-8">
            <div className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-blue-600">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600" aria-hidden />
              COLLEGE ACHIEVEMENTS · 学院成果
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">比赛、教学与活动成果</h2>
          </Reveal>
          <AchievementBoard achievements={achievements} />
        </div>
      </section>

      {/* 学生作品子模块 */}
      <section className="pb-24">
        <div className="shell">
          <Reveal className="mb-8">
            <div className="flex items-center justify-between rounded-2xl bg-slate-900 px-6 py-5 text-white">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-cyan-400">STUDENT WORKS</span>
                <h2 className="mt-1 text-xl font-bold sm:text-2xl">学生作品库 · 用作品证明能力</h2>
              </div>
              <span className="hidden font-mono text-xs text-slate-400 sm:block">LEARN BY DOING. PROVE BY CREATING.</span>
            </div>
          </Reveal>
          <WorksLibrary works={works} />
        </div>
      </section>
    </div>
  );
}
