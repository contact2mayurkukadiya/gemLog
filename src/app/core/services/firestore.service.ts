import { Injectable } from '@angular/core';
import {
    Firestore,
    doc,
    collection,
    collectionData,
    docData,
    setDoc,
    updateDoc,
    query,
    where,
    Timestamp,
} from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { DailyLog, PriceTier } from '../models/gem-log.models';

@Injectable({
    providedIn: 'root',
})
export class FirestoreService {
    constructor(private firestore: Firestore) { }

    // --- Price Tier Management ---

    // Get Price Tiers for a User
    getPriceTiers(userId: string): Observable<PriceTier[]> {
        const tiersCollection = collection(this.firestore, `users/${userId}/priceTiers`);
        return collectionData(tiersCollection, { idField: 'id' }) as Observable<PriceTier[]>;
    }

    // Save/Update Price Tiers for a User
    savePriceTiers(userId: string, tiers: PriceTier[]) {
        const promises = tiers.map((tier) => {
            const tierDocRef = doc(this.firestore, `users/${userId}/priceTiers/${tier.id}`);
            return setDoc(tierDocRef, tier, { merge: true });
        });
        return from(Promise.all(promises));
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
        // Use YYYY-MM-DD as the document ID for easy lookup
        const date = (log.date.toDate()).toISOString().split('T')[0];
        const logDocRef = doc(this.firestore, `users/${userId}/logs/${date}`);
        return from(setDoc(logDocRef, log));
    }

    // Update an existing daily log
    updateDailyLog(userId: string, logId: string, data: Partial<DailyLog>) {
        const logDocRef = doc(this.firestore, `users/${userId}/logs/${logId}`);
        return from(updateDoc(logDocRef, data));
    }
}