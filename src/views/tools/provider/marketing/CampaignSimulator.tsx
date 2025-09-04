import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Loader2, Wand2, RefreshCw } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import type { MarketingProjectData } from '@/api/schemas/appModulesSchemas';

interface CampaignSimulatorProps {
    projectData: MarketingProjectData;
    onDataChange: (data: MarketingProjectData['campaignSimulator']) => void;
}

const CampaignSimulator: React.FC<CampaignSimulatorProps> = ({ projectData, onDataChange }) => {
    const { campaignSimulator: data, keywords: allKeywords, adCopy: allAdCopy } = projectData;
    const addToast = useAppStore(s => s.addToast);
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<{ reach: string; engagement: string; conversions: string } | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        onDataChange({ ...data, [name]: name === 'budget' ? Number(value) : value });
    };

    const handleResultChange = (field: keyof NonNullable<typeof results>, value: string) => {
        if (results) {
            setResults(prev => prev ? { ...prev, [field]: value } : null);
        }
    };
    
    const handleSyncKeywords = () => {
        if (allKeywords.length === 0) {
            addToast({ message: 'No keywords have been generated in the Keyword Explorer yet.', type: 'error' });
            return;
        }
        const keywordsString = allKeywords.map(k => k.text).join(', ');
        onDataChange({ ...data, keywords: keywordsString });
        addToast({ message: 'Keywords synced from explorer!', type: 'info' });
    };

    const handleSyncAdCopy = () => {
        const benefitCopy = allAdCopy.find(ac => ac.world === 'Benefit-driven');
        if (benefitCopy) {
            const adCopyString = `${benefitCopy.copy.headline}\n${benefitCopy.copy.cta}`;
            onDataChange({ ...data, adCopy: adCopyString });
            addToast({ message: 'Benefit-driven ad copy synced!', type: 'info' });
        } else if (allAdCopy.length > 0) {
            const firstCopy = allAdCopy[0];
            const adCopyString = `${firstCopy.copy.headline}\n${firstCopy.copy.cta}`;
            onDataChange({ ...data, adCopy: adCopyString });
            addToast({ message: `Synced '${firstCopy.world}' ad copy.`, type: 'info' });
        } else {
            addToast({ message: 'No ad copy has been generated in the Ad Copy tool yet.', type: 'error' });
        }
    };

    const handleSimulate = async () => {
        setIsLoading(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Simulate a marketing campaign. Given keywords "${data.keywords}", email subject "${data.emailSubject}", ad copy "${data.adCopy}", and a budget of $${data.budget}, predict the campaign's reach (impressions), engagement rate (e.g., "2.5%"), and total conversions. Return only a valid JSON object with "reach", "engagement", and "conversions" keys as strings.`;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            const resultText = response.text.replace(/```json|```/g, '').trim();
            setResults(JSON.parse(resultText));
        } catch (e) {
            console.error(e);
            addToast({ message: 'AI simulation failed. Showing sample data.', type: 'error' });
            setResults({ reach: '~1.2M', engagement: '3.1%', conversions: '~450' });
        }
        setIsLoading(false);
    };

    return (
        <div className="space-y-4">
            <h3 className="font-bold">Campaign Inputs</h3>
            <div className="p-4 border rounded-lg bg-brand-surface space-y-4">
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <label className="text-sm font-medium text-brand-text-alt">Keywords</label>
                        <button onClick={handleSyncKeywords} className="text-xs px-2 py-1 bg-brand-primary/10 text-brand-primary rounded-md flex items-center gap-1 hover:bg-brand-primary/20">
                            <RefreshCw className="w-3 h-3"/> Sync from Explorer
                        </button>
                    </div>
                    <textarea name="keywords" value={data.keywords} onChange={handleChange} placeholder="Selected Keywords" className="p-2 border rounded-md w-full h-24" />
                </div>
                <div>
                    <label className="text-sm font-medium text-brand-text-alt">Email Subject</label>
                    <input name="emailSubject" type="text" value={data.emailSubject} onChange={handleChange} placeholder="Selected Email Subject" className="p-2 border rounded-md w-full mt-1" />
                </div>
                <div>
                    <div className="flex justify-between items-center mb-1">
                         <label className="text-sm font-medium text-brand-text-alt">Ad Copy</label>
                         <button onClick={handleSyncAdCopy} className="text-xs px-2 py-1 bg-brand-primary/10 text-brand-primary rounded-md flex items-center gap-1 hover:bg-brand-primary/20">
                            <RefreshCw className="w-3 h-3"/> Sync from Generator
                        </button>
                    </div>
                    <textarea name="adCopy" value={data.adCopy} onChange={handleChange} placeholder="Selected Ad Copy" className="p-2 border rounded-md w-full h-24" />
                </div>
                <div>
                    <label className="text-sm font-medium text-brand-text-alt">Budget ($)</label>
                    <input name="budget" type="number" value={data.budget} onChange={handleChange} placeholder="Budget" className="p-2 border rounded-md w-full mt-1" />
                </div>
            </div>
            <button onClick={handleSimulate} disabled={isLoading} className="w-full px-4 py-2 bg-brand-primary text-white rounded-md flex items-center justify-center gap-2 disabled:bg-gray-400">
                {isLoading ? <Loader2 className="animate-spin" /> : <Wand2 />} Run AI Simulation
            </button>
            {results && (
                <div>
                    <h3 className="font-bold mb-2">Predicted Results (Editable)</h3>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-brand-surface border border-brand-border rounded-lg p-2">
                             <p className="text-xs font-medium text-brand-text-alt">Expected Reach</p>
                             <input type="text" value={results.reach} onChange={(e) => handleResultChange('reach', e.target.value)} className="text-xl font-bold text-brand-text bg-transparent w-full focus:outline-none focus:bg-white p-1 rounded" />
                        </div>
                         <div className="bg-brand-surface border border-brand-border rounded-lg p-2">
                             <p className="text-xs font-medium text-brand-text-alt">Engagement Rate</p>
                             <input type="text" value={results.engagement} onChange={(e) => handleResultChange('engagement', e.target.value)} className="text-xl font-bold text-brand-text bg-transparent w-full focus:outline-none focus:bg-white p-1 rounded" />
                        </div>
                         <div className="bg-brand-surface border border-brand-border rounded-lg p-2">
                             <p className="text-xs font-medium text-brand-text-alt">Conversions</p>
                             <input type="text" value={results.conversions} onChange={(e) => handleResultChange('conversions', e.target.value)} className="text-xl font-bold text-brand-text bg-transparent w-full focus:outline-none focus:bg-white p-1 rounded" />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CampaignSimulator;