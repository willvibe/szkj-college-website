// PPT《最美职教新示范V7.0》P8/P11「专业特征/技能要求」岗课赛证图矢量数据
// 坐标单位 pt（与 PPT 一致），字号单位 pt，颜色取自 PPT 形状填充/文字色

export type TitleShape = { kind: "title"; x: number; y: number; w: number; h: number; color: string; text: string };
export type AbilityShape = { kind: "ability"; x: number; y: number; w: number; h: number; color: string; text: string };
export type PillShape = { kind: "pill"; x: number; y: number; w: number; h: number; fill: string; text: string };
export type ContentShape = { kind: "content"; x: number; y: number; w: number; h: number; size: number; lines: string[] };
export type GkczShape = TitleShape | AbilityShape | PillShape | ContentShape;

export type GkczDiagramData = {
  viewBox: { x: number; y: number; w: number; h: number };
  shapes: GkczShape[];
};

const DATA_CONTESTS = ["山东省“技能兴鲁”职业技能大赛", "中国职业技能大赛", "全国职业院校技能大赛"];

export const GKCS: Record<string, GkczDiagramData> = {
  // P8 大数据：标题/能力字色 F69744 0070C0，胶囊 0070C0，内容 14pt
  data: {
    viewBox: { x: 40, y: 0, w: 852, h: 515 },
    shapes: [
      { kind: "title", x: 45.2, y: 11.8, w: 432, h: 41.1, color: "#0070C0", text: "大数据专业：专业特征/技能要求" },
      { kind: "ability", x: 52.4, y: 185.8, w: 254.2, h: 29, color: "#F69744", text: "能力一：数据处理与分析能力" },
      { kind: "pill", x: 86.4, y: 226, w: 122.8, h: 25.2, fill: "#0070C0", text: "课程" },
      { kind: "content", x: 54, y: 252.2, w: 255.2, h: 63, size: 14, lines: ["数据库高级应用", "mysql数据采集与清洗", "scrapy+pandas"] },
      { kind: "pill", x: 86.4, y: 315.2, w: 122.8, h: 25.2, fill: "#0070C0", text: "岗位" },
      { kind: "content", x: 54, y: 342.4, w: 251, h: 24.2, size: 14, lines: ["数据运营数据分析师"] },
      { kind: "pill", x: 86.4, y: 368.4, w: 122.8, h: 25.2, fill: "#0070C0", text: "大赛" },
      { kind: "content", x: 54, y: 389.5, w: 251, h: 63, size: 14, lines: DATA_CONTESTS },
      { kind: "pill", x: 86.4, y: 450.6, w: 122.8, h: 25.2, fill: "#0070C0", text: "证书" },
      { kind: "content", x: 54, y: 477.6, w: 251, h: 24.2, size: 14, lines: ["Python技术应用工程师"] },
      { kind: "ability", x: 335.7, y: 131.4, w: 258.6, h: 29, color: "#F69744", text: "能力二：数据挖掘能力" },
      { kind: "pill", x: 371.6, y: 168.8, w: 122.8, h: 25.2, fill: "#0070C0", text: "课程" },
      { kind: "content", x: 339.2, y: 197.2, w: 255.2, h: 81.7, size: 14, lines: ["数据分析技术与应用", "pandas +  pyecharts", "数据挖掘技术与应用", "sklearn"] },
      { kind: "pill", x: 371.6, y: 282, w: 122.8, h: 25.2, fill: "#0070C0", text: "岗位" },
      { kind: "content", x: 339.2, y: 310.4, w: 251, h: 41.1, size: 14, lines: ["数据分析师", "数据挖掘工程师"] },
      { kind: "pill", x: 371.6, y: 354.6, w: 122.8, h: 25.2, fill: "#0070C0", text: "大赛" },
      { kind: "content", x: 339.2, y: 383, w: 251, h: 63, size: 14, lines: DATA_CONTESTS },
      { kind: "pill", x: 371.6, y: 449.2, w: 122.8, h: 25.2, fill: "#0070C0", text: "证书" },
      { kind: "content", x: 339.2, y: 477.6, w: 251, h: 24.2, size: 14, lines: ["数据分析师"] },
      { kind: "ability", x: 622.8, y: 77, w: 258.6, h: 29, color: "#F69744", text: "能力三：大数据开发能力" },
      { kind: "pill", x: 663.1, y: 118, w: 122.8, h: 25.2, fill: "#0070C0", text: "课程" },
      { kind: "content", x: 629.1, y: 153.4, w: 255.2, h: 54.6, size: 14, lines: ["Hadoop大数据生态技术与应用", "Spark生态技术与应用"] },
      { kind: "pill", x: 663.1, y: 218.2, w: 122.8, h: 25.2, fill: "#0070C0", text: "岗位" },
      { kind: "content", x: 629.1, y: 253.6, w: 251, h: 54.6, size: 14, lines: ["大数据运维工程师", "大数据开发工程师"] },
      { kind: "pill", x: 663.1, y: 318.4, w: 122.8, h: 25.2, fill: "#0070C0", text: "大赛" },
      { kind: "content", x: 629.1, y: 353.8, w: 251, h: 78.4, size: 14, lines: DATA_CONTESTS },
      { kind: "pill", x: 663.1, y: 442.2, w: 122.8, h: 25.2, fill: "#0070C0", text: "证书" },
      { kind: "content", x: 629.1, y: 476.9, w: 251, h: 24.2, size: 14, lines: ["大数据技能证书"] },
    ],
  },

  // P11 人工智能：标题 4267AA，能力字 0A47D9，胶囊 4368AB，能力一内容 12pt，其余 14pt
  ai: {
    viewBox: { x: 40, y: 0, w: 852, h: 515 },
    shapes: [
      { kind: "title", x: 45.2, y: 11.8, w: 479.7, h: 41.1, color: "#4267AA", text: "人工智能专业：专业特征/技能要求" },
      { kind: "ability", x: 52.4, y: 185.8, w: 254.2, h: 29, color: "#0A47D9", text: "能力一：数据采集与分析" },
      { kind: "pill", x: 86.4, y: 226, w: 122.8, h: 25.2, fill: "#4368AB", text: "课程" },
      { kind: "content", x: 54, y: 253.2, w: 255.2, h: 39.1, size: 12, lines: ["数据采集实战", "数据处理与分析"] },
      { kind: "pill", x: 86.4, y: 294.4, w: 122.8, h: 25.2, fill: "#4368AB", text: "岗位" },
      { kind: "content", x: 54, y: 321.7, w: 251, h: 50.8, size: 12, lines: ["爬虫工程师", "数据预处理工程师", "数据分析师"] },
      { kind: "pill", x: 86.4, y: 374.6, w: 122.8, h: 25.2, fill: "#4368AB", text: "大赛" },
      { kind: "content", x: 54, y: 401.8, w: 251, h: 39.1, size: 12, lines: ["全国大学生大数据分析技术技能大赛——Python数据分析赛项"] },
      { kind: "pill", x: 86.4, y: 443, w: 122.8, h: 25.2, fill: "#4368AB", text: "证书" },
      { kind: "content", x: 54, y: 470.3, w: 251, h: 36.2, size: 12, lines: ["人工智能数据分析与挖掘应用工程师", "数据分析师"] },
      { kind: "ability", x: 335.7, y: 131.4, w: 272.1, h: 29, color: "#0A47D9", text: "能力二：图像、语音处理与建模" },
      { kind: "pill", x: 371.6, y: 168.8, w: 122.8, h: 25.2, fill: "#4368AB", text: "课程" },
      { kind: "content", x: 339.2, y: 194.2, w: 255.2, h: 63, size: 14, lines: ["OpenCV实战", "语音处理技术应用", "深度学习技术应用"] },
      { kind: "pill", x: 371.6, y: 257.6, w: 122.8, h: 25.2, fill: "#4368AB", text: "岗位" },
      { kind: "content", x: 339.2, y: 283, w: 251, h: 58, size: 14, lines: ["图像处理软件工程师", "音频处理软件工程师", "深度学习系统运维"] },
      { kind: "pill", x: 371.6, y: 341.4, w: 122.8, h: 25.2, fill: "#4368AB", text: "大赛" },
      {
        kind: "content",
        x: 339.2,
        y: 366.8,
        w: 255.2,
        h: 88.6,
        size: 14,
        lines: ["山东省电子信息行业职业技能竞赛人工智能综合技术应用赛", "新一代信息技术领域专项赛", "中国职业技能大赛-人工智能训练赛"],
      },
      { kind: "pill", x: 371.6, y: 455.6, w: 122.8, h: 25.2, fill: "#4368AB", text: "证书" },
      { kind: "content", x: 339.2, y: 481.2, w: 251, h: 24.2, size: 14, lines: ["人工智能技术师"] },
      { kind: "ability", x: 622.8, y: 77, w: 258.6, h: 29, color: "#0A47D9", text: "能力三：AIoT系统开发和运维" },
      { kind: "pill", x: 663.1, y: 118, w: 122.8, h: 25.2, fill: "#4368AB", text: "课程" },
      { kind: "content", x: 629.1, y: 149.8, w: 255.2, h: 30.9, size: 14, lines: ["Qt开发实战"] },
      { kind: "pill", x: 663.1, y: 187.4, w: 122.8, h: 25.2, fill: "#4368AB", text: "岗位" },
      { kind: "content", x: 629.1, y: 219.3, w: 251, h: 54.6, size: 14, lines: ["嵌入式AI系统开发/运维工程师", "物联网开发工程师"] },
      { kind: "pill", x: 663.1, y: 280.6, w: 122.8, h: 25.2, fill: "#4368AB", text: "大赛" },
      {
        kind: "content",
        x: 629.1,
        y: 312.5,
        w: 251,
        h: 125.8,
        size: 14,
        lines: ["山东省电子信息行业职业技能竞赛人工智能综合技术应用赛", "新一代信息技术领域专项赛", "中国职业技能大赛-人工智能工程技术赛项"],
      },
      { kind: "pill", x: 663.1, y: 445, w: 122.8, h: 25.2, fill: "#4368AB", text: "证书" },
      { kind: "content", x: 629.1, y: 476.9, w: 251, h: 24.2, size: 14, lines: ["物联网技术应用师"] },
    ],
  },
};
