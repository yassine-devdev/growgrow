import { z } from 'zod';

// Team Member
export const teamMemberSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    role: z.string(),
    status: z.enum(['Active', 'Invited']),
    joinedDate: z.string().datetime(),
});
export type TeamMember = z.infer<typeof teamMemberSchema>;

// Permission
export const permissionSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    category: z.string(),
});
export type Permission = z.infer<typeof permissionSchema>;

// Role
export const hrmRoleSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    permissionIds: z.array(z.string()),
});
export type HrmRole = z.infer<typeof hrmRoleSchema>;

// Combined data for Roles Manager
export const rolesAndPermissionsSchema = z.object({
    roles: z.array(hrmRoleSchema),
    permissions: z.array(permissionSchema),
});
export type RolesAndPermissions = z.infer<typeof rolesAndPermissionsSchema>;
