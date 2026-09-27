// 专业岗位能力素养模型（旭日图）数据
// 结构 1:1 取自 PPT P7/P10：中心岗位 → 岗位职责 → 典型任务 → 核心技能 → 核心素养
// 岗位环文字 1:1 取自 PPT P8/P11 矢量数据；外环明细依据 PPT 同源资料（P3/P8/P11 及官网专业介绍）整理

export type AbilityJob = {
  name: string; // 岗位（1:1）
  duties: string[]; // 岗位职责
  tasks: string[]; // 典型任务
  skills: string[]; // 核心技能
  literacies: string[]; // 核心素养
};

export type AbilityMap = {
  center: string; // 中心标签
  note: string; // 数据说明
  jobs: AbilityJob[];
};

export const ABILITY_MAPS: Record<string, AbilityMap> = {
  data: {
    center: "大数据\n岗位能力\n素养模型",
    note: "五环结构取自 PPT P7；岗位环文字 1:1 取自 P8 矢量数据；职责/任务/技能/素养环依据 P8 课程与技能要求及官网专业介绍整理",
    jobs: [
      {
        name: "数据运营",
        duties: ["业务数据日常运营与维护", "数据报表输出与跟踪"],
        tasks: ["数据采集与录入", "数据清洗与校验", "运营数据监测"],
        skills: ["SQL 数据查询", "Excel/BI 报表", "业务理解"],
        literacies: ["严谨细致", "数据敏感度"],
      },
      {
        name: "数据分析师",
        duties: ["开展数据分析与洞察输出", "支撑业务决策"],
        tasks: ["需求分析与建模", "数据可视化呈现", "分析报告撰写"],
        skills: ["Python 数据分析", "pandas/pyecharts", "统计与挖掘方法"],
        literacies: ["逻辑思维", "业务洞察"],
      },
      {
        name: "数据挖掘工程师",
        duties: ["数据挖掘模型构建与调优", "挖掘成果落地应用"],
        tasks: ["特征工程", "模型训练与评估", "sklearn 建模"],
        skills: ["机器学习算法", "sklearn", "数据挖掘技术与应用"],
        literacies: ["算法思维", "持续钻研"],
      },
      {
        name: "大数据运维工程师",
        duties: ["大数据平台部署与运维", "保障集群稳定运行"],
        tasks: ["Hadoop 集群运维", "任务调度监控", "故障排查"],
        skills: ["Linux 操作系统", "Hadoop 生态", "平台运维"],
        literacies: ["责任意识", "安全规范"],
      },
      {
        name: "大数据开发工程师",
        duties: ["大数据应用开发与交付", "数据管道建设"],
        tasks: ["Spark 数据开发", "数仓建设", "接口与服务开发"],
        skills: ["Spark 生态技术", "数据库高级应用", "工程开发"],
        literacies: ["工程规范", "团队协作"],
      },
    ],
  },

  ai: {
    center: "人工智能\n岗位能力\n素养模型",
    note: "五环结构取自 PPT P10；岗位环文字 1:1 取自 P11 矢量数据；职责/任务/技能/素养环依据 P11 课程与技能要求及官网专业介绍整理",
    jobs: [
      {
        name: "爬虫工程师",
        duties: ["网络数据采集系统开发", "数据源接入与维护"],
        tasks: ["数据采集实战", "反爬处理与调度"],
        skills: ["Python 爬虫", "数据采集与解析"],
        literacies: ["合规意识", "动手实践"],
      },
      {
        name: "数据预处理工程师",
        duties: ["原始数据清洗与加工", "为模型训练供给合格数据"],
        tasks: ["数据处理与分析", "数据标注与质检"],
        skills: ["数据清洗工具链", "统计分析"],
        literacies: ["耐心细致", "质量意识"],
      },
      {
        name: "数据分析师",
        duties: ["业务数据分析与可视化", "输出分析结论"],
        tasks: ["数据洞察分析", "报表与看板搭建"],
        skills: ["Python 数据分析", "可视化工具"],
        literacies: ["逻辑思维", "业务理解"],
      },
      {
        name: "图像处理软件工程师",
        duties: ["计算机视觉应用开发", "图像算法落地"],
        tasks: ["OpenCV 实战开发", "视觉检测调优"],
        skills: ["OpenCV", "深度学习技术应用"],
        literacies: ["算法思维", "工程实现"],
      },
      {
        name: "音频处理软件工程师",
        duties: ["语音信号处理应用开发", "语音交互功能实现"],
        tasks: ["语音处理技术应用", "音频特征处理"],
        skills: ["语音处理技术", "深度学习框架"],
        literacies: ["钻研精神", "创新意识"],
      },
      {
        name: "深度学习系统运维",
        duties: ["训练与推理环境运维", "模型服务稳定保障"],
        tasks: ["GPU 资源调度", "模型部署与监控"],
        skills: ["Linux 运维", "深度学习平台"],
        literacies: ["责任意识", "稳定性思维"],
      },
      {
        name: "嵌入式AI系统开发/运维工程师",
        duties: ["端侧 AI 系统开发与运维", "AIoT 设备智能化"],
        tasks: ["Qt 开发实战", "嵌入式部署"],
        skills: ["Qt 开发", "嵌入式系统"],
        literacies: ["软硬结合", "现场排障"],
      },
      {
        name: "物联网开发工程师",
        duties: ["物联网应用系统开发", "设备互联与数据上云"],
        tasks: ["物联网组网开发", "边缘数据接入"],
        skills: ["物联网技术", "通信协议"],
        literacies: ["系统思维", "协作沟通"],
      },
    ],
  },
};
