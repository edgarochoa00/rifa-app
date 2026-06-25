export type TicketStatus = 'available' | 'reserved' | 'paid';

export interface Ticket {
  number: number;
  status: TicketStatus;
  name?: string;
  whatsapp?: string;
  reservedAt?: string;
}

export interface ReservationFormData {
  firstName: string;
  lastName: string;
  whatsapp: string;
}

export interface FinancialSummary {
  totalCollected: number;
  pendingAmount: number;
  availableCount: number;
  reservedCount: number;
  paidCount: number;
  totalTickets: number;
  ticketPrice: number;
}

export const TICKET_PRICE = 500;
export const TOTAL_TICKETS = 160;
