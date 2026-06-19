'use client';

import Link from 'next/link';
import { Settings, Ticket } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 glass-strong">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center shadow-lg group-hover:shadow-accent-cyan/20 transition-shadow duration-300">
            <Ticket className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-text-primary leading-tight tracking-tight">
              Rifa Ford LTD
            </h1>
            <p className="text-[10px] text-text-muted font-medium uppercase tracking-widest">
              161 Boletos
            </p>
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
