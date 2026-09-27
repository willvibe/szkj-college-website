import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ADMIN_COOKIE, ADMIN_TOKEN_TTL, DEFAULT_ADMIN } from "@/lib/authConfig";
import { signToken, verifyPassword, hashPassword } from "@/lib/auth";

export async function POST(req: Request) {
  const { username, password } = (await req.json().catch(() => ({}))) as {
    username?: string;
    password?: string;
  };
  if (!username || !password) {
    return NextResponse.json({ error: "请输入用户名和密码" }, { status: 400 });
  }

  // 首次引导：无任何管理员时，用默认账号初始化
  let user = await prisma.adminUser.findUnique({ where: { username } });
  if (!user) {
    const count = await prisma.adminUser.count();
    if (count === 0 && username === DEFAULT_ADMIN.username && password === DEFAULT_ADMIN.password) {
      user = await prisma.adminUser.create({
        data: { username, passwordHash: hashPassword(password), displayName: "系统管理员" },
      });
    }
  }

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json({ error: "用户名或密码错误" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, signToken(user.username), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_TOKEN_TTL,
  });
  return res;
}
