import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { getAiAnalysis } from '@/api/conciergeApi';
import { Loader2, Wand2, Search } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import MarkdownRenderer from '@/components/ui/MarkdownRenderer';

const BusinessHelp: React.FC = () => {
    const addToast = useAppStore(s => s.addToast);
    const [topic, setTopic] = useState('The future of AI in K-12 education');

    const { mutate, data: analysis, isPending, reset } = useMutation({
        mutationFn: (text: string) => {
            const prompt = `Act as a business strategist. Provide a brief market research summary on the topic: "${text}". Include sections for Market Trends, Key Opportunities, and Potential Challenges. Format the response using markdown.`;
            return getAiAnalysis(prompt);
        },
        onError: (error: Error) => {
            addToast({ message: `Analysis failed: ${error.message}`, type: 'error' });
        }
    });
    
    const handleResearch = () => {
        if (!topic.trim()) return;
        mutate(topic);
    };

    return (
        <div className="h-full flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-brand-text dark:text-dark-text">AI Market Research Assistant</h1>
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Enter a market topic to research..."
                    className="flex-1 p-3 border border-brand-border rounded-lg text-lg"
                />
                 <button 
                    onClick={handleResearch}
                    disabled={isPending || !topic.trim()}
                    className="h-full px-6 py-2 bg-brand-primary text-white rounded-lg flex items-center justify-center gap-2 disabled:bg-brand-text-alt"
                >
                    {isPending ? <Loader2 className="w-5 h-5 animate-spin"/> : <><Search className="w-5 h-5"/> Research</>}
                </button>
            </div>
            
            <div className="flex-1 p-4 bg-brand-surface-alt/50 border border-brand-border rounded-lg overflow-y-auto">
                {isPending && <div className="flex items-center justify-center h-full text-brand-text-alt"><Loader2 className="w-8 h-8 animate-spin" /></div>}
                {analysis && <MarkdownRenderer content={analysis.text} />}
                {!analysis && !isPending && <div className="text-center text-brand-text-alt pt-10">Research results will appear here.</div>}
            </div>
        </div>
    );
};

export default BusinessHelp;
