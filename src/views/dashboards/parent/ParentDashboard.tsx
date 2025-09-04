import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getParentDashboardData } from '../../../api/dashboardApi';
import { QUERY_KEYS } from '../../../constants/queries';
import StatCard from '../../../components/ui/StatCard';
import { Loader2, Bell, CreditCard, MessageSquare, Calendar, FileText, CalendarCheck2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ParentDashboard: React.FC = () => {
    const { t } = useTranslation();
    const { data, isLoading } = useQuery({
        queryKey: QUERY_KEYS.parentDashboard,
        queryFn: () => getParentDashboardData(),
    });

    if (isLoading) {
        return <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-brand-primary" /></div>;
    }

    if (!data) return null;

    return (
        <div className="flex flex-col h-full gap-4">
            <h1 className="text-2xl font-bold text-brand-text">Parent Dashboard</h1>
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 flex flex-col gap-6">
                    {/* Children Overviews */}
                    {data.children.map(child => (
                        <div key={child.name} className="bg-brand-surface border border-brand-border rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-xl font-bold text-brand-text">{child.name}'s Overview</h2>
                                <Link to="/comms/messages/inbox" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-brand-surface-alt hover:bg-brand-border text-brand-text">
                                    <MessageSquare className="w-3 h-3"/>
                                    Message Teacher
                                </Link>
                            </div>
                             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {child.stats.map(stat => (
                                    <StatCard key={stat.label} {...stat} />
                                ))}
                            </div>
                        </div>
                    ))}
                    {/* Upcoming Deadlines */}
                    <div className="bg-brand-surface border border-brand-border rounded-lg p-4">
                        <h3 className="text-lg font-bold mb-4 text-brand-text flex items-center gap-2"><CalendarCheck2 className="w-5 h-5 text-brand-primary" /> Upcoming Deadlines</h3>
                        <div className="space-y-3">
                            {data.upcomingDeadlines.map(item => (
                                <div key={item.id} className="flex items-center p-2 bg-brand-surface-alt rounded-lg">
                                    {item.type === 'assignment' ? <FileText className="w-5 h-5 text-blue-500 shrink-0" /> : <Calendar className="w-5 h-5 text-purple-500 shrink-0" />}
                                    <div className="ml-3 flex-1">
                                        <p className="font-semibold text-sm">{item.title} <span className="font-normal text-brand-text-alt">({item.childName})</span></p>
                                    </div>
                                    <p className="text-sm font-semibold text-red-500">{item.dueDate}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1 flex flex-col gap-6">
                     {/* Recent Grades */}
                     <div className="bg-brand-surface border border-brand-border rounded-lg p-4 flex-1">
                        <h3 className="text-lg font-bold mb-4 text-brand-text flex items-center gap-2"><Sparkles className="w-5 h-5 text-brand-accent" /> Recent Grades</h3>
                        <div className="space-y-3">
                           {data.recentGrades.map(item => (
                               <div key={item.id} className="flex justify-between items-center p-2 bg-brand-surface-alt rounded-lg">
                                   <div>
                                       <p className="font-semibold text-sm">{item.courseName} <span className="font-normal text-brand-text-alt">({item.childName})</span></p>
                                       <p className="text-xs text-brand-text-alt">Posted: {item.postedDate}</p>
                                   </div>
                                   <p className="text-lg font-bold text-brand-primary">{item.grade}</p>
                               </div>
                           ))}
                        </div>
                    </div>
                     {/* Announcements & Fees */}
                     <div className="bg-brand-surface border border-brand-border rounded-lg p-4">
                        <h3 className="text-lg font-bold mb-4 text-brand-text flex items-center gap-2"><Bell className="w-5 h-5 text-yellow-500" /> Announcements</h3>
                        <div className="space-y-3 max-h-48 overflow-y-auto">
                            {data.announcements.length > 0 ? (
                                data.announcements.map(item => (
                                    <div key={item.id} className="p-2 bg-brand-surface-alt rounded-lg">
                                        <p className="font-semibold text-sm">{item.title}</p>
                                        <p className="text-xs text-brand-text-alt">{item.date}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-sm text-brand-text-alt pt-4">
                                    <p>{t('parentDashboard.noAnnouncements')}</p>
                                </div>
                            )}
                        </div>
                    </div>
                     <div className="bg-brand-surface border border-brand-border rounded-lg p-4">
                        <h3 className="text-lg font-bold mb-2 text-brand-text flex items-center gap-2"><CreditCard className="w-5 h-5 text-green-500" /> Fees</h3>
                        <p className="text-2xl font-bold text-brand-text">${data.fees.amountDue.toFixed(2)}</p>
                        <p className="text-sm text-brand-text-alt">Due by {data.fees.dueDate}</p>
                        <Link to="/school-hub/billing/pay-fees" className="w-full block text-center mt-3 py-2 bg-brand-primary text-white rounded-lg text-sm font-semibold hover:bg-brand-primary-hover transition-colors">
                            Pay Now
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParentDashboard;