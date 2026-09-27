import PageHero from "@/components/PageHero";
import MajorsSection from "@/components/MajorsSection";
import { getMajors, getProjects } from "@/lib/queries";

export const metadata = { title: "专业建设 - 数智科技产业学院" };

export default async function MajorsPage() {
  const [majors, projects] = await Promise.all([getMajors(), getProjects()]);
  return (
    <>
      <PageHero
        index="02"
        en="MAJOR DEVELOPMENT"
        title="专业建设"
        desc="以专业构建能力，以项目打破边界。四个特色专业 + 跨专业真实项目。"
      />
      <MajorsSection majors={majors} projects={projects} entry={false} />
    </>
  );
}
