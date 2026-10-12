export const dynamic = "force-dynamic"; // 后台管理保存后前台即时生效

import PageHero from "@/components/PageHero";
import BaseSection from "@/components/BaseSection";
import BaseDigitalTwinSection from "@/components/BaseDigitalTwinSection";
import { getSpaces } from "@/lib/queries";

export const metadata = { title: "实训基地 - 数智科技产业学院" };

export default async function BasePage() {
  const spaces = await getSpaces();
  return (
    <>
      <PageHero
        index="04"
        en="PRODUCTION TRAINING BASE"
        title="生产型实训基地"
        desc="让课程、项目和产业实践发生在同一个空间。这是学院真实项目、教学、训练和学生协作发生的物理空间。"
      />
      <BaseDigitalTwinSection spaces={spaces} />
      <BaseSection spaces={spaces} entry={false} />
    </>
  );
}