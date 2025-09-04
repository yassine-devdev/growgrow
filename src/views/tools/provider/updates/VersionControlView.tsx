
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getVersionControlCommits } from '@/api/appModulesApi';
import { Loader2, GitCommit, Wand2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { useAppStore } from '@/store/useAppStore';
import { useTranslation } from 'react-i18next';
import type { VersionControlCommit } from '@/api/schemas/appModulesSchemas';

const VersionControlView: React.FC = () => {
    const { t } = useTranslation();
    const addToast = useAppStore(s => s.addToast);
    const { data: commits, isLoading } = useQuery<VersionControlCommit[]>({ 
        queryKey: ['versionControlCommits'], 
        queryFn: getVersionControlCommits 
    });
    
    const [selectedCommits, setSelectedCommits] = useState<Set<string>>(new Set());
    const [releaseNotes, setReleaseNotes] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleToggleCommit = (hash: string) => {
        setSelectedCommits(prev => {
            const newSet = new Set(prev);
            if (newSet.has(hash)) {
                newSet.delete(hash);
            } else {
                newSet.add(hash);
            }
            return newSet;
        });
    };
    
    const handleGenerateNotes = async () => {
        if (selectedCommits.size === 0) {
            addToast({ message: t('views.versionControl.noCommits'), type: 'error' });
            return;
        }
        setIsGenerating(true);
        const selectedMessages = commits?.filter(c => selectedCommits.has(c.hash)).map(c => c.message).join('\n');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Based on the following git commit messages, draft a set of user-facing release notes. Group them by "New Features", "Bug Fixes", and "Other Improvements". Use bullet points.
            
Commit Messages:
---
${selectedMessages}
---
`;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setReleaseNotes(response.text);
        } catch (e) {
            console.error(e);
            addToast({ message: 'Failed to generate release notes.', type: 'error' });
        }
        setIsGenerating(false);
    };

    return (
        <div className="h-full flex flex-col lg:flex-row gap-6">
            <div className="lg:w-1/2 flex flex-col gap-4">
                <h1 className="text-2xl font-bold text-brand-text">{t('views.versionControl.title')}</h1>
                <div className="flex-1 p-4 bg-brand-surface border border-brand-border rounded-lg overflow-y-auto">
                    <h2 className="font-bold text-lg mb-2">{t('views.versionControl.commitHistory')}</h2>
                    {isLoading ? (
                        <Loader2 className="w-8 h-8 animate-spin text-brand-primary mx-auto" />
                    ) : (
                        <ul className="space-y-3">
                            {commits?.map(commit => (
                                <li key={commit.hash} className="flex items-start gap-3">
                                    <input 
                                        type="checkbox" 
                                        checked={selectedCommits.has(commit.hash)}
                                        onChange={() => handleToggleCommit(commit.hash)}
                                        className="mt-1 h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                                        aria-label={`Select commit ${commit.hash}`}
                                    />
                                    <div className="flex-1">
                                        <p className="font-mono text-sm text-brand-primary bg-brand-surface-alt px-1 rounded-sm inline-block">{commit.hash.substring(0, 7)}</p>
                                        <p className="text-brand-text font-medium">{commit.message}</p>
                                        <p className="text-xs text-brand-text-alt">{commit.author} on {new Date(commit.date).toLocaleDateString()}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
            <div className="lg:w-1/2 flex flex-col gap-4">
                <button 
                    onClick={handleGenerateNotes}
                    disabled={isGenerating || selectedCommits.size === 0}
                    className="w-full py-3 bg-brand-primary text-white font-semibold rounded-lg flex items-center justify-center gap-2 disabled:bg-brand-text-alt"
                >
                    {isGenerating ? <Loader2 className="w-5 h-5 animate-spin"/> : <Wand2 className="w-5 h-5" />}
                    {t('views.versionControl.generateReleaseNotes')}
                </button>
                <div className="flex-1 p-4 bg-brand-surface border border-brand-border rounded-lg flex flex-col">
                    <h2 className="font-bold text-lg mb-2">{t('views.versionControl.aiGeneratedNotes')}</h2>
                    <textarea 
                        value={releaseNotes}
                        onChange={e => setReleaseNotes(e.target.value)}
                        placeholder={t('views.versionControl.releaseNotesPlaceholder')}
                        className="w-full flex-1 p-2 border border-brand-border rounded-md bg-brand-surface-alt text-sm font-sans"
                    />
                </div>
            </div>
        </div>
    );
};

export default VersionControlView;
