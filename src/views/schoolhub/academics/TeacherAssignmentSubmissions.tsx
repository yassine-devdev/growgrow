import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAssignmentSubmissions } from '@/api/schoolHubApi';
import { QUERY_KEYS } from '@/constants/queries';
import { Loader2, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Submission } from '@/api/schemas/schoolHubSchemas';

const StatusIndicator: React.FC<{ status: Submission['status'] }> = ({ status }) => {
    switch (status) {
        case 'Graded':
            return <div className="flex items-center gap-1 text-sm text-green-600"><CheckCircle className="w-4 h-4" /> Graded</div>;
        case 'Submitted':
            return <div className="flex items-center gap-1 text-sm text-blue-600"><Clock className="w-4 h-4" /> Submitted</div>;
        case 'Not Submitted':
            return <div className="flex items-center gap-1 text-sm text-red-600"><XCircle className="w-4 h-4" /> Not Submitted</div>;
        default:
            return null;
    }
};

const TeacherAssignmentSubmissions: React.FC = () => {
    const { assignmentId } = useParams<{ assignmentId: string }>();
    const { t } = useTranslation();

    const { data, isLoading } = useQuery({
        queryKey: ['assignmentSubmissions', assignmentId],
        queryFn: () => getAssignmentSubmissions(assignmentId!),
        enabled: !!assignmentId,
    });

    if (isLoading) {
        return <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-brand-primary" /></div>;
    }

    if (!data) return <div>{t('views.submissions.notFound')}</div>;

    const { assignment, submissions } = data;

    return (
        <div className="max-w-4xl mx-auto">
            <Link to="/school-hub/academics/assignments" className="text-sm text-brand-primary hover:underline mb-4 inline-block">
                &larr; {t('views.submissions.backLink')}
            </Link>
            <h1 className="text-2xl font-bold text-brand-text">{assignment.title}</h1>
            <p className="text-brand-text-alt">{assignment.course}</p>
            <div className="mt-4 p-4 bg-brand-surface-alt/50 border border-brand-border rounded-lg">
                <h2 className="text-lg font-semibold text-brand-text mb-2">{t('views.submissions.instructions')}</h2>
                <p className="text-sm text-brand-text-alt whitespace-pre-wrap">{assignment.description}</p>
            </div>
            
            <div className="mt-6">
                <h2 className="text-xl font-bold text-brand-text mb-4">{t('views.submissions.submissionsTitle')}</h2>
                <div className="space-y-3">
                    {submissions.map(sub => (
                        <div key={sub.studentId} className="p-3 bg-brand-surface border border-brand-border rounded-lg flex justify-between items-center">
                            <p className="font-semibold">{sub.studentName}</p>
                            <div className="flex items-center gap-4">
                                <StatusIndicator status={sub.status} />
                                {sub.status !== 'Not Submitted' && (
                                     <Link to={`/school-hub/academics/grades`} state={{ courseId: assignment.course, studentId: sub.studentId }} className="px-3 py-1 text-xs font-semibold rounded-md bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20">
                                        {sub.status === 'Graded' ? 'View Grade' : 'Grade Now'}
                                    </Link>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TeacherAssignmentSubmissions;
