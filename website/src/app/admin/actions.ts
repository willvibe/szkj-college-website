"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const s = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const arr = (fd: FormData, k: string) =>
  s(fd, k)
    .split(/[\n,，]/)
    .map((x) => x.trim())
    .filter(Boolean);

function revalidateAll(slug?: string) {
  revalidatePath("/");
  revalidatePath("/majors");
  revalidatePath("/news");
  if (slug) revalidatePath(`/majors/${slug}`);
}

// ===== 首页核心数据 =====
export async function saveStat(fd: FormData) {
  await requireAdmin();
  const id = Number(s(fd, "id"));
  await prisma.collegeStat.update({
    where: { id },
    data: {
      value: s(fd, "value"),
      suffix: s(fd, "suffix") || null,
      label: s(fd, "label"),
      englishLabel: s(fd, "englishLabel") || null,
      description: s(fd, "description") || null,
      sort: Number(s(fd, "sort")) || 0,
    },
  });
  revalidateAll();
}

export async function addStat(fd: FormData) {
  await requireAdmin();
  await prisma.collegeStat.create({
    data: {
      value: s(fd, "value"),
      suffix: s(fd, "suffix") || null,
      label: s(fd, "label"),
      englishLabel: s(fd, "englishLabel") || null,
      description: s(fd, "description") || null,
      sort: Number(s(fd, "sort")) || 0,
    },
  });
  revalidateAll();
}

export async function deleteStat(fd: FormData) {
  await requireAdmin();
  await prisma.collegeStat.delete({ where: { id: Number(s(fd, "id")) } });
  revalidateAll();
}

// ===== 专业管理 =====
export async function saveMajorBasic(fd: FormData) {
  await requireAdmin();
  const id = Number(s(fd, "id"));
  const slug = s(fd, "slug");
  await prisma.major.update({
    where: { id },
    data: {
      name: s(fd, "name"),
      englishName: s(fd, "englishName"),
      positioning: s(fd, "positioning"),
      tagline: s(fd, "tagline"),
      description: s(fd, "description"),
      abilities: JSON.stringify(arr(fd, "abilities")),
      coreCourses: JSON.stringify(arr(fd, "coreCourses")),
      careers: JSON.stringify(arr(fd, "careers")),
      honors: JSON.stringify(arr(fd, "honors")),
      cooperation: s(fd, "cooperation"),
      practice: s(fd, "practice"),
      faculty: s(fd, "faculty"),
      research: s(fd, "research"),
    },
  });
  revalidateAll(slug);
}

// 三块专业内容 JSON（能力矩阵 / 课程体系 / 培养体系）；清空文本 = 恢复内置数据
export async function saveMajorJson(
  _prev: { error?: string; ok?: boolean } | null,
  fd: FormData
): Promise<{ error?: string; ok?: boolean }> {
  await requireAdmin();
  const id = Number(s(fd, "id"));
  const slug = s(fd, "slug");
  const field = s(fd, "field");
  const raw = s(fd, "content");
  if (!["abilityMatrixJson", "courseSystemJson", "trainingSystemJson"].includes(field)) {
    return { error: "非法字段" };
  }
  if (raw) {
    try {
      JSON.parse(raw);
    } catch {
      return { error: "JSON 格式错误，请检查后重试" };
    }
  }
  await prisma.major.update({
    where: { id },
    data: { [field]: raw || null },
  });
  revalidateAll(slug);
  return { ok: true };
}

// 三块专业内容：参数式保存（结构化编辑器直接传对象）
export async function saveMajorContent(
  id: number,
  slug: string,
  field: string,
  content: unknown
): Promise<{ ok?: boolean; error?: string }> {
  await requireAdmin();
  if (!["abilityMatrixJson", "courseSystemJson", "trainingSystemJson"].includes(field)) {
    return { error: "非法字段" };
  }
  let raw: string | null = null;
  if (content != null) {
    try {
      raw = JSON.stringify(content, null, 2);
      JSON.parse(raw);
    } catch {
      return { error: "数据序列化失败，请检查内容" };
    }
  }
  await prisma.major.update({
    where: { id },
    data: { [field]: raw },
  });
  revalidateAll(slug);
  return { ok: true };
}

// ===== 新闻管理 =====
function slugify(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || `news-${Date.now()}`
  );
}

export async function saveNews(fd: FormData) {
  await requireAdmin();
  const id = s(fd, "id");
  const title = s(fd, "title");
  const slug = s(fd, "slug") || slugify(title);
  const data = {
    title,
    slug,
    category: s(fd, "category") || "学院动态",
    summary: s(fd, "summary"),
    // 富文本编辑器产出 HTML 直接存储；空内容存空数组占位（与旧 blocks 结构兼容）
    content: s(fd, "content") || "[]",
    cover: s(fd, "cover") || null,
    sourceUrl: s(fd, "sourceUrl") || null,
    featured: s(fd, "featured") === "on",
    publishedAt: s(fd, "publishedAt") ? new Date(s(fd, "publishedAt")) : new Date(),
  };
  if (id) {
    // 更新：若 slug 与其他文章冲突，自动加后缀避免唯一约束报错
    const dup = await prisma.news.findFirst({ where: { slug, NOT: { id: Number(id) } } });
    if (dup) data.slug = `${data.slug}-${Date.now() % 10000}`;
    await prisma.news.update({ where: { id: Number(id) }, data });
  } else {
    const exists = await prisma.news.findUnique({ where: { slug } });
    if (exists) data.slug = `${data.slug}-${Date.now() % 10000}`;
    await prisma.news.create({ data });
  }
  revalidateAll();
  redirect("/admin/news");
}

export async function deleteNews(fd: FormData) {
  await requireAdmin();
  await prisma.news.delete({ where: { id: Number(s(fd, "id")) } });
  revalidateAll();
}
