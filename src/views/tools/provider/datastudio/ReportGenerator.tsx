import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Loader2, Wand2 } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

const ReportBuilderView: React.FC = () => {
    const addToast = useAppStore(s => s.addToast);
    const [isLoading, setIsLoading] = useState(false);
    const [kpis, setKpis] = useState(['MRR', 'Active Users']);
    const [summary, setSummary] = useState('');

    const handleGenerate = async () => {
        setIsLoading(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Generate a brief executive summary for a report focusing on the following KPIs: ${kpis.join(', ')}. Mention a positive trend for each KPI and suggest one action item.`;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setSummary(response.text);
        } catch (e) {
            console.error(e);
            addToast({ message: 'Failed to generate summary.', type: 'error' });
        }
        setIsLoading(false);
    };

    return (
        <div className="space-y-4 max-w-3xl mx-auto">
            <h1 className="text-xl font-bold text-brand-text">AI Report Summary Generator</h1>
            <div className="p-4 border rounded-lg bg-brand-surface">
                <h3 className="font-bold mb-2">1. Select KPIs (Manual)</h3>
                {/* A real implementation would have a multi-select dropdown */}
                <p className="text-sm p-2 bg-brand-surface-alt rounded-md">{kpis.join(', ')}</p>
            </div>
            <button onClick={handleGenerate} disabled={isLoading} className="w-full px-4 py-2 bg-brand-primary text-white rounded-md flex items-center justify-center gap-2 disabled:bg-gray-400">
                {isLoading ? <Loader2 className="animate-spin" /> : <Wand2 />} Generate AI Summary
            </button>
            <div className="p-4 border rounded-lg bg-brand-surface">
                <h3 className="font-bold mb-2">2. Edit Report Summary (Manual Override)</h3>
                <textarea
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="AI-generated summary will appear here. You can edit it manually."
                    className="w-full h-48 p-2 border rounded-md"
                />
            </div>
        </div>
    );
};

export default ReportBuilderView;