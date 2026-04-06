"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/tracks", label: "Tracks" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/integrity", label: "Integrity" },
  { href: "/rules", label: "Rules" },
  { href: "/timeline", label: "Timeline" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl border-b"
            style={{ background: 'rgba(255,255,255,0.92)', borderColor: 'var(--gray-200)' }}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold"
               style={{ background: 'var(--navy-700)', color: 'white' }}>
            AI
          </div>
          <div className="flex flex-col leading-tight">
            <span style={{ fontFamily: "'Playfair Display', Georgia, serif", color: 'var(--navy-800)' }}
                  className="text-lg tracking-tight font-semibold">
              AISB <span style={{ color: 'var(--gray-400)' }}>2026</span>
            </span>
            <span className="text-[10px] tracking-[0.12em] uppercase" style={{ color: 'var(--gray-400)' }}>
              NLPCC Shared Task
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex gap-0.5">
          {NAV_LINKS.map((link) => {
            const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link key={link.href} href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "text-[var(--navy-700)] font-semibold"
                    : "text-[var(--gray-500)] hover:text-[var(--navy-700)]"
                }`}
                style={isActive ? { background: 'var(--gray-100)' } : {}}>
                {link.label}
              </Link>
            );
          })}
          <Link href="/cfp"
                className="px-4 py-2 rounded-lg text-sm font-semibold ml-2 transition-all"
                style={{
                  background: pathname === "/cfp" ? 'var(--gold-500)' : 'var(--gold-100)',
                  color: pathname === "/cfp" ? 'white' : 'var(--gold-600)',
                  border: '1px solid var(--gold-300)',
                }}>
            CFP
          </Link>
          <a href="https://forms.gle/9oWtS77UduudpRM1A" target="_blank" rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg text-sm font-semibold ml-1 transition-all hover:brightness-110"
                style={{ background: 'var(--navy-700)', color: 'white' }}>
            Register
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <a href="https://github.com/ResearAI/NLPCC-2026-Task9-AISB" target="_blank" rel="noreferrer"
             className="text-sm transition hidden sm:block" style={{ color: 'var(--gray-400)' }}>
            GitHub
          </a>
        </div>
      </div>
    </header>
  );
}
