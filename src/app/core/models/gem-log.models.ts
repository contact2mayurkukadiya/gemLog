import { Timestamp } from 'firebase/firestore';

// Represents a single price tier, e.g., "1-20", "21-40"
export interface PriceTier {
    id: string;
    weight: string;
    sieve?: string;
    price: number;
    isArchived?: boolean;
}

// Represents a single line item in the daily log
export interface DiamondEntry {
    priceTierId: string;
    count: number;
    priceAtTime: number;
}

// Represents the entire log document for a single day
export interface DailyLog {
    id?: string;
    date: Timestamp;
    userId: string;
    entries: DiamondEntry[];
}