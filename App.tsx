

import React, { Suspense, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import LoginPage from '@/views/auth/LoginPage';
import DashboardLayout from '@/components/layout/DashboardLayout';
// QueryClient and QueryClientProvider are imported from @tanstack/react-query
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Loader2 } from 'lucide-react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { FeatureFlagProvider } from '@/context/FeatureFlagContext';
import { OnlineStatusProvider } from '@/context/AppContext';
import ToastContainer from '@/components/ui/ToastContainer';
import { realtimeService } from '@/services/realtimeService';
import { useTranslation } from 'react-i18next';

/**
 * The TanStack Query client instance for managing server state.
 * @type {QueryClient}
 */
const queryClient = new QueryClient();

/**
 * The root component of the application.
 * It sets up the main providers (`QueryClientProvider`, `ErrorBoundary`, `FeatureFlagProvider`)
 * and handles the primary routing logic based on user authentication status.
 * If a user is logged in, it renders the `DashboardLayout`; otherwise, it directs to the `LoginPage`.
 *
 * @returns {JSX.Element} The rendered application structure.
 */
const App: React.FC = () => {
    const user = useAppStore((state) => state.user);
    const theme = useAppStore((state) => state.theme);
    const { i18n } = useTranslation();

    useEffect(() => {
        // Initialize the real-time service when the app loads.
        // This simulates a persistent WebSocket connection.
        realtimeService.init();

        return () => {
            realtimeService.stop();
        };
    }, []);

    useEffect(() => {
        const root = window.document.documentElement;
        const isDark =
            theme === 'dark' ||
            (theme === 'system' &&
                window.matchMedia('(prefers-color-scheme: dark)').matches);
        
        root.classList.toggle('dark', isDark);

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            if (theme === 'system') {
                root.classList.toggle('dark', mediaQuery.matches);
            }
        };
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme]);


    useEffect(() => {
        // A11y: Update document direction based on the current language.
        const language = i18n.language;
        if (language === 'ar') {
            document.documentElement.dir = 'rtl';
        } else {
            document.documentElement.dir = 'ltr';
        }
    }, [i18n.language]);

    return (
        <QueryClientProvider client={queryClient}>
            <ErrorBoundary>
                <Suspense fallback={<div className="w-full h-screen flex items-center justify-center" role="status" aria-label="Loading application..."><Loader2 className="w-12 h-12 animate-spin text-brand-primary" /></div>}>
                    <>
                        <FeatureFlagProvider>
                            <OnlineStatusProvider>
                                <Routes>
                                    {user ? (
                                        <>
                                            {/* If logged in, DashboardLayout handles all nested routes */}
                                            <Route path="/*" element={<DashboardLayout />} />
                                            {/* If logged in and tries to go to /login, redirect to home */}
                                            <Route path="/login" element={<Navigate to="/" replace />} />
                                        </>
                                    ) : (
                                        <>
                                            {/* If not logged in, only show the login page */}
                                            <Route path="/login" element={<LoginPage />} />
                                            {/* Any other path redirects to /login */}
                                            <Route path="*" element={<Navigate to="/login" replace />} />
                                        </>
                                    )}
                                </Routes>
                                <ToastContainer />
                            </OnlineStatusProvider>
                        </FeatureFlagProvider>
                    </>
                </Suspense>
            </ErrorBoundary>
        </QueryClientProvider>
    );
};

export default App;