'use client';

import { useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { useRifa } from '@/lib/rifa-context';
import { Ticket } from '@/lib/types';
import TicketCell from './ticket-cell';

interface TicketGridProps {
  onTicketSelect: (ticket: Ticket) => void;
}

export default function TicketGrid({ onTicketSelect }: TicketGridProps) {
  const { tickets } = useRifa();
  const [searchWhatsapp, setSearchWhatsapp] = useState('');

  const counts = useMemo(() => {
    const available = tickets.filter(t => t.status === 'available').length;
    const reserved = tickets.filter(t => t.status === 'reserved').length;
    const paid = tickets.filter(t => t.status === 'paid').length;
    return { available, reserved, paid };
  }, [tickets]);

  // Filter tickets matching the WhatsApp search
  const matchedNumbers = useMemo(() => {
    if (searchWhatsapp.length < 10) return new Set<number>();
    return new Set(
      tickets
        .filter(t => t.whatsapp === searchWhatsapp && (t.status === 'reserved' || t.status === 'paid'))
        .map(t => t.number)
    );
  }, [tickets, searchWhatsapp]);

  const isSearchActive = searchWhatsapp.length === 10 && matchedNumbers.size > 0;

  return (
    <section id="ticket-grid-section">
      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-md border border-white/20 bg-white/[0.05]" />
          <span className="text-xs text-text-secondary">
            Disponible <span className="text-text-muted">({counts.available})</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-md border border-status-reserved/40 bg-status-reserved/10" />
          <span className="text-xs text-text-secondary">
            Apartado <span className="text-text-muted">({counts.reserved})</span>
          </span>
        </div>
      </div>

      {/* WhatsApp Search */}
      <div className="mb-5">
        <div className="relative max-w-sm mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted z-10 pointer-events-none" />
          <input
            type="tel"
            maxLength={10}
            placeholder="Ingresa tu WhatsApp para ver tus boletos apartados"
            value={searchWhatsapp}
            onChange={e => {
              const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
              setSearchWhatsapp(digitsOnly);
            }}
            className="w-full pl-10 pr-10 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-xs text-text-primary placeholder:text-text-muted/50 focus:ring-2 focus:ring-accent-cyan/30 focus:border-accent-cyan/50 transition-all"
          />
          {searchWhatsapp && (
            <button
              onClick={() => setSearchWhatsapp('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label="Limpiar búsqueda"
            >
              <X className="w-3 h-3 text-text-muted" />
            </button>
          )}
        </div>

        {/* Search results info */}
        {searchWhatsapp.length === 10 && (
          <div className="text-center mt-3">
            {matchedNumbers.size > 0 ? (
              <p className="text-xs text-accent-cyan">
                Se encontraron <span className="font-bold">{matchedNumbers.size}</span> boleto{matchedNumbers.size > 1 ? 's' : ''} apartado{matchedNumbers.size > 1 ? 's' : ''}: <span className="font-semibold">{Array.from(matchedNumbers).sort((a, b) => a - b).join(', ')}</span>
              </p>
            ) : (
              <p className="text-xs text-text-muted">
                No se encontraron boletos apartados con este número
              </p>
            )}
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-8 lg:grid-cols-10 gap-2 sm:gap-2.5">
        {tickets.map((ticket, index) => (
          <TicketCell
            key={ticket.number}
            ticket={ticket}
            onClick={onTicketSelect}
            index={index}
            highlight={isSearchActive && matchedNumbers.has(ticket.number)}
            dim={isSearchActive && !matchedNumbers.has(ticket.number)}
          />
        ))}
      </div>
    </section>
  );
}
