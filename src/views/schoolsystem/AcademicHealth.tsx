import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAcademicHealthData } from '@/api/adminApi';
import { QUERY_KEYS } from '@/constants/queries';
import { Loader2 } from 'lucide-react';
import StatCard from '@/components/ui/StatCard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import Skeleton from '@/components/ui/Skeleton';

const AcademicHealthSkeleton: React.FC = () => (
    <div className="flex flex-col h-full gap-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
        </div>
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Skeleton className="w-full h-full" />
            <Skeleton className="w-full h-full" />
        </div>
    </div>
);

const AcademicHealth: React.FC = () => {
    const { data, isLoading } = useQuery({
        queryKey: QUERY_KEYS.academicHealthData,
        queryFn: getAcademicHealthData,
    });

    if (isLoading) {
        return <AcademicHealthSkeleton />;
    }

    if (!data) return null;

    return (
        <div className="flex flex-col h-full gap-4">
            <h1 className="text-2xl font-bold text-brand-text">Academic Health Monitor</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {data.stats.map(stat => (
                    <StatCard key={stat.label} {...stat} />
                ))}
            </div>
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-[300px]">
                 <div className="bg-brand-surface border border-brand-border rounded-lg p-4 flex flex-col">
                    <h3 className="text-lg font-bold mb-4 text-brand-text">Enrollment Trend</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data.enrollmentTrend} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                             <defs>
                                <linearGradient id="colorEnrollment" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="month" stroke="#6b7280" tick={{fontSize: 12}} />
                            <YAxis stroke="#6b7280" tick={{fontSize: 12}} />
                            <Tooltip />
                            <Area type="monotone" dataKey="enrollment" name="Enrollment" stroke="#4f46e5" fill="url(#colorEnrollment)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                 <div className="bg-brand-surface border border-brand-border rounded-lg p-4 flex flex-col">
                    <h3 className="text-lg font-bold mb-4 text-brand-text">Subject Performance</h3>
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.subjectPerformance} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" domain={[0, 100]} />
                            <YAxis type="category" dataKey="subject" width={80} />
                            <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                            <Legend />
                            <Bar dataKey="passRate" fill="#34d399" name="Pass Rate (%)" />
                            <Bar dataKey="averageScore" fill="#4f46e5" name="Average Score (%)" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default AcademicHealth;