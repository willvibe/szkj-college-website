export const dynamic = "force-dynamic"; // 后台管理保存后前台即时生效

import PageHero from "@/components/PageHero";
import { StatsScene } from "@/components/AboutSection";
import Reveal from "@/components/Reveal";
import { getStats } from "@/lib/queries";

export const metadata = { title: "学院概况 - 数智科技产业学院" };

const INTRO: Array<[string, string]> = [
  [
    "学院定位",
    "济南幼儿师范高等专科学校数智科技产业学院是学校聚焦数字经济发展、深化产教融合与校企合作而设立的特色二级学院。学院精准对接新一代信息技术等产业发展需求，以培养数智素养突出的高技能人才为核心目标，通过有效整合学校教育教学资源与行业企业资源，构建集人才培养、科研创新、社会服务于一体的产业育人平台，为区域产业转型升级和经济高质量发展持续输送高素质专业人才。",
  ],
  [
    "王牌专业：精准对接产业，锁定优质就业",
    "学院开设人工智能技术应用、大数据技术、电子商务、金融科技应用4个特色专业，构建“岗—课—赛—证”融通的课程体系，将企业岗位工作标准、职业技能竞赛标准、职业技能等级证书标准等融入教学内容，确保所学即所用。近三年平均就业率达96.61%，位居同类院校前列。",
  ],
  [
    "师资队伍：名师领衔，双师共育",
    "学院现有专职教师44名，其中省级教学名师1名、省级技术能手1名，更吸纳10余名行业优质企业实战导师加盟，形成校内专任教师与企业导师深度融合的“双师型”教学团队。师资团队主持及参与省级及以上项目100余名，多名教师荣获学生竞赛优秀指导教师及“阿里巴巴数据先锋奖”等行业专业奖项。",
  ],
  [
    "实践平台：校企共建，全链条实战",
    "校企合作建成生产型公共实训中心，建有金融科技实训室、大数据实训室、人工智能实训室、直播电商实训室、创新创业实训室、创新培训中心等生产型实训场所，各实训室均配备企业级软硬件设施，1:1还原行业真实工作场景。与北京凯文教育集团、小鸭集团、山东镁辰智能科技有限公司等知名企业深度合作，共建校外实习实训基地。",
  ],
  [
    "育人成效：双通道发展，前景广阔",
    "学院不断深化“岗—课—赛—证”综合育人，建立多级竞赛机制，获得省级及以上奖项30余项。毕业生广泛就职于银行、证券、金融科技、电子商务、人工智能等领域优质企业，部分学生成功创业，另有众多学生通过专升本进入本科院校继续深造。",
  ],
];

export default async function AboutPage() {
  const stats = await getStats();
  return (
    <>
      <PageHero
        index="01"
        en="ABOUT"
        title="学院概况"
        desc="数智科技产业学院，以数智技术连接真实产业。"
      />
      <section className="bg-paper py-16 md:py-24">
        <div className="shell grid gap-6 md:grid-cols-2">
          {INTRO.map(([t, c], i) => (
            <Reveal key={t} delay={(i % 2) * 70} className={i === 0 ? "md:col-span-2" : ""}>
              <div className="h-full rounded-xl border border-ink/10 bg-white p-6 md:p-8">
                <h2 className="text-lg md:text-xl font-bold">{t}</h2>
                <p className="mt-3 text-sm leading-7 text-ink/65">{c}</p>
              </div>
            </Reveal>
          ))}
          <Reveal delay={140}>
            <div className="h-full rounded-xl bg-ink p-6 md:p-8 text-white">
              <h2 className="text-lg md:text-xl font-bold">未来展望</h2>
              <p className="mt-3 text-sm leading-7 text-white/65">
                数智科技产业学院将继续紧扣学校高质量转型发展要求，以高质量就业为导向，以产教融合为引擎，以社会服务为抓手，不断完善教育教学环境，强化师资队伍，提升人才培养质量，为数字经济产业发展培养更多德智体美劳全面发展的高技能人才。
              </p>
            </div>
          </Reveal>
        </div>
      </section>
      <StatsScene stats={stats} entry={false} />
    </>
  );
}
