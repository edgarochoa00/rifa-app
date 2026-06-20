'use client';

import Link from 'next/link';
import { Settings, Mountain } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 glass-strong">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl glass bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center shadow-lg group-hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] group-hover:bg-gradient-to-br group-hover:from-cyan-500/30 group-hover:to-purple-500/30 transition-all duration-300">
            <Mountain className="w-6 h-6 text-white drop-shadow-md" />
          </div>
        </Link>

        <Link
          href="/admin"
          className="w-9 h-9 rounded-xl bg-bg-elevated hover:bg-bg-hover border border-border-subtle flex items-center justify-center transition-all duration-200 hover:border-accent-cyan/30"
          aria-label="Panel de administración"
        >
          <Settings className="w-4 h-4 text-text-muted" />
        </Link>
      </div>
    </header>
  );
}
