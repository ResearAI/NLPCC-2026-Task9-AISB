import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto" style={{ background: 'var(--navy-800)', color: 'rgba(255,255,255,0.7)' }}>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                   style={{ background: 'var(--gold-500)', color: 'var(--navy-900)' }}>AI</div>
              <span style={{ fontFamily: "'Playfair Display', Georgia, serif", color: 'white' }} className="text-lg font-semibold">
                AISB 2026
              </span>
            </div>
            <p className="text-sm leading-relaxed opacity-70 max-w-md">
              AI Scientist Benchmark -- NLPCC 2026 Shared Task.
              Evaluating autonomous AI research systems with integrity verification.
            </p>
            <p className="text-sm mt-2 opacity-70" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
              WestlakeNLP &middot; Prof. Yue Zhang
            </p>
          </div>
          <div className="flex flex-col gap-2 text-sm opacity-70">
            <span className="text-xs uppercase tracking-wider font-semibold mb-1 opacity-50">Competition</span>
            <Link href="/tracks" className="hover:text-white transition">Tracks / 赛道</Link>
            <Link href="/leaderboard" className="hover:text-white transition">Leaderboard</Link>
            <Link href="/cfp" className="hover:text-white transition">Call for Participation</Link>
            <Link href="/rules" className="hover:text-white transition">Rules</Link>
          </div>
          <div className="flex flex-col gap-2 text-sm opacity-70">
            <span className="text-xs uppercase tracking-wider font-semibold mb-1 opacity-50">Resources</span>
            <Link href="/integrity" className="hover:text-white transition">Integrity System</Link>
            <Link href="/timeline" className="hover:text-white transition">Timeline</Link>
            <a href="https://github.com/ResearAI/NLPCC-2026-Task9-AISB" target="_blank" rel="noreferrer" className="hover:text-white transition">GitHub</a>
            <a href="mailto:sunjoey035@gmail.com" className="hover:text-white transition">sunjoey035@gmail.com</a>
          </div>
        </div>
        <div className="mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs opacity-50"
             style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <span>2026 AISB. Part of NLPCC 2026. CCF-NLP Certified.</span>
          <span style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>ICLR 格式 &middot; 完整代码 &middot; 可复现验证</span>
        </div>
      </div>
    </footer>
  );
}
