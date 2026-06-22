'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Ticket, ReservationFormData, TOTAL_TICKETS } from './types';
import {
  subscribeToTickets,
  reserveTicketInFirestore,
  markTicketAsPaid,
  releaseTicketInFirestore,
  seedTickets,
} from './firebase-service';

interface RifaContextType {
  tickets: Ticket[];
  isLoading: boolean;
  error: string | null;
  reserveTicket: (ticketNumber: number, formData: ReservationFormData) => Promise<{ success: boolean; error?: string }>;
  markAsPaid: (ticketNumber: number) => Promise<{ success: boolean; error?: string }>;
  releaseTicket: (ticketNumber: number) => Promise<{ success: boolean; error?: string }>;
}

const RifaContext = createContext<RifaContextType | undefined>(undefined);

export function RifaProvider({ children }: { children: React.ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>(() => 
    Array.from({ length: TOTAL_TICKETS }, (_, i) => ({
      number: i + 1,
      status: 'available',
    }))
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const seeded = useRef(false);

  useEffect(() => {
    // Seed tickets on first load (idempotent — won't duplicate)
    if (!seeded.current) {
      seeded.current = true;
      seedTickets().catch((err) => {
        console.error('Error seeding tickets:', err);
      });
    }

    // Subscribe to real-time ticket updates
    const unsubscribe = subscribeToTickets(
      (updatedTickets) => {
        setTickets(updatedTickets);
        setIsLoading(false);
        setError(null);
      },
      (err) => {
        setError('Error al conectar con la base de datos');
        setIsLoading(false);
        console.error(err);
      }
    );

    return () => unsubscribe();
  }, []);

  const reserveTicket = useCallback(
    async (ticketNumber: number, formData: ReservationFormData) => {
      return reserveTicketInFirestore(ticketNumber, formData);
    },
    []
  );

  const markAsPaid = useCallback(async (ticketNumber: number) => {
    return markTicketAsPaid(ticketNumber);
  }, []);

  const releaseTicket = useCallback(async (ticketNumber: number) => {
    return releaseTicketInFirestore(ticketNumber);
  }, []);

  return (
    <RifaContext.Provider value={{ tickets, isLoading, error, reserveTicket, markAsPaid, releaseTicket }}>
      {children}
    </RifaContext.Provider>
  );
}

export function useRifa() {
  const context = useContext(RifaContext);
  if (!context) {
    throw new Error('useRifa must be used within a RifaProvider');
  }
  return context;
}
