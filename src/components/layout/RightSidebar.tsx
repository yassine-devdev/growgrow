import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import CustomIcon from '@/components/ui/CustomIcons';
import { useTranslation } from 'react-i18next';
import { NAVIGATION_CONFIG } from '@/constants/navigation';
import { NavLink } from 'react-router-dom';

/**
 * Renders the right sidebar, which serves as the primary navigation for main application modules (L0).
 * It dynamically displays navigation links based on the current user's role and configuration.
 *
 * @returns {JSX.Element} The rendered right sidebar component.
 */
const RightSidebar: React.FC = () => {
    const user = useAppStore(state => state.user);
    const config = user ? NAVIGATION_CONFIG[user.role] : [];
    const { t } = useTranslation();

    return (
        <aside className="w-20 flex flex-col items-center py-4 shrink-0 group relative overflow-hidden rounded-[20px] backdrop-blur-[15px] bg-[linear-gradient(145deg,_#0f0f23_0%,_#1a1a2e_25%,_#16213e_75%,_#0f1419_100%)] border border-white/[.08] shadow-[0_8px_32px_rgba(0,0,0,0.4),_0_0_0_1px_rgba(255,255,255,0.03),_inset_0_1px_0_rgba(255,255,255,0.05),_inset_0_-1px_0_rgba(0,0,0,0.2)] transition-all duration-400 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.5),_0_0_0_1px_rgba(255,255,255,0.08),_inset_0_1px_0_rgba(255,255,255,0.08),_inset_0_-1px_0_rgba(0,0,0,0.3),_0_0_30px_rgba(102,126,234,0.15)] hover:border-[rgba(102,126,234,0.2)] before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-0.5 before:bg-gradient-to-r before:from-transparent before:via-[rgba(102,126,234,0.3)] before:to-transparent before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-400 after:content-[''] after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_50%_0%,_rgba(102,126,234,0.03)_0%,_transparent_70%)] after:opacity-0 group-hover:after:opacity-100 after:transition-opacity after:duration-400 after:pointer-events-none">
            <nav className="flex flex-col items-center space-y-2 flex-1">
                {config.map(module => (
                    <NavLink
                        key={module.id}
                        to={`/${module.id}`}
                        aria-label={t(module.label)}
                        className={({ isActive }) => `w-16 h-16 flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-300 ease-in-out group/btn ${
                            isActive
                                ? 'bg-brand-primary text-white shadow-glow scale-110' 
                                : 'text-gray-400 hover:bg-white/10 hover:text-white hover:scale-105'
                        }`}
                    >
                        <CustomIcon name={module.id} className="w-7 h-7 mb-0.5 transition-transform duration-300 group-hover/btn:scale-110" />
                        <span className="text-[10px] mt-1 text-center w-full truncate">{t(module.label)}</span>
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default RightSidebar;