import { z } from 'zod';
export const createCarSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    type: z.enum(['SUV', 'Sedan', 'Hatchback', 'Luxury', 'MUV', 'Minivan'], { errorMap: () => ({ message: 'Invalid car type' }) }),
    fuel: z.enum(['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG']).optional(),
    transmission: z.enum(['Manual', 'Automatic', 'AMT']).optional(),
    seating: z.coerce.number().int().min(1).max(20).optional(),
    mileage: z.string().max(50).optional().nullable(),
    pricePerDay: z.coerce.number().positive('Price per day must be positive'),
    pricePerHour: z.coerce.number().positive().optional().nullable(),
    imageKey: z.string().optional().nullable(),
    images: z.array(z.string()).optional(),
    locationId: z.string().min(1, 'Location is required'),
});
export const updateCarSchema = z.object({
    name: z.string().min(2).max(100).optional(),
    type: z.enum(['SUV', 'Sedan', 'Hatchback', 'Luxury', 'MUV', 'Minivan']).optional(),
    fuel: z.enum(['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG']).optional(),
    transmission: z.enum(['Manual', 'Automatic', 'AMT']).optional(),
    seating: z.coerce.number().int().min(1).max(20).optional(),
    mileage: z.string().max(50).optional().nullable(),
    pricePerDay: z.coerce.number().positive().optional(),
    pricePerHour: z.coerce.number().positive().optional().nullable(),
    imageKey: z.string().optional().nullable(),
    images: z.array(z.string()).optional(),
    availability: z.boolean().optional(),
    locationId: z.string().optional(),
});
//# sourceMappingURL=carValidator.js.map