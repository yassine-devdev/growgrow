import * as schemas from './schemas/adminSchemas';
import { apiClient } from './apiClient';

export const getAcademicHealthData = async (): Promise<schemas.AcademicHealthData> => {
    const data = await apiClient<schemas.AcademicHealthData>('/admin/academic-health');
    return schemas.academicHealthSchema.parse(data);
};