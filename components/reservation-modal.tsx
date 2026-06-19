'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Phone, CheckCircle2, Ticket as TicketIcon } from 'lucide-react';
import { Ticket, ReservationFormData, TICKET_PRICE } from '@/lib/types';
import { useRifa } from '@/lib/rifa-context';

interface ReservationModalProps {
  ticket: Ticket | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ReservationModal({ ticket, isOpen, onClose }: ReservationModalProps) {
  const { reserveTicket } = useRifa();
  const [formData, setFormData] = useState<ReservationFormData>({ firstName: '', lastName: '', whatsapp: '' });
  const [errors, setErrors] = useState<Partial<ReservationFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({ firstName: '', lastName: '', whatsapp: '' });
      setErrors({});
      setIsSubmitting(false);
      setShowSuccess(false);
    }
  }, [isOpen]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const validate = (): boolean => {
    const newErrors: Partial<ReservationFormData> = {};
    if (!formData.firstName.trim() || formData.firstName.trim().length < 2) {
      newErrors.firstName = 'Ingresa tu nombre(s)';
    }
    if (!formData.lastName.trim() || formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Ingresa tus apellidos';
    }
    
    // Strict phone validation: exactly 10 digits
    const digits = formData.whatsapp.replace(/\D/g, '');
    if (digits.length !== 10) {
      newErrors.whatsapp = 'Debe ser exactamente 10 dígitos';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !ticket) return;

    setIsSubmitting(true);

    const result = await reserveTicket(ticket.number, formData);

    if (result.success) {
      setShowSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } else {
      setErrors({ firstName: result.error || 'Este boleto ya fue apartado por alguien más' });
      setIsSubmitting(false);
    }
  };

  if (!ticket) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 overlay-blur"
          />

          {/* Bottom Sheet (mobile) / Modal (desktop) */}
          <motion.div
            initial={{ y: '100%', opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-md sm:w-[calc(100%-2rem)] sm:rounded-2xl"
          >
            <div className="glass-strong rounded-t-3xl sm:rounded-2xl overflow-hidden">
              {/* Drag handle (mobile) */}
              <div className="flex justify-center pt-3 pb-1 sm:hidden">
                <div className="w-10 h-1 bg-text-muted/30 rounded-full" />
              </div>

              {showSuccess ? (
                /* Success State */
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="px-6 py-12 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 12, delay: 0.1 }}
                  >
                    <CheckCircle2 className="w-16 h-16 text-accent-cyan mx-auto mb-4" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-text-primary mb-2">
                    ¡Boleto Apartado!
                  </h3>
                  <p className="text-text-secondary text-sm">
                    Tu boleto <span className="font-bold text-accent-cyan">#{ticket.number}</span> ha sido reservado.
                    <br />
                    Te contactaremos por WhatsApp para confirmar el pago.
                  </p>
                </motion.div>
              ) : (
                /* Form State */
                <div className="px-5 sm:px-6 pb-8 pt-4">
                  {/* Close button */}
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-bold text-text-primary">Apartar Boleto</h2>
                    <button
                      onClick={onClose}
                      className="w-8 h-8 rounded-lg bg-bg-elevated hover:bg-bg-hover flex items-center justify-center transition-colors"
                      aria-label="Cerrar"
                    >
                      <X className="w-4 h-4 text-text-muted" />
                    </button>
                  </div>

                  {/* Selected ticket display */}
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] backdrop-blur-md border border-white/10 shadow-lg mb-6">
                    <div className="w-14 h-14 rounded-xl bg-white/[0.05] border border-white/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xl font-bold text-white ticket-number">
                        {ticket.number}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-primary">
                        Boleto #{ticket.number}
                      </p>
                      <p className="text-2xl font-bold gradient-text drop-shadow-md">
                        ${TICKET_PRICE.toLocaleString('es-MX')} MXN
                      </p>
                    </div>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name fields */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="reservation-firstname" className="block text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wider">
                          Nombre(s)
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                          <input
                            id="reservation-firstname"
                            type="text"
                            placeholder="Ej: María"
                            value={formData.firstName}
                            onChange={e => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                            className={`w-full pl-10 pr-3 py-3 bg-white/[0.02] backdrop-blur-sm border rounded-xl text-sm text-text-primary placeholder:text-text-muted/50 focus:ring-2 focus:ring-accent-cyan/30 focus:border-accent-cyan/50 transition-all ${
                              errors.firstName ? 'border-red-500/50' : 'border-white/10'
                            }`}
                          />
                        </div>
                        {errors.firstName && (
                          <motion.p
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-[10px] text-red-400 mt-1.5 leading-tight"
                          >
                            {errors.firstName}
                          </motion.p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="reservation-lastname" className="block text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wider">
                          Apellidos
                        </label>
                        <div className="relative">
                          <input
                            id="reservation-lastname"
                            type="text"
                            placeholder="Ej: García López"
                            value={formData.lastName}
                            onChange={e => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                            className={`w-full px-3 py-3 bg-white/[0.02] backdrop-blur-sm border rounded-xl text-sm text-text-primary placeholder:text-text-muted/50 focus:ring-2 focus:ring-accent-cyan/30 focus:border-accent-cyan/50 transition-all ${
                              errors.lastName ? 'border-red-500/50' : 'border-white/10'
                            }`}
                          />
                        </div>
                        {errors.lastName && (
                          <motion.p
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-[10px] text-red-400 mt-1.5 leading-tight"
                          >
                            {errors.lastName}
                          </motion.p>
                        )}
                      </div>
                    </div>

                    {/* WhatsApp field */}
                    <div>
                      <label htmlFor="reservation-whatsapp" className="block text-xs font-medium text-text-secondary mb-1.5 uppercase tracking-wider">
                        WhatsApp
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                        <input
                          id="reservation-whatsapp"
                          type="tel"
                          maxLength={10}
                          placeholder="Ej: 3312345678"
                          value={formData.whatsapp}
                          onChange={e => {
                            const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
                            setFormData(prev => ({ ...prev, whatsapp: digitsOnly }));
                          }}
                          className={`w-full pl-10 pr-4 py-3 bg-white/[0.02] backdrop-blur-sm border rounded-xl text-sm text-text-primary placeholder:text-text-muted/50 focus:ring-2 focus:ring-accent-cyan/30 focus:border-accent-cyan/50 transition-all ${
                            errors.whatsapp ? 'border-red-500/50' : 'border-white/10'
                          }`}
                        />
                      </div>
                      {errors.whatsapp && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-[10px] text-red-400 mt-1.5 leading-tight"
                        >
                          {errors.whatsapp}
                        </motion.p>
                      )}
                    </div>

                    {/* Submit button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 rounded-xl bg-white/[0.05] backdrop-blur-md border border-accent-cyan/40 text-accent-cyan-light font-bold text-sm hover:bg-accent-cyan/10 hover:border-accent-cyan-light hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:text-white active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                          />
                          Apartando...
                        </>
                      ) : (
                        <>
                          <TicketIcon className="w-4 h-4" />
                          Apartar Boleto #{ticket.number}
                        </>
                      )}
                    </button>

                    <p className="text-[10px] text-text-muted text-center leading-relaxed">
                      Al apartar, te comprometes a realizar el pago de ${TICKET_PRICE.toLocaleString('es-MX')} MXN
                      vía transferencia o depósito. Se te contactará por WhatsApp.
                    </p>
                  </form>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
