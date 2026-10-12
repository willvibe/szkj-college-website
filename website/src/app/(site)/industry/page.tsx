export const dynamic = "force-dynamic"; // 后台管理保存后前台即时生效

import PageHero from "@/components/PageHero";
import IndustrySection from "@/components/IndustrySection";
import { getProjects, getSteps } from "@/lib/queries";

export const metadata = { title: "产教融合 - 数智科技产业学院" };

export default async function IndustryPage() {
  const [steps, projects] = await Promise.all([getSteps(), getProjects()]);
  return (
    <>
      <PageHero
        index="03"
        en="INDUSTRY × EDUCATION"
        title="产教融合"
        desc="让产业进入教学，让学习发生在真实项目中。以岗位定义能力，以项目组织学习，以作品证明成长。"
      />
      <IndustrySection steps={steps} projects={projects} entry={false} />
    </>
  );
}
