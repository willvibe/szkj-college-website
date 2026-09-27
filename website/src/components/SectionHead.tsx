import Reveal from "./Reveal";

export default function SectionHead({
  index,
  en,
  title,
  desc,
  dark = false,
}: {
  index: string;
  en: string;
  title: string;
  desc?: string;
  dark?: boolean;
}) {
  return (
    <Reveal>
      <div className="flex items-baseline gap-4">
        <span className={`mono-label ${dark ? "text-brand-cyan" : "text-brand"}`}>
          {index} / {en}
        </span>
        <span className={`h-px flex-1 ${dark ? "bg-white/15" : "bg-ink/15"}`} aria-hidden />
      </div>
      <h2 className={`mt-4 text-3xl md:text-5xl font-bold tracking-wide ${dark ? "text-white" : "text-ink"}`}>{title}</h2>
      {desc && (
        <p className={`mt-4 max-w-2xl text-sm md:text-base leading-7 ${dark ? "text-white/60" : "text-ink/60"}`}>{desc}</p>
      )}
    </Reveal>
  );
}
