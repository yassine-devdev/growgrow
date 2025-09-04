import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getBulkOperations } from '@/api/appModulesApi';
import { QUERY_KEYS } from '@/constants/queries';
import type { BulkOperation } from '@/api/schemas/appModulesSchemas';
import { Loader2, PlayCircle } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

const BulkOperationsView: React.FC = () => {
    const addToast = useAppStore(s => s.addToast);
    const { data: operations, isLoading } = useQuery<BulkOperation[]>({
        queryKey: QUERY_KEYS.bulkOperations,
        queryFn: getBulkOperations,
    });

    if (isLoading) {
        return <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-brand-primary" /></div>;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-brand-text mb-6">Bulk Operations</h1>
            <p className="text-brand-text-alt mb-6">Run administrative tasks across multiple tenants at once. Use with caution.</p>
            <div className="space-y-4">
                {operations?.map(op => (
                    <div key={op.id} className="p-4 bg-brand-surface border border-brand-border rounded-lg flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-lg text-brand-text">{op.name}</h3>
                            <p className="text-sm text-brand-text-alt">{op.description}</p>
                        </div>
                        <button 
                            onClick={() => addToast({ message: `Operation '${op.name}' started.`, type: 'info' })}
                            className="px-4 py-2 bg-brand-primary text-white rounded-lg flex items-center gap-2 hover:bg-brand-primary-hover"
                        >
                            <PlayCircle className="w-5 h-5" />
                            Run Operation
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BulkOperationsView;
