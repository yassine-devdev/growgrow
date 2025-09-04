import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Loader2, Wand2, Lightbulb } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

interface CompetitorInsightsProps {
    data: string;
    onDataChange: (data: string) => void;
}

const CompetitorInsights: React.FC<CompetitorInsightsProps> = ({ data, onDataChange }) => {
    const addToast = useAppStore(s => s.addToast);
    const [isLoading, setIsLoading] = useState(false);
    const [urls, setUrls] = useState('');
    const [keywords, setKeywords] = useState('');

    const handleGenerate = async () => {
        if (!urls || !keywords) {
            addToast({ message: 'Please provide URLs and keywords.', type: 'error' });
            return;
        }
        setIsLoading(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Act as an SEO expert. I am analyzing competitors. My keywords are "${keywords}". My main competitors are at these URLs: ${urls}. Based on this, identify 3 potential keyword gaps and suggest a content idea (like a blog post title) for each gap. Format your response clearly with headings.`;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            onDataChange(response.text);
        } catch (e) {
            addToast({ message: 'Failed to get insights.', type: 'error' });
        }
        setIsLoading(false);
    };

    return (
        <div className="space-y-4">
            <textarea value={urls} onChange={e => setUrls(e.target.value)} placeholder="Enter competitor URLs, one per line..." className="w-full h-24 p-2 border rounded-md" />
            <input type="text" value={keywords} onChange={e => setKeywords(e.target.value)} placeholder="Enter your main keywords, comma separated..." className="w-full p-2 border rounded-md" />
             <button onClick={handleGenerate} disabled={isLoading} className="w-full px-4 py-2 bg-brand-primary text-white rounded-md flex items-center justify-center gap-2 disabled:bg-gray-400">
                {isLoading ? <Loader2 className="animate-spin" /> : <Wand2 />} Get AI Insights
            </button>
            
            <div className="p-4 border-2 border-dashed rounded-lg bg-brand-surface">
                 <h3 className="font-bold mb-2 flex items-center gap-2"><Lightbulb /> AI-Generated Insights (Editable)</h3>
                 <textarea
                    value={data}
                    onChange={(e) => onDataChange(e.target.value)}
                    placeholder="AI insights will appear here..."
                    className="w-full h-48 p-2 border rounded-md font-sans text-sm"
                 />
            </div>
            
        </div>
    );
};

export default CompetitorInsights;