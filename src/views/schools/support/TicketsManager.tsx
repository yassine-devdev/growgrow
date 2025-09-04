import React, { useMemo, useState } from 'react';
import { getSupportTickets } from '@/api/schoolManagementApi';
import type { SupportTicket } from '@/api/schemas/schoolManagementSchemas';
import { Loader2, Ticket } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import DataEmptyState from '@/components/ui/DataEmptyState';

const priorityInfo = {
    High: 'border-red-500',
    Medium: 'border-yellow-500',
    Low: 'border-blue-500'
};

const tagColors = [
    'bg-blue-100 text-blue-800',
    'bg-purple-100 text-purple-800',
    'bg-pink-100 text-pink-800',
    'bg-indigo-100 text-indigo-800',
];

const TicketCard: React.FC<{ ticket: SupportTicket }> = ({ ticket }) => (
    <div className={`p-3 bg-brand-surface rounded-lg border-l-4 ${priorityInfo[ticket.priority]} shadow-sm`}>
        <p className="font-bold text-sm text-brand-text mb-1 truncate">{ticket.subject}</p>
        
        {ticket.tags && ticket.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 my-2">
                {ticket.tags.map((tag, index) => (
                    <span key={tag} className={`px-2 py-0.5 text-xs font-medium rounded-full ${tagColors[index % tagColors.length]}`}>
                        {tag}
                    </span>
                ))}
            </div>
        )}

        <p className="text-xs text-brand-text-alt">{ticket.school}</p>
        <p className="text-xs text-brand-text-alt mt-2">{new Date(ticket.lastUpdate).toLocaleString()}</p>
    </div>
);

const KanbanColumn: React.FC<{ title: string; tickets: SupportTicket[] }> = ({ title, tickets }) => (
    <div className="flex-1 bg-brand-surface-alt p-3 rounded-lg flex flex-col min-w-[280px]">
        <h3 className="font-semibold text-brand-text mb-3 px-1">{title} ({tickets.length})</h3>
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {tickets.length > 0 ? (
                tickets.map(ticket => <TicketCard key={ticket.id} ticket={ticket} />)
            ) : (
                <div className="text-center text-sm text-brand-text-alt pt-10">
                    <p>No tickets here.</p>
                </div>
            )}
        </div>
    </div>
);


const TicketsManager: React.FC = () => {
    const { t } = useTranslation();
    const { data: tickets, isLoading } = useQuery({
        queryKey: ['supportTickets'],
        queryFn: getSupportTickets,
        initialData: []
    });

    const [priorityFilters, setPriorityFilters] = useState<Set<string>>(new Set());
    const [tagFilter, setTagFilter] = useState<string>('');
    const [sortBy, setSortBy] = useState<'priority' | 'lastUpdate'>('priority');

    const handlePriorityFilterChange = (priority: string) => {
        setPriorityFilters(prev => {
            const newSet = new Set(prev);
            if (newSet.has(priority)) {
                newSet.delete(priority);
            } else {
                newSet.add(priority);
            }
            return newSet;
        });
    };

    const processedTickets = useMemo(() => {
        let filtered = tickets.filter(ticket => {
            const priorityMatch = priorityFilters.size === 0 || priorityFilters.has(ticket.priority);
            const tagMatch = tagFilter === '' || ticket.tags?.some(tag => tag.toLowerCase().includes(tagFilter.toLowerCase()));
            return priorityMatch && tagMatch;
        });

        const priorityOrder: { [key in SupportTicket['priority']]: number } = { 'High': 0, 'Medium': 1, 'Low': 2 };
        filtered.sort((a, b) => {
            if (sortBy === 'priority') {
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            }
            if (sortBy === 'lastUpdate') {
                return new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime();
            }
            return 0;
        });

        return filtered;
    }, [tickets, priorityFilters, tagFilter, sortBy]);

    const columns = useMemo(() => ({
        New: processedTickets.filter(t => t.status === 'New'),
        'In Progress': processedTickets.filter(t => t.status === 'In Progress'),
        Resolved: processedTickets.filter(t => t.status === 'Resolved'),
    }), [processedTickets]);

    if (isLoading) {
        return <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-brand-primary" /></div>;
    }

    if (tickets.length === 0) {
        return (
            <div className="h-full flex flex-col">
                 <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold text-brand-text">{t('views.ticketsManager.title')}</h1>
                 </div>
                <div className="flex-1">
                    <DataEmptyState
                        icon={Ticket}
                        title={t('dataEmptyState.noTickets.title')}
                        description={t('dataEmptyState.noTickets.description')}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col gap-4">
             <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-brand-text">{t('views.ticketsManager.title')}</h1>
             </div>

             {/* Filters and Sorting */}
             <div className="flex flex-wrap items-center gap-4 p-3 bg-brand-surface border border-brand-border rounded-lg">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-brand-text-alt">Filter by Priority:</span>
                    {(['High', 'Medium', 'Low'] as const).map(p => (
                         <label key={p} className="flex items-center gap-1.5 text-sm cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={priorityFilters.has(p)}
                                onChange={() => handlePriorityFilterChange(p)}
                                className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                            />
                            {p}
                        </label>
                    ))}
                </div>
                 <div className="flex-1 min-w-[200px]">
                    <input 
                        type="text"
                        placeholder="Filter by tag..."
                        value={tagFilter}
                        onChange={(e) => setTagFilter(e.target.value)}
                        className="w-full text-sm bg-brand-surface-alt border border-brand-border rounded-lg p-2"
                    />
                </div>
                 <div className="flex items-center gap-2">
                     <label htmlFor="sort-by" className="text-sm font-semibold text-brand-text-alt">Sort by:</label>
                     <select 
                        id="sort-by"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as 'priority' | 'lastUpdate')}
                        className="text-sm bg-brand-surface-alt border border-brand-border rounded-lg p-2"
                    >
                        <option value="priority">Priority (High to Low)</option>
                        <option value="lastUpdate">Last Update (Newest)</option>
                     </select>
                 </div>
             </div>

            <div className="flex-1 flex gap-4 overflow-x-auto pb-2">
                <KanbanColumn title="New" tickets={columns.New} />
                <KanbanColumn title="In Progress" tickets={columns['In Progress']} />
                <KanbanColumn title="Resolved" tickets={columns.Resolved} />
            </div>
        </div>
    );
};

export default TicketsManager;