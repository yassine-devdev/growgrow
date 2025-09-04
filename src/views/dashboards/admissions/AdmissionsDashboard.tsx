import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAdmissionsDashboardData } from '@/api/dashboardApi';
import { QUERY_KEYS } from '@/constants/queries';
import { Loader2, ChevronRight, Eye, Users as UsersIcon, PieChart as RePieChartIcon } from 'lucide-react';
import StatCard from '@/components/ui/StatCard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import Skeleton from '@/components/ui/Skeleton';
import { useTranslation } from 'react-i18next';

const AdmissionsDashboardSkeleton: React.FC = () => (
    <div className="flex flex-col h-full gap-4">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
        </div>
        {/* Funnel */}
        <Skeleton className="h-24 w-full" />
        {/* Bottom row */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Skeleton className="lg:col-span-2" />
            <div className="flex flex-col gap-4">
                <Skeleton className="flex-1" />
                <Skeleton className="flex-1" />
            </div>
        </div>
    </div>
);

const FunnelStage: React.FC<{ stage: string; count: number; isLast?: boolean }> = ({ stage, count, isLast }) => (
    <>
        <div className="flex flex-col items-center text-center p-4 bg-brand-surface-alt rounded-lg flex-1 min-w-[100px]">
            <div className="text-3xl font-bold text-brand-primary">{count}</div>
            <div className="text-sm font-semibold text-brand-text-alt mt-1">{stage}</div>
        </div>
        {!isLast && <ChevronRight className="w-8 h-8 text-brand-border shrink-0 hidden md:block" />}
    </>
);

const ApplicantFunnel: React.FC<{ data: { stage: string; count: number }[] }> = ({ data }) => (
    <div className="bg-brand-surface border border-brand-border rounded-lg p-4">
        <h3 className="text-lg font-bold text-brand-text mb-4">Applicant Funnel</h3>
        <div className="flex flex-col md:flex-row items-center gap-2">
            {data.map((item, index) => (
                <FunnelStage key={item.stage} stage={item.stage} count={item.count} isLast={index === data.length - 1} />
            ))}
        </div>
    </div>
);

const COLORS = ['#4f46e5', '#818cf8', '#a78bfa', '#ddd6fe'];

const AdmissionsDashboard: React.FC = () => {
    const { t } = useTranslation();
    const { data, isLoading } = useQuery({
        queryKey: QUERY_KEYS.admissionsDashboard,
        queryFn: () => getAdmissionsDashboardData(),
    });

    if (isLoading) {
        return <AdmissionsDashboardSkeleton />;
    }

    if (!data) return null;

    return (
        <div className="flex flex-col h-full gap-4">
            <h1 className="text-2xl font-bold text-brand-text">{t('views.admissionsDashboard.title')}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {data.stats.map(stat => (
                    <StatCard key={stat.label} {...stat} />
                ))}
            </div>
            
            <ApplicantFunnel data={data.applicantFunnel} />
            
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
                <div className="lg:col-span-2 bg-brand-surface border border-brand-border rounded-lg p-4 flex flex-col">
                    <h3 className="text-lg font-bold mb-4 text-brand-text">{t('views.admissionsDashboard.applicationTrends')}</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data.applicationTrend} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                            <defs>
                                <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="name" stroke="#6b7280" tick={{fontSize: 12}} />
                            <YAxis stroke="#6b7280" tick={{fontSize: 12}} />
                            <Tooltip />
                            <Area type="monotone" dataKey="applications" name="Applications" stroke="#4f46e5" fill="url(#colorApps)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                 <div className="flex flex-col gap-4">
                    <div className="bg-brand-surface border border-brand-border rounded-lg p-4 flex flex-col">
                        <h3 className="text-lg font-bold mb-4 text-brand-text flex items-center gap-2"><UsersIcon className="w-5 h-5 text-brand-primary"/>Applications Needing Review</h3>
                        <div className="space-y-3 overflow-y-auto pr-2">
                            {data.needsReview.map(applicant => (
                                <div key={applicant.id} className="p-2 bg-brand-surface-alt rounded-lg flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold text-sm">{applicant.name}</p>
                                        <p className="text-xs text-brand-text-alt">Submitted: {applicant.submitted}</p>
                                    </div>
                                    <button className="p-1.5 text-brand-text-alt hover:bg-brand-border rounded-full" aria-label={`Review ${applicant.name}'s application`}>
                                        <Eye className="w-4 h-4"/>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                     <div className="bg-brand-surface border border-brand-border rounded-lg p-4 flex flex-col flex-1">
                        <h3 className="text-lg font-bold mb-4 text-brand-text flex items-center gap-2"><RePieChartIcon className="w-5 h-5 text-brand-primary"/>Applicant Demographics</h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={data.demographics} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} fill="#8884d8" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                    {data.demographics.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdmissionsDashboard;
