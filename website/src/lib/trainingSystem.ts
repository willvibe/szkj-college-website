// 大数据专业人才培养体系图 —— 内容 1:1 取自 PPT《最美职教新示范V7.0》slide 9
// 结构：纵向 5 行泳道（实习就业 → N+项目部 → 专业核心课 → 专业基础课 → 公共基础课）
//       右侧 4 阶段学年列（阶段一 1 学年 / 阶段二 1.5 学年 / 阶段三 / 阶段四 0.5 学年）

export type AbilityGroup = {
  tag: string; // 能力一 / 能力二 / 能力三
  name: string; // 能力名称
  courses: string[]; // 课程（左列）
  postsTop: string[]; // 岗位（右上）
  contests: string[]; // 大赛（右中）
  postsBottom: string[]; // 证书/岗位（右下）
};

const CONTESTS = [
  "山东省“技能兴鲁”职业技能大赛",
  "中国职业技能大赛",
  "全国职业院校技能大赛",
];

export const TRAINING_SYSTEM = {
  title: "大数据专业人才培养体系图",

  // 阶段四 · 0.5 学年
  internship: {
    label: "实习就业",
    stage: "阶段四",
    years: "0.5学年",
    items: ["升学（专升本/国际）", "数字简历", "就业推荐", "毕业设计"],
  },

  // 阶段三
  project: {
    stage: "阶段三",
    text: "N+企业校内项目部：生产项目实践/实战",
  },

  // 阶段二 · 1.5 学年
  core: {
    label: "专业核心课",
    stage: "阶段二",
    years: "1.5学年",
    abilities: [
      {
        tag: "能力一",
        name: "数据处理与分析能力",
        courses: ["数据库高级应用", "Mysql数据采集与清洗", "scrapy+pandas"],
        postsTop: ["数据运营", "数据分析师"],
        contests: CONTESTS,
        postsBottom: ["Python技术应用工程师"],
      },
      {
        tag: "能力二",
        name: "数据挖掘能力",
        courses: ["数据分析技术与应用", "pandas + pyecharts", "数据挖掘技术与应用(sklearn)"],
        postsTop: ["数据分析师", "数据挖掘工程师"],
        contests: CONTESTS,
        postsBottom: ["数据分析师"],
      },
      {
        tag: "能力三",
        name: "大数据开发能力",
        courses: ["Hadoop大数据生态技术与应用", "Spark生态技术与应用"],
        postsTop: ["大数据运维工程师", "大数据开发工程师"],
        contests: CONTESTS,
        postsBottom: ["大数据技能证书"],
      },
    ] as AbilityGroup[],
  },

  // 阶段一 · 1 学年（专业基础课 + 公共基础课同属阶段一）
  basic: {
    label: "专业基础课",
    stage: "阶段一",
    years: "1学年",
    courses: [
      "Linux操作系统",
      "Java面向对象程序设计",
      "echarts数据可视化技术",
      "web后端技术（Flask）",
      "web前端技术",
      "数据库技术基础（Mysql）",
      "Python面向对象程序设计",
    ],
    camp: "数据可视化训练营",
  },

  public: {
    label: "公共基础课",
    items: ["数据思维训练营（核心课）"],
    camp: "数据科学思维训练营",
  },
};
