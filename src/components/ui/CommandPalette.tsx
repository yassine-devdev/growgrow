import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { NAVIGATION_CONFIG } from '@/constants/navigation';
import { ModuleConfig, NavItem } from '@/types/index.ts';
import { Search } from 'lucide-react';
import Icon from '@/components/ui/Icon';

interface Action {
    id: string;
    name: string;
    path: string;
    icon: React.ElementType;
    section: string;
}

// Helper function to flatten the complex navigation config into a single list of actions
const flattenNav = (modules: ModuleConfig[], t: (key: string) => string): Action[] => {
    const actions: Action[] = [];
    const recurse = (items: NavItem[], pathPrefix: string, section: string) => {
        for (const item of items) {
            const path = `${pathPrefix}/${item.id}`;
            actions.push({
                id: path,
                name: t(item.label),
                path,
                icon: item.icon,
                section,
            });
            if (item.children) {
                recurse(item.children, path, section);
            }
        }
    };

    for (const module of modules) {
        recurse(module.headerNav, `/${module.id}`, t(module.label));
    }
    return actions;
};

const CommandPalette: React.FC = () => {
    const { isCommandPaletteOpen, toggleCommandPalette, user } = useAppStore();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [search, setSearch] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    // Memoize the flattened list of all possible actions for the current user
    const allActions = useMemo(() => {
        if (!user) return [];
        const config = NAVIGATION_CONFIG[user.role] || [];
        return flattenNav(config, t);
    }, [user, t]);

    // Memoize the filtered list based on the search query
    const filteredActions = useMemo(() => {
        if (!search) return allActions;
        return allActions.filter(action => 
            action.name.toLowerCase().includes(search.toLowerCase()) ||
            action.section.toLowerCase().includes(search.toLowerCase())
        );
    }, [search, allActions]);

    // Focus input when palette opens, and reset state when it closes
    useEffect(() => {
        if (isCommandPaletteOpen) {
            inputRef.current?.focus();
        } else {
            setSearch('');
            setSelectedIndex(0);
        }
    }, [isCommandPaletteOpen]);

    // Reset selected index when search query changes
    useEffect(() => {
        setSelectedIndex(0);
    }, [search]);

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(i => (i + 1) % filteredActions.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(i => (i - 1 + filteredActions.length) % filteredActions.length);
        } else if (e.key === 'Enter') {
            const action = filteredActions[selectedIndex];
            if (action) {
                navigate(action.path);
                toggleCommandPalette();
            }
        }
    };

    if (!isCommandPaletteOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50 backdrop-blur-sm animate-fade-in"
            role="dialog"
            aria-modal="true"
            onClick={toggleCommandPalette}
        >
            <div 
                className="bg-brand-surface dark:bg-dark-surface rounded-lg shadow-xl w-full max-w-2xl"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={handleKeyDown}
            >
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-alt dark:text-dark-text-alt" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search for a page or action..."
                        className="w-full bg-transparent p-4 pl-12 text-lg text-brand-text dark:text-dark-text focus:outline-none"
                    />
                </div>
                <div className="border-t border-brand-border dark:border-dark-border max-h-96 overflow-y-auto">
                    {filteredActions.length > 0 ? (
                         filteredActions.map((action, index) => (
                            <button
                                key={action.id}
                                onClick={() => {
                                    navigate(action.path);
                                    toggleCommandPalette();
                                }}
                                className={`w-full text-left flex items-center justify-between p-4 ${selectedIndex === index ? 'bg-brand-primary/10' : 'hover:bg-brand-surface-alt dark:hover:bg-dark-surface-alt'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <action.icon className="w-5 h-5 text-brand-text-alt dark:text-dark-text-alt" />
                                    <span className="text-brand-text dark:text-dark-text">{action.name}</span>
                                </div>
                                <span className="text-xs text-brand-text-alt dark:text-dark-text-alt bg-brand-surface-alt dark:bg-dark-surface-alt px-2 py-1 rounded-md">{action.section}</span>
                            </button>
                        ))
                    ) : (
                        <p className="p-8 text-center text-brand-text-alt dark:text-dark-text-alt">No results found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CommandPalette;
