import { Injectable } from '@angular/core';
import { Firestore, doc, collection, collectionData, docData, setDoc, updateDoc, query, where, Timestamp, deleteDoc, writeBatch, DocumentReference } from '@angular/fire/firestore';
import { from, Observable, of } from 'rxjs';
import { DailyLog, PriceTier } from '../models/gem-log.models';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
    providedIn: 'root',
})
export class FirestoreService {
    constructor(private firestore: Firestore) { }

    // Get Price Tiers for a User
    getPriceTiers(userId: string): Observable<PriceTier[]> {
        const tiersCollection = collection(this.firestore, `users/${userId}/priceTiers`);
        const q = query(tiersCollection, where('isArchived', '!=', true));
        return collectionData(q, { idField: 'id' }) as Observable<PriceTier[]>;
    }

    // Get all Price Tiers for a User (including archived)
    getAllPriceTiers(userId: string): Observable<PriceTier[]> {
        const tiersCollection = collection(this.firestore, `users/${userId}/priceTiers`);
        return collectionData(tiersCollection, { idField: 'id' }) as Observable<PriceTier[]>;
    }


    archivePriceTier(userId: string, tierId: string): Observable<void> {
        if (!tierId) return of(undefined);
        const tierDocRef = doc(this.firestore, `users/${userId}/priceTiers/${tierId}`);
        return from(updateDoc(tierDocRef, { isArchived: true }));
    }


    // Save/Update Price Tiers for a User
    savePriceTiers(userId: string, tiers: PriceTier[]): Observable<void> {
        const batch = writeBatch(this.firestore);

        tiers.forEach(tierFromForm => {
            const dataToSave: any = {
                weight: tierFromForm.weight,
                sieve: tierFromForm.sieve,
                price: tierFromForm.price,
            };

            let docRef: DocumentReference;

            if (tierFromForm.id) {
                console.log(`Updating tier with ID: ${tierFromForm.id}`);
                // --- CASE 1: UPDATE EXISTING DOCUMENT ---
                docRef = doc(this.firestore, `users/${userId}/priceTiers/${tierFromForm.id}`);
                batch.update(docRef, dataToSave);
            } else {
                // --- CASE 2: CREATE NEW DOCUMENT ---
                const newId = uuidv4();
                docRef = doc(this.firestore, `users/${userId}/priceTiers/${newId}`);
                dataToSave.isArchived = false;
                batch.set(docRef, dataToSave);
            }
        });

        return from(batch.commit());
    }

    // --- Daily Log Management ---

    // Get a single log for a specific date
    getLogForDate(userId: string, date: string): Observable<DailyLog> {
        const logDocRef = doc(this.firestore, `users/${userId}/logs/${date}`);
        return docData(logDocRef) as Observable<DailyLog>;
    }

    // Get all logs for a specific month
    getLogsForMonth(userId: string, year: number, month: number): Observable<DailyLog[]> {
        const startDate = Timestamp.fromDate(new Date(year, month - 1, 1));
        const endDate = Timestamp.fromDate(new Date(year, month, 0)); // Day 0 gives last day of previous month

        const logsCollection = collection(this.firestore, `users/${userId}/logs`);
        const q = query(logsCollection, where('date', '>=', startDate), where('date', '<=', endDate));

        return collectionData(q, { idField: 'id' }) as Observable<DailyLog[]>;
    }

    // Create or Update a daily log
    saveDailyLog(userId: string, log: DailyLog) {
        const date = (log.date.toDate()).toISOString().split('T')[0];
        const logDocRef = doc(this.firestore, `users/${userId}/logs/${date}`);
        // We only save the necessary data, excluding totals.
        return from(setDoc(logDocRef, {
            date: log.date,
            userId: log.userId,
            entries: log.entries
        }));
    }

    // Update an existing daily log
    updateDailyLog(userId: string, logId: string, data: Partial<DailyLog>) {
        const logDocRef = doc(this.firestore, `users/${userId}/logs/${logId}`);
        return from(updateDoc(logDocRef, data));
    }

    deleteDailyLog(userId: string, logId: string): Observable<void> {
        if (!logId) {
            return of(undefined);
        }
        const logDocRef = doc(this.firestore, `users/${userId}/logs/${logId}`);
        return from(deleteDoc(logDocRef));
    }
}