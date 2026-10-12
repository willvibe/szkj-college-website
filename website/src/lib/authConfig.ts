// 后台认证配置（Node/Edge 通用常量）
export const ADMIN_COOKIE = "szkj_admin";
// 签名密钥必须由环境变量提供（website/.env / 部署环境），缺失时拒绝启动，杜绝源码默认值被伪造 token
export const ADMIN_SECRET = (() => {
  const s = process.env.ADMIN_SECRET;
  if (!s || s.length < 16) {
    throw new Error("[authConfig] 缺少或过短的 ADMIN_SECRET 环境变量（≥16 字符），请在 .env 或部署环境中配置");
  }
  return s;
})();
export const ADMIN_TOKEN_TTL = 60 * 60 * 12; // 12 小时（秒）
export const DEFAULT_ADMIN = { username: "admin", password: "admin123" };
