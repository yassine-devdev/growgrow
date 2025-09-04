import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PenTool, Video, Code2, FileText, ShoppingCart } from 'lucide-react';

const studioNavItems = [
    { to: 'designer', label: 'Designer', icon: PenTool },
    { to: 'video', label: 'Video', icon: Video },
    { to: 'coder', label: 'Coder', icon: Code2 },
    { to: 'office', label: 'Office', icon: FileText },
    { to: 'marketplace', label: 'Marketplace', icon: ShoppingCart },
];

const StudioNav: React.FC = () => {
    const { t } = useTranslation();

    return (
        <aside className="w-56 bg-brand-surface dark:bg-dark-surface border-r border-brand-border dark:border-dark-border flex flex-col p-4 shrink-0">
            <h2 className="text-lg font-bold text-brand-text dark:text-dark-text mb-6 px-2">Studio Suite</h2>
            <nav className="flex flex-col gap-2">
                {studioNavItems.map(item => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end
                        className={({ isActive }) => `px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors duration-200 flex items-center gap-3 ${
                            isActive
                                ? 'bg-brand-primary/10 text-brand-primary' 
                                : 'text-brand-text-alt dark:text-dark-text-alt hover:bg-brand-surface-alt dark:hover:bg-dark-surface-alt hover:text-brand-text dark:hover:text-dark-text'
                        }`}
                    >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default StudioNav;