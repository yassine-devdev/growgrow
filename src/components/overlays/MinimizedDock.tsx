import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { OVERLAY_APPS } from '@/constants/overlays';
import { useTranslation } from 'react-i18next';

/**
 * Renders a dock in the footer that displays icons for all currently minimized overlay applications.
 * Clicking an icon will restore the corresponding application window.
 * The component renders nothing if no apps are minimized.
 *
 * @returns {JSX.Element | null} The rendered dock component or null.
 */
const MinimizedDock: React.FC = () => {
    const openOverlays = useAppStore((state) => state.openOverlays);
    const openOverlay = useAppStore((state) => state.openOverlay);
    const { t } = useTranslation();
    const minimizedApps = openOverlays.filter(o => o.isMinimized);

    if (minimizedApps.length === 0) {
        return <></>;
    }

    return (
        <div className="flex items-center gap-2">
            {minimizedApps.map(appState => {
                const appConfig = OVERLAY_APPS.find(app => app.id === appState.id);
                if (!appConfig) return <></>;
                
                return (
                    <button
                        key={appConfig.id}
                        aria-label={t('footer.restore', { app: t(appConfig.label) })}
                        onClick={() => openOverlay(appConfig.id)}
                        className="p-2 bg-white/5 rounded-lg border border-white/10 hover:bg-brand-primary hover:text-white transition-all duration-200"
                    >
                        <appConfig.icon className="w-5 h-5" />
                    </button>
                );
            })}
        </div>
    );
};

export default MinimizedDock;