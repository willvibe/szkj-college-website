import { cache } from "react";
import { prisma } from "./prisma";
import { parse } from "./parse";
import type { AchievementRow, CarouselRow, MajorRow, NewsRow, ProjectRow, SpaceRow, Stat, StepRow, WorkRow } from "./types";

// cache()：同一请求内（generateMetadata 与页面组件）去重查询

/** 首页 hero 轮播海报：后台管理的品牌海报 + 自动追加的学院/专业头条新闻帧 */
export async function getCarouselItems(): Promise<CarouselRow[]> {
  const [rows, news] = await Promise.all([
    prisma.carouselItem.findMany({
      where: { active: true },
      orderBy: { sort: "asc" },
    }),
    prisma.news.findMany({
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
      take: 8,
    }),
  ]);

  const posters: CarouselRow[] = rows.map((r) => ({
    id: r.id,
    title: r.title,
    subtitle: r.subtitle,
    badge: r.badge,
    image: r.image,
    link: r.link,
    btnText: r.btnText,
  }));

  // 头条帧：学院动态 → 学院头条；标题含专业关键词 → 专业头条；其余用原分类
  const MAJOR_KEYS: Array<[string, string]> = [
    ["人工智能", "人工智能"],
    ["大数据", "大数据"],
    ["电子商务", "电商"],
    ["直播", "电商"],
    ["金融科技", "金融科技"],
    ["零代码", "产教融合"],
  ];
  const newsFrames: CarouselRow[] = news
    .filter((n) => n.cover && !posters.some((p) => p.image === n.cover))
    // 标题前 4 字去重：同主题已有品牌海报的新闻不再生成头条帧
    .filter((n) => !posters.some((p) => p.title.includes(n.title.slice(0, 4))))
    .slice(0, 4)
    .map((n) => {
      const hit = MAJOR_KEYS.find(([kw]) => n.title.includes(kw));
      const badge = n.category === "学院动态" ? "学院头条" : hit ? `专业头条 · ${hit[1]}` : n.category;
      return {
        id: -1000 - n.id,
        title: n.title,
        subtitle: n.summary.slice(0, 64),
        badge,
        image: n.cover as string,
        link: `/news/${n.slug}`,
        btnText: "阅读全文",
      };
    });

  if (posters.length === 0 && newsFrames.length === 0) return FALLBACK_CAROUSEL;
  return [...posters, ...newsFrames];
}

const FALLBACK_CAROUSEL: CarouselRow[] = [
  { id: -1, title: "数智科技产业学院", subtitle: "聚焦数字经济 · 产教融合特色二级学院", badge: "学院形象", image: "/images/posters/poster-college.jpg", link: "/about", btnText: "了解学院" },
  { id: -2, title: "人工智能技术应用", subtitle: "AIGC 与工业质检双方向实训", badge: "专业巡礼 · 01", image: "/images/posters/poster-ai.jpg", link: "/majors/ai", btnText: "进入专业主页" },
  { id: -3, title: "大数据技术", subtitle: "企业真实数据全链路实战", badge: "专业巡礼 · 02", image: "/images/posters/poster-data.jpg", link: "/majors/data", btnText: "进入专业主页" },
  { id: -4, title: "电子商务", subtitle: "全域直播电商操盘", badge: "专业巡礼 · 03", image: "/images/posters/poster-commerce.jpg", link: "/majors/commerce", btnText: "进入专业主页" },
  { id: -5, title: "金融科技应用", subtitle: "银行级风控建模实训", badge: "专业巡礼 · 04", image: "/images/posters/poster-fintech.jpg", link: "/majors/fintech", btnText: "进入专业主页" },
];

export const getMajors = cache(async (): Promise<MajorRow[]> => {
  const rows = await prisma.major.findMany({
    orderBy: { sort: "asc" },
    include: { projects: { include: { project: true } } },
  });
  return rows.map((m) => ({
    id: m.id,
    slug: m.slug,
    code: m.code,
    name: m.name,
    englishName: m.englishName,
    positioning: m.positioning,
    tagline: m.tagline,
    description: m.description,
    abilities: parse<string[]>(m.abilities, []),
    coreCourses: parse<string[]>(m.coreCourses, []),
    careers: parse<string[]>(m.careers, []),
    honors: parse<string[]>(m.honors, []),
    cooperation: m.cooperation,
    practice: m.practice,
    faculty: m.faculty,
    research: m.research,
    projectSlugs: m.projects.map((p) => p.project.slug),
  }));
});

export const getProjects = cache(async (): Promise<ProjectRow[]> => {
  const rows = await prisma.industryProject.findMany({
    orderBy: { sort: "asc" },
    include: { majors: { include: { major: true } } },
  });
  return rows.map((p) => ({
    id: p.id,
    slug: p.slug,
    code: p.code,
    name: p.name,
    englishName: p.englishName,
    summary: p.summary,
    projectType: parse<string[]>(p.projectType, []),
    studentRoles: parse<string[]>(p.studentRoles, []),
    process: parse<string[]>(p.process, []),
    outputs: parse<string[]>(p.outputs, []),
    learningModel: parse<string[]>(p.learningModel, []),
    status: p.status,
    cover: p.cover,
    majorCodes: p.majors.map((m) => m.major.code),
  }));
});

export const getWorks = cache(async (): Promise<WorkRow[]> => {
  const rows = await prisma.studentWork.findMany({
    orderBy: { sort: "asc" },
    include: { majors: { include: { major: true } } },
  });
  return rows.map((w) => ({
    id: w.id,
    slug: w.slug,
    code: w.code,
    title: w.title,
    summary: w.summary,
    type: parse<string[]>(w.type, []),
    tags: parse<string[]>(w.tags, []),
    challenge: w.challenge,
    brief: w.brief,
    process: parse<string[]>(w.process, []),
    tools: parse<string[]>(w.tools, []),
    team: parse<WorkRow["team"]>(w.team, []),
    mentor: w.mentor,
    outputs: parse<string[]>(w.outputs, []),
    results: parse<string[]>(w.results, []),
    commercialUse: w.commercialUse,
    crossMajor: w.crossMajor,
    cover: w.cover,
    featured: w.featured,
    majorCodes: w.majors.map((m) => m.major.code),
  }));
});

export async function getSpaces(): Promise<SpaceRow[]> {
  const rows = await prisma.trainingSpace.findMany({ orderBy: { sort: "asc" } });
  return rows.map((s) => ({
    id: s.id,
    roomNo: s.roomNo,
    name: s.name,
    spaceType: s.spaceType,
    area: s.area,
    capacity: s.capacity,
    majors: parse<string[]>(s.majors, []),
    projects: parse<string[]>(s.projects, []),
    courses: parse<string[]>(s.courses, []),
    description: s.description,
    equipmentSummary: parse<string[]>(s.equipmentSummary, []),
    cover: s.cover,
    posX: s.posX,
    posY: s.posY,
    width: s.width,
    height: s.height,
  }));
}

export async function getStats(): Promise<Stat[]> {
  const rows = await prisma.collegeStat.findMany({ orderBy: { sort: "asc" } });
  return rows.map((s) => ({
    id: s.id,
    value: s.value,
    suffix: s.suffix,
    label: s.label,
    englishLabel: s.englishLabel,
    description: s.description,
  }));
}

export async function getSteps(): Promise<StepRow[]> {
  const rows = await prisma.educationStep.findMany({ orderBy: { sort: "asc" } });
  return rows.map((s) => ({
    code: s.code,
    englishName: s.englishName,
    name: s.name,
    description: s.description,
  }));
}

export async function getAchievements(): Promise<AchievementRow[]> {
  const rows = await prisma.achievement.findMany({ orderBy: { sort: "asc" } });
  return rows.map((a) => ({
    id: a.id,
    slug: a.slug,
    code: a.code,
    title: a.title,
    category: a.category,
    year: a.year,
    summary: a.summary,
    detail: a.detail,
    results: parse<string[]>(a.results, []),
    cover: a.cover,
    featured: a.featured,
  }));
}

export async function getNewsList(): Promise<NewsRow[]> {
  const rows = await prisma.news.findMany({ orderBy: { publishedAt: "desc" } });
  return rows.map((n) => ({
    id: n.id,
    slug: n.slug,
    title: n.title,
    category: n.category,
    summary: n.summary,
    cover: n.cover,
    publishedAt: n.publishedAt.toISOString(),
    featured: n.featured,
  }));
}
