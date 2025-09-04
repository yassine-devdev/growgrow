import React, { useState, useEffect } from 'react';
import { getFeatureFlags } from '@/services/featureFlagService';
import type { FeatureFlags, FeatureFlag } from '@/types/index.ts';
import { useAppStore } from '@/store/useAppStore';
import { Loader2 } from 'lucide-react';
import ToggleSwitch from '@/components/ui/ToggleSwitch';

const FeatureRolloutsView: React.FC = () => {
    const user = useAppStore(s => s.user);
    const [flags, setFlags] = useState<FeatureFlags>({});
    const [isLoading, setIsLoading] = useState(true);

    // This simulates fetching AND updating flags. In a real app, you'd have a mutation.
    useEffect(() => {
        getFeatureFlags(user).then(fetchedFlags => {
            setFlags(fetchedFlags);
            setIsLoading(false);
        });
    }, [user]);

    const handleFlagChange = (key: string, value: any) => {
        setFlags(prev => ({
            ...prev,
            [key]: { ...prev[key], value }
        }));
    };
    
    if (isLoading) {
        return <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-brand-primary" /></div>;
    }

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-brand-text mb-6">Feature Rollouts</h1>
            <div className="space-y-4">
                {Object.values(flags).map((flag: FeatureFlag) => (
                    <div key={flag.key} className="p-4 bg-brand-surface border border-brand-border rounded-lg">
                        {typeof flag.value === 'boolean' ? (
                            <ToggleSwitch
                                name={flag.key}
                                label={flag.key}
                                description={flag.description}
                                checked={flag.value}
                                onChange={(e) => handleFlagChange(flag.key, e.target.checked)}
                            />
                        ) : (
                             <div className="flex items-center justify-between">
                                 <div>
                                    <label className="font-medium text-brand-text">{flag.key}</label>
                                    <p className="text-sm text-brand-text-alt">{flag.description}</p>
                                </div>
                                <select 
                                    value={String(flag.value)} 
                                    onChange={(e) => handleFlagChange(flag.key, e.target.value)}
                                    className="p-2 border rounded-md"
                                >
                                    <option>control</option>
                                    <option>treatment</option>
                                </select>
                             </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeatureRolloutsView;