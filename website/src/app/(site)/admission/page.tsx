export const dynamic = "force-dynamic"; // 后台管理保存后前台即时生效

import PageHero from "@/components/PageHero";
import AdmissionSection from "@/components/AdmissionSection";
import { getMajors } from "@/lib/queries";

export const metadata = { title: "招生就业 - 数智科技产业学院" };

export default async function AdmissionPage() {
  const majors = await getMajors();
  return (
    <>
      <PageHero
        index="06"
        en="ADMISSION & CAREERS"
        title="招生就业"
        desc="选择学院 → 进入专业 → 学习成长 → 实践 → 就业 / 升学 / 创业。"
      />
      <AdmissionSection majors={majors} entry={false} />
    </>
  );
}
