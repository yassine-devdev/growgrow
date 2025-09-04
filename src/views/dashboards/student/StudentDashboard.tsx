import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStudentDashboardData } from '@/api/dashboardApi';
import { submitMoodCheckIn, getRecentMoods } from '@/api/studentApi';
import { QUERY_KEYS } from '@/constants/queries';
import StatCard from '@/components/ui/StatCard';
import { Loader2, CheckCircle, Smile, Meh, Frown } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/store/useAppStore';
import type { StudentDashboardData } from '@/api/schemas/dashboardSchemas';
import PersonalTodoList from './PersonalTodoList';

const WellnessCard: React.FC = () => {
    const { t } = useTranslation();
    const addToast = useAppStore(s => s.addToast);
    const queryClient = useQueryClient();
    const [submittedToday, setSubmittedToday] = useState(false);

    const { data: recentMoods } = useQuery({
        queryKey: QUERY_KEYS.recentMoods,
        queryFn: () => getRecentMoods(),
    });
    
    const moodMutation = useMutation({
        mutationFn: submitMoodCheckIn,
        onSuccess: () => {
            setSubmittedToday(true);
            addToast({ message: "Thanks for checking in!", type: "success" });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.recentMoods });
        },
        onError: (error: Error) => {
            addToast({ message: error.message || "Could not save mood.", type: "error" });
        }
    });

    const moods = [
        { name: 'Happy', nameKey: 'happy', icon: Smile, color: 'text-green-500' },
        { name: 'Neutral', nameKey: 'neutral', icon: Meh, color: 'text-yellow-500' },
        { name: 'Sad', nameKey: 'sad', icon: Frown, color: 'text-blue-500' },
    ];

    const moodChartData = useMemo(() => {
        if (!recentMoods) return [];
        const moodCounts = recentMoods.reduce((acc, mood) => {
            acc[mood.mood] = (acc[mood.mood] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        // Ensure all mood types are present for a consistent radar chart shape
        const fullData = { Happy: 0, Neutral: 0, Sad: 0, ...moodCounts };
        return Object.entries(fullData).map(([name, count]) => ({ name, count }));
    }, [recentMoods]);
    
    return (
        <div className="bg-brand-surface border border-brand-border rounded-lg p-4 flex flex-col">
            <h3 className="text-lg font-bold mb-4 text-brand-text">{t('studentDashboard.wellnessCard.title')}</h3>
            {submittedToday ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <CheckCircle className="w-10 h-10 text-green-500 mb-2" />
                    <p className="font-semibold text-brand-text">{t('studentDashboard.wellnessCard.submitted')}</p>
                    {moodChartData.length > 0 && (
                        <>
                            <p className="text-sm text-brand-text-alt mt-4 mb-2">{t('studentDashboard.wellnessCard.recentMoods')}</p>
                            <ResponsiveContainer width="100%" height={150}>
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={moodChartData}>
                                    <PolarGrid />
                                    <PolarAngleAxis dataKey="name" tick={{ fontSize: 10 }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 'dataMax + 1']} tick={false} axisLine={false} />
                                    <Radar name="Count" dataKey="count" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.6} />
                                    <Tooltip />
                                </RadarChart>
                            </ResponsiveContainer>
                        </>
                    )}
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <p className="font-semibold mb-3">{t('studentDashboard.wellnessCard.prompt')}</p>
                    <div className="flex gap-4">
                        {moods.map(mood => (
                            <button key={mood.name} onClick={() => moodMutation.mutate(mood.name as 'Happy' | 'Neutral' | 'Sad')} className="flex flex-col items-center gap-1 text-brand-text-alt hover:text-brand-primary transition-colors">
                                <mood.icon className={`w-10 h-10 ${mood.color}`} />
                                <span className="text-xs font-semibold">{t(`studentDashboard.wellnessCard.${mood.nameKey}`)}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};


const StudentDashboard: React.FC = () => {
    const { t } = useTranslation();
    const user = useAppStore((state) => state.user);
    const { data, isLoading } = useQuery<StudentDashboardData>({
        queryKey: [...QUERY_KEYS.studentDashboard, user?.id],
        queryFn: getStudentDashboardData,
        enabled: !!user,
    });

    const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Completed'>('All');
    const [priorityFilter, setPriorityFilter] = useState<'All' | 'High' | 'Medium' | 'Low'>('All');

    const prevAssignmentsRef = useRef<StudentDashboardData['upcomingAssignments']>();

    useEffect(() => {
        if (data?.upcomingAssignments) {
            prevAssignmentsRef.current = data.upcomingAssignments;
        }
    }, [data?.upcomingAssignments]);

    const filteredAssignments = useMemo(() => {
        if (!data?.upcomingAssignments) return [];
        return data.upcomingAssignments.filter(assignment => {
            const statusMatch = statusFilter === 'All' || assignment.status === statusFilter;
            const priorityMatch = priorityFilter === 'All' || assignment.priority === priorityFilter;
            return statusMatch && priorityMatch;
        });
    }, [data?.upcomingAssignments, statusFilter, priorityFilter]);

    if (isLoading) {
        return <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-brand-primary" /></div>;
    }

    if (!data) return null;

    const priorityColors: { [key: string]: string } = {
        High: 'bg-red-500',
        Medium: 'bg-yellow-500',
        Low: 'bg-blue-500',
    };
    
    return (
        <div className="flex flex-col h-full gap-4">
            <h1 className="text-2xl font-bold text-brand-text">Student Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {data.stats.map(stat => (
                    <StatCard key={stat.label} {...stat} />
                ))}
            </div>
             <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 flex flex-col gap-4">
                    {/* My Tasks */}
                    <div className="bg-brand-surface border border-brand-border rounded-lg p-4 flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                             <h3 className="text-lg font-bold text-brand-text">My Tasks</h3>
                             <div className="flex gap-2 text-sm">
                                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="bg-brand-surface-alt border border-brand-border rounded-md p-1">
                                    <option>All</option>
                                    <option>Pending</option>
                                    <option>Completed</option>
                                </select>
                                 <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value as any)} className="bg-brand-surface-alt border border-brand-border rounded-md p-1">
                                    <option>All</option>
                                    <option>High</option>
                                    <option>Medium</option>
                                    <option>Low</option>
                                </select>
                             </div>
                        </div>
                        <div className="space-y-3 flex-1 overflow-y-auto pr-2 min-h-[200px]">
                            {filteredAssignments.length > 0 ? (
                                filteredAssignments.map((item, index) => {
                                    const isNew = !prevAssignmentsRef.current?.some(prev => prev.id === item.id);
                                    return (
                                    <Link to={`/school-hub/academics/assignments/${item.id}`} key={item.id} className={`block p-3 bg-brand-surface-alt rounded-lg hover:bg-brand-primary/10 transition-colors ${isNew ? 'animate-flash-success' : ''}`}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-3 h-3 rounded-full ${priorityColors[item.priority]}`} />
                                                <div>
                                                    <p className="font-bold text-brand-text">{item.title}</p>
                                                    <p className="text-sm text-brand-text-alt">{item.course} - Due: {item.dueDate}</p>
                                                </div>
                                            </div>
                                            {item.status === 'Completed' ? <CheckCircle className="w-5 h-5 text-green-500" /> : null}
                                        </div>
                                    </Link>
                                );
                                })
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center text-brand-text-alt">
                                    <CheckCircle className="w-10 h-10 text-green-500 mb-2" aria-hidden="true"/>
                                    <p className="font-semibold">{t('studentDashboard.noTasks.title')}</p>
                                    <p className="text-xs">{t('studentDashboard.noTasks.description')}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-1 flex flex-col gap-4">
                    <WellnessCard />
                    <PersonalTodoList />
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;