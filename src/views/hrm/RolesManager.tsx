import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getRolesAndPermissions } from '@/api/hrmApi';
import { QUERY_KEYS } from '@/constants/queries';
import { Loader2, Check, Edit } from 'lucide-react';
import type { Permission } from '@/api/schemas/hrmSchemas';

const RolesManager: React.FC = () => {
    const { data, isLoading } = useQuery({
        queryKey: [QUERY_KEYS.hrmRolesAndPermissions],
        queryFn: getRolesAndPermissions,
    });

    if (isLoading) {
        return <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-brand-primary" /></div>;
    }

    if (!data) return null;
    
    const { roles, permissions } = data;
    // FIX: Explicitly type the Map to help TypeScript's type inference.
    const permissionsMap = new Map<string, Permission>(permissions.map(p => [p.id, p]));

    return (
        <div className="h-full flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-brand-text">Roles & Permissions</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roles.map(role => (
                    <div key={role.id} className="bg-brand-surface border border-brand-border rounded-lg p-4 flex flex-col">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-lg text-brand-text">{role.name}</h3>
                                <p className="text-sm text-brand-text-alt">{role.description}</p>
                            </div>
                            <button className="p-2 hover:bg-brand-surface-alt rounded-full text-brand-text-alt hover:text-brand-primary"><Edit className="w-4 h-4"/></button>
                        </div>
                        <div className="mt-4 pt-4 border-t border-brand-border flex-1">
                            <h4 className="font-semibold text-sm mb-2">Permissions:</h4>
                            <div className="space-y-2">
                                {role.permissionIds.map(permId => {
                                    const permission = permissionsMap.get(permId);
                                    // Add a null check to prevent runtime errors if a permission ID is invalid
                                    if (!permission) return null;
                                    return (
                                        <div key={permId} className="flex items-center gap-2 text-sm">
                                            <Check className="w-4 h-4 text-green-500" />
                                            <span>{permission.name}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RolesManager;