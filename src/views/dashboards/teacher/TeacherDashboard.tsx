import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTeacherDashboardData } from '../../../api/dashboardApi';
import { QUERY_KEYS } from '../../../constants/queries';
import StatCard from '../../../components/ui/StatCard';
import { Loader2, Edit, CheckCircle, Users, Mail, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const TeacherDashboard: React.FC = () => {
    const { t } = useTranslation();
    const { data, isLoading } = useQuery({
        queryKey: QUERY_KEYS.teacherDashboard,
        queryFn: () => getTeacherDashboardData(),
    });

    if (isLoading) {
        return <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-brand-primary" /></div>;
    }

    if (!data) return null;

    return (
        <div className="flex flex-col h-full gap-4">
            <h1 className="text-2xl font-bold text-brand-text">Teacher Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {data.stats.map(stat => (
                    <StatCard key={stat.label} {...stat} />
                ))}
            </div>
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-brand-surface border border-brand-border rounded-lg p-4 flex flex-col">
                    <h3 className="text-lg font-bold mb-4 text-brand-text">Today's Schedule</h3>
                    <div className="space-y-3">
                        {data.schedule.map((item, index) => (
                            <div key={index} className="flex items-center p-3 bg-brand-surface-alt rounded-lg">
                                <div className="font-semibold text-brand-primary w-24">{item.time}</div>
                                <div>
                                    <p className="font-bold text-brand-text">{item.subject}</p>
                                    <p className="text-sm text-brand-text-alt">{item.class}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-brand-surface border border-brand-border rounded-lg p-4 flex flex-col">
                    <h3 className="text-lg font-bold mb-4 text-brand-text">Assignments to Grade</h3>
                    <div className="space-y-3 flex-1 overflow-y-auto pr-2">
                        {data.assignmentsToGrade.length > 0 ? (
                            data.assignmentsToGrade.map(item => (
                                <Link
                                    to="/school-hub/academics/grades"
                                    state={{ courseId: item.courseId, courseName: item.course }}
                                    key={item.id}
                                    className="block p-3 bg-brand-surface-alt rounded-lg hover:bg-brand-primary/10 transition-colors"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-bold text-brand-text">{item.title}</p>
                                            <p className="text-sm text-brand-text-alt">{item.course} - Due: {item.dueDate}</p>
                                        </div>
                                        <Edit className="w-4 h-4 text-brand-text-alt" />
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center text-brand-text-alt">
                                <CheckCircle className="w-10 h-10 text-green-500 mb-2" aria-hidden="true"/>
                                <p className="font-semibold">{t('teacherDashboard.noAssignments.title')}</p>
                                <p className="text-xs">{t('teacherDashboard.noAssignments.description')}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Classroom Management Section */}
                <div className="lg:col-span-2 bg-brand-surface border border-brand-border rounded-lg p-4 flex flex-col">
                    <h3 className="text-lg font-bold mb-4 text-brand-text flex items-center gap-2">
                        <Users className="w-5 h-5 text-brand-primary" />
                        Classroom Management
                    </h3>
                    <div className="space-y-3 overflow-y-auto pr-2">
                        {data.classrooms.map(classroom => {
                             const attendancePercentage = (classroom.attendance.present / classroom.attendance.total) * 100;
                             const attendanceColor = attendancePercentage >= 95 ? 'text-green-600' : attendancePercentage >= 80 ? 'text-yellow-600' : 'text-red-600';

                            return (
                            <details key={classroom.id} className="group bg-brand-surface-alt rounded-lg border border-brand-border/50">
                                <summary className="p-3 flex items-center justify-between cursor-pointer list-none">
                                    <div className="flex items-center gap-4">
                                        <p className="font-bold text-brand-text">{classroom.name}</p>
                                        <span className={`text-sm font-semibold ${attendanceColor}`}>
                                            {classroom.attendance.present}/{classroom.attendance.total} Present
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Link to="/comms/messages/inbox" onClick={(e) => e.stopPropagation()} className="text-xs px-2 py-1 bg-brand-primary/10 text-brand-primary rounded-md flex items-center gap-1 hover:bg-brand-primary/20">
                                            <Mail className="w-3 h-3"/> Message Class
                                        </Link>
                                        <ChevronDown className="w-5 h-5 text-brand-text-alt transition-transform group-open:rotate-180" />
                                    </div>
                                </summary>
                                <div className="p-4 border-t border-brand-border">
                                    <h4 className="font-semibold text-sm mb-2 text-brand-text">Student Roster</h4>
                                    <ul className="text-sm text-brand-text-alt grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-1">
                                        {classroom.roster.map(student => <li key={student} className="truncate">{student}</li>)}
                                    </ul>
                                </div>
                            </details>
                        )})}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default TeacherDashboard;