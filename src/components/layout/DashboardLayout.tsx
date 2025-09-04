import React, { useEffect, lazy, Suspense } from 'react';
import Header from '@/components/layout/Header';
import RightSidebar from '@/components/layout/RightSidebar';
import LeftSubnav from '@/components/layout/LeftSubnav';
import ContentArea from '@/views/content/ContentArea';
import OverlayManager from '@/components/overlays/OverlayManager';
import Footer from '@/components/layout/Footer';
import { useAppStore } from '@/store/useAppStore';

const CommandPalette = lazy(() => import('@/components/ui/CommandPalette'));

/**
 * Renders the main layout for the authenticated application experience.
 * This component assembles the primary UI structure, including the header, sidebars,
 * main content area, footer, and overlay manager. It now handles responsive
 * toggling of sidebars for mobile views.
 *
 * @returns {JSX.Element} The rendered dashboard layout.
 */
const DashboardLayout: React.FC = () => {
    const { isMobileNavOpen, toggleMobileNav, toggleCommandPalette } = useAppStore();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                toggleCommandPalette();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [toggleCommandPalette]);

    return (
        <div className="h-screen w-screen flex flex-col font-sans overflow-hidden p-4 md:p-6 gap-4 md:gap-6 relative bg-brand-bg dark:bg-dark-bg">
            {/* Backdrop for mobile nav */}
            {isMobileNavOpen && (
                <div 
                    className="md:hidden fixed inset-0 bg-black/50 z-30 animate-fade-in" 
                    onClick={toggleMobileNav} 
                    aria-hidden="true"
                />
            )}
            
            {/* Mobile slide-out panel */}
            <div 
                id="mobile-nav-panel"
                className={`md:hidden fixed top-0 left-0 h-full z-40 transition-transform duration-300 ease-in-out ${isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                 <div className="p-4 h-full flex gap-4 bg-brand-bg dark:bg-dark-bg">
                    <RightSidebar />
                    <LeftSubnav />
                </div>
            </div>

            {/* Main Desktop Layout */}
            <div className="flex flex-1 min-h-0 gap-4 md:gap-6">
                <div className="flex-1 flex flex-col gap-4 md:gap-6 min-w-0">
                    <Header />
                    <div className="flex flex-1 gap-4 md:gap-6 min-h-0">
                        <div className="hidden md:flex">
                            <LeftSubnav />
                        </div>
                        <main className="flex-1 min-w-0 flex">
                            <ContentArea />
                        </main>
                    </div>
                </div>
                 <div className="hidden md:flex">
                    <RightSidebar />
                </div>
            </div>
            <Footer />
            <OverlayManager />
            <Suspense>
                <CommandPalette />
            </Suspense>
        </div>
    );
};

export default DashboardLayout;