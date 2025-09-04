import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCohortAnalysisData } from '@/api/providerApi';
import { QUERY_KEYS } from '@/constants/queries';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import Skeleton from '@/components/ui/Skeleton';
import type { CohortAnalysisData } from '@/api/schemas/commonSchemas';

const CohortAnalysisSkeleton: React.FC = () => (
    <div className="flex flex-col h-full gap-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="flex-1 w-full" />
    </div>
);

const getHeatmapColor = (value: number | null): string => {
    if (value === null || value === 0) return 'bg-brand-surface-alt/50';
    if (value > 80) return 'bg-green-600/80 text-white';
    if (value > 60) return 'bg-green-500/70 text-white';
    if (value > 40) return 'bg-green-400/60 text-green-900';
    if (value > 20) return 'bg-green-300/50 text-green-800';
    return 'bg-green-200/40 text-green-700';
};


const CohortAnalysisDashboard: React.FC = () => {
    const { t } = useTranslation();
    const { data, isLoading } = useQuery<CohortAnalysisData>({
        queryKey: QUERY_KEYS.cohortAnalysisData,
        queryFn: getCohortAnalysisData,
    });

    if (isLoading) {
        return <CohortAnalysisSkeleton />;
    }

    if (!data) return null;

    return (
        <div className="flex flex-col h-full gap-4">
             <h1 className="text-2xl font-bold text-brand-text">{t('views.cohortAnalysis.title')}</h1>
             <div className="flex-1 bg-brand-surface border border-brand-border rounded-lg p-4 overflow-auto">
                <h3 className="text-lg font-bold text-brand-text mb-4">{t('views.cohortAnalysis.retentionBySignup')}</h3>
                <table className="w-full min-w-[800px] border-collapse text-sm">
                    <thead>
                        <tr className="text-left text-brand-text-alt bg-brand-surface-alt">
                             <th className="p-2 border border-brand-border">Cohort</th>
                             <th className="p-2 border border-brand-border">{t('views.cohortAnalysis.users')}</th>
                            {data.timePeriods.map(period => (
                                <th key={period} className="p-2 border border-brand-border">{period}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.cohorts.map(cohort => (
                            <tr key={cohort.cohort}>
                                <td className="p-2 border border-brand-border font-semibold">{cohort.cohort}</td>
                                <td className="p-2 border border-brand-border">{cohort.totalUsers.toLocaleString()}</td>
                                {cohort.values.map((value, index) => (
                                    <td key={index} className={`p-2 border border-brand-border text-center font-semibold ${getHeatmapColor(value)}`}>
                                        {value !== null ? `${value}%` : ''}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
        </div>
    );
};

export default CohortAnalysisDashboard;
