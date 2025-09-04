import { buildApiUrl } from './apiHelpers';
import { apiClient } from './apiClient';
import { PaginatedResponse } from '@/types';
import { 
    teamMemberSchema,
    permissionSchema,
    rolesAndPermissionsSchema,
    type TeamMember, 
    type Permission,
    type RolesAndPermissions,
} from './schemas/hrmSchemas';

// Team Members
export const getTeamMembers = async (options: { pageIndex: number; pageSize: number; sorting: { id: string, desc: boolean }[]; globalFilter?: string; }): Promise<PaginatedResponse<TeamMember>> => {
    return apiClient(buildApiUrl('/hrm/directory', options));
};

// Roles and Permissions
export const getRolesAndPermissions = async (): Promise<RolesAndPermissions> => {
    const data = await apiClient<RolesAndPermissions>('/hrm/roles');
    return rolesAndPermissionsSchema.parse(data);
};

// All Permissions (for reference view)
export const getAllPermissions = async (): Promise<Permission[]> => {
    const data = await apiClient<Permission[]>('/hrm/permissions');
    return permissionSchema.array().parse(data);
};
