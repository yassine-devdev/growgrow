import React, { useState } from 'react';
import { Loader2, Wand2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const ForecastingTool = () => {
    const [scenario, setScenario] = useState('Default growth trajectory');
    const [forecast, setForecast] = useState<any[] | null>(null);
    const [isForecasting, setIsForecasting] = useState(false);

    const handleRunForecast = async () => {
        setIsForecasting(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Act as a financial analyst. Given the following scenario for a SaaS company: "${scenario}", generate a projected quarterly revenue forecast for the next 4 quarters. Start from a baseline of $125,630 MRR, which translates to $376,890 quarterly revenue. Return only a valid JSON array of objects with "quarter" (e.g., "Q1 2025") and "projectedRevenue" keys.`;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            const resultText = response.text.replace(/```json|```/g, '').trim();
            const result = JSON.parse(resultText);
            setForecast(result);
        } catch (e) {
            console.error(e);
            // Sample data on failure
            setForecast([
                { quarter: "Q1 2025", projectedRevenue: 410000 },
                { quarter: "Q2 2025", projectedRevenue: 450000 },
                { quarter: "Q3 2025", projectedRevenue: 490000 },
                { quarter: "Q4 2025", projectedRevenue: 540000 },
            ]);
        }
        setIsForecasting(false);
    };

    return (
        <div className="space-y-4">
             <h1 className="text-xl font-bold text-brand-text">AI Forecasting Tool</h1>
            <div>
                <label className="block text-sm font-medium text-brand-text-alt mb-1">Forecasting Scenario (Editable)</label>
                <textarea 
                    value={scenario} 
                    onChange={e => setScenario(e.target.value)}
                    placeholder="Describe a scenario, e.g., 'Aggressive marketing spend in Q2, launch new feature in Q3'"
                    className="w-full h-24 p-2 border rounded-md"
                />
            </div>
            <button onClick={handleRunForecast} disabled={isForecasting} className="px-4 py-2 bg-brand-primary text-white rounded-md flex items-center gap-2 disabled:bg-gray-400">
                {isForecasting ? <Loader2 className="animate-spin" /> : <Wand2 />} Run AI Forecast
            </button>
            {forecast && (
                <div className="p-4 bg-brand-surface rounded-lg border border-brand-border h-96">
                    <h3 className="font-bold mb-4">Projected Quarterly Revenue</h3>
                    <ResponsiveContainer width="100%" height="90%">
                        <BarChart data={forecast}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="quarter" />
                            <YAxis tickFormatter={(value) => `$${(value / 1000)}k`} />
                            <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                            <Bar dataKey="projectedRevenue" fill="#82ca9d" name="Projected Revenue" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
};

export default ForecastingTool;