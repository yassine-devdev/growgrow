import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAdminDashboardData } from '../../../api/dashboardApi';
import { QUERY_KEYS } from '../../../constants/queries';
import { Loader2, AreaChart as AreaChartIcon, ChevronRight, UserPlus, FileCheck, MailWarning, Users, GraduationCap, CreditCard, Megaphone, Plus } from 'lucide-react';
import StatCard from '../../../components/ui/StatCard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Skeleton from '../../../components/ui/Skeleton';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/Icon';

const AdminDashboardSkeleton: React.FC = () => (
    <div className="flex flex-col h-full gap-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
        </div>
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 flex flex-col gap-6">
                <Skeleton className="h-32" />
                <Skeleton className="flex-1" />
            </div>
            <div className="lg:col-span-1 flex flex-col gap-6">
                <Skeleton className="flex-1" />
                <Skeleton className="flex-1" />
            </div>
        </div>
    </div>
);

const AdminDashboard: React.FC = () => {
    const { data, isLoading } = useQuery({
        queryKey: QUERY_KEYS.adminDashboard,
        queryFn: () => getAdminDashboardData(),
    });

    if (isLoading) {
        return <AdminDashboardSkeleton />;
    }

    if (!data) return null;
    
    const quickLinks = [
        { label: 'Manage Students', icon: 'Users', to: '/school-hub/people/students' },
        { label: 'View Teacher Directory', icon: 'GraduationCap', to: '/school-hub/people/teachers' },
        { label: 'Access Billing', icon: 'CreditCard', to: '/school-hub/billing/pay-fees' },
    ];

    return (
        <div className="flex flex-col h-full gap-6">
            <h1 className="text-2xl font-bold text-brand-text">Admin Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {data.stats.map(stat => (
                    <StatCard key={stat.label} {...stat} />
                ))}
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
                {/* Main Content */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="bg-brand-surface border border-brand-border rounded-lg p-4">
                        <h3 className="text-lg font-bold text-brand-text mb-4">Quick Links</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                           {quickLinks.map(link => (
                                <Link key={link.label} to={link.to} className="group p-4 bg-brand-surface-alt border border-brand-border rounded-lg flex flex-col items-center justify-center space-y-2 transition-all duration-300 hover:bg-brand-primary hover:text-white hover:shadow-glow">
                                    <Icon name={link.icon as any} className="w-8 h-8 text-brand-primary group-hover:text-white transition-colors" />
                                    <span className="font-semibold text-brand-text group-hover:text-white transition-colors text-sm text-center">{link.label}</span>
                                </Link>
                           ))}
                        </div>
                    </div>
                    <div className="flex-1 bg-brand-surface border border-brand-border rounded-lg p-4 flex flex-col min-h-[300px]">
                        <h3 className="text-lg font-bold mb-4 text-brand-text flex items-center gap-2"><AreaChartIcon className="w-5 h-5 text-brand-primary" />Enrollment Trends</h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.enrollmentTrend} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                <defs>
                                    <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis dataKey="name" stroke="#6b7280" tick={{fontSize: 12}} />
                                <YAxis stroke="#6b7280" tick={{fontSize: 12}} />
                                <Tooltip />
                                <Area type="monotone" dataKey="students" name="Students" stroke="#4f46e5" fill="url(#colorStudents)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                     <div className="bg-brand-surface border border-brand-border rounded-lg p-4 flex flex-col">
                        <h3 className="text-lg font-bold text-brand-text mb-2">Action Items</h3>
                        <div className="flex-1 space-y-1">
                            {data.actionItems.map(item => (
                                <Link key={item.id} to={item.link} className="flex items-center p-3 -mx-3 rounded-lg hover:bg-brand-surface-alt transition-colors">
                                    <Icon name={item.icon as any} className="w-6 h-6 text-brand-primary mr-3" />
                                    <span className="flex-1 text-sm text-brand-text">{item.text}</span>
                                    <ChevronRight className="w-4 h-4 text-brand-text-alt" />
                                </Link>
                            ))}
                        </div>
                    </div>
                     <div className="bg-brand-surface border border-brand-border rounded-lg p-4 flex flex-col">
                        <h3 className="text-lg font-bold text-brand-text mb-2 flex items-center gap-2"><Megaphone className="w-5 h-5 text-brand-primary"/>Communication Hub</h3>
                        <div className="flex-1 space-y-3">
                           {data.recentAnnouncements.map(item => (
                               <div key={item.id} className="p-2 bg-brand-surface-alt rounded-md">
                                   <p className="font-semibold text-sm truncate">{item.title}</p>
                                   <p className="text-xs text-brand-text-alt">{item.date}</p>
                               </div>
                           ))}
                        </div>
                        <Link to="/comms/messages/announcements" className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-primary-hover">
                            <Plus className="w-4 h-4" /> Create New Announcement
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;