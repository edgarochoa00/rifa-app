'use client';

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { storage, db } from './firebase';

const TICKETS_COLLECTION = 'tickets';
const MAX_WIDTH = 800;
const JPEG_QUALITY = 0.6;

/**
 * Compress an image file in the browser before uploading.
 * Resizes to max 800px wide and converts to JPEG at 60% quality.
 * Result is a base64 string, typically 50-100 KB.
 */
async function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      let { width, height } = img;

      // Scale down if wider than MAX_WIDTH
      if (width > MAX_WIDTH) {
        height = (height * MAX_WIDTH) / width;
        width = MAX_WIDTH;
      }

      canvas.width = width;
      canvas.height = height;

      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      // Get base64 string representation
      const base64String = canvas.toDataURL('image/jpeg', JPEG_QUALITY);
      resolve(base64String);
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Upload a payment receipt for tickets.
 * Compresses the image to a base64 string and saves it in a separate
 * 'receipts' collection.
 */
export async function uploadReceipt(
  ticketNumbers: number[],
  file: File
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('1. Starting receipt upload for tickets', ticketNumbers);
    // Compress the image to base64
    console.log('2. Compressing image...', file.size, 'bytes');
    const base64String = await compressImage(file);
    console.log('3. Image compressed, length:', base64String.length);

    console.log('4. Saving receipts and updating tickets in Firestore');
    const promises = ticketNumbers.map(async (ticketNumber) => {
      // 1. Save receipt document
      const receiptRef = doc(db, 'receipts', ticketNumber.toString());
      await updateDoc(receiptRef, {
        ticketNumber,
        base64Image: base64String,
        uploadedAt: new Date().toISOString(),
      }).catch(async (err) => {
        if (err.code === 'not-found') {
          const { setDoc } = await import('firebase/firestore');
          await setDoc(receiptRef, {
            ticketNumber,
            base64Image: base64String,
            uploadedAt: new Date().toISOString(),
          });
        } else {
          throw err;
        }
      });

      // 2. Update ticket document
      const ticketRef = doc(db, TICKETS_COLLECTION, ticketNumber.toString());
      await updateDoc(ticketRef, {
        hasReceipt: true,
        receiptUploadedAt: new Date().toISOString(),
      });
    });

    await Promise.all(promises);
    console.log('5. Finished upload process successfully');

    return { success: true };
  } catch (error) {
    console.error('Upload process failed:', error);
    const message = error instanceof Error ? error.message : 'Error al subir comprobante';
    return { success: false, error: message };
  }
}
