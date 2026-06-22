'use client';

import { useState } from 'react';
import { Car, DollarSign } from 'lucide-react';
import Header from '@/components/header';
import StatsBar from '@/components/stats-bar';
import TicketGrid from '@/components/ticket-grid';
import CarGallery from '@/components/car-gallery';
import ReservationModal from '@/components/reservation-modal';
import { Ticket, TICKET_PRICE, TOTAL_TICKETS } from '@/lib/types';
import { useRifa } from '@/lib/rifa-context';

export default function HomePage() {
  const { error } = useRifa();
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTicketSelect = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedTicket(null), 300);
  };

  return (
    <>
      <Header />

      <main className="max-w-5xl mx-auto px-4 pb-12">
        {/* Hero Section */}
        <section className="py-8 sm:py-12 text-center">
          <div>

            {/* Title */}
            <h1 className="font-fancy mb-6 tracking-[0.25em] drop-shadow-[0_4px_12px_rgba(255,255,255,0.05)] flex flex-col items-center justify-center gap-2 sm:gap-3 uppercase">
              <span className="text-lg sm:text-xl text-transparent bg-clip-text bg-gradient-to-r from-teal-50 via-slate-200 to-purple-200 select-none">
                RIFA
              </span>
              <span className="text-xl sm:text-2xl flex flex-wrap justify-center gap-x-4 text-transparent bg-clip-text bg-gradient-to-r from-teal-50 via-slate-200 to-purple-200 select-none">
                <span>Ford</span>
                <span>LTD</span>
                <span>Crown</span>
                <span>Victoria</span>
              </span>
            </h1>

            <p className="text-text-secondary text-sm sm:text-base max-w-md mx-auto mb-6 leading-relaxed">
              Participa por la oportunidad de ganar este clásico americano. Solo {TOTAL_TICKETS} boletos
              disponibles.
            </p>

            {/* Prize cards */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 mb-8">
              <div className="glass rounded-xl px-4 py-3 flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-accent-cyan/15 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-accent-cyan" />
                </div>
                <div className="text-left">
                  <p className="text-lg sm:text-xl font-bold text-text-primary">
                    ${TICKET_PRICE.toLocaleString('es-MX')}
                  </p>
                  <p className="text-[10px] text-text-muted font-medium uppercase tracking-wider">
                    Por boleto
                  </p>
                </div>
              </div>

              <div className="glass rounded-xl px-4 py-3 flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-accent-purple/15 flex items-center justify-center">
                  <Car className="w-5 h-5 text-accent-purple" />
                </div>
                <div className="text-left">
                  <p className="text-lg sm:text-xl font-bold text-text-primary">
                    Ford LTD
                  </p>
                  <p className="text-[10px] text-text-muted font-medium uppercase tracking-wider">
                    Crown Victoria
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div>
            <StatsBar />
          </div>
        </section>

        {/* Car Gallery & Specs */}
        <CarGallery />

        {/* Ticket Grid */}
        <section className="pb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-base font-bold text-text-primary">Selecciona tu boleto</h2>
              <div className="flex-1 h-px bg-border-subtle" />
            </div>

            {error ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <p className="text-sm text-red-400">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="text-xs text-accent-cyan hover:underline"
                >
                  Reintentar
                </button>
              </div>
            ) : (
              <TicketGrid onTicketSelect={handleTicketSelect} />
            )}
          </div>
        </section>

        {/* Info Section */}
        <section className="glass rounded-2xl p-5 sm:p-6">
          <h3 className="text-sm font-bold text-text-primary mb-3">¿Cómo funciona?</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                step: '1',
                title: 'Elige tu boleto',
                description: 'Selecciona un número disponible del grid',
              },
              {
                step: '2',
                title: 'Llena tus datos',
                description: 'Ingresa tu nombre y WhatsApp para apartarlo',
              },
              {
                step: '3',
                title: 'Realiza el pago',
                description: 'Te contactaremos por WhatsApp para confirmar',
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent-cyan/20 to-accent-purple/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold gradient-text">{item.step}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">{item.title}</p>
                  <p className="text-xs text-text-muted mt-0.5">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Reservation Modal */}
      <ReservationModal
        ticket={selectedTicket}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}
