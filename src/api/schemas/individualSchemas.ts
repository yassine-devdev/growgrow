import { z } from 'zod';

export const bookingSchema = z.object({
    id: z.number(),
    service: z.string(),
    date: z.string(),
    status: z.enum(['Confirmed', 'Pending', 'Canceled']),
});
export type Booking = z.infer<typeof bookingSchema>;

export const bookingRequestSchema = z.object({
    serviceId: z.string(),
    serviceName: z.string(),
    date: z.string(),
});
export type BookingRequest = z.infer<typeof bookingRequestSchema>;

export const orderSchema = z.object({
    id: z.string(),
    item: z.string(),
    date: z.string(),
    status: z.enum(['Processing', 'Shipped', 'Delivered', 'Canceled']),
});
export type Order = z.infer<typeof orderSchema>;