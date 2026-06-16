'use client';

import { useMemo } from 'react';
import { useRifa } from '@/lib/rifa-context';
import { Ticket } from '@/lib/types';
import TicketCell from './ticket-cell';

interface TicketGridProps {
  onTicketSelect: (ticket: Ticket) => void;
}

export default function TicketGrid({ onTicketSelect }: TicketGridProps) {
  const { tickets } = useRifa();

  const counts = useMemo(() => {
    const available = tickets.filter(t => t.status === 'available').length;
    const reserved = tickets.filter(t => t.status === 'reserved').length;
    const paid = tickets.filter(t => t.status === 'paid').length;
    return { available, reserved, paid };
  }, [tickets]);

  return (
    <section id="ticket-grid-section">
      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-md border border-accent-cyan/50 bg-accent-cyan/10" />
          <span className="text-xs text-text-secondary">
            Disponible <span className="text-text-muted">({counts.available})</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-md border border-status-reserved/50 bg-status-reserved/10" />
          <span className="text-xs text-text-secondary">
            Apartado <span className="text-text-muted">({counts.reserved})</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-md border border-accent-purple/40 bg-accent-purple/10" />
          <span className="text-xs text-text-secondary">
            Pagado <span className="text-text-muted">({counts.paid})</span>
          </span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-8 lg:grid-cols-10 gap-2 sm:gap-2.5">
        {tickets.map((ticket, index) => (
          <TicketCell
            key={ticket.number}
            ticket={ticket}
            onClick={onTicketSelect}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}
