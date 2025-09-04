import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { getAiAnalysis } from '@/api/conciergeApi';
import { Loader2, Wand2, FileText, Trash2, BrainCircuit } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import MarkdownRenderer from '@/components/ui/MarkdownRenderer';

const sampleLogs = `[INFO] User provider@growyourneed.com logged in successfully.
[INFO] Scheduled backup job started.
[WARN] API Key "Legacy Marketing API" is expired but received a request.
[INFO] Scheduled backup job completed successfully.
[ERROR] Failed to connect to third-party integration "QuickBooks": Authentication error.
[INFO] User admin@northwood.com logged in.
[ERROR] 500 Internal Server Error on /api/billing/invoices - DB connection timeout.
[INFO] Cache cleared for user: student@northwood.com`;

const LogAnalyzer: React.FC = () => {
    const addToast = useAppStore(s => s.addToast);
    const [logs, setLogs] = useState('');

    const { mutate, data: analysis, isPending, reset } = useMutation({
        mutationFn: (text: string) => {
            const prompt = `Act as a senior DevOps engineer. Analyze the following system logs. Identify any errors or critical warnings, suggest potential root causes, and recommend next steps for investigation. Format your analysis using markdown with headings for "Summary", "Identified Issues", and "Recommendations".

Logs to analyze:
---
${text}
---`;
            return getAiAnalysis(prompt);
        },
        onError: (error: Error) => {
            addToast({ message: `Analysis failed: ${error.message}`, type: 'error' });
        }
    });

    const handleAnalyze = () => {
        if (!logs.trim()) return;
        mutate(logs);
    };
    
    const handleClear = () => {
        setLogs('');
        reset();
    };

    return (
        <div className="h-full flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-brand-text dark:text-dark-text">AI Log Analyzer</h1>
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
                <div className="flex flex-col gap-2 bg-brand-surface-alt/50 dark:bg-dark-surface-alt/50 p-4 rounded-lg border border-brand-border dark:border-dark-border">
                    <div className="flex justify-between items-center">
                        <label className="font-semibold text-brand-text dark:text-dark-text">Paste System Logs</label>
                        <div className="flex gap-2">
                            <button onClick={() => setLogs(sampleLogs)} className="text-xs px-2 py-1 bg-brand-surface dark:bg-dark-surface rounded-md flex items-center gap-1 hover:bg-brand-border dark:hover:bg-dark-border">
                                <FileText className="w-3 h-3"/> Load Sample
                            </button>
                            <button onClick={handleClear} className="text-xs px-2 py-1 bg-brand-surface dark:bg-dark-surface rounded-md flex items-center gap-1 hover:bg-brand-border dark:hover:bg-dark-border">
                                <Trash2 className="w-3 h-3"/> Clear
                            </button>
                        </div>
                    </div>
                    <textarea 
                        value={logs}
                        onChange={(e) => setLogs(e.target.value)}
                        className="w-full flex-1 p-2 border border-brand-border dark:border-dark-border rounded-md font-mono text-xs bg-brand-surface dark:bg-dark-surface text-brand-text dark:text-dark-text focus:ring-brand-primary focus:border-brand-primary"
                        aria-label="Log input"
                        placeholder="Paste logs here..."
                    />
                    <button 
                        onClick={handleAnalyze}
                        disabled={isPending || !logs.trim()}
                        className="w-full mt-2 py-2 bg-brand-primary text-white rounded-lg flex items-center justify-center gap-2 disabled:bg-brand-text-alt dark:disabled:bg-dark-border disabled:cursor-not-allowed"
                    >
                        {isPending ? <Loader2 className="w-5 h-5 animate-spin"/> : <><Wand2 className="w-5 h-5"/> Analyze Logs</>}
                    </button>
                </div>
                <div className="p-4 bg-brand-surface-alt/50 dark:bg-dark-surface-alt/50 rounded-lg border border-brand-border dark:border-dark-border flex flex-col">
                    <h3 className="text-sm font-semibold text-brand-text dark:text-dark-text mb-2 flex items-center gap-2">
                        <BrainCircuit className="w-5 h-5 text-brand-primary"/> AI Analysis
                    </h3>
                    <div className="flex-1 overflow-y-auto pr-2 bg-brand-surface dark:bg-dark-surface rounded-md p-3">
                        {isPending && <div className="flex items-center justify-center h-full text-brand-text-alt"><Loader2 className="w-8 h-8 animate-spin" /></div>}
                        {analysis && <MarkdownRenderer content={analysis.text} />}
                        {!analysis && !isPending && <div className="text-center text-brand-text-alt pt-10">Analysis results will appear here.</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogAnalyzer;
