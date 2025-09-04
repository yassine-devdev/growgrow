

import React from 'react';
import Icon from './Icon';
import { icons } from 'lucide-react';

/**
 * @typedef {object} StatCardProps
 * @property {string} label - The label or title of the statistic.
 * @property {string} value - The main value of the statistic.
 * @property {string} [change] - An optional string indicating the change (e.g., "+12.5%"). The color will be green if it starts with '+' and red otherwise.
 * @property {keyof import('lucide-react').icons} icon - The name of the icon from `lucide-react` to display.
 */
interface StatCardProps {
    label: string;
    value: string;
    change?: string;
    icon: keyof typeof icons;
}

/**
 * A reusable UI component for displaying a single key statistic.
 * It includes a label, a primary value, an optional change indicator, and an icon.
 *
 * @param {StatCardProps} props - The component props.
 * @returns {JSX.Element} The rendered statistic card.
 */
const StatCard: React.FC<StatCardProps> = ({ label, value, change, icon }) => {
    const isPositive = change?.startsWith('+');
    return (
        <div className="bg-brand-surface dark:bg-dark-surface border border-brand-border dark:border-dark-border rounded-lg p-4 flex items-start justify-between">
            <div className="flex-1 overflow-hidden">
                <p className="text-xs sm:text-sm font-medium text-brand-text-alt dark:text-dark-text-alt truncate">{label}</p>
                <p className="text-xl sm:text-2xl font-bold text-brand-text dark:text-dark-text truncate">{value}</p>
                {change && (
                    <p className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {change}
                    </p>
                )}
            </div>
            <div className="p-2 bg-brand-primary/10 rounded-lg ml-2">
                 <Icon name={icon} className="w-5 h-5 text-brand-primary" />
            </div>
        </div>
    );
};

export default StatCard;