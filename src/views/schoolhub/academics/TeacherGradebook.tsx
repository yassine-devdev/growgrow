import React, { useState, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getGradebookData } from '../../../api/schoolHubApi';
import { QUERY_KEYS } from '../../../constants/queries';
import { useTranslation } from 'react-i18next';
import { Loader2, MessageSquare } from 'lucide-react';
import type { GradebookData, StudentGrade, GradebookStudent, GradebookAssignment } from '../../../api/schemas/schoolHubSchemas';
import { useLocation } from 'react-router-dom';
import GradeEditModal from './GradeEditModal';

// Helper to calculate average score for a student
const calculateAverage = (studentId: string, grades: StudentGrade[], assignments: GradebookData['assignments']) => {
    const studentGrades = grades.filter(g => g.studentId === studentId && g.score !== null);
    if (studentGrades.length === 0) return 'N/A';

    const totalPoints = studentGrades.reduce((sum, g) => sum + (g.score ?? 0), 0);
    const totalMaxPoints = studentGrades.reduce((sum, g) => {
        const assignment = assignments.find(a => a.id === g.assignmentId);
        return sum + (assignment?.maxPoints ?? 0);
    }, 0);

    if (totalMaxPoints === 0) return 'N/A';
    return ((totalPoints / totalMaxPoints) * 100).toFixed(1) + '%';
};

// Helper to get color based on score percentage
const getGradeColor = (score: number | null, maxPoints: number) => {
    if (score === null) return 'bg-brand-surface';
    const percentage = (score / maxPoints) * 100;
    if (percentage >= 90) return 'bg-green-100 text-green-800';
    if (percentage >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
};

interface EditingGradeInfo {
    student: GradebookStudent;
    assignment: GradebookAssignment;
    grade: StudentGrade | null;
}

const TeacherGradebook: React.FC = () => {
    const { t } = useTranslation();
    const location = useLocation();
    
    const { courseId = 'MATH-101', courseName = null } = location.state || {};
    
    const [editingGradeInfo, setEditingGradeInfo] = useState<EditingGradeInfo | null>(null);

    const { data, isLoading } = useQuery({
        queryKey: QUERY_KEYS.gradebook(courseId),
        queryFn: () => getGradebookData(courseId),
    });

    const handleCellClick = (student: GradebookStudent, assignment: GradebookAssignment) => {
        const grade = data?.grades.find(g => g.studentId === student.id && g.assignmentId === assignment.id) || null;
        setEditingGradeInfo({ student, assignment, grade });
    };

    const handleCloseModal = () => {
        setEditingGradeInfo(null);
    };

    if (isLoading) {
        return <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-brand-primary" /></div>;
    }

    if (!data) return null;

    return (
        <>
            <div className="flex flex-col h-full gap-4">
                <h1 className="text-2xl font-bold text-brand-text">{t('views.gradebook.title', { courseName: courseName || data.courseName })}</h1>
                <div className="flex-1 overflow-auto border border-brand-border rounded-lg">
                    <table className="w-full text-sm text-left text-brand-text border-collapse">
                        <thead className="text-xs text-brand-text-alt uppercase bg-brand-surface-alt sticky top-0 z-10">
                            <tr>
                                <th scope="col" className="px-2 md:px-4 py-3 sticky left-0 bg-brand-surface-alt min-w-[180px] md:min-w-[200px] border-r border-brand-border">
                                    {t('views.gradebook.studentHeader')}
                                    <div className="font-normal normal-case text-gray-400">{t('views.gradebook.averageHeader')}</div>
                                </th>
                                {data.assignments.map(a => (
                                    <th key={a.id} scope="col" className="px-2 md:px-4 py-3 text-center min-w-[100px] md:min-w-[120px]">
                                        {a.title}
                                        <div className="font-normal normal-case text-gray-400">/ {a.maxPoints}</div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-brand-surface">
                            {data.students.map((student) => (
                                <tr key={student.id} className="group hover:bg-brand-surface-alt/50">
                                    <td className="px-2 md:px-4 py-2 font-medium sticky left-0 bg-brand-surface group-hover:bg-brand-surface-alt/50 border-r border-brand-border min-w-[180px] md:min-w-[200px]">
                                        {student.name}
                                        <div className="text-xs font-normal text-brand-text-alt">{calculateAverage(student.id, data.grades, data.assignments)}</div>
                                    </td>
                                    {data.assignments.map(assignment => {
                                        const grade = data.grades.find(g => g.studentId === student.id && g.assignmentId === assignment.id);
                                        
                                        return (
                                            <td 
                                                key={assignment.id} 
                                                className="border-t border-brand-border text-center cursor-pointer min-w-[100px] md:min-w-[120px] p-1 md:p-2"
                                                onClick={() => handleCellClick(student, assignment)}
                                            >
                                                <div className={`w-full h-full rounded py-2 flex items-center justify-center gap-2 ${getGradeColor(grade?.score ?? null, assignment.maxPoints)}`}>
                                                    <span>{grade?.score ?? '—'}</span>
                                                    {grade?.feedback && <span title={t('teacherGradebook.feedbackIndicator')}><MessageSquare className="w-3 h-3 text-brand-text-alt" /></span>}
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {editingGradeInfo && (
                <GradeEditModal
                    isOpen={!!editingGradeInfo}
                    onClose={handleCloseModal}
                    gradeInfo={editingGradeInfo}
                    courseId={courseId}
                />
            )}
        </>
    );
};

export default TeacherGradebook;
