import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCommandCenterData } from '@/api/providerApi';
import { QUERY_KEYS } from '@/constants/queries';
import { Loader2 } from 'lucide-react';
import StatCard from '@/components/ui/StatCard';
import Skeleton from '@/components/ui/Skeleton';
import type { SchoolHealth } from '@/api/schemas/providerSchemas';
import { Link } from 'react-router-dom';

const HealthIndicator: React.FC<{ score: number }> = ({ score }) => {
    const getColor = () => {
        if (score > 85) return 'text-green-500';
        if (score > 60) return 'text-yellow-500';
        return 'text-red-500';
    };

    return (
        <div className="flex flex-col items-center">
            <div className={`text-2xl font-bold ${getColor()}`}>{score}</div>
            <div className="text-xs text-brand-text-alt">Health Score</div>
        </div>
    );
};

const SchoolCard: React.FC<{ school: SchoolHealth }> = ({ school }) => (
    <Link to={`/schools/detail/${school.id}`} className="block hover:shadow-lg transition-shadow rounded-lg">
        <div className="bg-brand-surface border border-brand-border rounded-lg p-4 flex items-center justify-between h-full">
            <div>
                <h4 className="font-bold text-lg text-brand-text">{school.name}</h4>
                <div className="flex gap-4 mt-2">
                    {school.keyStats.map(stat => (
                        <div key={stat.label} className="text-sm">
                            <p className="text-brand-text-alt">{stat.label}</p>
                            <p className="font-semibold text-brand-text">{stat.value}</p>
                        </div>
                    ))}
                </div>
            </div>
            <HealthIndicator score={school.healthScore} />
        </div>
    </Link>
);


const CommandCenterDashboard: React.FC = () => {
    const { data, isLoading } = useQuery({
        queryKey: QUERY_KEYS.commandCenterData,
        queryFn: getCommandCenterData,
    });

    if (isLoading) {
        return (
            <div className="flex flex-col h-full gap-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Skeleton className="h-24" />
                    <Skeleton className="h-24" />
                    <Skeleton className="h-24" />
                    <Skeleton className="h-24" />
                </div>
                <div className="flex-1 space-y-4">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                </div>
            </div>
        );
    }
    
    if (!data) return null;

    return (
        <div className="flex flex-col h-full gap-4">
            <h1 className="text-2xl font-bold text-brand-text">Multi-School Command Center</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {data.overallStats.map(stat => (
                    <StatCard key={stat.label} {...stat} />
                ))}
            </div>
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                <h3 className="text-lg font-bold text-brand-text">School Health Overview</h3>
                {data.schools.map(school => (
                    <SchoolCard key={school.id} school={school} />
                ))}
            </div>
        </div>
    );
};

export default CommandCenterDashboard;