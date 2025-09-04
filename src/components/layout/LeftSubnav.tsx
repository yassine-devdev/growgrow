import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useTranslation } from 'react-i18next';
import { useLocation, NavLink } from 'react-router-dom';
import { NAVIGATION_CONFIG } from '@/constants/navigation';

/**
 * Renders the left sub-navigation panel.
 * This component displays the secondary (L2) navigation links that are children
 * of the currently active header navigation item (L1).
 *
 * @returns {JSX.Element} The rendered left sub-navigation component.
 */
const LeftSubnav: React.FC = () => {
    const user = useAppStore(state => state.user);
    const { t } = useTranslation();
    const { pathname } = useLocation();

    const config = user ? NAVIGATION_CONFIG[user.role] : [];
    const pathParts = pathname.split('/').filter(Boolean);
    const l0Id = pathParts[0];
    const l1Id = pathParts[1];
    
    const activeL0 = config.find(module => module.id === l0Id);
    const activeL1 = activeL0?.headerNav.find(item => item.id === l1Id);

    if (!activeL1?.children || activeL1.children.length === 0) {
        return <aside className="w-20 shrink-0"></aside>; // Render an empty placeholder to maintain layout
    }

    return (
        <aside className="w-20 bg-brand-surface dark:bg-dark-surface border border-brand-border dark:border-dark-border flex flex-col items-center py-4 rounded-2xl shrink-0">
            <nav 
                aria-label={t(activeL1.label)}
                className="flex flex-col items-center gap-1 bg-black/5 dark:bg-white/5 backdrop-blur-lg border border-black/10 dark:border-white/10 p-1 rounded-xl"
            >
                {activeL1?.children?.map(item => (
                    <NavLink
                        key={item.id}
                        to={`/${l0Id}/${l1Id}/${item.id}`}
                        aria-label={t(item.label)}
                         className={({ isActive }) => `w-16 h-16 flex flex-col items-center justify-center p-2 rounded-lg transition-colors duration-200 group/btn ${
                            isActive 
                                ? 'bg-brand-primary text-white shadow-glow' 
                                : 'text-brand-text-alt dark:text-dark-text-alt hover:bg-black/5 dark:hover:bg-white/5 hover:text-brand-text dark:hover:text-dark-text'
                        }`}
                    >
                        <item.icon className="w-6 h-6 transition-transform group-hover/btn:scale-110" />
                        <span className="text-[10px] mt-1 text-center w-full truncate">{t(item.label)}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default LeftSubnav;