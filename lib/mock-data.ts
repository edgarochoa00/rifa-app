import { Ticket, TicketStatus, FinancialSummary, TICKET_PRICE, TOTAL_TICKETS } from './types';

// Generate 107 tickets with some pre-set states for demo purposes
function generateMockTickets(): Ticket[] {
  const tickets: Ticket[] = [];

  // Define some reserved and paid tickets for demo
  const reservedTickets: Record<number, { name: string; whatsapp: string }> = {
    3: { name: 'María García López', whatsapp: '+52 33 1234 5678' },
    7: { name: 'Carlos Hernández', whatsapp: '+52 81 9876 5432' },
    15: { name: 'Ana Martínez Ruiz', whatsapp: '+52 55 4567 8901' },
    22: { name: 'Roberto Sánchez', whatsapp: '+52 33 7654 3210' },
    34: { name: 'Laura Díaz Pérez', whatsapp: '+52 55 1122 3344' },
    45: { name: 'Fernando Torres', whatsapp: '+52 81 5566 7788' },
    56: { name: 'Patricia Morales', whatsapp: '+52 33 9900 1122' },
    78: { name: 'Miguel Ángel Flores', whatsapp: '+52 55 3344 5566' },
    91: { name: 'Sofía Ramírez', whatsapp: '+52 81 7788 9900' },
    100: { name: 'Diego Vargas Castro', whatsapp: '+52 33 2233 4455' },
  };

  const paidTickets: Record<number, { name: string; whatsapp: string }> = {
    1: { name: 'Juan Pérez Rodríguez', whatsapp: '+52 55 1234 5678' },
    12: { name: 'Gabriela Ríos', whatsapp: '+52 33 8765 4321' },
    25: { name: 'Alejandro Mendoza', whatsapp: '+52 81 2345 6789' },
    42: { name: 'Isabel Gutiérrez', whatsapp: '+52 55 6789 0123' },
    67: { name: 'Ricardo Luna Vega', whatsapp: '+52 33 4321 8765' },
    88: { name: 'Valentina Ortiz', whatsapp: '+52 81 0987 6543' },
    105: { name: 'Andrés Castillo', whatsapp: '+52 55 5678 1234' },
  };

  for (let i = 1; i <= TOTAL_TICKETS; i++) {
    let status: TicketStatus = 'available';
    let name: string | undefined;
    let whatsapp: string | undefined;
    let reservedAt: string | undefined;

    if (paidTickets[i]) {
      status = 'paid';
      name = paidTickets[i].name;
      whatsapp = paidTickets[i].whatsapp;
      reservedAt = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString();
    } else if (reservedTickets[i]) {
      status = 'reserved';
      name = reservedTickets[i].name;
      whatsapp = reservedTickets[i].whatsapp;
      reservedAt = new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString();
    }

    tickets.push({ number: i, status, name, whatsapp, reservedAt });
  }

  return tickets;
}

export const initialTickets = generateMockTickets();

export function getFinancialSummary(tickets: Ticket[]): FinancialSummary {
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
    ticketPrice: TICKET_PRICE,
  };
}

export function getReservedTickets(tickets: Ticket[]): Ticket[] {
  return tickets.filter(t => t.status === 'reserved' || t.status === 'paid');
}
