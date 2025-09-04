import React, { useState } from 'react';
import { DollarSign } from 'lucide-react';

type Stage = 'Lead' | 'Contacted' | 'Proposal' | 'Won' | 'Lost';

interface Card {
    id: number;
    title: string;
    value: number;
    stage: Stage;
}

const initialCards: Card[] = [
    { id: 1, title: 'Northwood High Expansion', value: 25000, stage: 'Proposal' },
    { id: 2, title: 'South Park Elementary', value: 15000, stage: 'Contacted' },
    { id: 3, title: 'Riverdale University', value: 50000, stage: 'Won' },
    { id: 4, title: 'Generic School District', value: 75000, stage: 'Lead' },
    { id: 5, title: 'Charter Academy', value: 12000, stage: 'Lost' },
];

const STAGES: Stage[] = ['Lead', 'Contacted', 'Proposal', 'Won', 'Lost'];

const SalesPipelinesView: React.FC = () => {
    const [cards, setCards] = useState(initialCards);
    const [draggedCardId, setDraggedCardId] = useState<number | null>(null);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: number) => {
        setDraggedCardId(id);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetStage: Stage) => {
        e.preventDefault();
        if (draggedCardId === null) return;
        
        setCards(prevCards =>
            prevCards.map(card =>
                card.id === draggedCardId ? { ...card, stage: targetStage } : card
            )
        );
        setDraggedCardId(null);
    };

    return (
        <div className="h-full flex flex-col gap-4">
             <h1 className="text-xl font-bold text-brand-text">Provider Sales Pipeline</h1>
             <div className="flex-1 flex gap-4 overflow-x-auto pb-2">
                {STAGES.map(stage => (
                    <div
                        key={stage}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, stage)}
                        className="flex-1 bg-brand-surface-alt p-3 rounded-lg flex flex-col min-w-[280px]"
                    >
                        <h3 className="font-semibold text-brand-text mb-3 px-1">{stage}</h3>
                        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                            {cards
                                .filter(card => card.stage === stage)
                                .map(card => (
                                    <div
                                        key={card.id}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, card.id)}
                                        className="p-3 bg-brand-surface rounded-lg border border-brand-border shadow-sm cursor-grab active:cursor-grabbing"
                                    >
                                        <p className="font-bold text-sm text-brand-text mb-1">{card.title}</p>
                                        <div className="flex items-center gap-1 text-xs text-green-600">
                                            <DollarSign className="w-3 h-3"/>
                                            <span>{card.value.toLocaleString()}</span>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SalesPipelinesView;