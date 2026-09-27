import Link from "next/link";

export default function PageHero({
  index,
  en,
  title,
  desc,
}: {
  index: string;
  en: string;
  title: string;
  desc?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-ink pt-36 pb-16 text-white md:pb-20">
      <div className="absolute inset-0 grid-bg-dark" aria-hidden />
      {/* 大号描边背景字 */}
      <div
        className="text-stroke-dark pointer-events-none absolute -right-6 bottom-0 select-none font-mono text-[22vw] font-bold leading-none opacity-60 md:text-[15vw]"
        aria-hidden
      >
        {index}
      </div>
      {/* 坐标装饰 */}
      <p className="absolute right-6 top-24 hidden font-mono text-[10px] tracking-[0.2em] text-white/25 md:block" aria-hidden>
        36.55°N / 116.80°E
      </p>
      <div className="shell relative">
        <nav className="mono-label text-white/35" aria-label="breadcrumb">
          <Link href="/" className="transition-colors hover:text-brand-cyan">
            首页
          </Link>
          <span className="mx-2 text-white/20">/</span>
          <span className="text-white/60">{title}</span>
        </nav>
        <div className="mt-8 flex items-center gap-4">
          <span className="h-px w-10 bg-brand-cyan" aria-hidden />
          <p className="mono-label text-brand-cyan">
            {index} / {en}
          </p>
        </div>
        <h1 className="mt-4 text-4xl font-bold tracking-wide md:text-6xl">{title}</h1>
        {desc && <p className="mt-5 max-w-2xl text-sm leading-7 text-white/60 md:text-base">{desc}</p>}
      </div>
    </section>
  );
}
