import React, { createContext, useState, useEffect, ReactNode } from 'react';

/**
 * Provides the network online status of the user's browser.
 * Value is `true` if online, `false` if offline.
 */
export const OnlineStatusContext = createContext(true);

/**
 * A provider component that tracks the browser's online status and
 * makes it available to its children through the OnlineStatusContext.
 */
export const OnlineStatusProvider = ({ children }: { children: ReactNode }) => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return (
        <OnlineStatusContext.Provider value={isOnline}>
            {children}
        </OnlineStatusContext.Provider>
    );
};