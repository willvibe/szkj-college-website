// 后台认证配置（Node/Edge 通用常量）
export const ADMIN_COOKIE = "szkj_admin";
export const ADMIN_SECRET = process.env.ADMIN_SECRET ?? "szkj-college-admin-secret-2026";
export const ADMIN_TOKEN_TTL = 60 * 60 * 12; // 12 小时（秒）
export const DEFAULT_ADMIN = { username: "admin", password: "admin123" };
