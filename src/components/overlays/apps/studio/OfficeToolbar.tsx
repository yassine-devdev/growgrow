import React from 'react';
import { Bold, Italic, Heading1, Heading2, List, ListOrdered } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface OfficeToolbarProps {
    onFormat: (command: string, value?: string) => void;
}

const OfficeToolbar: React.FC<OfficeToolbarProps> = ({ onFormat }) => {
    const { t } = useTranslation();

    const buttons = [
        { command: 'bold', label: t('views.studio.office.bold'), icon: Bold },
        { command: 'italic', label: t('views.studio.office.italic'), icon: Italic },
        { command: 'formatBlock', value: 'H1', label: t('views.studio.office.h1'), icon: Heading1 },
        { command: 'formatBlock', value: 'H2', label: t('views.studio.office.h2'), icon: Heading2 },
        { command: 'insertUnorderedList', label: t('views.studio.office.ul'), icon: List },
        { command: 'insertOrderedList', label: t('views.studio.office.ol'), icon: ListOrdered },
    ];

    return (
        <div className="p-2 bg-brand-surface border-b border-brand-border flex items-center gap-1">
            {buttons.map(btn => (
                <button
                    key={btn.label}
                    title={btn.label}
                    onMouseDown={(e) => {
                        e.preventDefault(); // Prevent editor from losing focus
                        onFormat(btn.command, btn.value);
                    }}
                    className="p-2 rounded-md hover:bg-brand-surface-alt"
                >
                    <btn.icon className="w-4 h-4" />
                </button>
            ))}
        </div>
    );
};

export default OfficeToolbar;