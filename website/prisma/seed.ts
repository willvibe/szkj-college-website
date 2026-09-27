import { PrismaClient } from "@prisma/client";
import fs from "node:fs";
import path from "node:path";

const prisma = new PrismaClient();

const IMG_DIR = path.join(__dirname, "../public/images");
const AKA = "https://aka.doubaocdn.com/s/";

async function ensureImage(hash: string, rel: string): Promise<string> {
  const dest = path.join(IMG_DIR, rel);
  if (fs.existsSync(dest)) return `/images/${rel}`;
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const res = await fetch(AKA + hash);
  if (!res.ok) throw new Error(`download failed ${hash}: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  console.log("image saved:", rel);
  return `/images/${rel}`;
}

const J = (v: unknown) => JSON.stringify(v);

type Block = { t: "p" | "h" | "img"; text?: string; src?: string };

async function main() {
  // ---------- 图片本地化 ----------
  const img = {
    aiRoom: await ensureImage("n3hYPCpLEE", "major/ai-room.jpg"),
    aiRoom2: await ensureImage("243kdCUl26", "major/ai-room2.jpg"),
    aiCoop: await ensureImage("FjFLLeeYOK", "major/ai-coop.jpg"),
    aiPractice: await ensureImage("Z8JDSa6i0A", "major/ai-practice.jpg"),
    dataRoom: await ensureImage("w8eXYfZrvs", "major/data-room.jpg"),
    dataPractice: await ensureImage("FbIP7hIKt8", "major/data-practice.jpg"),
    commerceRoom: await ensureImage("CSCKsekG6U", "major/commerce-room.jpg"),
    commerceLive: await ensureImage("WNDKl3bdJg", "major/commerce-live.jpg"),
    commercePractice: await ensureImage("d4XlSkgz6l", "major/commerce-practice.jpg"),
    commerceCamp: await ensureImage("EkVVp38nGj", "major/commerce-camp.jpg"),
    fintechRoom: await ensureImage("bcl2mnYTW8", "major/fintech-room.jpg"),
    fintechRoom2: await ensureImage("6KmcZu2VRd", "major/fintech-room2.jpg"),
    fintechPractice: await ensureImage("tkbbfGVRFo", "major/fintech-practice.jpg"),
    newsSafety: await ensureImage("RLz46YDZX0", "news/safety.jpg"),
    newsSafety2: await ensureImage("fxgggwrMxU", "news/safety2.jpg"),
    newsRobot: await ensureImage("WCbRFXmnwB", "news/robot.jpg"),
    newsRobot2: await ensureImage("0ZSIUVcb5C", "news/robot2.jpg"),
    news4c: await ensureImage("GJrykuwgxA", "news/4c.jpg"),
    news4cProv: await ensureImage("65eKWmeO8W", "news/4c-prov.jpg"),
    newsRural: await ensureImage("vMOWSdTwBg", "news/rural.jpg"),
    newsVillage: await ensureImage("LyP0h6Spq3", "news/village.jpg"),
    newsVillageLive: await ensureImage("imPdGdiNBm", "news/village-live.jpg"),
    newsIntern: await ensureImage("hGZtsYvsk9", "news/intern.jpg"),
    newsIntern2: await ensureImage("c7jCjUvIVK", "news/intern2.jpg"),
    newsCup: await ensureImage("VIi8BxS553", "news/cup.jpg"),
    newsCup2: await ensureImage("o70VeV2GUY", "news/cup2.jpg"),
    newsZhengda: await ensureImage("qIhpeRHjLb", "news/zhengda.jpg"),
    workFinance: await ensureImage("x4IiK2HIqL", "works/finance.jpg"),
    workLive: await ensureImage("Lwv4kxzyTU", "works/live.jpg"),
    workNocode: await ensureImage("gyXcCEtFBj", "works/nocode.jpg"),
  };

  // ---------- 清空旧数据 ----------
  await prisma.industryProjectMajor.deleteMany();
  await prisma.studentWorkMajor.deleteMany();
  await prisma.industryProject.deleteMany();
  await prisma.studentWork.deleteMany();
  await prisma.major.deleteMany();
  await prisma.trainingSpace.deleteMany();
  await prisma.collegeStat.deleteMany();
  await prisma.news.deleteMany();
  await prisma.educationStep.deleteMany();

  // ---------- 专业 ----------
  const ai = await prisma.major.create({
    data: {
      slug: "ai",
      code: "AI",
      name: "人工智能技术应用",
      englishName: "ARTIFICIAL INTELLIGENCE",
      positioning: "智能能力",
      tagline: "让机器理解、生成与行动。",
      description:
        "面向软件与信息技术服务、互联网和相关服务等行业，培养能够从事数据采集与处理、算法模型训练与测试、人工智能应用开发、人工智能系统集成与运维等工作的高技能人才。专业深化产教融合，构建“课堂+实训+企业+竞赛”四位一体培养体系，实现真项目、真环境、真过程的教学模式。",
      abilities: J(["AI APPLICATION", "AIGC", "COMPUTER VISION", "INTELLIGENT SYSTEM", "ROBOTICS", "AI EDUCATION"]),
      coreCourses: J(["Python程序设计", "机器学习基础", "深度学习框架", "计算机视觉", "自然语言处理", "数据预处理"]),
      careers: J(["人工智能工程技术人员", "人工智能训练师", "AI应用开发工程师", "系统集成与运维工程师"]),
      honors: J([
        "全国智能汽车竞赛国赛二等奖 2 项",
        "山东省职业院校技能大赛省赛一等奖 5 项",
        "省级以上二等奖 20 余项",
        "中国高校智能机器人创意大赛国赛二等奖",
      ]),
      cooperation:
        "与凯文教育等优质企业建立紧密战略合作关系，共同构建“校企共育”人才培养模式，引入真实产业项目，确保人才培养目标与产业需求无缝对接。",
      practice:
        "依托校内人工智能实训基地，开展数据标注、模型训练、应用开发等实践项目；与知名AI企业合作引入真实产业项目；组织学生参加全国职业技能大赛、人工智能应用创新大赛等赛事，以赛促学、以赛促教。",
      faculty:
        "专任教师8人，教授1人、副教授2人，聘请企业资深工程师1人担任产业教师；硕士/博士研究生学历占比100%，双师型教师占比100%。",
      research:
        "承担国家统计局课题“异构大数据共享平台自身安全关键问题研究”，省级课题9项，教育部就业育人项目3项。",
      sort: 1,
    },
  });
  const data = await prisma.major.create({
    data: {
      slug: "data",
      code: "DATA",
      name: "大数据技术",
      englishName: "BIG DATA",
      positioning: "数据能力",
      tagline: "让数据成为洞察、判断与决策。",
      description:
        "培养掌握大数据采集、清洗、分析、可视化、平台运维等核心技能，能够胜任大数据平台运维、数据采集与预处理、大数据分析与可视化、数据治理、大数据应用开发等工作的高素质技术技能人才。",
      abilities: J(["DATA COLLECTION", "DATA PROCESSING", "DATA ANALYTICS", "VISUALIZATION", "DATA GOVERNANCE", "DATA APPLICATION"]),
      coreCourses: J(["程序设计基础(Python)", "数据可视化技术", "大数据平台运维", "数据采集与预处理", "数据分析", "数据仓库开发"]),
      careers: J(["大数据分析工程师", "大数据挖掘工程师", "大数据应用开发工程师", "大数据项目经理"]),
      honors: J([
        "省级精品资源课 1 门、校级在线精品课程 1 门",
        "中国大学生计算机设计大赛山东赛区一等奖 2 项（晋级国赛）",
        "中国大学生计算机设计大赛国赛三等奖 2 项",
        "授权各类专利 8 项",
      ]),
      cooperation:
        "与凯文教育集团深度融合共建数智科技产业学院，企业投入超1000万元软硬件教学环境；参与山东省新一代信息技术产教融合共同体，所在信息商务专业群通过济南市首批产教融合示范专业（群）点培育项目验收。",
      practice:
        "实践性教学课时占比平均达58.3%，核心采用PBL项目式教学；构建综合项目30余个、专项训练项目超1000个；学生参与“链家租房数据分析”“直播带货运营”“证券市场数仓开发”等真实或仿真项目实训。",
      faculty:
        "专兼职教师共12人，副高级及以上职称2人（含教授1人），硕士及以上学位6人，“双师型”教师7人，37.5%教师具有3年以上企业工作经历。",
      research:
        "主持或参与教育部供需对接就业育人项目、山东省职业教育教学改革研究项目、省市级科研项目共10项；发表核心期刊论文1篇，授权专利8项。",
      sort: 2,
    },
  });
  const commerce = await prisma.major.create({
    data: {
      slug: "commerce",
      code: "COMMERCE",
      name: "电子商务",
      englishName: "DIGITAL COMMERCE",
      positioning: "数字商业能力",
      tagline: "用技术、内容和数据创造商业价值。",
      description:
        "对接产业、精准育人，培养掌握电子商务运营、内容创作、数据分析、AIGC工具应用等知识与技能，能够从事数据化运营、AI内容制作、智能客服管理、全渠道营销、直播电商运营等岗位的高素质技术技能人才。",
      abilities: J(["DIGITAL COMMERCE", "LIVE COMMERCE", "CROSS-BORDER", "AIGC CONTENT", "DIGITAL MARKETING", "DATA OPERATION"]),
      coreCourses: J(["短视频制作与运营", "直播电商运营", "电商运营基础", "数据分析", "跨境电商实务", "AIGC内容制作"]),
      careers: J(["电商运营", "直播运营", "视觉设计", "数据分析", "跨境电商运营"]),
      honors: J([
        "全国职业院校技能大赛直播电商赛项三等奖（2023）",
        "山东省职业院校技能大赛直播电商赛项二等奖（2024）",
        "山东省跨境电子商务大赛二等奖（2025）",
        "全国高校商业精英挑战赛一等奖（2025）",
        "山东省“技能兴鲁”直播电商大赛一等奖（2024）",
      ]),
      cooperation:
        "与小鸭集团、山东镁辰智能科技、北京凯文教育集团等合作；实行双导师制、工时置换学时、项目化教学、企业顶岗实习；搭建“校中企”“企中校”模式，以岗位KPI决定课程成绩。",
      practice:
        "分层递进实训：基础层依托校内直播基地开展直播训练营；进阶层通过“电商训练营”承接区域农产品上行、教育机构线上推广等项目；实战层选拔优秀学生进入合作企业顶岗实习，参与直播间运营、跨境独立站运营建设。",
      faculty:
        "校内外教师队伍共8人，含博士1名、企业电商资深高级讲师1名；双师型教师占比90%；1名教师获阿里巴巴数据先锋奖。",
      research: "主持参与山东省教育改革研究项目、省社科规划项目等20多项课题；参编多部著作与立体化教材。",
      sort: 3,
    },
  });
  const fintech = await prisma.major.create({
    data: {
      slug: "fintech",
      code: "FINTECH",
      name: "金融科技应用",
      englishName: "FINTECH",
      positioning: "数字金融能力",
      tagline: "用数据与技术理解金融业务。",
      description:
        "面向货币金融服务、资本市场服务、保险业等行业的产品类、运营类、营销类岗位（群），培养能够从事金融科技客户服务、市场营销、商务推广、用户运营、数据分析、风险控制的高技能人才。",
      abilities: J(["FINTECH", "FINANCIAL DATA", "USER OPERATION", "BUSINESS ANALYSIS", "RISK CONTROL", "DIGITAL FINANCE"]),
      coreCourses: J(["金融科技前沿", "金融市场分析", "商务数据分析", "金融营销实务", "用户运营", "风险控制"]),
      careers: J(["金融分析师", "金融大数据分析师", "用户运营", "证券经纪人", "投资理财顾问", "金融产品经理"]),
      honors: J([
        "2022年山东省职业教育教学创新团队",
        "山东省大学生人工智能大赛“智慧金融”赛项一等奖",
        "第十八届山东省职业院校技能大赛三等奖",
        "第十六届山东省大学生人工智能大赛“智慧金融”赛项学生获奖 9 项、优秀组织奖",
      ]),
      cooperation:
        "与凯文教育集团等知名企业深度合作，校企共建课程10余门，形成“校企双主体”协同育人模式；校外建有3家实训实习基地。",
      practice:
        "采用“做中学、学中做”教学模式，通过项目式教学和训练营模式，参与真实的商务数据分析项目，提升实际操作能力。",
      faculty:
        "研究生及以上学历教师占比100%；团队获2022年山东省职业教育教学创新团队；主持或参与省教改项目、省社科规划项目等20余项。",
      research:
        "开展“产教融合视域下金融科技应用人才孵化培育项目实践”“山东省金融与文旅融合发展效率区域规律和驱动因素研究”等科研项目。",
      sort: 4,
    },
  });
  const majors = { ai, data, commerce, fintech };

  // ---------- 产业项目 ----------
  const projects = [
    {
      slug: "data-annotation",
      code: "PROJECT / 001",
      name: "数据标注真实项目",
      englishName: "DATA ANNOTATION",
      summary: "引入企业真实数据标注任务，学生完成数据处理、标注、质检与交付全流程，服务人工智能模型训练。",
      projectType: J(["REAL PROJECT", "WORK-STUDY INTEGRATION"]),
      studentRoles: J(["数据处理", "数据标注", "质检", "交付"]),
      process: J(["任务导入", "规则培训", "数据处理", "标注生产", "质量检验", "成果交付"]),
      outputs: J(["标注数据集", "质检报告", "交付工单"]),
      learningModel: J(["工学结合", "PBL", "企业导师制"]),
      status: "active",
      cover: img.dataPractice,
      majors: [ai, data],
    },
    {
      slug: "ai-content",
      code: "PROJECT / 002",
      name: "AI短剧与智能内容",
      englishName: "AI CONTENT",
      summary: "从脚本创作、AIGC生成、AI视频制作到剪辑与内容运营，学生团队完成智能内容生产与商业应用探索。",
      projectType: J(["REAL PROJECT", "CROSS-MAJOR", "COMMERCIAL USE"]),
      studentRoles: J(["脚本", "AIGC", "AI视频", "剪辑", "内容运营"]),
      process: J(["脚本策划", "AIGC生成", "视频制作", "剪辑包装", "内容运营", "商业应用"]),
      outputs: J(["AI短剧成片", "AIGC内容矩阵", "运营数据报告"]),
      learningModel: J(["跨专业协同", "PBL"]),
      status: "active",
      cover: img.aiPractice,
      majors: [ai, data, commerce],
    },
    {
      slug: "cross-border",
      code: "PROJECT / 003",
      name: "跨境电商",
      englishName: "CROSS-BORDER",
      summary: "面向跨境独立站与平台运营，学生参与选品、商品信息制作、内容生产、平台运营与数据分析。",
      projectType: J(["REAL PROJECT", "CROSS-MAJOR"]),
      studentRoles: J(["选品", "商品信息", "内容", "平台运营", "数据分析"]),
      process: J(["市场选品", "商品上架", "内容制作", "平台运营", "数据复盘"]),
      outputs: J(["独立站店铺", "运营看板", "选品报告"]),
      learningModel: J(["工学结合", "双导师制"]),
      status: "active",
      cover: img.commercePractice,
      majors: [data, commerce],
    },
    {
      slug: "live-commerce",
      code: "PROJECT / 004",
      name: "直播电商",
      englishName: "LIVE COMMERCE",
      summary: "依托校内直播基地承接真实经营任务，学生轮岗直播策划、主播、中控、视觉与数据复盘。",
      projectType: J(["REAL PROJECT", "COMMERCIAL USE"]),
      studentRoles: J(["直播策划", "主播", "中控", "视觉", "数据复盘"]),
      process: J(["直播策划", "场控执行", "真实经营", "数据复盘"]),
      outputs: J(["直播场次", "经营数据", "复盘报告"]),
      learningModel: J(["工时置换学时", "PBL"]),
      status: "active",
      cover: img.commerceLive,
      majors: [commerce, data],
    },
  ];
  for (const [i, p] of projects.entries()) {
    const { majors: ms, ...rest } = p;
    const created = await prisma.industryProject.create({
      data: { ...rest, partnerPublic: false, partnerDisplayName: "行业合作企业", featured: true, sort: i + 1 },
    });
    for (const m of ms) {
      await prisma.industryProjectMajor.create({ data: { projectId: created.id, majorId: m.id } });
    }
  }

  // ---------- 学生作品 ----------
  const works = [
    {
      slug: "huxing-robot",
      code: "WORK / 001",
      title: "“护星”短距离智能接送及陪护机器人",
      summary: "兼具科技实力与人文关怀的智能陪护机器人，获中国高校智能机器人创意大赛国赛二等奖。",
      type: J(["COMPETITION", "REAL PROJECT"]),
      tags: J(["ROBOTICS", "AI APPLICATION", "INTELLIGENT SYSTEM"]),
      challenge: "如何为短距离接送与陪护场景提供安全、可靠、有温度的智能机器人方案。",
      brief: "面向校园与社区陪护场景，完成机器人结构设计、控制系统开发与人文交互设计。",
      process: J(["方案设计", "设备调试", "赛区答辩", "国赛实物演示"]),
      tools: J(["嵌入式控制", "传感器融合", "Python", "机械设计"]),
      team: J([{ name: "参赛团队", major: "AI × DATA", role: "结构设计 / 控制开发 / 答辩演示" }]),
      mentor: "专业教师团队",
      course: "智能机器人创意实践",
      outputs: J(["实物机器人", "技术答辩报告"]),
      results: J(["山东赛区自制实物组一等奖", "第九届中国高校智能机器人创意大赛国赛二等奖"]),
      commercialUse: false,
      crossMajor: true,
      cover: img.newsRobot,
      featured: true,
      majors: [ai, data],
    },
    {
      slug: "ancient-architecture-data",
      code: "WORK / 002",
      title: "古建文化数字化保护与创新表达",
      summary: "运用大数据采集、分析与可视化技术完成古建文化原创性数字化创作，省赛一等奖晋级国赛。",
      type: J(["COMPETITION"]),
      tags: J(["DATA ANALYSIS", "VISUALIZATION", "DATA COLLECTION"]),
      challenge: "古建文化资料分散、数字化程度低，如何用数据技术完成保护与创新表达。",
      brief: "依托校企共建实训平台，完成古建数据采集、分析与可视化创作。",
      process: J(["数据采集", "数据清洗", "分析建模", "可视化创作", "省赛答辩", "国赛总决赛"]),
      tools: J(["Python", "数据可视化", "大数据采集"]),
      team: J([
        { name: "郭骁峰", major: "DATA", role: "数据分析" },
        { name: "刘鑫淼", major: "DATA", role: "可视化" },
        { name: "董思琪", major: "DATA", role: "数据采集" },
      ]),
      mentor: "周文挺、张健",
      course: "数据可视化技术",
      outputs: J(["数字化作品", "可视化看板", "研究报告"]),
      results: J(["2026年中国大学生计算机设计大赛山东赛区一等奖 2 项", "全国总决赛三等奖 2 项"]),
      commercialUse: false,
      crossMajor: false,
      cover: img.news4cProv,
      featured: true,
      majors: [data],
    },
    {
      slug: "zhengda-market-research",
      code: "WORK / 003",
      title: "厚切炸猪排市场表现产品优化升级研究",
      summary: "“正大杯”全国大学生市场调查与分析大赛山东省一等奖作品，深入市场一线的数据调研实践。",
      type: J(["COMPETITION"]),
      tags: J(["DATA ANALYSIS", "BUSINESS ANALYSIS"]),
      challenge: "如何基于真实市场数据为品牌产品优化升级提供可执行建议。",
      brief: "深入市场一线开展调研，运用数据分析、用户访谈等方法剖析产品现状与市场痛点。",
      process: J(["调查策划", "数据采集", "建模分析", "报告撰写"]),
      tools: J(["统计分析", "用户访谈", "数据建模"]),
      team: J([
        { name: "魏安奇", major: "DATA", role: "调研统筹" },
        { name: "刘秀云", major: "DATA", role: "数据分析" },
        { name: "林爱羽", major: "COMMERCE", role: "市场洞察" },
        { name: "刘鑫奕", major: "COMMERCE", role: "报告撰写" },
      ]),
      mentor: "周晓旭、王华新",
      outputs: J(["研究报告"]),
      results: J(["“正大杯”第十六届全国大学生市场调查与分析大赛山东省一等奖"]),
      commercialUse: false,
      crossMajor: true,
      cover: img.newsZhengda,
      featured: true,
      majors: [data, commerce],
    },
    {
      slug: "village-live-commerce",
      code: "WORK / 004",
      title: "五峰山街道直播助农专项行动",
      summary: "搭建实景直播间为酸枣叶茶等本土农产专场带货，把数字渠道铺到乡村产业一线。",
      type: J(["SOCIAL IMPACT", "REAL PROJECT"]),
      tags: J(["LIVE", "DIGITAL MARKETING", "AIGC CONTENT"]),
      challenge: "乡村特色林果产业数字化升级存在短板，农产品销路受限。",
      brief: "依托电商专业优势搭建实景直播间，完成场地布景、脚本撰写、实时直播全流程，并向农户传授短视频与直播运营技巧。",
      process: J(["产业调研", "直播间搭建", "专场带货", "技能培训"]),
      tools: J(["直播电商运营", "短视频拍摄", "线上引流"]),
      team: J([{ name: "“数智启新，智惠同行”志愿服务队", major: "COMMERCE × DATA", role: "直播 / 拍摄 / 运营" }]),
      outputs: J(["专场直播", "农户培训", "调研材料"]),
      results: J(["12 天乡村振兴专项实践圆满落地", "数字渠道拓宽农产品销路"]),
      commercialUse: false,
      crossMajor: true,
      cover: img.newsVillageLive,
      featured: true,
      majors: [commerce, data],
    },
    {
      slug: "nocode-creation",
      code: "WORK / 005",
      title: "首届“中马凯文杯”零代码项目创作作品",
      summary: "立足校园管理、教育服务、数字化办公等真实场景，用零代码工具完成系统搭建与功能落地。",
      type: J(["COMPETITION", "PBL"]),
      tags: J(["DATA APPLICATION", "INNOVATION"]),
      challenge: "如何用零代码工具快速响应真实场景的数字化需求。",
      brief: "面向大数据技术等专业征集创新项目，六支队伍晋级决赛并完成现场答辩。",
      process: J(["需求分析", "系统搭建", "流程设计", "功能落地", "现场答辩"]),
      tools: J(["零代码平台", "流程设计"]),
      team: J([{ name: "六支决赛团队", major: "DATA × AI", role: "开发与答辩" }]),
      outputs: J(["零代码应用系统", "流程方案"]),
      results: J(["首届“中马凯文杯”零代码项目创作大赛获奖", "中马青年AI交流共创平台实践"]),
      commercialUse: false,
      crossMajor: true,
      cover: img.newsCup2,
      featured: false,
      majors: [data, ai],
    },
    {
      slug: "smart-finance",
      code: "WORK / 006",
      title: "“智慧金融”赛项系列作品",
      summary: "山东省大学生人工智能大赛“智慧金融”赛项一等奖作品，数据与技术理解金融业务的典型实践。",
      type: J(["COMPETITION"]),
      tags: J(["FINANCIAL DATA", "BUSINESS ANALYSIS", "RISK CONTROL"]),
      challenge: "如何用数据与技术手段解析真实金融业务问题。",
      brief: "围绕智慧金融场景完成数据分析、方案设计与路演答辩。",
      process: J(["场景调研", "数据分析", "方案设计", "路演答辩"]),
      tools: J(["商务数据分析", "金融建模"]),
      team: J([{ name: "金融科技参赛团队", major: "FINTECH", role: "分析 / 设计 / 答辩" }]),
      outputs: J(["分析报告", "路演方案"]),
      results: J(["山东省大学生人工智能大赛“智慧金融”赛项一等奖", "学生获奖 9 项、学院优秀组织奖"]),
      commercialUse: false,
      crossMajor: false,
      cover: img.workFinance,
      featured: false,
      majors: [fintech],
    },
    {
      slug: "live-commerce-skill",
      code: "WORK / 007",
      title: "全国职业院校技能大赛直播电商赛项作品",
      summary: "实现国赛突破的直播电商实战作品，完整覆盖策划、主播、中控、视觉与数据复盘岗位链。",
      type: J(["COMPETITION", "REAL PROJECT"]),
      tags: J(["LIVE", "DATA OPERATION"]),
      challenge: "以真实经营指标检验直播电商全岗位协同能力。",
      brief: "团队轮岗完成直播策划、执行与复盘，形成可复制的直播运营方法论。",
      process: J(["直播策划", "岗位轮训", "实战执行", "数据复盘"]),
      tools: J(["直播电商运营", "数据复盘"]),
      team: J([{ name: "直播电商竞赛团队", major: "COMMERCE", role: "全岗位协同" }]),
      outputs: J(["直播方案", "复盘报告"]),
      results: J(["全国职业院校技能大赛直播电商赛项三等奖", "山东省“技能兴鲁”直播电商大赛一等奖"]),
      commercialUse: false,
      crossMajor: false,
      cover: img.workLive,
      featured: false,
      majors: [commerce],
    },
    {
      slug: "ai-short-drama",
      code: "WORK / 008",
      title: "AI短剧创作与AIGC内容矩阵",
      summary: "学生团队完成脚本、AIGC生成、AI视频与剪辑包装的短剧成片，探索内容商业应用。",
      type: J(["INNOVATION", "COMMERCIAL"]),
      tags: J(["AIGC", "VIDEO", "AI CONTENT"]),
      challenge: "如何用AIGC工具链稳定产出可运营的短剧内容。",
      brief: "以真实内容运营为目标，完成AI短剧从脚本到成片的全流程生产。",
      process: J(["脚本", "AIGC", "AI视频", "剪辑", "内容运营"]),
      tools: J(["AIGC工具链", "视频剪辑", "内容运营平台"]),
      team: J([{ name: "AI内容创作团队", major: "AI × COMMERCE", role: "创作 / 制作 / 运营" }]),
      outputs: J(["短剧成片", "内容矩阵账号"]),
      results: J(["内容矩阵持续运营", "商业应用探索中"]),
      commercialUse: true,
      crossMajor: true,
      cover: img.aiPractice,
      featured: false,
      majors: [ai, commerce],
    },
  ];
  for (const [i, w] of works.entries()) {
    const { majors: ms, ...rest } = w;
    const created = await prisma.studentWork.create({ data: { ...rest, sort: i + 1 } });
    for (const m of ms) {
      await prisma.studentWorkMajor.create({ data: { workId: created.id, majorId: m.id } });
    }
  }

  // ---------- 实训空间 ----------
  const spaces = [
    { roomNo: "T-01", name: "人工智能实训室", spaceType: "DATA / AI", area: 260, capacity: 48, majors: J(["AI", "DATA"]), projects: J(["数据标注", "模型训练", "智能机器人"]), courses: J(["机器学习基础", "计算机视觉", "深度学习框架"]), description: "满足从数据预处理、模型训练到应用部署的全流程实训需求，配备48台高性能笔记本。", equipmentSummary: J(["高性能笔记本 48 台", "企业级AI开发平台", "录播系统"]), cover: img.aiRoom, posX: 0, posY: 0, width: 46, height: 42, sort: 1 },
    { roomNo: "T-02", name: "大数据实训室", spaceType: "DATA", area: 280, capacity: 46, majors: J(["DATA", "FINTECH"]), projects: J(["数据分析", "数据可视化", "数仓开发"]), courses: J(["数据可视化技术", "大数据分析", "程序设计基础"]), description: "配备46台高性能台式机，支撑数据分析、可视化与平台运维实训。", equipmentSummary: J(["高性能台式机 46 台", "大数据平台", "网络设备"]), cover: img.dataRoom, posX: 46, posY: 0, width: 34, height: 42, sort: 2 },
    { roomNo: "T-03", name: "直播电商实训室", spaceType: "COMMERCE", area: 220, capacity: 40, majors: J(["COMMERCE"]), projects: J(["直播电商", "跨境电商", "AI短剧"]), courses: J(["直播电商运营", "短视频制作与运营"]), description: "1:1还原行业直播间场景，支撑直播策划、主播、中控、视觉全岗位训练。", equipmentSummary: J(["专业直播间", "录播系统", "直播中控设备"]), cover: img.commerceLive, posX: 80, posY: 0, width: 20, height: 42, sort: 3 },
    { roomNo: "T-04", name: "金融科技实训室", spaceType: "FINTECH", area: 200, capacity: 44, majors: J(["FINTECH", "DATA"]), projects: J(["金融数据分析", "智慧金融"]), courses: J(["金融市场分析", "商务数据分析"]), description: "配备先进实训设备，为学生提供真实的职业场景模拟。", equipmentSummary: J(["金融实训平台", "行情分析终端"]), cover: img.fintechRoom, posX: 0, posY: 42, width: 38, height: 38, sort: 4 },
    { roomNo: "T-05", name: "创新创业实训室", spaceType: "CROSS-MAJOR", area: 180, capacity: 36, majors: J(["AI", "DATA", "COMMERCE", "FINTECH"]), projects: J(["零代码创作", "双创竞赛"]), courses: J(["精益创业", "创新实践"]), description: "跨专业项目协作与双创竞赛训练空间。", equipmentSummary: J(["协作工位", "路演设备"]), cover: img.commerceCamp, posX: 38, posY: 42, width: 34, height: 38, sort: 5 },
    { roomNo: "T-06", name: "创新培训中心", spaceType: "TRAINING", area: 360, capacity: 120, majors: J(["AI", "DATA", "COMMERCE", "FINTECH"]), projects: J(["企业讲师授课", "训练营", "双选会"]), courses: J(["企业课程", "实训动员"]), description: "多用途培训与实训空间，承载企业课程、训练营与校企活动。", equipmentSummary: J(["多用途培训空间", "录播系统", "路演舞台"]), cover: img.newsIntern, posX: 72, posY: 42, width: 28, height: 38, sort: 6 },
  ];
  for (const s of spaces) await prisma.trainingSpace.create({ data: s });

  // ---------- 学院数据 ----------
  const stats = [
    { value: "4", label: "特色专业", englishLabel: "MAJORS", description: "人工智能技术应用 / 大数据技术 / 电子商务 / 金融科技应用", sort: 1 },
    { value: "44", label: "专职教师", englishLabel: "FACULTY", description: "含省级教学名师、省级技术能手", sort: 2 },
    { value: "10", suffix: "+", label: "行业企业实战导师", englishLabel: "INDUSTRY MENTORS", description: "校内专任教师与企业导师深度融合", sort: 3 },
    { value: "1500", suffix: "㎡+", label: "生产型公共实训基地", englishLabel: "PRODUCTION BASE", description: "校企共建，1:1还原行业真实工作场景", sort: 4 },
    { value: "30", suffix: "+", label: "省级以上学生竞赛奖项", englishLabel: "AWARDS", description: "数据更新时间：2026-07", sort: 5 },
    { value: "96.61", suffix: "%", label: "近三年平均就业率", englishLabel: "EMPLOYMENT", description: "位居同类院校前列", sort: 6 },
  ];
  for (const s of stats) await prisma.collegeStat.create({ data: s });

  // ---------- 培养链路 ----------
  const steps = [
    ["01", "INDUSTRY NEEDS", "产业需求", "课程和项目持续对接真实行业需求。"],
    ["02", "PRACTITIONER TEACHERS", "企业实战型讲师", "专业核心课由具有一线经验的实战型讲师参与交付。"],
    ["03", "CORE COURSES", "专业核心课程", "课程围绕岗位能力更新，而非孤立知识点。"],
    ["04", "PBL", "PBL 项目制教学", "学生围绕问题、任务、项目和最终交付学习。"],
    ["05", "JOB · COURSE · COMPETITION · CERTIFICATE", "岗 · 课 · 赛 · 证", "将岗位、课程、竞赛、技能认证贯通。"],
    ["06", "CROSS-MAJOR", "跨专业协同", "学生可以根据兴趣与项目需求进入其他专业项目。"],
    ["07", "REAL PROJECT", "真实产业项目", "将数据标注、直播电商、跨境电商、AI短剧等真实项目引入学校。"],
    ["08", "WORK-STUDY INTEGRATION", "工学结合", "学习和生产实践发生在同一个项目过程中。"],
    ["09", "DELIVERY", "项目交付", "最终产出可被评审、采用、运营或展示的成果。"],
    ["10", "CAPABILITY", "形成复合岗位能力", "学生最终获得专业能力、项目能力、协作能力、作品资产与岗位经验。"],
  ];
  for (const [i, [code, en, name, desc]] of steps.entries()) {
    await prisma.educationStep.create({ data: { code, englishName: en, name, description: desc, sort: i + 1 } });
  }

  // ---------- 新闻 ----------
  const news: Array<{
    slug: string; title: string; category: string; summary: string; blocks: Block[];
    cover: string; publishedAt: string; sourceUrl: string; featured?: boolean;
  }> = [
    {
      slug: "robot-4c-awards-2026",
      title: "以赛砺能，捷报频传｜数智科技产业学院学子科创竞赛斩获多项大奖",
      category: "学生成长",
      summary: "学院学子在第九届中国高校智能机器人创意大赛、2026年中国大学生计算机设计大赛全国总决赛中斩获国赛二等奖1项、三等奖2项。",
      cover: img.newsRobot,
      publishedAt: "2026-08-24",
      sourceUrl: "https://www.jnpec.edu.cn/szkjcyxy/info/1123/1148.htm",
      featured: true,
      blocks: [
        { t: "p", text: "近日，多项高水平学科竞赛结果陆续揭晓，数智科技产业学院学子奋勇争先，在第九届中国高校智能机器人创意大赛、2026年中国大学生计算机设计大赛（高职高专组）全国总决赛中斩获多项重要荣誉。" },
        { t: "p", text: "在第九届中国高校智能机器人创意大赛的角逐中，学院参赛团队依托专业技术打磨“护星”短距离智能接送及陪护机器人项目，先斩获山东赛区自制实物组一等奖，顺利晋级国赛；在全国赛场上与吉林大学、北京工业大学等高校选手同台竞技，最终斩获国赛二等奖。" },
        { t: "img", src: img.newsRobot2 },
        { t: "p", text: "与此同时，2026年中国大学生计算机设计大赛（高职高专组）全国总决赛在上海落下帷幕，学院参赛学子凭借新颖创意与扎实技术功底，斩获两项国赛三等奖。" },
        { t: "img", src: img.news4c },
        { t: "p", text: "优异成绩的背后，是师生日夜不懈的付出，也是学院“以赛促教、以赛促学、以赛促创”育人理念的生动体现。学院将竞赛实践与课堂实训深度融合，搭建科创平台，助力学生锤炼本领、激活创新思维。" },
      ],
    },
    {
      slug: "safety-inspection-2026",
      title: "筑牢安全防线 护航开学新程——数智科技产业学院开展新学期全面安全排查工作",
      category: "学院动态",
      summary: "学院组织专项检查组，对学生宿舍、教学教室、多媒体设备及辖区消防设施开展全覆盖、无死角安全专项排查。",
      cover: img.newsSafety,
      publishedAt: "2026-08-29",
      sourceUrl: "https://www.jnpec.edu.cn/szkjcyxy/info/1123/1149.htm",
      blocks: [
        { t: "p", text: "为扎实做好秋季开学各项筹备工作，切实消除安全隐患，保障师生拥有安全稳定的学习生活环境，近日，数智科技产业学院组织专项检查组，对学生宿舍、教学教室、多媒体设备及辖区消防设施开展全覆盖、无死角安全专项排查，以细致扎实的工作迎接新学期到来。" },
        { t: "img", src: img.newsSafety2 },
        { t: "p", text: "本次检查坚持“安全第一、预防为主、全面排查、闭环整改”的工作原则，检查小组分工明确、逐项落实。排查过程中，工作人员对发现的隐患逐一登记造册，建立问题台账，确保所有隐患清零见底。" },
        { t: "p", text: "此次开学前安全大排查，进一步夯实了学院安全管理基础。下一步，学院将持续常态化开展安全隐患排查整治，全力为全体师生营造平安、有序、舒适的校园环境。" },
      ],
    },
    {
      slug: "rural-assessment-2026",
      title: "喜报！我校获批2026年济南市乡村振兴领域专项职业能力考核机构及项目",
      category: "产教融合",
      summary: "“新媒体短视频策划与制作”和“数据标注”两项考核项目获批，均由数智科技产业学院主导申报。",
      cover: img.newsRural,
      publishedAt: "2026-08-15",
      sourceUrl: "https://www.jnpec.edu.cn/szkjcyxy/info/1123/1146.htm",
      blocks: [
        { t: "p", text: "近日，济南市公布了2026年乡村振兴领域专项职业能力考核机构及项目名单，济南幼儿师范高等专科学校成功获批两项考核项目，标志着我校在服务乡村振兴战略、赋能职业技能培训方面迈出重要一步。" },
        { t: "p", text: "此次获批的两项考核项目分别为“新媒体短视频策划与制作”和“数据标注”，均由我校数智科技产业学院主导申报。在学院精心组织和专业团队的通力配合下，申报工作扎实推进、高效完成，最终成功获批。" },
        { t: "img", src: img.newsRural },
        { t: "p", text: "下一步，学校将以此次获批为契机，高标准建设考核站点，严把考核质量，努力为乡村振兴培养更多高素质数字技能人才，贡献幼高专智慧和力量。" },
      ],
    },
    {
      slug: "village-practice-2026",
      title: "数智启新 智惠同行｜深耕乡土十二日，以专业力量赋能乡村振兴",
      category: "学生成长",
      summary: "志愿服务队赴长清区五峰山街道东黄村开展12天乡村振兴专项实践，落地产业助农、科教惠民、文化暖心、思政研学四大主线。",
      cover: img.newsVillage,
      publishedAt: "2026-07-25",
      sourceUrl: "https://www.jnpec.edu.cn/szkjcyxy/info/1112/1147.htm",
      blocks: [
        { t: "p", text: "建功“十五五”，青春担使命。数智科技产业学院“数智启新，智惠同行”志愿服务队赴长清区五峰山街道东黄村，开展了为期12天的乡村振兴专项实践，围绕产业助农、科教惠民、文化暖心、思政研学四大主线落地系列实践活动。" },
        { t: "p", text: "实践团设立数智助农服务站，为沿街摊贩定制标准化收款二维码，现场开展反诈、普惠金融科普；依托电商专业优势搭建实景直播间，聚焦酸枣叶茶等本土农产开展专场带货，借助数字渠道拓宽乡村农产品销路。" },
        { t: "img", src: img.newsVillageLive },
        { t: "p", text: "团队同步开设少儿公益课堂与村民数字夜校，参与樱谷里草坪音乐节，走访村内老党员开设田间实景思政课堂，实现产业赋能、科教帮扶、文化服务、思政育人深度融合。" },
      ],
    },
    {
      slug: "intern-mobilization-2026",
      title: "实训实习启新程｜数智科技产业学院召开专业实训实习动员会",
      category: "学院动态",
      summary: "24级电子商务、金融科技应用专业实训实习动员会顺利开展，校企双方共话实践育人。",
      cover: img.newsIntern,
      publishedAt: "2026-07-05",
      sourceUrl: "https://www.jnpec.edu.cn/szkjcyxy/info/1123/1142.htm",
      blocks: [
        { t: "p", text: "2026年7月2日，数智科技产业学院电子商务、金融科技应用专业实训实习动员会于思敏楼1201教室顺利开展。24级电子商务、金融科技应用专业全体学生到场参会。" },
        { t: "img", src: img.newsIntern2 },
        { t: "p", text: "会上，专业负责人立足人才培养目标强调实训实习的重要意义；校企合作单位凯文教育集团老师围绕校企协同实训项目展开细致解读，详细介绍实训岗位、培养体系与实践保障。" },
        { t: "p", text: "下一步，学院将持续做实实习全过程跟踪管理服务，护航24级学子扎实开展实践学习，锤炼专业技能，稳步开启职业成长之路。" },
      ],
    },
    {
      slug: "nocode-cup-2026",
      title: "产教融合搭平台 数智创新展锋芒——首届“中马凯文杯”零代码项目创作大赛圆满落幕",
      category: "产教融合",
      summary: "六支队伍晋级决赛，中马两国师生线上联动，共同见证跨国界数智创新赛事。",
      cover: img.newsCup,
      publishedAt: "2026-07-01",
      sourceUrl: "https://www.jnpec.edu.cn/szkjcyxy/info/1084/1126.htm",
      blocks: [
        { t: "p", text: "6月30日下午，由北京凯文德信教育科技股份有限公司山东分公司、马来西亚沙巴“一带一路”高等教育协会主办，济南幼儿师范高等专科学校数智科技产业学院协办的首届“中马凯文杯”零代码项目创作大赛决赛，于思敏楼2101教室顺利举办。" },
        { t: "img", src: img.newsCup2 },
        { t: "p", text: "本次大赛聚焦零代码数字化应用开发赛道，六支团队的参赛作品立足校园管理、教育服务、数字化办公等真实应用场景，依托零代码工具完成系统搭建、流程设计与功能落地。" },
        { t: "p", text: "副校长崔建代表学校作总结讲话。他表示，本次赛事是学校产教融合、中马国际交流的重要实践，大赛坚持“真题真做”，以真实需求驱动实践创新，搭建起中马青年AI领域交流共创平台。" },
      ],
    },
    {
      slug: "4c-provincial-first-2026",
      title: "数智科技产业学院斩获两项省一等奖，晋级中国大学生计算机设计大赛国赛",
      category: "学生成长",
      summary: "2025级大数据技术专业团队作品聚焦古建文化数字化保护，以山东省一等奖成绩晋级国赛。",
      cover: img.news4cProv,
      publishedAt: "2026-06-26",
      sourceUrl: "https://www.jnpec.edu.cn/szkjcyxy/info/1123/1122.htm",
      blocks: [
        { t: "p", text: "近日，2026年中国大学生计算机设计大赛山东赛区上推国赛名单公布。数智科技产业学院两项作品在省赛中表现卓越，均以山东省一等奖的优异成绩脱颖而出，成功获得国赛晋级资格！" },
        { t: "p", text: "参赛队伍由2025级大数据技术专业学生郭骁峰、刘鑫淼、董思琪组成，指导教师为周文挺、张健。作品聚焦古建文化数字化保护与创新表达，依托校企共建实训平台，运用大数据采集、分析与可视化等技术完成原创性数字化创作。" },
        { t: "p", text: "此次成绩是校企深度合作、协同育人成果的突出体现。学院将持续深化产教融合，完善“以赛促学、以赛促教”长效机制。" },
      ],
    },
    {
      slug: "zhengda-cup-first-2026",
      title: "喜报！我院学子在“正大杯”全国大学生市场调查与分析大赛中斩获山东省一等奖",
      category: "学生成长",
      summary: "参赛团队深入市场一线开展调研，斩获“正大杯”山东省专科组选拔赛一等奖。",
      cover: img.newsZhengda,
      publishedAt: "2026-05-13",
      sourceUrl: "https://www.jnpec.edu.cn/szkjcyxy/info/1123/1075.htm",
      blocks: [
        { t: "p", text: "由中国商业统计学会主办的“正大杯”第十六届全国大学生市场调查与分析大赛山东省专科组选拔赛结果正式揭晓，我院学子组成的参赛团队一举斩获山东省一等奖。" },
        { t: "p", text: "我院参赛团队由周晓旭、王华新两位老师指导，魏安奇、刘秀云、林爱羽、刘鑫奕四位同学组成。团队深入市场一线开展调研，运用数据分析、用户访谈等方法剖析产品现状与市场痛点，最终形成兼具专业性与实践性的研究报告。" },
        { t: "p", text: "一直以来，数智科技产业学院始终坚持“以赛促学、以赛促教、以赛促创”的育人理念，不断提升学生的核心竞争力，助力学生在实战中成长成才。" },
      ],
    },
  ];
  for (const n of news) {
    await prisma.news.create({
      data: {
        slug: n.slug,
        title: n.title,
        category: n.category,
        summary: n.summary,
        content: J(n.blocks),
        cover: n.cover,
        publishedAt: new Date(n.publishedAt),
        sourceUrl: n.sourceUrl,
        featured: n.featured ?? false,
      },
    });
  }

  console.log("seed done");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
