import { z } from 'zod';
import * as schemas from './schemas/marketSchemas';
import { CartItem, Product } from '../types/index.ts';
import { apiClient } from './apiClient';

export const getProducts = async (): Promise<Product[]> => {
    const data = await apiClient<Product[]>('/market/products');
    return schemas.productSchema.array().parse(data);
};

export const checkout = (items: CartItem[]): Promise<{ success: boolean; message: string }> => {
    return apiClient('/market/checkout', {
        method: 'POST',
        body: JSON.stringify({ items })
    });
};