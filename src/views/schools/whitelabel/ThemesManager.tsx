import React, { useState } from 'react';
import { getThemes } from '@/api/schoolManagementApi';
import type { Theme } from '@/api/schemas/schoolManagementSchemas';
import { Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { QUERY_KEYS } from '@/constants/queries';
import Image from '@/components/ui/Image';

const ThemesManager: React.FC = () => {
    const { t } = useTranslation();
    const { data: themes, isLoading } = useQuery({
        queryKey: QUERY_KEYS.themes,
        queryFn: getThemes,
        initialData: [],
    });
    const [activeTheme, setActiveTheme] = useState('light');

    if (isLoading) {
        return <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-brand-primary" /></div>;
    }

    return (
        <div className="h-full flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-brand-text">{t('views.themesManager.title')}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {themes.map(theme => (
                    <div key={theme.id} className={`border-2 rounded-lg overflow-hidden transition-all ${activeTheme === theme.id ? 'border-brand-primary shadow-glow' : 'border-brand-border'}`}>
                        <Image src={theme.thumbnailUrl} alt={theme.name} className="w-full h-40" />
                        <div className="p-4 bg-brand-surface">
                            <h3 className="font-bold text-lg text-brand-text">{theme.name}</h3>
                            <p className="text-sm text-brand-text-alt mb-4">{theme.description}</p>
                            <button 
                                onClick={() => setActiveTheme(theme.id)}
                                disabled={activeTheme === theme.id}
                                className="w-full py-2 text-sm font-semibold rounded-md disabled:bg-green-500 disabled:text-white bg-brand-primary hover:bg-brand-primary-hover text-white"
                            >
                                {activeTheme === theme.id ? t('views.themesManager.appliedButton') : t('views.themesManager.applyButton')}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ThemesManager;
