import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllPermissions } from '@/api/hrmApi';
import { QUERY_KEYS } from '@/constants/queries';
import { Loader2, ShieldCheck } from 'lucide-react';
import type { Permission } from '@/api/schemas/hrmSchemas';

const PermissionsManager: React.FC = () => {
    const { data: permissions, isLoading } = useQuery({
        queryKey: [QUERY_KEYS.hrmAllPermissions],
        queryFn: getAllPermissions,
    });

    const permissionsByCategory = useMemo(() => {
        if (!permissions) return {};
        return permissions.reduce((acc, perm) => {
            (acc[perm.category] = acc[perm.category] || []).push(perm);
            return acc;
        }, {} as Record<string, Permission[]>);
    }, [permissions]);

    if (isLoading) {
        return <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-brand-primary" /></div>;
    }

    return (
        <div className="h-full flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-brand-text">System Permissions</h1>
            <p className="text-brand-text-alt">This is a read-only view of all available permissions in the system for reference.</p>
            <div className="space-y-6">
                {Object.entries(permissionsByCategory).map(([category, perms]) => (
                    <div key={category}>
                        <h2 className="text-lg font-semibold text-brand-text mb-2 flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-brand-primary"/>{category}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Array.isArray(perms) && perms.map(perm => (
                                <div key={perm.id} className="p-3 bg-brand-surface border border-brand-border rounded-lg">
                                    <h3 className="font-semibold text-sm">{perm.name}</h3>
                                    <p className="text-xs text-brand-text-alt">{perm.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PermissionsManager;