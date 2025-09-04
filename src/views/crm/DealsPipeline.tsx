import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCrmDeals, updateCrmDealStage } from '@/api/crmApi';
import { QUERY_KEYS } from '@/constants/queries';
import type { CrmDeal } from '@/api/schemas/crmSchemas';
import KanbanBoard from '@/components/ui/KanbanBoard';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/store/useAppStore';

const DealCard: React.FC<{ item: CrmDeal }> = ({ item }) => (
    <div>
        <h4 className="font-semibold text-sm">{item.name}</h4>
        <p className="text-xs text-brand-text-alt">Value: ${item.value.toLocaleString()}</p>
        <p className="text-xs text-brand-text-alt">Close Date: {item.closeDate}</p>
    </div>
);

const DealsPipeline: React.FC = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const addToast = useAppStore(s => s.addToast);
    
    const [deals, setDeals] = useState<CrmDeal[]>([]);

    const { data: initialDeals, isLoading } = useQuery({
        queryKey: [QUERY_KEYS.crmDeals],
        queryFn: getCrmDeals,
    });

    useEffect(() => {
        if (initialDeals) {
            setDeals(initialDeals);
        }
    }, [initialDeals]);

    const stageUpdateMutation = useMutation({
        mutationFn: (variables: { dealId: string; newStage: CrmDeal['stage'] }) => 
            updateCrmDealStage(variables.dealId, variables.newStage),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.crmDeals] });
        },
        onError: (error: Error) => {
            addToast({ message: error.message || 'Failed to update deal stage.', type: 'error' });
            // Revert optimistic update
            if (initialDeals) setDeals(initialDeals);
        }
    });

    const handleStageChange = (itemId: string, newStage: string) => {
        // Optimistic update
        const updatedDeals = deals.map(deal =>
            deal.id === itemId ? { ...deal, stage: newStage as CrmDeal['stage'] } : deal
        );
        setDeals(updatedDeals);

        // Fire mutation
        stageUpdateMutation.mutate({ dealId: itemId, newStage: newStage as CrmDeal['stage'] });
    };

    const columns = [
        { id: 'Prospecting', title: 'Prospecting' },
        { id: 'Proposal Sent', title: 'Proposal Sent' },
        { id: 'Negotiation', title: 'Negotiation' },
        { id: 'Won', title: 'Won' },
        { id: 'Lost', title: 'Lost' },
    ];
    
    if (isLoading) {
        return <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-brand-primary" /></div>;
    }
    
    return (
        <div className="h-full flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-brand-text">{t('views.crm.deals.title')}</h1>
            <KanbanBoard
                columns={columns}
                items={deals}
                itemStatusField="stage"
                onItemMove={handleStageChange}
                renderCard={(item) => <DealCard item={item as CrmDeal} />}
            />
        </div>
    );
};

export default DealsPipeline;