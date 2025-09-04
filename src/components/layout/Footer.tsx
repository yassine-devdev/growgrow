import React, { useState } from 'react';
import { Layers, LogOut, Globe, ShoppingCart, WifiOff, Grid3x3, Sun, Moon, Monitor } from 'lucide-react';
import MinimizedDock from '@/components/overlays/MinimizedDock';
import { OVERLAY_APPS } from '@/constants/overlays';
import { useAppStore } from '@/store/useAppStore';
import CustomIcon from '@/components/ui/CustomIcons';
import { useTranslation } from 'react-i18next';
import { useOnlineStatus } from '@/hooks/useAppContext';

const ThemeSwitcher: React.FC = () => {
    const { theme, setTheme } = useAppStore();
    
    const themes = [
        { name: 'light', icon: Sun },
        { name: 'dark', icon: Moon },
        { name: 'system', icon: Monitor },
    ];
    
    return (
        <div className="group relative">
            <button
                className="p-3 bg-white/5 rounded-full border border-white/10 text-white hover:bg-brand-primary/80 transition-colors"
                aria-label="Change theme"
                aria-haspopup="true"
            >
                {theme === 'light' && <Sun className="w-5 h-5" />}
                {theme === 'dark' && <Moon className="w-5 h-5" />}
                {theme === 'system' && <Monitor className="w-5 h-5" />}
            </button>
            <div role="menu" className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 p-1 bg-black/30 backdrop-blur-md border border-white/10 rounded-lg flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                {themes.map(t => (
                    <button 
                        key={t.name}
                        onClick={() => setTheme(t.name as 'light' | 'dark' | 'system')} 
                        className={`p-2 rounded-full text-white ${theme === t.name ? 'bg-brand-primary' : 'hover:bg-white/10'}`}
                        aria-label={`Set theme to ${t.name}`}
                    >
                        <t.icon className="w-5 h-5" />
                    </button>
                ))}
            </div>
        </div>
    );
};

/**
 * Renders the application footer, which acts as a global dock.
 * It contains the app launcher, the dock for minimized overlay windows,
 * a language switcher, and the logout button.
 *
 * @returns {JSX.Element} The rendered footer component.
 */
const Footer: React.FC = () => {
    const [isLauncherOpen, setIsLauncherOpen] = useState(false);
    const { openOverlay, logout, cart } = useAppStore();
    const { t, i18n } = useTranslation();
    const isOnline = useOnlineStatus();
    const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    /**
     * Handles opening an overlay application when its icon is clicked.
     * @param {string} id - The ID of the app to open.
     */
    const handleAppClick = (id: string) => {
        openOverlay(id);
        setIsLauncherOpen(false); // Close launcher after selection
    };
    
    /**
     * Changes the application's language.
     * @param {'en' | 'es' | 'fr' | 'ar'} lng - The language code to switch to.
     */
    const changeLanguage = (lng: 'en' | 'es' | 'fr' | 'ar') => {
        i18n.changeLanguage(lng);
    };

    return (
        <footer className="h-[68px] shrink-0 group relative overflow-hidden rounded-[20px] backdrop-blur-[15px] bg-[linear-gradient(145deg,_#0f0f23_0%,_#1a1a2e_25%,_#16213e_75%,_#0f1419_100%)] border border-white/[.08] shadow-[0_8px_32px_rgba(0,0,0,0.4),_0_0_0_1px_rgba(255,255,255,0.03),_inset_0_1px_0_rgba(255,255,255,0.05),_inset_0_-1px_0_rgba(0,0,0,0.2)] transition-all duration-400 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.5),_0_0_0_1px_rgba(255,255,255,0.08),_inset_0_1px_0_rgba(255,255,255,0.08),_inset_0_-1px_0_rgba(0,0,0,0.3),_0_0_30px_rgba(102,126,234,0.15)] hover:border-[rgba(102,126,234,0.2)] before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-0.5 before:bg-gradient-to-r before:from-transparent before:via-[rgba(102,126,234,0.3)] before:to-transparent before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-400 after:content-[''] after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_50%_0%,_rgba(102,126,234,0.03)_0%,_transparent_70%)] after:opacity-0 group-hover:after:opacity-100 after:transition-opacity after:duration-400 after:pointer-events-none">
            <div className="flex items-center justify-between h-full px-5">
                <div className="flex items-center gap-2">
                    {/* App Launcher */}
                    <button 
                        aria-label={t('footer.launcher.open')} 
                        onClick={() => setIsLauncherOpen(!isLauncherOpen)}
                        aria-expanded={isLauncherOpen}
                        aria-controls="app-launcher-tray"
                        className="p-3 bg-white/5 rounded-full border border-white/10 hover:bg-brand-primary transition-all duration-200"
                    >
                        <Layers className="w-5 h-5 text-white" />
                    </button>
                     {/* New App Grid Launcher */}
                    <button
                        aria-label={t('footer.launcher.openGrid')}
                        onClick={() => setIsLauncherOpen(!isLauncherOpen)}
                        aria-expanded={isLauncherOpen}
                        aria-controls="app-launcher-tray"
                        className="p-3 bg-white/5 rounded-full border border-white/10 hover:bg-brand-primary transition-all duration-200"
                    >
                        <Grid3x3 className="w-5 h-5 text-white" />
                    </button>
                    {/* Minimized Dock */}
                    <MinimizedDock />
                </div>

                {!isOnline && (
                    <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-1.5 bg-yellow-500/20 text-yellow-300 rounded-full text-sm border border-yellow-500/30">
                        <WifiOff className="w-4 h-4" />
                        You are currently offline.
                    </div>
                )}

                <div className="flex items-center gap-2">
                    <ThemeSwitcher />
                    {/* Language Switcher (Example) */}
                    <div className="group relative">
                        <button 
                            className="p-3 bg-white/5 rounded-full border border-white/10 text-white hover:bg-brand-primary/80 transition-colors"
                            aria-label={t('footer.language')}
                            aria-haspopup="true"
                        >
                            <Globe className="w-5 h-5" />
                        </button>
                        <div role="menu" className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 p-1 bg-black/30 backdrop-blur-md border border-white/10 rounded-lg flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                            <button onClick={() => changeLanguage('en')} className={`px-2 py-1 rounded text-xs ${i18n.language === 'en' ? 'bg-brand-primary' : ''}`}>EN</button>
                            <button onClick={() => changeLanguage('es')} className={`px-2 py-1 rounded text-xs ${i18n.language === 'es' ? 'bg-brand-primary' : ''}`}>ES</button>
                            <button onClick={() => changeLanguage('fr')} className={`px-2 py-1 rounded text-xs ${i18n.language === 'fr' ? 'bg-brand-primary' : ''}`}>FR</button>
                            <button onClick={() => changeLanguage('ar')} className={`px-2 py-1 rounded text-xs ${i18n.language === 'ar' ? 'bg-brand-primary' : ''}`}>AR</button>
                        </div>
                    </div>
                     {/* Cart Button */}
                     <button
                        aria-label={t('footer.openMarket')}
                        onClick={() => handleAppClick('market')}
                        className="relative p-3 bg-white/5 rounded-full border border-white/10 text-white hover:bg-brand-primary/80 transition-colors"
                    >
                        <ShoppingCart className="w-5 h-5" />
                        {cartItemCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                                {cartItemCount}
                            </span>
                        )}
                    </button>
                    {/* Logout Button */}
                    <button 
                        aria-label={t('footer.logout')} 
                        onClick={logout} 
                        className="p-3 bg-white/5 rounded-full border border-white/10 text-white hover:bg-red-500/80 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>
             {/* App Launcher Tray */}
            <div 
                id="app-launcher-tray"
                className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 p-3 bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-wrap gap-2 transition-all duration-300 ease-in-out ${isLauncherOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`} style={{ width: 'min(80vw, 600px)' }}>
                {OVERLAY_APPS.map(app => (
                    <button 
                        key={app.id} 
                        onClick={() => handleAppClick(app.id)} 
                        className="flex flex-col items-center gap-1 p-2 rounded-lg text-white hover:bg-white/10 w-20"
                    >
                        <CustomIcon name={app.id} className="w-10 h-10" />
                        <span className="text-xs text-center truncate w-full">{t(app.label)}</span>
                    </button>
                ))}
            </div>
        </footer>
    );
};

export default Footer;