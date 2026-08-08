import { z } from 'zod';
export const createBookingSchema = z.object({
    carId: z.string().min(1, 'Car ID is required'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    offerCode: z.string().optional(),
});
export const updateBookingStatusSchema = z.object({
    status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'], {
        errorMap: () => ({ message: 'Invalid booking status' }),
    }),
});
//# sourceMappingURL=bookingValidator.js.map