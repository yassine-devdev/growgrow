
import React from 'react';
import { Rocket } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * A placeholder component for overlay apps that are not yet implemented.
 * It displays a "Coming Soon" message with an engaging icon and text.
 *
 * @returns {JSX.Element} The rendered placeholder view.
 */
const PlaceholderOverlay: React.FC = () => {
    const { t } = useTranslation();
    return (
        <div className="w-full h-full flex flex-col items-center justify-center text-center p-4 bg-brand-surface-alt dark:bg-dark-surface-alt rounded-lg">
            <div className="relative mb-4">
                <div className="absolute -inset-2 bg-brand-primary/10 rounded-full animate-pulse"></div>
                <Rocket className="relative w-16 h-16 text-brand-primary" />
            </div>
            <h2 className="text-2xl font-bold text-brand-text dark:text-dark-text mb-2">{t('apps.placeholder.title')}</h2>
            <p className="text-brand-text-alt dark:text-dark-text-alt max-w-sm">{t('apps.placeholder.description')}</p>
        </div>
    );
};

export default PlaceholderOverlay;
