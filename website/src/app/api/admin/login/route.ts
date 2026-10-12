import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ADMIN_COOKIE, ADMIN_TOKEN_TTL, DEFAULT_ADMIN } from "@/lib/authConfig";
import { signToken, verifyPassword, hashPassword, dummyVerify } from "@/lib/auth";

// 登录失败限流（内存实现，进程级）：IP+用户名 10 分钟内最多 5 次失败
const FAIL_LIMIT = 5;
const FAIL_WINDOW = 10 * 60 * 1000;
const fails = new Map<string, { n: number; until: number }>();

function clientIp(req: Request) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
}

function tooManyFails(key: string) {
  const f = fails.get(key);
  if (!f) return false;
  if (Date.now() > f.until) {
    fails.delete(key);
    return false;
  }
  return f.n >= FAIL_LIMIT;
}

function recordFail(key: string) {
  const f = fails.get(key);
  if (f && Date.now() <= f.until) f.n++;
  else fails.set(key, { n: 1, until: Date.now() + FAIL_WINDOW });
}

function clearFails(key: string) {
  fails.delete(key);
}

export async function POST(req: Request) {
  const { username, password } = (await req.json().catch(() => ({}))) as {
    username?: string;
    password?: string;
  };
  if (!username || !password) {
    return NextResponse.json({ error: "请输入用户名和密码" }, { status: 400 });
  }

  const ip = clientIp(req);
  const key = `${ip}|${username}`;
  if (tooManyFails(key)) {
    return NextResponse.json({ error: "尝试次数过多，请 10 分钟后再试" }, { status: 429 });
  }

  // 首次引导：无任何管理员时，用默认账号初始化（create 捕获并发唯一冲突后重查）
  let user = await prisma.adminUser.findUnique({ where: { username } });
  if (!user) {
    const count = await prisma.adminUser.count();
    if (count === 0 && username === DEFAULT_ADMIN.username && password === DEFAULT_ADMIN.password) {
      try {
        user = await prisma.adminUser.create({
          data: { username, passwordHash: hashPassword(password), displayName: "系统管理员" },
        });
      } catch {
        user = await prisma.adminUser.findUnique({ where: { username } });
      }
    }
  }

  if (!user) {
    dummyVerify(); // 抹平"用户不存在"与"密码错误"的耗时差，防用户名枚举
    recordFail(key);
    return NextResponse.json({ error: "用户名或密码错误" }, { status: 401 });
  }
  if (!verifyPassword(password, user.passwordHash)) {
    recordFail(key);
    return NextResponse.json({ error: "用户名或密码错误" }, { status: 401 });
  }

  clearFails(key);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, signToken(user.username), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_TOKEN_TTL,
  });
  return res;
}
