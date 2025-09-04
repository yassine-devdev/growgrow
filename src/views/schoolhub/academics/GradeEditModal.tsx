import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateGrade, generateAiFeedback } from '@/api/schoolHubApi';
import { QUERY_KEYS } from '@/constants/queries';
import { useAppStore } from '@/store/useAppStore';
import Modal from '@/components/ui/Modal';
import { Loader2, Wand2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { GradebookStudent, GradebookAssignment, StudentGrade } from '@/api/schemas/schoolHubSchemas';

interface GradeEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    gradeInfo: {
        student: GradebookStudent;
        assignment: GradebookAssignment;
        grade: StudentGrade | null;
    };
    courseId: string;
}

const GradeEditModal: React.FC<GradeEditModalProps> = ({ isOpen, onClose, gradeInfo, courseId }) => {
    const { student, assignment, grade } = gradeInfo;
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const addToast = useAppStore(s => s.addToast);

    const [score, setScore] = useState<string>(grade?.score?.toString() ?? '');
    const [feedback, setFeedback] = useState<string>(grade?.feedback ?? '');

    useEffect(() => {
        setScore(grade?.score?.toString() ?? '');
        setFeedback(grade?.feedback ?? '');
    }, [grade]);

    const saveMutation = useMutation({
        mutationFn: updateGrade,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.gradebook(courseId) });
            addToast({ message: 'Grade saved successfully!', type: 'success' });
            onClose();
        },
        onError: (error: Error) => {
            addToast({ message: error.message || 'Failed to save grade.', type: 'error' });
        }
    });

    const feedbackMutation = useMutation({
        mutationFn: generateAiFeedback,
        onSuccess: (data) => {
            setFeedback(data.feedback);
            addToast({ message: 'AI feedback generated!', type: 'info' });
        },
        onError: (error: Error) => {
            addToast({ message: error.message || 'Failed to generate feedback.', type: 'error' });
        }
    });

    const handleSave = () => {
        const scoreValue = score === '' ? null : parseInt(score, 10);
        if (score !== '' && (isNaN(scoreValue as number) || (scoreValue as number) < 0 || scoreValue! > assignment.maxPoints)) {
            addToast({ message: `Please enter a valid score between 0 and ${assignment.maxPoints}.`, type: 'error' });
            return;
        }
        saveMutation.mutate({
            studentId: student.id,
            assignmentId: assignment.id,
            score: scoreValue,
            feedback,
        });
    };

    const handleGenerateFeedback = () => {
        const scoreValue = score === '' ? null : parseInt(score, 10);
        feedbackMutation.mutate({
            studentName: student.name,
            assignmentTitle: assignment.title,
            score: scoreValue,
            maxPoints: assignment.maxPoints,
            currentFeedback: feedback,
        });
    };
    
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={t('views.gradeEditModal.title', { studentName: student.name })}
        >
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-brand-text-alt">{t('views.gradeEditModal.assignment')}</label>
                    <p className="font-semibold">{assignment.title}</p>
                </div>
                <div>
                    <label htmlFor="score" className="block text-sm font-medium text-brand-text-alt">
                        {t('views.gradeEditModal.score', { maxPoints: assignment.maxPoints })}
                    </label>
                    <input
                        id="score"
                        type="number"
                        value={score}
                        onChange={(e) => setScore(e.target.value)}
                        className="mt-1 w-full p-2 border border-brand-border rounded-md"
                    />
                </div>
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label htmlFor="feedback" className="block text-sm font-medium text-brand-text-alt">
                            {t('views.gradeEditModal.feedback')}
                        </label>
                        <button
                            onClick={handleGenerateFeedback}
                            disabled={feedbackMutation.isPending}
                            className="text-xs px-2 py-1 bg-brand-primary/10 text-brand-primary rounded-md flex items-center gap-1 hover:bg-brand-primary/20 disabled:opacity-50"
                        >
                             {feedbackMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin"/> : <Wand2 className="w-3 h-3" />}
                             {feedbackMutation.isPending ? t('views.gradeEditModal.generating') : t('views.gradeEditModal.generateFeedback')}
                        </button>
                    </div>
                    <textarea
                        id="feedback"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        rows={5}
                        className="mt-1 w-full p-2 border border-brand-border rounded-md"
                        placeholder="Provide constructive feedback..."
                    />
                </div>
                <div className="flex justify-end gap-2 pt-4 border-t border-brand-border">
                    <button onClick={onClose} className="px-4 py-2 text-sm rounded-md bg-brand-surface-alt">Cancel</button>
                    <button 
                        onClick={handleSave}
                        disabled={saveMutation.isPending}
                        className="px-4 py-2 text-sm rounded-md bg-brand-primary text-white flex items-center gap-2 disabled:bg-brand-text-alt"
                    >
                        {saveMutation.isPending && <Loader2 className="w-4 h-4 animate-spin"/>}
                        {saveMutation.isPending ? t('views.gradeEditModal.saving') : t('views.gradeEditModal.save')}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default GradeEditModal;
