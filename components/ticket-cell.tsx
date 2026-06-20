'use client';

import { memo } from 'react';
import { Ticket } from '@/lib/types';

interface TicketCellProps {
  ticket: Ticket;
  onClick: (ticket: Ticket) => void;
  index: number;
}

const TicketCell = memo(function TicketCell({ ticket, onClick, index }: TicketCellProps) {
  const isAvailable = ticket.status === 'available';
  const isReserved = ticket.status === 'reserved';
  const isPaid = ticket.status === 'paid';

  const handleClick = () => {
    if (isAvailable) {
      onClick(ticket);
    }
  };

  const baseClasses = 'relative aspect-square rounded-xl flex items-center justify-center ticket-number text-sm font-semibold transition-all duration-200 select-none';

  const statusClasses = isAvailable
    ? 'bg-white/[0.03] border border-white/10 text-text-primary/90 cursor-pointer hover:bg-accent-cyan/10 hover:border-accent-cyan/40 hover:text-accent-cyan-light hover:shadow-[0_0_20px_rgba(6,182,212,0.25)] active:scale-95'
    : isReserved
    ? 'bg-status-reserved/10 border border-status-reserved/20 text-status-reserved/80 cursor-default'
    : 'bg-accent-purple/10 border border-accent-purple/20 text-accent-purple/60 cursor-default';

  return (
    <button
      onClick={handleClick}
      className={`${baseClasses} ${statusClasses} animate-fade-in`}
      style={{ animationDelay: `${index * 0.005}s` }}
      disabled={!isAvailable}
      aria-label={`Boleto ${ticket.number} - ${
        isAvailable ? 'Disponible' : isReserved ? 'Apartado' : 'Pagado'
      }`}
    >
      {ticket.number}

      {/* Paid checkmark overlay */}
      {isPaid && (
        <div className="absolute inset-0 rounded-xl flex items-center justify-center bg-accent-purple/5">
          <svg className="absolute top-1 right-1 w-3 h-3 text-accent-purple/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}

      {/* Reserved clock overlay */}
      {isReserved && (
        <svg className="absolute top-1 right-1 w-3 h-3 text-status-reserved/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" strokeLinecap="round" />
        </svg>
      )}
    </button>
  );
});

export default TicketCell;
