import * as schemas from './schemas/parentSchemas';
import type { PaymentFormData } from './schemas/parentSchemas';
import { apiClient } from './apiClient';

export const getFeeDetails = async (childId: string): Promise<schemas.FeeDetails> => {
    const data = await apiClient<schemas.FeeDetails>(`/fees/${childId}`);
    return schemas.feeDetailsSchema.parse(data);
};

export const processPayment = (data: { paymentDetails: PaymentFormData, amount: number }): Promise<{ success: boolean; transactionId: string }> => {
    return apiClient('/fees/pay', {
        method: 'POST',
        body: JSON.stringify(data),
    });
};