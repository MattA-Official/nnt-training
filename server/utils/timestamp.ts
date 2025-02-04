import { Timestamp } from "firebase-admin/firestore"

// Convert all Firestore Timestamps to JavaScript Dates it's messy but it works
export const convertTimestamps = <T extends Record<string, any>>(data: T): T => {
    if (!data || typeof data !== 'object') return data

    const convertValue = (value: any): any => {
        if (value instanceof Timestamp) return value.toDate()
        if (Array.isArray(value)) return value.map(convertValue)
        if (typeof value === 'object' && value !== null) return convertTimestamps(value)
        return value
    }

    return Object.fromEntries(
        Object.entries(data).map(([key, value]) => [key, convertValue(value)])
    ) as T
}
