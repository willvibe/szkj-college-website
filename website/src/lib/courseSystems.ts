// 岗课赛证融通课程体系与能力图谱数据
// 大数据/人工智能：严格 1:1 复刻《最美职教新示范V7.0》PPT 第8/11页“专业特征/技能要求”模型
// 电子商务/金融科技应用：PPT 未展开，按学院官网专业介绍同结构构建

export type Ability = {
  name: string; // 能力一：数据处理与分析能力
  courses: string[];
  jobs: string[];
  contests: string[];
  certificates: string[];
};

export type CourseSystem = {
  source: string; // 数据来源说明
  abilities: Ability[];
  foundationCourses: string[]; // 专业基础课
  trainings: string[]; // 训练营
  diagram?: "ai" | "data"; // PPT 岗课赛证图矢量 1:1 重绘数据键
};

export const COURSE_SYSTEMS: Record<string, CourseSystem> = {
  ai: {
    source: "《最美职教新示范V7.0》P11 人工智能专业岗位能力素养模型（严格复刻）· P12 人才培养体系图",
    abilities: [
      {
        name: "能力一：数据采集与分析",
        courses: ["数据采集实战", "数据处理与分析"],
        jobs: ["爬虫工程师", "数据预处理工程师", "数据分析师"],
        contests: ["全国大学生大数据分析技术技能大赛——Python数据分析赛项"],
        certificates: ["人工智能数据分析与挖掘应用工程师", "数据分析师"],
      },
      {
        name: "能力二：图像、语音处理与建模",
        courses: ["OpenCV实战", "语音处理技术应用", "深度学习技术应用"],
        jobs: ["图像处理软件工程师", "音频处理软件工程师", "深度学习系统运维"],
        contests: [
          "山东省电子信息行业职业技能竞赛人工智能综合技术应用赛",
          "新一代信息技术领域专项赛",
          "中国职业技能大赛-人工智能训练赛",
        ],
        certificates: ["人工智能技术师"],
      },
      {
        name: "能力三：AIoT系统开发和运维",
        courses: ["Qt开发实战"],
        jobs: ["嵌入式AI系统开发/运维工程师", "物联网开发工程师"],
        contests: [
          "山东省电子信息行业职业技能竞赛人工智能综合技术应用赛",
          "新一代信息技术领域专项赛",
          "中国职业技能大赛-人工智能工程技术赛项",
        ],
        certificates: ["物联网技术应用师"],
      },
    ],
    foundationCourses: [
      "人工智能导论",
      "C++程序设计",
      "Linux操作系统",
      "Web前端开发",
      "Web后端开发",
      "数据库管理与应用",
      "Hadoop大数据生态技术与应用",
      "Spark生态技术与应用",
      "arm嵌入式系统开发",
    ],
    trainings: ["Python程序设计训练营", "行业认知训练营：数据思维训练营", "AIoT训练营"],
    diagram: "ai",
  },

  data: {
    source: "《最美职教新示范V7.0》P8 大数据专业岗位能力素养模型（严格复刻）· P9 人才培养体系图",
    abilities: [
      {
        name: "能力一：数据处理与分析能力",
        courses: ["数据库高级应用", "mysql数据采集与清洗（scrapy+pandas）"],
        jobs: ["数据运营", "数据分析师"],
        contests: ["山东省“技能兴鲁”职业技能大赛", "中国职业技能大赛", "全国职业院校技能大赛"],
        certificates: ["Python技术应用工程师"],
      },
      {
        name: "能力二：数据挖掘能力",
        courses: ["数据分析技术与应用（pandas + pyecharts）", "数据挖掘技术与应用（sklearn）"],
        jobs: ["数据分析师", "数据挖掘工程师"],
        contests: ["山东省“技能兴鲁”职业技能大赛", "中国职业技能大赛", "全国职业院校技能大赛"],
        certificates: ["数据分析师"],
      },
      {
        name: "能力三：大数据开发能力",
        courses: ["Hadoop大数据生态技术与应用", "Spark生态技术与应用"],
        jobs: ["大数据运维工程师", "大数据开发工程师"],
        contests: ["山东省“技能兴鲁”职业技能大赛", "中国职业技能大赛", "全国职业院校技能大赛"],
        certificates: ["大数据技能证书"],
      },
    ],
    foundationCourses: [
      "Java面向对象程序设计",
      "Python面向对象程序设计",
      "Linux操作系统",
      "数据库技术基础（Mysql）",
      "web前端技术（echarts）",
      "web后端技术（Flask）",
      "数据可视化技术",
    ],
    trainings: ["数据思维训练营（核心课）", "数据科学思维训练营", "数据可视化训练营"],
    diagram: "data",
  },

  commerce: {
    source: "学院官网专业介绍 · 电子商务专业岗位能力体系（模块化课程设计）",
    abilities: [
      {
        name: "能力一：直播电商运营能力",
        courses: ["直播电商运营", "短视频制作与运营"],
        jobs: ["直播运营", "电商运营", "全渠道营销"],
        contests: ["全国职业院校技能大赛直播电商赛项", "山东省“技能兴鲁”直播电商大赛"],
        certificates: ["直播电商职业技能等级证书"],
      },
      {
        name: "能力二：AIGC内容创作能力",
        courses: ["AIGC内容制作", "短视频脚本与拍摄"],
        jobs: ["AI内容制作", "视觉设计"],
        contests: ["山东省跨境电子商务大赛", "山东省高校商业经营挑战赛品牌策划竞赛"],
        certificates: ["新媒体技术职业技能等级证书"],
      },
      {
        name: "能力三：数据化运营能力",
        courses: ["电商运营基础", "数据分析"],
        jobs: ["数据分析", "智能客服管理"],
        contests: ["全国高校商业精英挑战赛", "“正大杯”全国大学生市场调查与分析大赛"],
        certificates: ["电子商务数据分析职业技能等级证书"],
      },
    ],
    foundationCourses: ["管理学基础", "电商运营基础", "数据分析", "公共关系与商务礼仪", "跨境电商实务"],
    trainings: ["直播训练营", "电商训练营"],
  },

  fintech: {
    source: "学院官网专业介绍 · 金融科技应用专业课程体系（项目式教学+训练营模式）",
    abilities: [
      {
        name: "能力一：金融数据分析能力",
        courses: ["商务数据分析", "金融市场分析"],
        jobs: ["金融大数据分析师", "金融分析师"],
        contests: ["山东省大学生人工智能大赛“智慧金融”赛项"],
        certificates: ["证券从业资格", "金融智能投顾"],
      },
      {
        name: "能力二：用户运营与营销能力",
        courses: ["用户运营", "金融营销实务"],
        jobs: ["用户运营", "证券经纪人", "投资理财顾问"],
        contests: ["山东省职业院校技能大赛", "全国高校商业精英挑战赛"],
        certificates: ["基金从业资格"],
      },
      {
        name: "能力三：风险控制能力",
        courses: ["风险控制", "金融科技前沿"],
        jobs: ["风控专员", "金融产品经理"],
        contests: ["山东省大学生科技节未来商业科技创新创业大赛"],
        certificates: ["银行从业资格"],
      },
    ],
    foundationCourses: ["金融科技概论", "现代银行业务数字化实操", "智能风控模型构建", "金融法规与职业素养"],
    trainings: ["商务数据分析训练营", "智慧金融训练营"],
  },
};

// 四维图例
export const GKCZ_META = [
  { key: "courses", label: "课程", en: "COURSE", desc: "以出口设计入口，对接岗位标准" },
  { key: "jobs", label: "岗位", en: "JOB", desc: "企业招聘岗位能力要求" },
  { key: "contests", label: "大赛", en: "COMPETITION", desc: "以赛促学、以赛促教" },
  { key: "certificates", label: "证书", en: "CERTIFICATE", desc: "职业技能等级证书融通" },
] as const;
