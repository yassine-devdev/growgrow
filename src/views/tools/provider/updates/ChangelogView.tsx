
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUpdates } from '@/api/appModulesApi';
import { GitBranch, Loader2, Wand2 } from 'lucide-react';
import type { Update } from '@/api/schemas/appModulesSchemas';
import { GoogleGenAI } from "@google/genai";
import { useAppStore } from '@/store/useAppStore';
import { useTranslation } from 'react-i18next';

const AiEditor: React.FC = () => {
    const { t } = useTranslation();
    const addToast = useAppStore(s => s.addToast);
    const [notes, setNotes] = useState('- Fixed a critical bug in the billing module where invoices were not sent.\n- Improved performance of the main dashboard by optimizing data fetching.\n- Added three new themes to the White Label module for schools.');
    const [summary, setSummary] = useState('');
    const [isSummarizing, setIsSummarizing] = useState(false);

    const handleSummarize = async () => {
        if (!notes) return;
        setIsSummarizing(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Summarize the following release notes into a short, engaging paragraph for an announcement: ${notes}`
            });
            setSummary(response.text);
        } catch (e) {
            addToast({ message: 'Failed to generate summary.', type: 'error' });
        }
        setIsSummarizing(false);
    };

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-brand-text">{t('views.changelog.aiEditorTitle')}</h2>
            <textarea 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)} 
                className="w-full h-48 p-2 border rounded-md bg-brand-surface" 
                placeholder={t('views.changelog.notesPlaceholder')}
            />
            <button onClick={handleSummarize} disabled={isSummarizing} className="px-4 py-2 bg-brand-primary text-white rounded-md flex items-center gap-2 disabled:bg-gray-400">
                {isSummarizing ? <Loader2 className="animate-spin" /> : <Wand2 />} {isSummarizing ? t('views.changelog.summarizing') : t('views.changelog.summarizeButton')}
            </button>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-bold text-blue-800">{t('views.changelog.aiSummaryTitle')}</h3>
                <textarea
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder={t('views.changelog.aiSummaryPlaceholder')}
                    className="w-full h-24 p-2 mt-2 bg-white border border-blue-200 rounded-md text-sm text-blue-700"
                />
            </div>
        </div>
    );
};

const ChangelogView: React.FC = () => {
    const { t } = useTranslation();
    const { data: updates, isLoading } = useQuery<Update[]>({ queryKey: ['updates'], queryFn: getUpdates });
    
    const getBadgeColor = (type: Update['type']) => {
        switch(type) {
            case 'Major': return 'bg-red-100 text-red-800';
            case 'Minor': return 'bg-blue-100 text-blue-800';
            case 'Patch': return 'bg-green-100 text-green-800';
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="max-w-3xl">
                <h1 className="text-2xl font-bold text-brand-text mb-6">{t('views.changelog.title')}</h1>
                {isLoading ? (
                    <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-brand-primary" /></div>
                ) : (
                    <div className="relative border-l-2 border-brand-border pl-6 space-y-8">
                        {updates?.map((update) => (
                            <div key={update.version} className="relative">
                                <div className="absolute -left-[34px] top-1 h-4 w-4 rounded-full bg-brand-primary border-4 border-brand-surface"></div>
                                <p className="text-sm text-brand-text-alt">{new Date(update.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                <h2 className="text-lg font-bold flex items-center gap-2">
                                <GitBranch className="w-5 h-5" />
                                Version {update.version}
                                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getBadgeColor(update.type)}`}>{update.type}</span>
                                </h2>
                                <p className="text-brand-text mt-1 whitespace-pre-line">{update.notes}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div>
                <AiEditor />
            </div>
        </div>
    );
};

export default ChangelogView;
