import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface DataEmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

const DataEmptyState: React.FC<DataEmptyStateProps> = ({ icon: Icon, title, description, action }) => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center text-center bg-brand-surface p-4 rounded-lg">
            <div className="p-3 bg-brand-primary/10 rounded-full mb-4">
                <Icon className="w-10 h-10 text-brand-primary" />
            </div>
            <h3 className="text-lg font-bold text-brand-text">{title}</h3>
            <p className="text-sm text-brand-text-alt max-w-xs mt-1">{description}</p>
            {action && (
                <button
                    onClick={action.onClick}
                    className="mt-4 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-primary hover:bg-brand-primary-hover"
                >
                    {action.label}
                </button>
            )}
        </div>
    );
};

export default DataEmptyState;
