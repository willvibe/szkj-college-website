import NewsList from "@/components/NewsList";
import { getNewsList } from "@/lib/queries";

export const dynamic = "force-dynamic"; // 后台管理保存后前台即时生效
export const metadata = { title: "学院动态 - 数智科技产业学院" };

export default async function NewsPage() {
  const news = await getNewsList();

  return (
    <div className="min-h-screen bg-slate-100 pt-28 pb-20">
      <div className="shell">
        <p className="mono-label text-blue-600">LATEST NEWS</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">学院动态</h1>
        <NewsList news={news} />
      </div>
    </div>
  );
}
