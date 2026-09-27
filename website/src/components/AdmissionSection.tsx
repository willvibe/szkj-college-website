import Link from "next/link";
import Reveal from "./Reveal";
import type { MajorRow } from "@/lib/types";

const YEARS = [
  {
    y: "YEAR 01 · 筑牢底座与素养养成",
    t: "专业认知与数字通识技能实训",
    desc: "学习计算机网络、Python程序设计、数据科学导论等底层基础；通过入门微任务走进6大实训室，明确未来兴趣方向。",
    dot: "bg-blue-600",
  },
  {
    y: "YEAR 02 · PBL核心课与名企导师带教",
    t: "跨专业组队实战与技能考证摘星",
    desc: "10余名企业一线实战导师进驻课堂，承接真实项目任务；组织参与省级以上职业技能大赛，获取“1+X”高含金量职业技能证书。",
    dot: "bg-cyan-400",
  },
  {
    y: "YEAR 03 · 顶岗生产与作品集答辩",
    t: "高质量名企就业 / 专升本无缝深造",
    desc: "进入校外实训基地进行综合顶岗实战，交付个人工业级作品集；同步开设系统化专升本升学辅导通道。",
    dot: "bg-emerald-400",
  },
];

const CAREERS = [
  {
    num: "96.61%",
    color: "text-emerald-600",
    title: "对口高质量就业",
    desc: "毕业生广泛进入银行机构、金融科技、头部电商、AI人工智能与大数据技术创新企业。",
  },
  {
    num: "专升本",
    color: "text-blue-600",
    title: "畅通学历提升通道",
    desc: "针对专升本考试提供专业教研团队辅导，每年均有大量学子考入省内全日制本科高校。",
  },
  {
    num: "双创孵化",
    color: "text-amber-500",
    title: "精益创新创业支持",
    desc: "依托精益创业实训室，多组学生团队承接自媒体代运营、电商货源代销与数据清洗，实现自主创业。",
  },
];

export default function AdmissionSection({ majors, entry = true }: { majors: MajorRow[]; entry?: boolean }) {
  return (
    <section id="admission" className="relative bg-white py-24">
      <div className="shell">
        {/* 头部 */}
        <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <Reveal>
            <div className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-blue-600">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600" aria-hidden />
              ADMISSIONS &amp; CAREERS / 06 · 发展路径
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">从专业技能走向广阔未来</h2>
            <p className="mt-2 text-base text-slate-600">清晰的三年成长路径：就业、升学、创新创业协同并进。</p>
            {entry && (
              <Link href="/admission" className="mt-3 inline-block text-sm font-semibold text-blue-600 hover:text-blue-700">
                进入招生就业 →
              </Link>
            )}
          </Reveal>
          <Reveal delay={100}>
            <Link
              href="/admission"
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md transition-all hover:bg-blue-500"
            >
              获取最新单招与统招计划
            </Link>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* 左：专业怎么选 */}
          <Reveal className="lg:col-span-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <span className="mb-2 block font-mono text-xs font-bold uppercase tracking-wider text-blue-600">ADMISSION GUIDE</span>
              <h3 className="mb-4 text-lg font-bold text-slate-900">专业怎么选？</h3>
              <div className="space-y-3 text-xs">
                {[
                  { like: "喜欢算法 / 智能硬件 / AIGC", go: "人工智能技术应用" },
                  { like: "喜欢数据洞察 / 商业分析", go: "大数据技术" },
                  { like: "喜欢运营 / 直播 / 商业出海", go: "电子商务" },
                  { like: "喜欢金融理财 / 风控逻辑", go: "金融科技应用" },
                ].map((x) => (
                  <div key={x.go} className="rounded-xl border border-slate-200/80 bg-white p-3">
                    <span className="mb-0.5 block font-bold text-slate-800">{x.like}</span>
                    <span className="text-slate-500">首选 → {x.go}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 border-t border-slate-200 pt-6 text-center">
                <span className="mb-3 block font-mono text-[11px] text-slate-400">咨询热线：0531-87207750</span>
                <Link
                  href="/admission"
                  className="block w-full rounded-lg bg-blue-600 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  在线登记意向专业
                </Link>
              </div>
            </div>
          </Reveal>

          {/* 中：三年时间轴 */}
          <Reveal delay={100} className="lg:col-span-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 text-white shadow-xl sm:p-8">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs uppercase tracking-widest text-cyan-400">ROADMAP</span>
                  <h3 className="mt-0.5 text-xl font-bold text-white">在数智学院的完整三年经历</h3>
                </div>
                <span className="font-mono text-xs text-slate-400">学制：三年全日制</span>
              </div>
              <div className="relative space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
                {YEARS.map((y) => (
                  <div key={y.y} className="relative pl-8">
                    <div className={`absolute left-1.5 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-slate-900 ${y.dot}`} aria-hidden />
                    <span className="mb-1 block font-mono text-xs font-bold text-cyan-400">{y.y}</span>
                    <h4 className="text-sm font-bold text-white">{y.t}</h4>
                    <p className="mt-1 text-xs leading-relaxed text-slate-400">{y.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* 右：发展通道 */}
          <Reveal delay={200} className="lg:col-span-3">
            <div className="space-y-4">
              {CAREERS.map((c) => (
                <div key={c.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className={`mb-1 font-mono text-2xl font-black ${c.color}`}>{c.num}</div>
                  <h4 className="text-xs font-bold text-slate-800">{c.title}</h4>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-500">{c.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
