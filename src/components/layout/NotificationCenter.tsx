import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bell, FileText, Banknote, Megaphone, Wrench, Circle } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { getNotifications } from '@/api/notificationsApi';
import { QUERY_KEYS } from '@/constants/queries';
import { useRealtimeNotifications } from '@/hooks/useRealtime';
import { useTranslation } from 'react-i18next';

const notificationIcons = {
    grade: <FileText className="w-4 h-4 text-blue-500" />,
    billing: <Banknote className="w-4 h-4 text-green-500" />,
    announcement: <Megaphone className="w-4 h-4 text-yellow-500" />,
    system: <Wrench className="w-4 h-4 text-gray-500" />,
};

const NotificationCenter: React.FC = () => {
    const { notifications, setNotifications, markAsRead, markAllAsRead } = useAppStore();
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useTranslation();

    // Initial fetch of notifications
    const { data } = useQuery({
        queryKey: QUERY_KEYS.notifications,
        queryFn: getNotifications,
        staleTime: Infinity, // Data will be updated via real-time service, no need to refetch
    });

    // Subscribe to real-time updates
    useRealtimeNotifications();

    useEffect(() => {
        if (data) {
            setNotifications(data);
        }
    }, [data, setNotifications]);
    
    const unreadCount = notifications.filter(n => !n.read).length;

    const handleMarkAsRead = (id: string) => {
        markAsRead(id);
    };

    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                aria-label={`You have ${unreadCount} unread notifications`}
                title={t('header.tooltips.notifications')}
                className="relative p-2.5 rounded-lg text-brand-text-alt dark:text-dark-text-alt hover:bg-black/5 dark:hover:bg-white/5 hover:text-brand-text dark:hover:text-dark-text transition-colors"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 items-center justify-center text-[10px] text-white">
                            {unreadCount}
                        </span>
                    </span>
                )}
            </button>

            {isOpen && (
                <div 
                    className="absolute top-full right-0 mt-2 w-80 bg-brand-surface dark:bg-dark-surface border border-brand-border dark:border-dark-border rounded-lg shadow-xl z-20 animate-fade-in-down"
                    role="dialog"
                    aria-labelledby="notification-heading"
                >
                    <div className="p-3 border-b border-brand-border dark:border-dark-border flex justify-between items-center">
                        <h2 id="notification-heading" className="font-bold text-brand-text dark:text-dark-text">Notifications</h2>
                        <button onClick={markAllAsRead} className="text-xs text-brand-primary hover:underline" disabled={unreadCount === 0}>
                            Mark all as read
                        </button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                            notifications.map(n => (
                                <div key={n.id} className={`p-3 border-b border-brand-border dark:border-dark-border last:border-b-0 hover:bg-brand-surface-alt dark:hover:bg-dark-surface-alt flex gap-3 ${!n.read ? 'bg-brand-primary/5' : ''}`}>
                                    <div className="mt-1">{notificationIcons[n.type]}</div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-brand-text dark:text-dark-text">{n.title}</p>
                                        <p className="text-xs text-brand-text-alt dark:text-dark-text-alt">{n.description}</p>
                                    </div>
                                    {!n.read && (
                                        <button onClick={() => handleMarkAsRead(n.id)} className="self-center" aria-label="Mark as read">
                                            <Circle className="w-2.5 h-2.5 text-brand-primary fill-current"/>
                                        </button>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="p-4 text-center text-sm text-brand-text-alt dark:text-dark-text-alt">You're all caught up!</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationCenter;