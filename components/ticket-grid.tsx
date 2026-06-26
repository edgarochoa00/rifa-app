'use client';

import { useMemo, useState, useEffect } from 'react';
import { Search, X, Upload, MessageCircle, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { useRifa } from '@/lib/rifa-context';
import { Ticket, TICKET_PRICE } from '@/lib/types';
import TicketCell from './ticket-cell';
import { uploadReceipt } from '@/lib/receipt-service';
import { motion, AnimatePresence } from 'framer-motion';

interface TicketGridProps {
  onTicketSelect: (ticket: Ticket) => void;
}

export default function TicketGrid({ onTicketSelect }: TicketGridProps) {
  const { tickets, isLoading } = useRifa();
  const [searchWhatsapp, setSearchWhatsapp] = useState('');
  const [isUploadingReceipt, setIsUploadingReceipt] = useState(false);
  const [receiptUploaded, setReceiptUploaded] = useState(false);
  const [receiptError, setReceiptError] = useState('');
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);
  const [selectedTicketsToPay, setSelectedTicketsToPay] = useState<Set<number>>(new Set());

  // Reset states when search changes
  useEffect(() => {
    setReceiptUploaded(false);
    setReceiptError('');
    setShowPaymentInfo(false);
  }, [searchWhatsapp]);

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

  const pendingTickets = useMemo(() => {
    if (matchedNumbers.size === 0) return [];
    return tickets.filter(t => matchedNumbers.has(t.number) && !t.hasReceipt);
  }, [tickets, matchedNumbers]);

  // Update selected tickets when pending tickets change (select all by default)
  useEffect(() => {
    if (!receiptUploaded) {
      setSelectedTicketsToPay(new Set(pendingTickets.map(t => t.number)));
    }
  }, [pendingTickets, receiptUploaded]);

  const allHaveReceipts = matchedNumbers.size > 0 && pendingTickets.length === 0;

  const handleToggleTicketToPay = (number: number) => {
    const newSet = new Set(selectedTicketsToPay);
    if (newSet.has(number)) {
      newSet.delete(number);
    } else {
      newSet.add(number);
    }
    setSelectedTicketsToPay(newSet);
  };

  const handleReceiptUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (selectedTicketsToPay.size === 0) {
      setReceiptError('Selecciona al menos un boleto para subir el comprobante');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setReceiptError('Solo se permiten imágenes');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setReceiptError('La imagen es demasiado grande (máximo 10MB)');
      return;
    }

    setIsUploadingReceipt(true);
    setReceiptError('');

    // Assign receipt to selected tickets
    const numbersToUpdate = Array.from(selectedTicketsToPay);
    const result = await uploadReceipt(numbersToUpdate, file);

    if (result.success) {
      setReceiptUploaded(true);
    } else {
      setReceiptError(result.error || 'Error al subir el comprobante');
    }

    setIsUploadingReceipt(false);
  };

  return (
    <section id="ticket-grid-section">
      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-md border border-white/20 bg-white/[0.05]" />
          <span className="text-xs text-text-secondary">
            Disponible <span className="text-text-muted">({isLoading ? '—' : counts.available})</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-md border border-status-reserved/40 bg-status-reserved/10" />
          <span className="text-xs text-text-secondary">
            Apartado <span className="text-text-muted">({isLoading ? '—' : counts.reserved})</span>
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
            placeholder="Tu WhatsApp para ver boletos"
            value={searchWhatsapp}
            onChange={e => {
              const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
              setSearchWhatsapp(digitsOnly);
            }}
            className="w-full pl-10 pr-10 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-[10px] text-text-primary placeholder:text-text-muted/50 focus:ring-2 focus:ring-accent-cyan/30 focus:border-accent-cyan/50 transition-all"
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
          <div className="mt-3 flex flex-col items-center">
            {matchedNumbers.size > 0 ? (
              <div className="w-full max-w-sm">
                <p className="text-xs text-accent-cyan text-center mb-3">
                  Se encontraron <span className="font-bold">{matchedNumbers.size}</span> boleto{matchedNumbers.size > 1 ? 's' : ''} apartado{matchedNumbers.size > 1 ? 's' : ''}: <span className="font-semibold">{Array.from(matchedNumbers).sort((a, b) => a - b).join(', ')}</span>
                </p>

                <button
                  onClick={() => setShowPaymentInfo(!showPaymentInfo)}
                  className="w-full flex items-center justify-between px-4 py-2.5 bg-accent-cyan/10 hover:bg-accent-cyan/20 border border-accent-cyan/20 rounded-xl transition-colors text-accent-cyan"
                >
                  <span className="text-xs font-semibold">¿Ya pagaste o quieres subir comprobante?</span>
                  {showPaymentInfo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                <AnimatePresence>
                  {showPaymentInfo && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-2 p-4 bg-bg-elevated border border-border-subtle rounded-xl space-y-4">
                        {/* Account Info */}
                        <div>
                          {!allHaveReceipts && pendingTickets.length > 0 && (
                            <div className="mb-4">
                              <p className="text-[10px] text-text-muted font-medium uppercase tracking-wider mb-2">
                                ¿De qué boletos es este comprobante?
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {pendingTickets.map(t => (
                                  <label 
                                    key={t.number} 
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all border ${
                                      selectedTicketsToPay.has(t.number) 
                                        ? 'bg-accent-cyan/10 border-accent-cyan/30 text-accent-cyan' 
                                        : 'bg-white/5 border-white/10 text-text-muted hover:bg-white/10'
                                    }`}
                                  >
                                    <input 
                                      type="checkbox" 
                                      checked={selectedTicketsToPay.has(t.number)}
                                      onChange={() => handleToggleTicketToPay(t.number)}
                                      className="hidden"
                                    />
                                    <div className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center ${
                                      selectedTicketsToPay.has(t.number) ? 'bg-accent-cyan border-accent-cyan' : 'border-white/30'
                                    }`}>
                                      {selectedTicketsToPay.has(t.number) && <CheckCircle2 className="w-3 h-3 text-bg-dark" />}
                                    </div>
                                    <span className="text-xs font-semibold">Boleto {t.number}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="flex flex-col gap-0.5 mb-2">
                            <p className="text-[10px] text-text-muted font-medium uppercase tracking-wider">
                              Datos para transferencia
                            </p>
                          </div>
                          <div className="space-y-1.5 bg-black/20 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-text-secondary">Cuenta:</span>
                              <span className="text-xs font-bold text-white tracking-wider">4027 6658 1948 4354</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-text-secondary">Nombre:</span>
                              <span className="text-[10px] font-semibold text-white">Edgar Ochoa</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-text-secondary">Concepto:</span>
                              <span className="text-[10px] font-semibold text-accent-cyan">Rifa</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-text-secondary">Total a pagar:</span>
                              <span className="text-xs font-bold text-accent-cyan">
                                ${(selectedTicketsToPay.size * TICKET_PRICE).toLocaleString('es-MX')} MXN
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Upload Receipt */}
                        <div>
                          <p className="text-[10px] text-text-muted font-medium uppercase tracking-wider mb-2">
                            Subir comprobante {(!allHaveReceipts && selectedTicketsToPay.size > 0) ? `(Boleto${selectedTicketsToPay.size > 1 ? 's' : ''} ${Array.from(selectedTicketsToPay).sort((a,b)=>a-b).join(', ')})` : ''}
                          </p>

                          {receiptUploaded && !allHaveReceipts && (
                            <div className="mb-3 flex items-center justify-center gap-2 text-accent-cyan bg-accent-cyan/10 py-2 rounded-lg border border-accent-cyan/20">
                              <CheckCircle2 className="w-4 h-4" />
                              <span className="text-xs font-medium">Comprobante enviado con éxito</span>
                            </div>
                          )}
                          
                          {allHaveReceipts ? (
                            <div className="flex items-center justify-center gap-2 text-accent-cyan bg-accent-cyan/10 py-2.5 rounded-lg border border-accent-cyan/20">
                              <CheckCircle2 className="w-4 h-4" />
                              <span className="text-xs font-medium">Comprobante enviado</span>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <label
                                htmlFor="search-receipt-upload"
                                className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-dashed cursor-pointer transition-all duration-200 ${
                                  isUploadingReceipt
                                    ? 'border-accent-cyan/30 bg-accent-cyan/5 cursor-wait'
                                    : 'border-white/20 hover:border-accent-cyan/40 hover:bg-accent-cyan/5'
                                }`}
                              >
                                {isUploadingReceipt ? (
                                  <>
                                    <motion.div
                                      animate={{ rotate: 360 }}
                                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                      className="w-4 h-4 border-2 border-white/30 border-t-accent-cyan rounded-full"
                                    />
                                    <span className="text-xs text-text-secondary">Subiendo...</span>
                                  </>
                                ) : (
                                  <>
                                    <Upload className="w-4 h-4 text-text-muted" />
                                    <span className="text-xs text-text-secondary">Seleccionar imagen</span>
                                  </>
                                )}
                              </label>
                              <input
                                id="search-receipt-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                disabled={isUploadingReceipt}
                                onChange={handleReceiptUpload}
                              />
                              {receiptError && (
                                <p className="text-[10px] text-red-400 mt-1.5 text-center">{receiptError}</p>
                              )}
                            </div>
                          )}
                        </div>

                        {/* WhatsApp Button */}
                        <a
                          href={`https://wa.me/52${searchWhatsapp}?text=${encodeURIComponent(
                            `¡Hola! Estos son mis boletos apartados para la rifa del Ford LTD Crown Victoria: ${Array.from(matchedNumbers).sort((a, b) => a - b).join(', ')}`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 w-full bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 font-semibold py-2.5 px-4 rounded-lg hover:bg-[#25D366]/30 transition-all duration-200"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span className="text-xs">Enviar comprobante por WhatsApp</span>
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <p className="text-xs text-text-muted text-center">
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
