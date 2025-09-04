import { apiClient } from './apiClient';
import type { LessonPlan, LessonPlanFormData } from './schemas/schoolHubSchemas';

export const getLessonPlans = async (): Promise<LessonPlan[]> => {
    return apiClient('/school-hub/lesson-plans');
};

export const saveLessonPlan = (data: LessonPlanFormData & { id?: string }): Promise<LessonPlan> => {
    return apiClient('/school-hub/lesson-plans', {
        method: 'POST',
        body: JSON.stringify(data),
    });
};

export const deleteLessonPlan = (id: string): Promise<{ success: boolean }> => {
    return apiClient(`/school-hub/lesson-plans/${id}`, { method: 'DELETE' });
};

export const getAiLessonPlanSuggestion = (data: { topic: string; objective: string }): Promise<{ objectives: string; materials: string; activities: string; }> => {
    return apiClient('/school-hub/ai/lesson-plan', {
        method: 'POST',
        body: JSON.stringify(data),
    });
};
