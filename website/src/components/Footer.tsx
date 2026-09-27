import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative border-t border-slate-800 bg-brand-navy py-16 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Col 1: College Info */}
          <div className="md:col-span-2">
            <div className="mb-4 flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/brand/logo-round.png" alt="数智科技产业学院徽标" className="h-10 w-10" />
              <div>
                <div className="text-xs font-medium text-slate-400">济南幼儿师范高等专科学校</div>
                <div className="text-base font-bold tracking-tight text-white">数智科技产业学院</div>
              </div>
            </div>
            <p className="mb-4 max-w-sm text-xs leading-relaxed text-slate-400">
              面向数字经济与新一代信息技术产业，以数智素养突出的高技能复合人才为培养核心，构建集人才培养、科研创新、社会服务于一体的产业育人高地。
            </p>
            <div className="font-mono text-xs text-cyan-400">CONNECT DIGITAL INTELLIGENCE WITH REAL INDUSTRY</div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="mb-4 font-mono text-xs font-bold uppercase tracking-wider text-white">快速导航</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/" className="transition-colors hover:text-white">学院首页</Link></li>
              <li><Link href="/about" className="transition-colors hover:text-white">学院概况与核心数据</Link></li>
              <li><Link href="/majors" className="transition-colors hover:text-white">四大王牌专业建设</Link></li>
              <li><Link href="/industry" className="transition-colors hover:text-white">产教融合十步育人</Link></li>
              <li><Link href="/base" className="transition-colors hover:text-white">1500㎡+生产型实训基地</Link></li>
              <li><Link href="/works" className="transition-colors hover:text-white">成果展示与作品库</Link></li>
              <li><Link href="/admission" className="transition-colors hover:text-white">招生咨询与就业走向</Link></li>
            </ul>
          </div>

          {/* Col 3: Contact & Campus */}
          <div>
            <h4 className="mb-4 font-mono text-xs font-bold uppercase tracking-wider text-white">联系与地址</h4>
            <p className="mb-2 text-xs leading-relaxed">地址：山东省济南市长清区大学科技园丹桂路2011号</p>
            <p className="mb-2 text-xs leading-relaxed">电话：0531-87207750</p>
            <p className="mb-4 text-xs leading-relaxed">邮编：250307</p>
            <a
              href="https://www.jnpec.edu.cn"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300"
            >
              <span>访问学校官方门户</span> ↗
            </a>
          </div>
        </div>

        {/* Sub Bottom Line */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 font-mono text-[11px] text-slate-500 sm:flex-row">
          <div>Copyright © 2026 济南幼儿师范高等专科学校 数智科技产业学院. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <span>鲁ICP备05002934号</span>
            <span>公安网安备案保护中</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
