import { changePassword } from "@/app/admin/actions";
import { getAdminUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

const input = "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-400";

export default async function AdminSettingsPage() {
  const user = await getAdminUser();

  return (
    <div className="max-w-lg">
      <div className="mb-6">
        <p className="mono-label text-brand">ADMIN · ACCOUNT SECURITY</p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight">账号安全</h1>
        <p className="mt-1 text-sm text-slate-500">当前登录：{user}。修改密码后将自动退出，需用新密码重新登录。</p>
      </div>

      <form action={changePassword} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
        <label className="block">
          <span className="text-[11px] font-semibold text-slate-500">当前密码 *</span>
          <input name="oldPassword" type="password" required className={input} autoComplete="current-password" />
        </label>
        <label className="block">
          <span className="text-[11px] font-semibold text-slate-500">新密码 *（至少 8 位，建议字母+数字组合）</span>
          <input name="newPassword" type="password" required minLength={8} className={input} autoComplete="new-password" />
        </label>
        <label className="block">
          <span className="text-[11px] font-semibold text-slate-500">确认新密码 *</span>
          <input name="confirmPassword" type="password" required minLength={8} className={input} autoComplete="new-password" />
        </label>
        <button className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-bold text-white hover:bg-blue-700">
          修改密码并重新登录
        </button>
      </form>

      <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/50 p-4 text-xs leading-6 text-blue-900">
        <p className="font-bold">安全建议</p>
        <p>· 首次部署后请立即修改初始密码，并避免使用 admin123 等弱口令</p>
        <p>· 登录接口已开启失败限流（10 分钟内 5 次），连续失败将临时锁定</p>
        <p>· 会话有效期 12 小时，退出登录请点击左下角「退出登录」</p>
      </div>
    </div>
  );
}
