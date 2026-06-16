'use client';

import { motion } from 'framer-motion';
import { Ticket } from '@/lib/types';

interface TicketCellProps {
  ticket: Ticket;
  onClick: (ticket: Ticket) => void;
  index: number;
}

export default function TicketCell({ ticket, onClick, index }: TicketCellProps) {
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
    ? 'bg-bg-elevated/60 border border-accent-cyan/25 text-accent-cyan-light cursor-pointer hover:bg-accent-cyan/10 hover:border-accent-cyan/50 hover:shadow-[0_0_16px_rgba(6,182,212,0.2)] active:scale-95'
    : isReserved
    ? 'bg-status-reserved/10 border border-status-reserved/30 text-status-reserved cursor-default'
    : 'bg-accent-purple/10 border border-accent-purple/20 text-accent-purple/60 cursor-default';

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.3,
        delay: index * 0.008,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      onClick={handleClick}
      className={`${baseClasses} ${statusClasses}`}
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
    </motion.button>
  );
}
