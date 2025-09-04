import React, { useState } from 'react';
import { Loader2, Wand2, CheckCircle, XCircle } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const historicalCampaigns = [
    {
        id: 'C1',
        name: 'Q2 Summer Signup Drive',
        details: 'Goal: Increase student signups by 20%. Budget: $10,000. Channel: Social Media Ads. Target: High school graduates.',
        results: 'Outcome: 15% increase in signups. Spend: $10,000. Notes: High cost per acquisition.'
    },
    {
        id: 'C2',
        name: 'Q3 Teacher Engagement Email',
        details: 'Goal: Reactivate dormant teacher accounts. Budget: $1,500. Channel: Email Marketing. Target: Teachers inactive for 90+ days.',
        results: 'Outcome: 30% reactivation rate. Spend: $1,200. Notes: Very successful, low cost.'
    }
];

const CampaignBacktesting: React.FC = () => {
    const [selectedCampaignId, setSelectedCampaignId] = useState(historicalCampaigns[0].id);
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const selectedCampaign = historicalCampaigns.find(c => c.id === selectedCampaignId);

    const handleAnalyze = async () => {
        if (!selectedCampaign) return;
        setIsLoading(true);
        setAnalysis(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Act as a marketing analyst. Evaluate the success of the following historical marketing campaign. Provide a brief summary, identify what went well, and suggest one key area for improvement.

            Campaign Details:
            ${selectedCampaign.details}

            Campaign Results:
            ${selectedCampaign.results}
            `;
            const result = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setAnalysis(result.text);
        } catch (e) {
            console.error(e);
            setAnalysis('Error: Could not analyze the campaign.');
        }
        setIsLoading(false);
    };

    return (
        <div className="h-full flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-brand-text">Campaign Backtesting</h1>
            <div className="flex gap-4">
                <div className="w-1/3">
                    <label className="block text-sm font-medium text-brand-text-alt mb-1">Select Historical Campaign</label>
                    <select
                        value={selectedCampaignId}
                        onChange={(e) => {
                            setSelectedCampaignId(e.target.value);
                            setAnalysis(null);
                        }}
                        className="w-full p-2 border rounded-md"
                    >
                        {historicalCampaigns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    {selectedCampaign && (
                        <div className="mt-4 p-4 bg-brand-surface-alt rounded-lg space-y-2 text-sm">
                            <div><p className="font-semibold">Details:</p><p>{selectedCampaign.details}</p></div>
                            <div><p className="font-semibold">Results:</p><p>{selectedCampaign.results}</p></div>
                        </div>
                    )}
                </div>
                <div className="w-2/3 flex flex-col">
                    <button
                        onClick={handleAnalyze}
                        disabled={isLoading}
                        className="mb-4 px-4 py-2 bg-brand-primary text-white rounded-md flex items-center justify-center gap-2 disabled:bg-gray-400"
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : <Wand2 />} Evaluate Success with AI
                    </button>
                    <div className="flex-1 p-4 bg-gray-800 rounded-lg text-white">
                         {isLoading && <div className="text-gray-400">Analyzing historical data...</div>}
                         {analysis && <pre className="text-green-300 text-sm whitespace-pre-wrap font-sans">{analysis}</pre>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CampaignBacktesting;