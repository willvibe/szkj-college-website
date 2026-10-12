"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin, verifyPassword, hashPassword } from "@/lib/auth";
import { ADMIN_COOKIE } from "@/lib/authConfig";
import { sanitizeRichHtml } from "@/lib/sanitize";

const s = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const arr = (fd: FormData, k: string) =>
  s(fd, k)
    .split(/[\n,，]/)
    .map((x) => x.trim())
    .filter(Boolean);

/** 表单 id 安全解析：非法/缺失返回 null */
function safeId(fd: FormData, key = "id"): number | null {
  const n = Number(s(fd, key));
  return Number.isInteger(n) && n > 0 ? n : null;
}

/** Prisma 记录不存在（并发删除/错误 id）：删除类操作按幂等成功处理 */
function isMissingRecord(e: unknown): boolean {
  return e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025";
}

/** 轮播/富文本链接协议校验：仅允许站内路径与 http(s) 外链，阻断 javascript: 等 */
function assertSafeLink(link: string) {
  if (link && !link.startsWith("/") && !/^https?:\/\//i.test(link)) {
    throw new Error("跳转链接必须以 / 开头（站内路径）或为 http(s) 地址");
  }
}

function revalidateAll(slug?: string) {
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/majors");
  revalidatePath("/news");
  if (slug) revalidatePath(`/majors/${slug}`);
}

// ===== 首页核心数据 =====
export async function saveStat(fd: FormData) {
  await requireAdmin();
  const id = safeId(fd);
  if (!id) throw new Error("指标 ID 无效");
  const value = s(fd, "value");
  if (!/^[\d.]/.test(value)) throw new Error("指标数值必须以数字开头（如 3000 或 98.5%），请检查后重试");
  await prisma.collegeStat.update({
    where: { id },
    data: {
      value,
      suffix: s(fd, "suffix") || null,
      label: s(fd, "label"),
      englishLabel: s(fd, "englishLabel") || null,
      description: s(fd, "description") || null,
      sort: Number(s(fd, "sort")) || 0,
      updatedAt: new Date().toISOString().slice(0, 10),
    },
  });
  revalidateAll();
}

export async function addStat(fd: FormData) {
  await requireAdmin();
  const value = s(fd, "value");
  if (!/^[\d.]/.test(value)) throw new Error("指标数值必须以数字开头（如 3000 或 98.5%），请检查后重试");
  await prisma.collegeStat.create({
    data: {
      value,
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
  const id = safeId(fd);
  if (!id) throw new Error("指标 ID 无效");
  try {
    await prisma.collegeStat.delete({ where: { id } });
  } catch (e) {
    if (!isMissingRecord(e)) throw e; // 并发已删视为成功（幂等）
  }
  revalidateAll();
}

// ===== 专业管理 =====
export async function saveMajorBasic(fd: FormData) {
  await requireAdmin();
  const id = safeId(fd);
  if (!id) throw new Error("专业 ID 无效");
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

// 三块专业内容：参数式保存（结构化编辑器直接传对象）；清空 = 恢复内置数据
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
  if (!Number.isInteger(id) || id <= 0) {
    return { error: "专业 ID 无效" };
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

// ===== 首页轮播海报 =====
export async function saveCarousel(fd: FormData) {
  await requireAdmin();
  const id = safeId(fd);
  if (!id) throw new Error("海报 ID 无效");
  const link = s(fd, "link");
  assertSafeLink(link);
  const image = s(fd, "image");
  if (!image) throw new Error("海报图不能为空，请先上传或粘贴图片地址");
  await prisma.carouselItem.update({
    where: { id },
    data: {
      title: s(fd, "title"),
      subtitle: s(fd, "subtitle") || null,
      badge: s(fd, "badge") || null,
      image,
      link: link || null,
      btnText: s(fd, "btnText") || null,
      active: s(fd, "active") === "on",
      sort: Number(s(fd, "sort")) || 0,
    },
  });
  revalidatePath("/");
}

export async function addCarousel(fd: FormData) {
  await requireAdmin();
  const link = s(fd, "link");
  assertSafeLink(link);
  const image = s(fd, "image");
  if (!image) throw new Error("海报图不能为空，请先上传或粘贴图片地址");
  await prisma.carouselItem.create({
    data: {
      title: s(fd, "title"),
      subtitle: s(fd, "subtitle") || null,
      badge: s(fd, "badge") || null,
      image,
      link: link || null,
      btnText: s(fd, "btnText") || null,
      active: true,
      sort: Number(s(fd, "sort")) || 99,
    },
  });
  revalidatePath("/");
}

export async function deleteCarousel(fd: FormData) {
  await requireAdmin();
  const id = safeId(fd);
  if (!id) throw new Error("海报 ID 无效");
  try {
    await prisma.carouselItem.delete({ where: { id } });
  } catch (e) {
    if (!isMissingRecord(e)) throw e;
  }
  revalidatePath("/");
}

// ===== 招生咨询线索 =====
export async function toggleConsultHandled(fd: FormData) {
  await requireAdmin();
  const id = safeId(fd);
  if (!id) throw new Error("线索 ID 无效");
  const handled = s(fd, "handled") === "on";
  await prisma.consultLead.update({ where: { id }, data: { handled } }).catch((e) => {
    if (!isMissingRecord(e)) throw e;
  });
}

export async function deleteConsult(fd: FormData) {
  await requireAdmin();
  const id = safeId(fd);
  if (!id) throw new Error("线索 ID 无效");
  try {
    await prisma.consultLead.delete({ where: { id } });
  } catch (e) {
    if (!isMissingRecord(e)) throw e;
  }
}

// ===== 账号安全 =====
export async function changePassword(fd: FormData) {
  const me = await requireAdmin();
  const oldPwd = s(fd, "oldPassword");
  const newPwd = s(fd, "newPassword");
  const confirm = s(fd, "confirmPassword");
  if (newPwd.length < 8) throw new Error("新密码至少 8 位");
  if (newPwd !== confirm) throw new Error("两次输入的新密码不一致");
  const user = await prisma.adminUser.findUnique({ where: { username: me } });
  if (!user || !verifyPassword(oldPwd, user.passwordHash)) {
    throw new Error("当前密码错误");
  }
  await prisma.adminUser.update({
    where: { username: me },
    data: { passwordHash: hashPassword(newPwd) },
  });
  // 改密后使当前会话失效，强制重新登录
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  redirect("/admin/login");
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
  if (!/^[a-z0-9\u4e00-\u9fa5-]+$/.test(slug)) {
    throw new Error("别名（slug）只能包含小写字母、数字、中文与连字符");
  }
  const publishedRaw = s(fd, "publishedAt");
  let publishedAt = new Date();
  if (publishedRaw) {
    const d = new Date(publishedRaw);
    if (Number.isNaN(d.getTime())) throw new Error("发布日期格式无效");
    publishedAt = d;
  }
  const cover = s(fd, "cover");
  assertSafeLink(cover);
  const sourceUrl = s(fd, "sourceUrl");
  assertSafeLink(sourceUrl);
  const data = {
    title,
    slug,
    category: s(fd, "category") || "学院动态",
    summary: s(fd, "summary"),
    // 富文本 HTML 服务端净化后再入库（防存储型 XSS）；空内容存空数组占位
    content: s(fd, "content") ? sanitizeRichHtml(s(fd, "content")) : "[]",
    cover: cover || null,
    sourceUrl: sourceUrl || null,
    featured: s(fd, "featured") === "on",
    publishedAt,
  };
  try {
    if (id) {
      const nid = Number(id);
      if (!Number.isInteger(nid) || nid <= 0) throw new Error("新闻 ID 无效");
      await prisma.news.update({ where: { id: nid }, data });
    } else {
      await prisma.news.create({ data });
    }
  } catch (e) {
    // slug 唯一冲突（并发/同题）：追加时间后缀重试一次
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      const retry = { ...data, slug: `${data.slug}-${Date.now().toString(36)}` };
      if (id) await prisma.news.update({ where: { id: Number(id) }, data: retry });
      else await prisma.news.create({ data: retry });
    } else {
      throw e;
    }
  }
  revalidateAll();
  redirect("/admin/news");
}

export async function deleteNews(fd: FormData) {
  await requireAdmin();
  const id = safeId(fd);
  if (!id) throw new Error("新闻 ID 无效");
  try {
    await prisma.news.delete({ where: { id } });
  } catch (e) {
    if (!isMissingRecord(e)) throw e;
  }
  revalidateAll();
}
