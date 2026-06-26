'use client';

import Link from 'next/link';
import { Settings, Mountain, HelpCircle } from 'lucide-react';

export default function Header() {
  const scrollToHowItWorks = () => {
    const el = document.getElementById('como-funciona');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 glass-strong">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between relative">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl glass bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center shadow-lg group-hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] group-hover:bg-gradient-to-br group-hover:from-cyan-500/30 group-hover:to-purple-500/30 transition-all duration-300">
            <Mountain className="w-6 h-6 text-white drop-shadow-md" />
          </div>
        </Link>

        <div className="absolute left-1/2 -translate-x-1/2 pointer-events-none">
          <p className="text-accent-cyan text-[9px] sm:text-xs font-medium bg-accent-cyan/10 border border-accent-cyan/20 py-1 sm:py-1.5 px-2 sm:px-4 rounded-full whitespace-nowrap">
            Del 25 de junio al 15 de agosto de 2026
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={scrollToHowItWorks}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent-cyan/10 text-accent-cyan hover:bg-accent-cyan/20 border border-accent-cyan/20 transition-all duration-200 text-xs font-semibold"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            ¿Cómo funciona?
          </button>
          
          <button
            onClick={scrollToHowItWorks}
            className="sm:hidden w-9 h-9 rounded-xl bg-accent-cyan/10 text-accent-cyan hover:bg-accent-cyan/20 border border-accent-cyan/20 flex items-center justify-center transition-all duration-200"
            aria-label="¿Cómo funciona?"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          <Link
            href="/admin"
            className="w-9 h-9 rounded-xl bg-bg-elevated hover:bg-bg-hover border border-border-subtle flex items-center justify-center transition-all duration-200 hover:border-accent-cyan/30"
            aria-label="Panel de administración"
          >
            <Settings className="w-4 h-4 text-text-muted" />
          </Link>
        </div>
      </div>
    </header>
  );
}
