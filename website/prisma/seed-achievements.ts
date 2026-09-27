import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const J = (v: unknown) => JSON.stringify(v);

// 成果数据来源：学院官网真实新闻与专业介绍
const ITEMS = [
  {
    slug: "robot-national-2nd",
    code: "ACHV / 001",
    title: "中国高校智能机器人创意大赛国赛二等奖",
    category: "COMPETITION",
    year: "2026",
    summary: "“护星”短距离智能接送及陪护机器人先获山东赛区自制实物组一等奖，晋级国赛后与吉林大学等高校同台竞技，斩获国赛二等奖。",
    detail: "参赛团队依托专业技术反复调试设备、完善方案细节，凭借兼具科技实力与人文关怀的项目设计，在全国赛场圆满完成实物演示与技术答辩。",
    results: J(["山东赛区自制实物组一等奖", "第九届中国高校智能机器人创意大赛国赛二等奖"]),
    cover: "/images/news/robot.jpg",
    featured: true,
    sort: 1,
  },
  {
    slug: "4c-design-awards",
    code: "ACHV / 002",
    title: "中国大学生计算机设计大赛省一 · 国三",
    category: "COMPETITION",
    year: "2026",
    summary: "2025级大数据技术专业团队作品《古建文化数字化保护与创新表达》以两项山东省一等奖晋级国赛，最终斩获全国总决赛三等奖2项。",
    detail: "依托校企共建实训平台，运用大数据采集、分析与可视化技术完成原创性数字化创作，兼具技术深度与文化价值，充分体现校企协同育人成果。",
    results: J(["山东赛区一等奖 2 项（晋级国赛）", "全国总决赛（高职高专组）三等奖 2 项"]),
    cover: "/images/news/4c-prov.jpg",
    featured: true,
    sort: 2,
  },
  {
    slug: "zhengda-first-prize",
    code: "ACHV / 003",
    title: "“正大杯”市场调查与分析大赛山东省一等奖",
    category: "COMPETITION",
    year: "2026",
    summary: "学生团队深入市场一线开展调研，运用数据分析、用户访谈等方法完成《正大牌厚切炸猪排市场表现产品优化升级研究》，获山东省专科组一等奖。",
    detail: "该赛事是教育部认可的全国性学科竞赛，累计吸引全国1400余所高校、超180万名学子参赛，全面考查调查策划、数据建模与团队协作综合能力。",
    results: J(["“正大杯”第十六届山东省专科组选拔赛一等奖"]),
    cover: "/images/news/zhengda.jpg",
    featured: true,
    sort: 3,
  },
  {
    slug: "live-commerce-awards",
    code: "ACHV / 004",
    title: "直播电商技能竞赛矩阵：国赛突破 · 省赛一等奖",
    category: "COMPETITION",
    year: "2023-2025",
    summary: "电子商务专业构建“校赛-省赛-国赛-国际赛”四级竞赛机制，实现全国职业院校技能大赛直播电商赛项三等奖突破，并屡获省级一等奖。",
    detail: "将技能大赛经验持续转化为教学案例，形成“以赛促学、以证强技”的良性循环，近三年累计斩获国家级奖项1项、省级奖项30余项。",
    results: J([
      "全国职业院校技能大赛直播电商赛项三等奖（2023）",
      "山东省“技能兴鲁”直播电商大赛一等奖（2024）",
      "山东省跨境电子商务大赛二等奖（2025）",
    ]),
    cover: "/images/works/live.jpg",
    featured: false,
    sort: 4,
  },
  {
    slug: "smart-finance-awards",
    code: "ACHV / 005",
    title: "“智慧金融”赛项一等奖 · 学院优秀组织奖",
    category: "COMPETITION",
    year: "2024-2025",
    summary: "金融科技应用专业学子在山东省大学生人工智能大赛“智慧金融”赛项中斩获一等奖，第十六届赛事学生获奖9项，学院荣获优秀组织奖。",
    detail: "通过项目式教学与训练营模式参与真实商务数据分析项目，学生在数据分析、方案设计与路演答辩中展现扎实的金融科技素养。",
    results: J(["“智慧金融”赛项一等奖 1 项", "学生累计获奖 9 项 · 学院优秀组织奖"]),
    cover: "/images/works/finance.jpg",
    featured: false,
    sort: 5,
  },
  {
    slug: "teaching-innovation-team",
    code: "ACHV / 006",
    title: "山东省职业教育教学创新团队",
    category: "TEACHING",
    year: "2022",
    summary: "金融科技应用专业教师团队获评2022年山东省职业教育教学创新团队，研究生及以上学历教师占比100%。",
    detail: "团队成员主持或参与省教改项目、省社科规划项目等20余项，参编著作与教材10部，持有专利与软件著作权多项。",
    results: J(["山东省职业教育教学创新团队（金融科技应用专业）", "省级教改/社科项目 20 余项", "参编著作教材 10 部"]),
    cover: "/images/major/fintech-room.jpg",
    featured: false,
    sort: 6,
  },
  {
    slug: "course-group-building",
    code: "ACHV / 007",
    title: "精品课程与产教融合示范专业群建设",
    category: "TEACHING",
    year: "2021-2025",
    summary: "专业教学团队主持建设省级精品资源课1门、校级在线精品课程1门；所在信息商务专业群通过济南市首批产教融合示范专业（群）点培育项目验收。",
    detail: "与凯文教育集团共建《程序设计基础(Python)》《数据可视化技术》等多门课程，企业投入超1000万元软硬件教学环境。",
    results: J(["省级精品资源课 1 门", "济南市首批产教融合示范专业（群）点培育项目验收通过"]),
    cover: "/images/major/data-room.jpg",
    featured: false,
    sort: 7,
  },
  {
    slug: "rural-assessment",
    code: "ACHV / 008",
    title: "获批济南市乡村振兴专项职业能力考核机构",
    category: "TEACHING",
    year: "2026",
    summary: "“新媒体短视频策划与制作”“数据标注”两项考核项目由数智科技产业学院主导申报并成功获批，学院成为专项职业能力考核机构。",
    detail: "此次获批是学校深化校企合作、服务地方发展的生动体现，也为拓展社会培训职能、服务乡村振兴打开了新空间。",
    results: J(["乡村振兴领域专项职业能力考核机构", "“新媒体短视频策划与制作”“数据标注”两项考核项目"]),
    cover: "/images/news/rural.jpg",
    featured: true,
    sort: 8,
  },
  {
    slug: "research-projects",
    code: "ACHV / 009",
    title: "教科研立项与专利成果",
    category: "TEACHING",
    year: "2021-2026",
    summary: "师资团队主持及参与省级及以上项目100余项，承担国家统计局课题、省级课题9项、教育部就业育人项目3项，授权各类专利8项。",
    detail: "多名教师荣获学生竞赛优秀指导教师及“阿里巴巴数据先锋奖”等行业专业奖项，科研反哺教学成效显著。",
    results: J(["省级及以上项目 100 余项", "国家统计局课题 1 项", "授权专利 8 项"]),
    cover: "/images/major/ai-room.jpg",
    featured: false,
    sort: 9,
  },
  {
    slug: "village-practice",
    code: "ACHV / 010",
    title: "“数智启新 智惠同行”乡村振兴专项实践",
    category: "ACTIVITY",
    year: "2026",
    summary: "志愿服务队赴长清区五峰山街道东黄村开展12天专项实践，落地产业助农、科教惠民、文化暖心、思政研学四大主线。",
    detail: "搭建实景直播间为酸枣叶茶等本土农产专场带货，开设少儿公益课堂与村民数字夜校，用专业力量服务乡村振兴。",
    results: J(["12 天乡村振兴专项实践", "数智助农服务站 · 实景直播带货", "少儿课堂 + 村民数字夜校"]),
    cover: "/images/news/village.jpg",
    featured: true,
    sort: 10,
  },
  {
    slug: "nocode-cup",
    code: "ACHV / 011",
    title: "首届“中马凯文杯”零代码项目创作大赛",
    category: "ACTIVITY",
    year: "2026",
    summary: "六支队伍晋级现场答辩决赛，作品立足校园管理、教育服务、数字化办公等真实场景，中马两国师生线上联动共创。",
    detail: "由凯文教育集团山东分公司、马来西亚沙巴“一带一路”高等教育协会主办，学院协办，坚持“真题真做”，搭建中马青年AI交流平台。",
    results: J(["六支队伍晋级决赛 · 现场答辩", "中马国际联动赛事"]),
    cover: "/images/news/cup2.jpg",
    featured: true,
    sort: 11,
  },
  {
    slug: "internship-fair",
    code: "ACHV / 012",
    title: "校企见面会暨综合实训双选会",
    category: "ACTIVITY",
    year: "2026",
    summary: "多家新一代信息技术与数字商业名企进校选拔，提供定向实训工位，24级学子全面开启实训实习新程。",
    detail: "校企双方围绕实训岗位、培养体系与实践保障深入解读，学院持续做实实习全过程跟踪管理服务。",
    results: J(["校企见面会 · 实训双选会（第3期）", "24级电子商务、金融科技应用专业全覆盖"]),
    cover: "/images/news/intern.jpg",
    featured: false,
    sort: 12,
  },
];

async function main() {
  await prisma.achievement.deleteMany();
  for (const item of ITEMS) {
    await prisma.achievement.create({ data: item });
  }
  const count = await prisma.achievement.count();
  console.log(`achievements seeded: ${count}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
