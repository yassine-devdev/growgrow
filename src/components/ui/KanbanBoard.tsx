import React, { useState } from 'react';

interface KanbanItem {
    id: string;
    [key: string]: any;
}

interface KanbanColumn {
    id: string;
    title: string;
}

interface KanbanBoardProps<T extends KanbanItem> {
    columns: KanbanColumn[];
    items: T[];
    itemStatusField: keyof T;
    onItemMove: (itemId: string, newStatus: string) => void;
    renderCard: (item: T) => React.ReactNode;
}

const KanbanBoard = <T extends KanbanItem>({
    columns,
    items,
    itemStatusField,
    onItemMove,
    renderCard
}: KanbanBoardProps<T>) => {
    const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
    const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, itemId: string) => {
        setDraggedItemId(itemId);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>, columnId: string) => {
        e.preventDefault();
        setDragOverColumn(columnId);
    };

    const handleDragLeave = () => {
        setDragOverColumn(null);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, columnId: string) => {
        e.preventDefault();
        if (draggedItemId) {
            onItemMove(draggedItemId, columnId);
        }
        setDraggedItemId(null);
        setDragOverColumn(null);
    };

    return (
        <div className="flex-1 flex gap-4 overflow-x-auto pb-2">
            {columns.map(column => (
                <div
                    key={column.id}
                    onDragOver={(e) => handleDragOver(e, column.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, column.id)}
                    className={`flex-1 bg-brand-surface-alt p-3 rounded-lg flex flex-col min-w-[280px] transition-colors ${dragOverColumn === column.id ? 'bg-brand-primary/10' : ''}`}
                >
                    <h3 className="font-semibold text-brand-text mb-3 px-1">{column.title}</h3>
                    <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                        {items
                            .filter(item => item[itemStatusField] === column.id)
                            .map(item => (
                                <div
                                    key={item.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, item.id)}
                                    className={`p-3 bg-brand-surface rounded-lg border border-brand-border shadow-sm cursor-grab active:cursor-grabbing transition-opacity ${draggedItemId === item.id ? 'opacity-50' : ''}`}
                                >
                                    {renderCard(item)}
                                </div>
                            ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default KanbanBoard;