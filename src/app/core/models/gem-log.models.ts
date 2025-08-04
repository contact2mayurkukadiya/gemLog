import { Timestamp } from 'firebase/firestore';

// Represents a single price tier, e.g., "1-20", "21-40"
export interface PriceTier {
    id: string; // Firestore-generated ID
    weight: string; // e.g., "1-20" or "Single"
    sieve?: string; // Optional: e.g., "+11" or "Round"
    price: number;
}

// Represents a single line item in the daily log
export interface DiamondEntry {
    priceTierId: string;
    count: number;
    priceAtTime: number; // Store the price at the time of entry for historical accuracy
}

// Represents the entire log document for a single day
export interface DailyLog {
    id?: string; // Document ID from Firestore, e.g., "2023-10-27"
    date: Timestamp;
    userId: string;
    entries: DiamondEntry[];
    totalIncome: number;
    totalDiamonds: number;
}