import type { Notification } from '@/types/index.ts';
import { apiClient } from './apiClient';

export const getNotifications = async (): Promise<Notification[]> => {
    return apiClient<Notification[]>('/notifications');
};