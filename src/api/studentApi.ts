import * as schemas from './schemas/studentSchemas';
import type { MoodCheckIn } from './schemas/studentSchemas';
import { apiClient } from './apiClient';

export const getAssignmentDetails = async (assignmentId: string): Promise<schemas.AssignmentDetails> => {
    const data = await apiClient<schemas.AssignmentDetails>(`/assignments/${assignmentId}`);
    return schemas.assignmentDetailsSchema.parse(data);
};

export const submitAssignment = (data: { assignmentId: string; text?: string; file?: File }): Promise<schemas.AssignmentSubmission> => {
    const formData = new FormData();
    formData.append('assignmentId', data.assignmentId);
    if (data.text) {
        formData.append('text', data.text);
    }
    if (data.file) {
        formData.append('file', data.file);
    }
    
    // Use apiClient for multipart/form-data
    return apiClient(`/assignments/submit`, {
        method: 'POST',
        body: formData,
        // Content-Type is set automatically by browser for FormData
    });
};

export const submitMoodCheckIn = (mood: 'Happy' | 'Neutral' | 'Sad'): Promise<{ success: boolean }> => {
    return apiClient('/student/mood-checkin', {
        method: 'POST',
        body: JSON.stringify({ mood }),
    });
};

export const getRecentMoods = async (): Promise<MoodCheckIn[]> => {
    const data = await apiClient<MoodCheckIn[]>('/student/moods');
    return schemas.moodCheckInSchema.array().parse(data);
};