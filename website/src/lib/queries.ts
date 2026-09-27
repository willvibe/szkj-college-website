import { prisma } from "./prisma";
import { parse } from "./parse";
import type { AchievementRow, MajorRow, NewsRow, ProjectRow, SpaceRow, Stat, StepRow, WorkRow } from "./types";

export async function getMajors(): Promise<MajorRow[]> {
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
}

export async function getProjects(): Promise<ProjectRow[]> {
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
}

export async function getWorks(): Promise<WorkRow[]> {
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
}

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
