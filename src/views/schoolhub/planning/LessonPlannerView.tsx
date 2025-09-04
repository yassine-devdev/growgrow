import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLessonPlans, saveLessonPlan, deleteLessonPlan, getAiLessonPlanSuggestion } from '@/api/lessonPlannerApi';
import type { LessonPlan, LessonPlanFormData } from '@/api/schemas/schoolHubSchemas';
import { useForm } from '@/hooks/useForm';
import { useAppStore } from '@/store/useAppStore';
import { useTranslation } from 'react-i18next';
import { QUERY_KEYS } from '@/constants/queries';
import { Loader2, Plus, Wand2, ClipboardList, Trash2, Calendar, BookOpen, Target, Hammer, Beaker } from 'lucide-react';
import InputField from '@/components/ui/InputField';
import SelectField from '@/components/ui/SelectField';
import DataEmptyState from '@/components/ui/DataEmptyState';
import Modal from '@/components/ui/Modal';
import Dialog from '@/components/ui/Dialog';

const mockCourses = [
    { id: 'ALG-2', name: 'Algebra II' },
    { id: 'HIST-1', name: 'World History' },
    { id: 'SCI-BIO', name: 'Biology' },
];

const LessonPlannerView: React.FC = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const addToast = useAppStore(s => s.addToast);

    const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

    const { data: lessonPlans = [], isLoading: isLoadingPlans } = useQuery({
        queryKey: QUERY_KEYS.lessonPlans,
        queryFn: getLessonPlans,
    });

    const initialState: LessonPlanFormData = {
        title: '', course: '', date: new Date().toISOString().split('T')[0],
        objectives: '', materials: '', activities: '',
    };
    
    const { values, errors, isSubmitting, handleChange, handleSubmit, setValues, setErrors } = useForm(
        initialState,
        // The schema is defined but not used here since we are not submitting a single form but saving fields individually.
        {} as any, 
        async (vals) => {
            saveMutation.mutate({ id: selectedPlanId || undefined, ...vals });
        }
    );

    const saveMutation = useMutation({
        mutationFn: saveLessonPlan,
        onSuccess: (savedPlan) => {
            addToast({ message: 'Lesson plan saved!', type: 'success' });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lessonPlans });
            if (!selectedPlanId) {
                setSelectedPlanId(savedPlan.id);
            }
        },
        onError: (error: Error) => addToast({ message: error.message, type: 'error' }),
    });
    
    const deleteMutation = useMutation({
        mutationFn: deleteLessonPlan,
        onSuccess: () => {
            addToast({ message: 'Lesson plan deleted.', type: 'success' });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.lessonPlans });
            setSelectedPlanId(null);
            setValues(initialState);
        },
        onError: (error: Error) => addToast({ message: error.message, type: 'error' }),
    });

    const aiSuggestionMutation = useMutation({
        mutationFn: getAiLessonPlanSuggestion,
        onSuccess: (data) => {
            setValues(prev => ({ ...prev, ...data }));
            setIsAiModalOpen(false);
            addToast({ message: 'AI draft generated!', type: 'success' });
        },
        onError: (error: Error) => addToast({ message: error.message, type: 'error' }),
    });


    useEffect(() => {
        if (selectedPlanId) {
            const plan = lessonPlans.find(p => p.id === selectedPlanId);
            if (plan) setValues(plan);
        } else {
            setValues(initialState);
        }
        setErrors({});
    }, [selectedPlanId, lessonPlans, setValues, setErrors]);
    
    const handleNewPlan = () => setSelectedPlanId(null);
    const handleDeleteClick = () => setIsDeleteConfirmOpen(true);
    const confirmDelete = () => {
        if(selectedPlanId) deleteMutation.mutate(selectedPlanId);
        setIsDeleteConfirmOpen(false);
    };

    return (
        <>
            <div className="h-full flex gap-6">
                <div className="w-1/3 bg-brand-surface border border-brand-border rounded-lg p-4 flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-brand-text">{t('lessonPlanner.title')}</h2>
                        <button onClick={handleNewPlan} className="p-2 rounded-full bg-brand-primary text-white hover:bg-brand-primary-hover"><Plus className="w-4 h-4" /></button>
                    </div>
                    {isLoadingPlans ? <Loader2 className="animate-spin mx-auto my-auto" /> : (
                        lessonPlans.length > 0 ? (
                             <div className="flex-1 overflow-y-auto space-y-2 -mr-2 pr-2">
                                {lessonPlans.map(plan => (
                                    <button 
                                        key={plan.id}
                                        onClick={() => setSelectedPlanId(plan.id)}
                                        className={`w-full text-left p-3 rounded-lg ${selectedPlanId === plan.id ? 'bg-brand-primary/10' : 'hover:bg-brand-surface-alt'}`}
                                    >
                                        <p className="font-semibold text-brand-text truncate">{plan.title}</p>
                                        <p className="text-xs text-brand-text-alt">{plan.course}</p>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="flex-1">
                                <DataEmptyState icon={ClipboardList} title={t('lessonPlanner.noPlansTitle')} description={t('lessonPlanner.noPlansDescription')} action={{ label: t('lessonPlanner.newPlan'), onClick: handleNewPlan }} />
                            </div>
                        )
                    )}
                </div>

                <div className="w-2/3 bg-brand-surface border border-brand-border rounded-lg p-6 flex flex-col">
                     <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-brand-text">{t('lessonPlanner.editorTitle')}</h2>
                        <div className="flex gap-2">
                             <button onClick={() => setIsAiModalOpen(true)} className="px-3 py-2 text-sm bg-brand-primary text-white rounded-md flex items-center gap-2"><Wand2 className="w-4 h-4" /> {t('lessonPlanner.aiAssistantButton')}</button>
                             {selectedPlanId && <button onClick={handleDeleteClick} className="p-2 bg-red-500/10 text-red-600 rounded-md hover:bg-red-500/20"><Trash2 className="w-4 h-4" /></button>}
                        </div>
                    </div>
                    <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2">
                        <InputField name="title" label={t('lessonPlanner.planTitleLabel')} value={values.title} onChange={handleChange} />
                        <div className="grid grid-cols-2 gap-4">
                            <SelectField name="course" label={t('lessonPlanner.courseLabel')} value={values.course} onChange={handleChange}>
                                <option value="">Select a course</option>
                                {mockCourses.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                            </SelectField>
                            <InputField name="date" label={t('lessonPlanner.dateLabel')} type="date" value={values.date} onChange={handleChange} />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-brand-text-alt"><Target className="w-4 h-4" /> {t('lessonPlanner.objectivesLabel')}</label>
                            <textarea name="objectives" value={values.objectives} onChange={handleChange} rows={3} className="mt-1 w-full p-2 border rounded-md" />
                        </div>
                        <div>
                             <label className="flex items-center gap-2 text-sm font-medium text-brand-text-alt"><Hammer className="w-4 h-4" /> {t('lessonPlanner.materialsLabel')}</label>
                            <textarea name="materials" value={values.materials} onChange={handleChange} rows={2} className="mt-1 w-full p-2 border rounded-md" />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-brand-text-alt"><Beaker className="w-4 h-4" /> {t('lessonPlanner.activitiesLabel')}</label>
                            <textarea name="activities" value={values.activities} onChange={handleChange} rows={5} className="mt-1 w-full p-2 border rounded-md" />
                        </div>
                         <div className="mt-auto pt-4 flex justify-end">
                            <button type="submit" disabled={saveMutation.isPending} className="px-4 py-2 bg-brand-primary text-white rounded-md flex items-center gap-2 disabled:bg-gray-400">
                                {saveMutation.isPending ? <Loader2 className="animate-spin" /> : null} {t('lessonPlanner.saveButton')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            {isAiModalOpen && <AiAssistantModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} mutation={aiSuggestionMutation} />}
            <Dialog isOpen={isDeleteConfirmOpen} onClose={() => setIsDeleteConfirmOpen(false)} onConfirm={confirmDelete} title="Delete Lesson Plan" description={t('lessonPlanner.confirmDelete')} confirmText="Delete" confirmVariant="destructive" isConfirming={deleteMutation.isPending} />
        </>
    );
};


const AiAssistantModal: React.FC<{ isOpen: boolean; onClose: () => void; mutation: any; }> = ({ isOpen, onClose, mutation }) => {
    const { t } = useTranslation();
    const [topic, setTopic] = useState('');
    const [objective, setObjective] = useState('');

    const handleGenerate = () => {
        if (topic && objective) {
            mutation.mutate({ topic, objective });
        }
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('lessonPlanner.aiModalTitle')}>
            <div className="space-y-4">
                <InputField name="topic" label={t('lessonPlanner.aiTopicLabel')} value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., The Roman Empire" />
                <InputField name="objective" label={t('lessonPlanner.aiObjectiveLabel')} value={objective} onChange={(e) => setObjective(e.target.value)} placeholder="e.g., Understand the reasons for its fall" />
                <div className="flex justify-end pt-2">
                    <button onClick={handleGenerate} disabled={mutation.isPending} className="px-4 py-2 bg-brand-primary text-white rounded-md flex items-center gap-2 disabled:bg-gray-400">
                        {mutation.isPending ? <Loader2 className="animate-spin" /> : <Wand2 />}
                        {mutation.isPending ? t('lessonPlanner.aiGenerating') : t('lessonPlanner.aiGenerateButton')}
                    </button>
                </div>
            </div>
        </Modal>
    )
}

export default LessonPlannerView;