import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { realtimeService } from '@/services/realtimeService';
import { useAppStore } from '@/store/useAppStore';
import { QUERY_KEYS } from '@/constants/queries';
import type { Notification } from '@/types/index.ts';

/**
 * A custom hook to handle real-time notification updates.
 * It subscribes to the realtimeService and updates the Zustand store
 * when a new notification is received.
 */
export const useRealtimeNotifications = () => {
    const { addToast, setNotifications, notifications } = useAppStore();

    useEffect(() => {
        const handleNewNotification = (newNotification: Notification) => {
            // Add a toast for immediate feedback
            addToast({ message: `New notification: ${newNotification.title}`, type: 'info' });
            // Update the global state
            setNotifications([newNotification, ...notifications]);
        };

        realtimeService.subscribe('notifications', handleNewNotification);

        return () => {
            realtimeService.unsubscribe('notifications', handleNewNotification);
        };
    }, [addToast, setNotifications, notifications]);
};


/**
 * A custom hook to handle real-time updates for the monitoring dashboard.
 * It subscribes to the realtimeService and uses the queryClient to update
 * the TanStack Query cache with new data, causing components to re-render.
 */
export const useRealtimeMonitoring = () => {
    const queryClient = useQueryClient();

    useEffect(() => {
        const handleMonitoringUpdate = (update: { type: string; data: any }) => {
            switch (update.type) {
                case 'serviceStatus':
                    queryClient.setQueryData(QUERY_KEYS.serviceStatus, update.data);
                    break;
                case 'incidents':
                    queryClient.setQueryData(QUERY_KEYS.activeIncidents, update.data);
                    break;
                case 'logs':
                     queryClient.setQueryData(QUERY_KEYS.liveLogs, update.data);
                    break;
                case 'alerts':
                    queryClient.setQueryData(QUERY_KEYS.systemAlerts, update.data);
                    break;
            }
        };

        realtimeService.subscribe('monitoring', handleMonitoringUpdate);

        return () => {
            realtimeService.unsubscribe('monitoring', handleMonitoringUpdate);
        };
    }, [queryClient]);
};