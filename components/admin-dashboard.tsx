'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign,
  Clock,
  CheckCircle2,
  Ticket,
  TrendingUp,
  Search,
  Filter,
  ChevronDown,
  ArrowLeft,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useRifa } from '@/lib/rifa-context';
import { TICKET_PRICE, TOTAL_TICKETS } from '@/lib/types';

type FilterStatus = 'all' | 'reserved' | 'paid';

export default function AdminDashboard() {
  const { tickets, markAsPaid, releaseTicket } = useRifa();
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmAction, setConfirmAction] = useState<{ number: number; action: 'pay' | 'release' } | null>(null);
  const [viewingReceipt, setViewingReceipt] = useState<{ ticketNumber: number; base64Image: string } | null>(null);
  const [isLoadingReceipt, setIsLoadingReceipt] = useState<number | null>(null);

  const summary = useMemo(() => {
    const paidCount = tickets.filter(t => t.status === 'paid').length;
    const reservedCount = tickets.filter(t => t.status === 'reserved').length;
    const availableCount = tickets.filter(t => t.status === 'available').length;
    return {
      totalCollected: paidCount * TICKET_PRICE,
      pendingAmount: reservedCount * TICKET_PRICE,
      availableCount,
      reservedCount,
      paidCount,
      totalTickets: TOTAL_TICKETS,
    };
  }, [tickets]);
  const reservations = useMemo(() => tickets.filter(t => t.status === 'reserved' || t.status === 'paid'), [tickets]);

  const filteredReservations = useMemo(() => {
    let filtered = reservations;
    if (filter === 'reserved') {
      filtered = filtered.filter(t => t.status === 'reserved');
    } else if (filter === 'paid') {
      filtered = filtered.filter(t => t.status === 'paid');
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        t =>
          t.name?.toLowerCase().includes(q) ||
          t.whatsapp?.includes(q) ||
          t.number.toString().includes(q)
      );
    }
    return filtered;
  }, [reservations, filter, searchQuery]);

  const progressPercent = ((summary.paidCount + summary.reservedCount) / summary.totalTickets) * 100;

  const handleAction = async (ticketNumber: number, action: 'pay' | 'release') => {
    if (action === 'pay') {
      await markAsPaid(ticketNumber);
    } else {
      await releaseTicket(ticketNumber);
    }
    setConfirmAction(null);
  };

  const handleViewReceipt = async (ticketNumber: number) => {
    setIsLoadingReceipt(ticketNumber);
    try {
      const { doc, getDoc } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase');
      const receiptDoc = await getDoc(doc(db, 'receipts', ticketNumber.toString()));
      if (receiptDoc.exists()) {
        setViewingReceipt({ ticketNumber, base64Image: receiptDoc.data().base64Image });
      } else {
        alert('El comprobante no se encontró en la base de datos.');
      }
    } catch (error) {
      console.error(error);
      alert('Error al cargar el comprobante');
    }
    setIsLoadingReceipt(null);
  };

  const financialCards = [
    {
      title: 'Total Recaudado',
      value: `$${summary.totalCollected.toLocaleString('es-MX')}`,
      subtitle: `${summary.paidCount} boletos pagados`,
      icon: DollarSign,
      gradient: 'from-accent-cyan/20 to-accent-cyan/5',
      borderColor: 'border-accent-cyan/20',
      iconColor: 'text-accent-cyan',
      valueColor: 'text-accent-cyan-light',
    },
    {
      title: 'Monto Pendiente',
      value: `$${summary.pendingAmount.toLocaleString('es-MX')}`,
      subtitle: `${summary.reservedCount} boletos apartados`,
      icon: Clock,
      gradient: 'from-status-reserved/20 to-status-reserved/5',
      borderColor: 'border-status-reserved/20',
      iconColor: 'text-status-reserved',
      valueColor: 'text-status-reserved',
    },
    {
      title: 'Boletos Libres',
      value: summary.availableCount.toString(),
      subtitle: `de ${summary.totalTickets} total`,
      icon: Ticket,
      gradient: 'from-accent-purple/20 to-accent-purple/5',
      borderColor: 'border-accent-purple/20',
      iconColor: 'text-accent-purple',
      valueColor: 'text-accent-purple-light',
    },
    {
      title: 'Meta Total',
      value: `$${(summary.totalTickets * TICKET_PRICE).toLocaleString('es-MX')}`,
      subtitle: `${Math.round(progressPercent)}% completado`,
      icon: TrendingUp,
      gradient: 'from-accent-cyan/10 to-accent-purple/10',
      borderColor: 'border-accent-cyan/15',
      iconColor: 'text-accent-cyan',
      valueColor: 'text-text-primary',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="w-9 h-9 rounded-xl bg-bg-elevated hover:bg-bg-hover border border-border-subtle flex items-center justify-center transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-text-muted" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-text-primary">Panel de Admin</h1>
          <p className="text-xs text-text-muted">Gestión de boletos y pagos</p>
        </div>
      </div>

      {/* Financial Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {financialCards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className={`glass rounded-xl p-4 border ${card.borderColor}`}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${card.gradient} flex items-center justify-center`}>
                <card.icon className={`w-4 h-4 ${card.iconColor}`} />
              </div>
              <span className="text-[10px] text-text-muted font-medium uppercase tracking-wider">
                {card.title}
              </span>
            </div>
            <p className={`text-xl sm:text-2xl font-bold ${card.valueColor} tracking-tight`}>
              {card.value}
            </p>
            <p className="text-[10px] text-text-muted mt-1">{card.subtitle}</p>
          </motion.div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="glass rounded-xl px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-text-secondary font-medium">Progreso general</span>
          <span className="text-xs font-bold text-accent-cyan">{Math.round(progressPercent)}%</span>
        </div>
        <div className="h-2.5 bg-bg-elevated rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="h-full rounded-full bg-gradient-to-r from-accent-cyan via-accent-purple to-accent-purple-light relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" 
              style={{ backgroundSize: '200% 100%', animation: 'shimmer 2s infinite' }} />
          </motion.div>
        </div>
      </div>

      {/* Reservations Table */}
      <div className="glass rounded-xl overflow-hidden border border-border-subtle">
        {/* Table Header */}
        <div className="px-4 py-4 border-b border-border-subtle">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <h2 className="text-base font-bold text-text-primary flex-shrink-0">
              Reservaciones ({filteredReservations.length})
            </h2>
            <div className="flex gap-2 flex-1">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
                <input
                  id="admin-search"
                  type="text"
                  placeholder="Buscar por nombre, teléfono o número..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-bg-elevated border border-border-subtle rounded-lg text-xs text-text-primary placeholder:text-text-muted/50 focus:ring-2 focus:ring-accent-cyan/20 focus:border-accent-cyan/40 transition-all"
                />
              </div>
              {/* Filter */}
              <div className="relative">
                <select
                  id="admin-filter"
                  value={filter}
                  onChange={e => setFilter(e.target.value as FilterStatus)}
                  className="appearance-none pl-3 pr-8 py-2 bg-bg-elevated border border-border-subtle rounded-lg text-xs text-text-primary focus:ring-2 focus:ring-accent-cyan/20 focus:border-accent-cyan/40 transition-all cursor-pointer"
                >
                  <option value="all">Todos</option>
                  <option value="reserved">Apartados</option>
                  <option value="paid">Pagados</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-text-muted pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-border-subtle max-h-[60vh] overflow-y-auto">
          {filteredReservations.length === 0 ? (
            <div className="px-4 py-12 text-center">
              <Ticket className="w-10 h-10 text-text-muted/30 mx-auto mb-3" />
              <p className="text-sm text-text-muted">No se encontraron reservaciones</p>
            </div>
          ) : (
            filteredReservations.map((ticket, i) => (
              <motion.div
                key={ticket.number}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="px-4 py-3 hover:bg-bg-elevated/50 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Ticket number */}
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-sm ticket-number ${
                        ticket.status === 'paid'
                          ? 'bg-accent-purple/15 text-accent-purple-light border border-accent-purple/25'
                          : 'bg-status-reserved/15 text-status-reserved border border-status-reserved/25'
                      }`}
                    >
                      {ticket.number}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {ticket.name}
                      </p>
                      <p className="text-xs text-text-muted truncate">{ticket.whatsapp}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-border-subtle/30">
                    <div className="flex items-center gap-2">
                      {/* Receipt indicator */}
                      {ticket.hasReceipt && (
                        <button
                          onClick={() => handleViewReceipt(ticket.number)}
                          disabled={isLoadingReceipt === ticket.number}
                          className={`px-2 py-1 rounded-md text-[10px] font-semibold transition-colors border flex-shrink-0 ${
                            isLoadingReceipt === ticket.number 
                              ? 'bg-text-muted/10 text-text-muted border-text-muted/20 cursor-wait' 
                              : 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20 hover:bg-accent-cyan/20'
                          }`}
                          title="Ver comprobante"
                        >
                          {isLoadingReceipt === ticket.number ? '...' : '📄'}
                        </button>
                      )}

                      {/* Status badge */}
                      <span
                        className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-md flex-shrink-0 ${
                          ticket.status === 'paid'
                            ? 'bg-accent-purple/15 text-accent-purple-light'
                            : 'bg-status-reserved/15 text-status-reserved'
                        }`}
                      >
                        {ticket.status === 'paid' ? 'Pagado' : 'Apartado'}
                      </span>
                    </div>

                    {/* Actions */}
                    {ticket.status === 'reserved' && (
                      <div className="flex gap-1.5 flex-shrink-0">
                        {confirmAction?.number === ticket.number ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-text-muted">¿Seguro?</span>
                            <button
                              onClick={() => handleAction(ticket.number, confirmAction.action)}
                              className="px-2 py-1 rounded-md bg-accent-cyan/20 text-accent-cyan text-[10px] font-semibold hover:bg-accent-cyan/30 transition-colors"
                            >
                              Sí
                            </button>
                            <button
                              onClick={() => setConfirmAction(null)}
                              className="px-2 py-1 rounded-md bg-bg-hover text-text-muted text-[10px] font-semibold hover:bg-bg-elevated transition-colors"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => setConfirmAction({ number: ticket.number, action: 'pay' })}
                              className="px-2.5 py-1.5 rounded-lg bg-accent-cyan/10 text-accent-cyan text-[10px] font-semibold hover:bg-accent-cyan/20 transition-colors border border-accent-cyan/20"
                              title="Marcar como pagado"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setConfirmAction({ number: ticket.number, action: 'release' })}
                              className="px-2.5 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-[10px] font-semibold hover:bg-red-500/20 transition-colors border border-red-500/20"
                              title="Liberar boleto"
                            >
                              ✕
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Receipt Modal */}
      <AnimatePresence>
        {viewingReceipt && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewingReceipt(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 w-full max-w-2xl bg-bg-dark rounded-2xl overflow-hidden border border-border-subtle"
            >
              <div className="flex items-center justify-between p-4 border-b border-border-subtle">
                <h3 className="font-bold text-text-primary">Comprobante - Boleto #{viewingReceipt.ticketNumber}</h3>
                <button
                  onClick={() => setViewingReceipt(null)}
                  className="w-8 h-8 rounded-lg bg-bg-elevated hover:bg-bg-hover flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-text-muted" />
                </button>
              </div>
              <div className="p-4 bg-black/50 overflow-auto max-h-[70vh] flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={viewingReceipt.base64Image} 
                  alt={`Comprobante boleto ${viewingReceipt.ticketNumber}`}
                  className="max-w-full h-auto rounded-lg" 
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
