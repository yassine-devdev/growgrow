

import React, { lazy, Suspense } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { OVERLAY_APPS } from '@/constants/overlays';
import OverlayWindow from './OverlayWindow';
import { Loader2 } from 'lucide-react';

/**
 * A map of overlay app IDs to their lazily-loaded components.
 * This allows for code-splitting, so that app code is only downloaded when the user opens it.
 * @type {Record<string, React.LazyExoticComponent<React.ComponentType<any>>>}
 */
const lazyComponentMap: { [key: string]: React.LazyExoticComponent<React.ComponentType<any>> } = {
    'studio': lazy(() => import('@/components/overlays/apps/StudioOverlay')),
    'media': lazy(() => import('@/components/overlays/apps/MediaOverlay')),
    'gamification': lazy(() => import('@/components/overlays/apps/GamificationOverlay')),
    'leisure': lazy(() => import('@/components/overlays/apps/LeisureOverlay')),
    'market': lazy(() => import('@/components/overlays/apps/MarketplaceOverlay')),
    'lifestyle': lazy(() => import('@/components/overlays/apps/LifestyleOverlay')),
    'hobbies': lazy(() => import('@/components/overlays/apps/HobbiesOverlay')),
    'knowledge': lazy(() => import('@/components/overlays/apps/KnowledgeOverlay')),
    'sports': lazy(() => import('@/components/overlays/apps/SportsOverlay')),
    'religion': lazy(() => import('@/components/overlays/apps/ReligionOverlay')),
    'sudoku': lazy(() => import('@/components/overlays/apps/SudokuOverlay')),
    'services': lazy(() => import('@/components/overlays/apps/ServicesOverlay')),
    'finance': lazy(() => import('@/components/overlays/apps/FinanceOverlay')),
    'help': lazy(() => import('@/components/overlays/apps/HelpOverlay')),
};

/**
 * Manages the rendering of all open, non-minimized overlay applications.
 * It iterates through the `openOverlays` state from the global store and renders
 * an `OverlayWindow` for each one, dynamically loading the app's content.
 *
 * @returns {JSX.Element} A fragment containing all active overlay windows.
 */
const OverlayManager: React.FC = () => {
    const openOverlays = useAppStore((state) => state.openOverlays);

    return (
        <>
            {openOverlays.map(overlayState => {
                const appConfig = OVERLAY_APPS.find(app => app.id === overlayState.id);
                if (!appConfig || overlayState.isMinimized) return <></>;

                const AppComponent = lazyComponentMap[appConfig.id];
                if (!AppComponent) return <></>;
                
                return (
                    <OverlayWindow
                        key={appConfig.id}
                        appId={appConfig.id}
                        title={appConfig.label}
                        icon={appConfig.icon}
                        zIndex={overlayState.zIndex}
                    >
                        <Suspense fallback={<div className="w-full h-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-brand-primary" /></div>}>
                            <AppComponent />
                        </Suspense>
                    </OverlayWindow>
                );
            })}
        </>
    );
};

export default OverlayManager;