import React, { createContext, useState, ReactNode, useContext } from 'react';

export type DateRange = '7d' | '30d' | '90d' | 'all';

interface AnalyticsFilterContextType {
    dateRange: DateRange;
    setDateRange: (range: DateRange) => void;
}

const AnalyticsFilterContext = createContext<AnalyticsFilterContextType | undefined>(undefined);

export const AnalyticsFilterProvider = ({ children }: { children: ReactNode }) => {
    const [dateRange, setDateRange] = useState<DateRange>('30d');
    
    const value = { dateRange, setDateRange };

    return (
        <AnalyticsFilterContext.Provider value={value}>
            {children}
        </AnalyticsFilterContext.Provider>
    );
};

export const useAnalyticsFilter = () => {
    const context = useContext(AnalyticsFilterContext);
    if (context === undefined) {
        throw new Error('useAnalyticsFilter must be used within an AnalyticsFilterProvider');
    }
    return context;
};