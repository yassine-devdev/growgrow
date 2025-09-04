import React from 'react';
import { Rocket } from 'lucide-react';

/**
 * @typedef {object} EmptyStateProps
 * @property {string} message - The message to display within the empty state component.
 */
interface EmptyStateProps {
    message: string;
}

/**
 * A reusable component to display when a view has no content or is not yet implemented.
 * It shows a "Coming Soon" message with a rocket icon.
 *
 * @param {EmptyStateProps} props - The component props.
 * @returns {JSX.Element} The rendered empty state component.
 */
const EmptyState: React.FC<EmptyStateProps> = ({ message }) => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center text-center bg-brand-surface-alt/50 dark:bg-dark-surface-alt/50 border-2 border-dashed border-brand-border dark:border-dark-border rounded-lg p-4">
            <div className="relative mb-4">
                <div className="absolute -inset-2 bg-brand-primary/10 rounded-full animate-pulse"></div>
                <Rocket className="relative w-16 h-16 text-brand-primary" />
            </div>
            <h2 className="text-2xl font-bold text-brand-text dark:text-dark-text mb-2">Coming Soon</h2>
            <p className="text-brand-text-alt dark:text-dark-text-alt max-w-sm">{message}</p>
        </div>
    );
};

export default EmptyState;