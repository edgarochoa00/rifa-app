'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useRifa } from '@/lib/rifa-context';
import { TICKET_PRICE, TOTAL_TICKETS } from '@/lib/types';

export default function StatsBar() {
  const { tickets } = useRifa();

  const summary = useMemo(() => {
    const paidCount = tickets.filter(t => t.status === 'paid').length;
    const reservedCount = tickets.filter(t => t.status === 'reserved').length;
    const availableCount = tickets.filter(t => t.status === 'available').length;
    return {
      totalCollected: paidCount * TICKET_PRICE,
      availableCount,
      reservedCount,
      paidCount,
      totalTickets: TOTAL_TICKETS,
    };
  }, [tickets]);
  const progressPercent = ((summary.paidCount + summary.reservedCount) / summary.totalTickets) * 100;

  const stats = [
    {
      label: 'Disponibles',
      value: summary.availableCount,
      color: 'text-accent-cyan-light',
      bgColor: 'bg-white/[0.02] backdrop-blur-md shadow-lg',
      borderColor: 'border-accent-cyan/20',
    },
    {
      label: 'Apartados',
      value: summary.reservedCount,
      color: 'text-status-reserved',
      bgColor: 'bg-white/[0.02] backdrop-blur-md shadow-lg',
      borderColor: 'border-status-reserved/20',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className={`${stat.bgColor} ${stat.borderColor} border rounded-xl px-3 py-3 text-center`}
          >
            <p className={`text-2xl sm:text-3xl font-bold ${stat.color} tracking-tight`}>
              {stat.value}
            </p>
            <p className="text-[10px] sm:text-xs text-text-muted font-medium uppercase tracking-wider mt-0.5">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="glass rounded-xl px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-text-secondary">Progreso de venta</span>
          <span className="text-xs font-semibold text-text-primary">
            {Math.round(progressPercent)}%
          </span>
        </div>
        <div className="h-2 bg-bg-elevated rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="h-full rounded-full bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-purple-light"
          />
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-[10px] text-text-muted">
            {summary.paidCount + summary.reservedCount} de {summary.totalTickets} boletos
          </span>
          <span className="text-[10px] text-text-muted">
            ${(summary.totalCollected).toLocaleString('es-MX')} recaudado
          </span>
        </div>
      </div>
    </div>
  );
}
