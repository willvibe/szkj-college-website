"use server";

// 招生咨询表单（公开提交）：前台浮动咨询窗 → 入库，后台跟进
import { prisma } from "@/lib/prisma";

export type ConsultState = { ok?: boolean; error?: string } | null;

export async function submitConsult(_prev: ConsultState, fd: FormData): Promise<ConsultState> {
  const name = String(fd.get("name") ?? "").trim().slice(0, 40);
  const contact = String(fd.get("contact") ?? "").trim().slice(0, 60);
  const major = String(fd.get("major") ?? "").trim().slice(0, 40) || "尚未决定";
  // 蜜罐：机器人会填隐藏字段，直接丢弃
  if (String(fd.get("company") ?? "").trim()) return { ok: true };

  if (!name || !contact) return { error: "请填写称呼与联系方式" };
  if (contact.length < 5) return { error: "联系方式格式看起来不正确，请检查" };
  // 简易频率限制：同联系方式 10 分钟内最多 3 条
  const recent = await prisma.consultLead.count({
    where: { contact, createdAt: { gt: new Date(Date.now() - 10 * 60 * 1000) } },
  });
  if (recent >= 3) return { error: "提交太频繁了，请稍后再试或直接拨打 0531-87207750" };

  await prisma.consultLead.create({ data: { name, contact, major } });
  return { ok: true };
}
