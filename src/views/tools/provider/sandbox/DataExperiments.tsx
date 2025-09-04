import React, { useState } from 'react';
import { Loader2, Wand2, TestTube } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { useAppStore } from '@/store/useAppStore';

const sampleData = `student_id,grade,attendance_pct,hours_studied
101,85,95,10
102,92,98,15
103,76,85,8
104,88,96,12
105,65,70,5
106,95,99,18
107,81,90,9
108,55,60,4
109,89,80,14
110,72,88,7
`;

const DataExperiments: React.FC = () => {
    const [data, setData] = useState(sampleData);
    const [result, setResult] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const addToast = useAppStore(s => s.addToast);

    const handleAnalyze = async () => {
        if (!data.trim()) {
            addToast({ message: 'Please enter some data to analyze.', type: 'error' });
            return;
        }
        setIsLoading(true);
        setResult(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Act as a data scientist. Analyze the following CSV data and provide a brief summary of any patterns, anomalies, or interesting correlations you find. Present your findings in a clear, readable format with bullet points.

            Data:
            ${data}
            `;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setResult(response.text);
        } catch (e) {
            console.error(e);
            addToast({ message: 'Failed to analyze data. Please check your API key.', type: 'error' });
            setResult('Error: Could not analyze data. Please check your input and try again.');
        }
        setIsLoading(false);
    };

    return (
        <div className="h-full flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-brand-text">Data Experiments</h1>
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
                <div className="flex flex-col gap-2">
                    <label className="font-semibold text-brand-text">Paste Raw Data (CSV format)</label>
                    <textarea 
                        value={data}
                        onChange={(e) => setData(e.target.value)}
                        className="w-full flex-1 p-2 border border-brand-border rounded-md font-mono text-sm bg-brand-surface"
                        aria-label="Raw CSV data input"
                    />
                     <button 
                        onClick={handleAnalyze}
                        disabled={isLoading}
                        className="px-4 py-2 bg-brand-primary text-white rounded-md flex items-center justify-center gap-2 disabled:bg-brand-text-alt"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />} Detect Patterns with AI
                    </button>
                </div>
                 <div className="p-4 bg-gray-800 rounded-lg text-white flex flex-col">
                    <h3 className="text-sm font-semibold text-gray-400 mb-2 flex items-center gap-2"><TestTube className="w-5 h-5"/> AI Analysis</h3>
                    <div className="flex-1 overflow-y-auto pr-2">
                        {isLoading && <div className="text-gray-400">Analyzing data... This may take a moment.</div>}
                        {result && <pre className="text-green-300 text-sm whitespace-pre-wrap font-sans">{result}</pre>}
                        {!result && !isLoading && <div className="text-gray-500">Analysis results will appear here.</div>}
                    </div>
                 </div>
            </div>
        </div>
    );
};

export default DataExperiments;
