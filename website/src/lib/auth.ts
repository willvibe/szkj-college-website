import crypto from "crypto";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, ADMIN_SECRET, ADMIN_TOKEN_TTL } from "./authConfig";

// ===== 密码哈希（scrypt）=====
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 32).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const test = crypto.scryptSync(password, salt, 32).toString("hex");
  const a = Buffer.from(hash, "hex");
  const b = Buffer.from(test, "hex");
  // 长度先比较：库中哈希损坏时 timingSafeEqual 会 throw，而非返回 false
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/** 用户不存在时执行一次等价 scrypt，抹平时序差防用户名枚举 */
export function dummyVerify() {
  crypto.scryptSync("dummy-password", "00000000000000000000000000000000", 32);
}

// ===== Token（payload.signature，HMAC-SHA256）=====
function hmac(payload: string): string {
  return crypto.createHmac("sha256", ADMIN_SECRET).update(payload).digest("base64url");
}

/** 常量时间比较两个 base64url 签名 */
function safeEqualHex(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && crypto.timingSafeEqual(ba, bb);
}

export function signToken(username: string): string {
  const payload = Buffer.from(
    JSON.stringify({ u: username, exp: Date.now() + ADMIN_TOKEN_TTL * 1000 })
  ).toString("base64url");
  return `${payload}.${hmac(payload)}`;
}

export function verifyToken(token: string | undefined | null): string | null {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  if (!safeEqualHex(hmac(payload), sig)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString()) as { u: string; exp: number };
    if (Date.now() > data.exp) return null;
    return data.u;
  } catch {
    return null;
  }
}

// ===== 会话读取（Server Actions / 服务端组件用）=====
export async function getAdminUser(): Promise<string | null> {
  const store = await cookies();
  return verifyToken(store.get(ADMIN_COOKIE)?.value);
}

// Server Actions 统一鉴权：未登录抛错
export async function requireAdmin(): Promise<string> {
  const u = await getAdminUser();
  if (!u) throw new Error("未登录或会话已过期，请重新登录");
  return u;
}
