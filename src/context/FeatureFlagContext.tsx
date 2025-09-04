import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getFeatureFlags } from '../services/featureFlagService';
import { useAppStore } from '../store/useAppStore';
import { FeatureFlags, FeatureFlagValue } from '../types/index.ts';

interface FeatureFlagContextType {
    flags: FeatureFlags;
    isLoading: boolean;
    isEnabled: (key: string) => boolean;
    getVariant: (key: string) => FeatureFlagValue;
}

const FeatureFlagContext = createContext<FeatureFlagContextType | undefined>(undefined);

export const FeatureFlagProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const user = useAppStore((state) => state.user);
    const [flags, setFlags] = useState<FeatureFlags>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchFlags = async () => {
            setIsLoading(true);
            try {
                const fetchedFlags = await getFeatureFlags(user);
                setFlags(fetchedFlags);
            } catch (error) {
                console.error("Failed to fetch feature flags:", error);
                setFlags({}); // Fallback to empty flags on error
            } finally {
                setIsLoading(false);
            }
        };

        fetchFlags();
    }, [user]);

    const isEnabled = (key: string): boolean => {
        return flags[key]?.value === true;
    };
    
    const getVariant = (key: string): FeatureFlagValue => {
        return flags[key]?.value ?? 'control'; // Default to 'control' if flag doesn't exist
    }

    const value = {
        flags,
        isLoading,
        isEnabled,
        getVariant
    };

    return (
        <FeatureFlagContext.Provider value={value}>
            {children}
        </FeatureFlagContext.Provider>
    );
};

export const useFeatureFlag = (key: string) => {
    const context = useContext(FeatureFlagContext);
    if (context === undefined) {
        throw new Error('useFeatureFlag must be used within a FeatureFlagProvider');
    }
    
    const { isEnabled, getVariant } = context;

    return {
        isEnabled: isEnabled(key),
        getVariant: () => getVariant(key)
    };
};
