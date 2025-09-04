import { z } from 'zod';

export const feeDetailsSchema = z.object({
    childName: z.string(),
    amountDue: z.number(),
    dueDate: z.string(),
    lineItems: z.array(z.object({
        description: z.string(),
        amount: z.number(),
    })),
});
export type FeeDetails = z.infer<typeof feeDetailsSchema>;


export const paymentFormSchema = z.object({
    nameOnCard: z.string().min(3, 'Name on card is required.'),
    cardNumber: z.string().refine((val) => /^\d{16}$/.test(val.replace(/\s/g, '')), 'Please enter a valid 16-digit card number.'),
    expiryDate: z.string().refine((val) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(val), 'Expiry date must be in MM/YY format.'),
    cvc: z.string().refine((val) => /^\d{3,4}$/.test(val), 'CVC must be 3 or 4 digits.'),
});
export type PaymentFormData = z.infer<typeof paymentFormSchema>;