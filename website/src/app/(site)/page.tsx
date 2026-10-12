import { HeroScene, StatsScene } from "@/components/AboutSection";
import MajorsSection from "@/components/MajorsSection";
import IndustrySection from "@/components/IndustrySection";
import BaseSection from "@/components/BaseSection";
import ShowcaseSection from "@/components/ShowcaseSection";
import AdmissionSection from "@/components/AdmissionSection";
import NewsSection from "@/components/NewsSection";
import { getAchievements, getCarouselItems, getMajors, getNewsList, getProjects, getSpaces, getStats, getSteps, getWorks } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [majors, projects, works, spaces, stats, steps, news, achievements, carousel] = await Promise.all([
    getMajors(),
    getProjects(),
    getWorks(),
    getSpaces(),
    getStats(),
    getSteps(),
    getNewsList(),
    getAchievements(),
    getCarouselItems(),
  ]);

  return (
    <>
      <HeroScene carousel={carousel} />
      <StatsScene stats={stats} />
      <MajorsSection majors={majors} projects={projects} />
      <IndustrySection steps={steps} projects={projects} />
      <BaseSection spaces={spaces} />
      <ShowcaseSection achievements={achievements} works={works} />
      <AdmissionSection majors={majors} />
      <NewsSection news={news} />
    </>
  );
}
