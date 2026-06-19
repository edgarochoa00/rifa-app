import {
  collection,
  doc,
  getDocs,
  setDoc,
  runTransaction,
  onSnapshot,
  query,
  orderBy,
  writeBatch,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';
import { Ticket, TicketStatus, ReservationFormData, TOTAL_TICKETS } from './types';

const TICKETS_COLLECTION = 'tickets';

/**
 * Listen to all tickets in real-time.
 * Returns an unsubscribe function.
 */
export function subscribeToTickets(
  callback: (tickets: Ticket[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const q = query(collection(db, TICKETS_COLLECTION), orderBy('number', 'asc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const tickets: Ticket[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          number: data.number,
          status: data.status as TicketStatus,
          name: data.name || undefined,
          whatsapp: data.whatsapp || undefined,
          reservedAt: data.reservedAt || undefined,
        };
      });
      callback(tickets);
    },
    (error) => {
      console.error('Error listening to tickets:', error);
      onError?.(error);
    }
  );
}

/**
 * Reserve a ticket using a Firestore transaction.
 * This ensures no two users can reserve the same ticket simultaneously.
 */
export async function reserveTicketInFirestore(
  ticketNumber: number,
  formData: ReservationFormData
): Promise<{ success: boolean; error?: string }> {
  const ticketRef = doc(db, TICKETS_COLLECTION, ticketNumber.toString());

  try {
    await runTransaction(db, async (transaction) => {
      const ticketDoc = await transaction.get(ticketRef);

      if (!ticketDoc.exists()) {
        throw new Error('El boleto no existe');
      }

      const currentStatus = ticketDoc.data().status;
      if (currentStatus !== 'available') {
        throw new Error('Este boleto ya fue apartado por alguien más');
      }

      transaction.update(ticketRef, {
        status: 'reserved',
        name: `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim(),
        whatsapp: formData.whatsapp.trim(),
        reservedAt: new Date().toISOString(),
      });
    });

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return { success: false, error: message };
  }
}

/**
 * Mark a ticket as paid (admin action).
 */
export async function markTicketAsPaid(
  ticketNumber: number
): Promise<{ success: boolean; error?: string }> {
  const ticketRef = doc(db, TICKETS_COLLECTION, ticketNumber.toString());

  try {
    await runTransaction(db, async (transaction) => {
      const ticketDoc = await transaction.get(ticketRef);

      if (!ticketDoc.exists()) {
        throw new Error('El boleto no existe');
      }

      if (ticketDoc.data().status !== 'reserved') {
        throw new Error('Solo se pueden marcar como pagados los boletos apartados');
      }

      transaction.update(ticketRef, { status: 'paid' });
    });

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return { success: false, error: message };
  }
}

/**
 * Release a reserved ticket back to available (admin action).
 */
export async function releaseTicketInFirestore(
  ticketNumber: number
): Promise<{ success: boolean; error?: string }> {
  const ticketRef = doc(db, TICKETS_COLLECTION, ticketNumber.toString());

  try {
    await runTransaction(db, async (transaction) => {
      const ticketDoc = await transaction.get(ticketRef);

      if (!ticketDoc.exists()) {
        throw new Error('El boleto no existe');
      }

      if (ticketDoc.data().status !== 'reserved') {
        throw new Error('Solo se pueden liberar los boletos apartados');
      }

      transaction.update(ticketRef, {
        status: 'available',
        name: null,
        whatsapp: null,
        reservedAt: null,
      });
    });

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return { success: false, error: message };
  }
}

/**
 * Initialize all 107 tickets in Firestore.
 * Only creates tickets that don't already exist (safe to run multiple times).
 */
export async function seedTickets(): Promise<void> {
  const snapshot = await getDocs(collection(db, TICKETS_COLLECTION));
  const existingNumbers = new Set(snapshot.docs.map((d) => d.data().number));

  const batch = writeBatch(db);
  let added = 0;

  for (let i = 1; i <= TOTAL_TICKETS; i++) {
    if (!existingNumbers.has(i)) {
      const ticketRef = doc(db, TICKETS_COLLECTION, i.toString());
      batch.set(ticketRef, {
        number: i,
        status: 'available' as TicketStatus,
        name: null,
        whatsapp: null,
        reservedAt: null,
      });
      added++;
    }
  }

  if (added > 0) {
    await batch.commit();
    console.log(`✅ Seeded ${added} tickets in Firestore`);
  } else {
    console.log(`ℹ️ All ${TOTAL_TICKETS} tickets already exist in Firestore`);
  }
}
