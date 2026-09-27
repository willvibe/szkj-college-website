import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { parse, type NewsBlock } from "@/lib/parse";
import { isHtmlContent } from "@/lib/newsText";
import Reveal from "@/components/Reveal";

export const dynamic = "force-dynamic"; // 后台管理保存后前台即时生效

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const n = await prisma.news.findUnique({ where: { slug } });
  return { title: n ? `${n.title} - 学院动态 - 数智科技产业学院` : "学院动态" };
}

export default async function NewsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const n = await prisma.news.findUnique({ where: { slug } });
  if (!n) notFound();
  const richHtml = isHtmlContent(n.content) ? n.content : null;
  const blocks = richHtml ? [] : parse<NewsBlock[]>(n.content, []);

  return (
    <div className="bg-paper pt-28 pb-20">
      <div className="shell max-w-4xl">
        <nav className="mono-label text-ink/40" aria-label="breadcrumb">
          <Link href="/" className="hover:text-brand">首页</Link> / <Link href="/news" className="hover:text-brand">学院动态</Link> / 正文
        </nav>
        <Reveal>
          <div className="mt-6 flex items-center gap-3 font-mono text-[11px] text-ink/45">
            <span className="tag tag-light">{n.category}</span>
            <time dateTime={n.publishedAt.toISOString().slice(0, 10)}>{n.publishedAt.toISOString().slice(0, 10)}</time>
          </div>
          <h1 className="mt-4 text-2xl md:text-4xl font-bold leading-snug">{n.title}</h1>
          <p className="mt-4 text-sm leading-7 text-ink/55">{n.summary}</p>
        </Reveal>

        {richHtml ? (
          /* 富文本正文（后台编辑器 / 公众号粘贴，保留原内联样式） */
          <article
            className="rich-content mt-10"
            dangerouslySetInnerHTML={{ __html: richHtml }}
          />
        ) : (
          <article className="mt-10 space-y-6">
            {blocks.map((b, i) =>
              b.t === "img" && b.src ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img key={i} src={b.src} alt={n.title} className="w-full rounded-xl" loading="lazy" />
              ) : (
                <p key={i} className="text-[15px] leading-8 text-ink/75">
                  {b.text}
                </p>
              )
            )}
          </article>
        )}

        <div className="mt-12 flex items-center justify-between border-t border-ink/10 pt-6">
          <p className="text-xs text-ink/40">来源：济南幼儿师范高等专科学校数智科技产业学院</p>
          <Link href="/news" className="text-sm text-brand hover:text-brand-cyan">← 返回动态列表</Link>
        </div>
      </div>
    </div>
  );
}
