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
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(test, "hex"));
}

// ===== Token（payload.signature，HMAC-SHA256）=====
function hmac(payload: string): string {
  return crypto.createHmac("sha256", ADMIN_SECRET).update(payload).digest("base64url");
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
  if (hmac(payload) !== sig) return null;
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
