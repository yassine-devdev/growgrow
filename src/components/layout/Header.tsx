

import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { NavItem } from '@/types/index.ts';
import { useTranslation } from 'react-i18next';
import { NavLink, useLocation } from 'react-router-dom';
import { NAVIGATION_CONFIG } from '@/constants/navigation';
import NotificationCenter from '@/components/layout/NotificationCenter';
import { HelpCircle, Menu } from 'lucide-react';

/**
 * Renders the main header of the application dashboard.
 * It dynamically displays the title and icon of the current main module (L0)
 * and provides the primary (L1) navigation links for that module.
 * It now also includes the Notification Center and a Help button.
 *
 * @returns {JSX.Element} The rendered header component.
 */
const Header: React.FC = () => {
    const user = useAppStore((state) => state.user);
    const openOverlay = useAppStore((state) => state.openOverlay);
    const { isMobileNavOpen, toggleMobileNav } = useAppStore();
    const { t } = useTranslation();
    const { pathname } = useLocation();

    const config = user ? NAVIGATION_CONFIG[user.role] : [];
    const l0Id = pathname.split('/')[1];
    const activeL0 = config.find(module => module.id === l0Id);

    if (!activeL0) return <header className="h-20" />;

    return (
        <header className="h-20 bg-brand-surface/80 dark:bg-dark-surface/80 backdrop-blur-sm border border-brand-border/50 dark:border-dark-border/50 flex items-center px-4 md:px-6 shrink-0 rounded-2xl">
            <button 
                onClick={toggleMobileNav} 
                className="p-2.5 rounded-lg text-brand-text-alt dark:text-dark-text-alt hover:bg-black/5 dark:hover:bg-white/5 md:hidden mr-2"
                aria-label="Toggle navigation menu"
                aria-expanded={isMobileNavOpen}
                aria-controls="mobile-nav-panel"
            >
                <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-3 overflow-hidden">
                {activeL0?.icon && (
                    <div className="p-2 bg-brand-primary/10 rounded-lg">
                        <activeL0.icon className="w-7 h-7 text-brand-primary" />
                    </div>
                )}
                <div className="overflow-hidden">
                    <h1 className="text-xl md:text-2xl font-bold text-brand-text dark:text-dark-text truncate">{t(activeL0?.label || '')}</h1>
                    <p className="text-sm text-brand-text-alt dark:text-dark-text-alt -mt-1">{t(`roles.${user?.role.toLowerCase()}`)} View</p>
                </div>
            </div>

            <nav 
                className="hidden md:flex items-center ml-auto space-x-1 bg-black/5 dark:bg-white/5 backdrop-blur-lg border border-black/10 dark:border-white/10 p-1 rounded-xl"
            >
                {activeL0?.headerNav.map((item: NavItem) => (
                    <NavLink
                        key={item.id}
                        to={`/${l0Id}/${item.id}`}
                        end={!item.children || item.children.length === 0}
                        className={({ isActive }) => `px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 flex items-center gap-2 ${
                            isActive
                                ? 'bg-brand-primary text-white shadow-glow' 
                                : 'text-brand-text-alt dark:text-dark-text-alt hover:bg-black/5 dark:hover:bg-white/5 hover:text-brand-text dark:hover:text-dark-text'
                        }`}
                    >
                        <item.icon className="w-4 h-4" />
                        {t(item.label)}
                    </NavLink>
                ))}
            </nav>
            
            <div className="flex items-center gap-2 ml-auto md:ml-4">
                <NotificationCenter />
                <button 
                    onClick={() => openOverlay('help')} 
                    aria-label={t('header.tooltips.help')}
                    title={t('header.tooltips.help')}
                    className="p-2.5 rounded-lg text-brand-text-alt dark:text-dark-text-alt hover:bg-black/5 dark:hover:bg-white/5 hover:text-brand-text dark:hover:text-dark-text transition-colors"
                >
                    <HelpCircle className="w-5 h-5" />
                </button>
            </div>
        </header>
    );
};

export default Header;