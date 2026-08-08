import { z } from 'zod';
export declare const createBookingSchema: z.ZodObject<{
    carId: z.ZodString;
    startDate: z.ZodString;
    endDate: z.ZodString;
    offerCode: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    carId: string;
    startDate: string;
    endDate: string;
    offerCode?: string | undefined;
}, {
    carId: string;
    startDate: string;
    endDate: string;
    offerCode?: string | undefined;
}>;
export declare const updateBookingStatusSchema: z.ZodObject<{
    status: z.ZodEnum<["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]>;
}, "strip", z.ZodTypeAny, {
    status: "PENDING" | "CANCELLED" | "CONFIRMED" | "COMPLETED";
}, {
    status: "PENDING" | "CANCELLED" | "CONFIRMED" | "COMPLETED";
}>;
