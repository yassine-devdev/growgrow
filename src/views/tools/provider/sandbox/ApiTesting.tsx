import React, { useState } from 'react';
import { Loader2, Wand2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const MarketingSimulator: React.FC = () => {
    const [budget, setBudget] = useState('5000');
    const [audience, setAudience] = useState('High School Students');
    const [goal, setGoal] = useState('Drive sign-ups for a new coding course.');
    const [response, setResponse] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSendRequest = async () => {
        setIsLoading(true);
        setResponse(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Act as a marketing analyst. Simulate the expected outcome of a marketing campaign with the following parameters. Budget: $${budget}, Target Audience: "${audience}", Goal: "${goal}". Provide a brief summary including expected reach, engagement rate, and number of conversions. Also list potential risks.`;
            const result = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setResponse(result.text);
        } catch (e) {
            console.error(e);
            setResponse('Error: Could not run simulation. Please check your API key and try again.');
        }
        setIsLoading(false);
    };

    return (
        <div className="h-full flex flex-col gap-6">
            <h2 className="text-xl font-bold">Marketing Campaign Simulator</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
                {/* Request Panel */}
                <div className="bg-brand-surface-alt p-4 rounded-lg flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-brand-text-alt mb-1">Budget ($)</label>
                         <input 
                            type="number" 
                            value={budget} 
                            onChange={(e) => setBudget(e.target.value)}
                            className="w-full bg-brand-surface border border-brand-border rounded-lg p-2"
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-brand-text-alt mb-1">Target Audience</label>
                         <input 
                            type="text" 
                            value={audience} 
                            onChange={(e) => setAudience(e.target.value)}
                            className="w-full bg-brand-surface border border-brand-border rounded-lg p-2"
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-brand-text-alt mb-1">Campaign Goal</label>
                        <textarea 
                            value={goal} 
                            onChange={(e) => setGoal(e.target.value)}
                            className="w-full h-24 bg-brand-surface border border-brand-border rounded-lg p-2"
                        />
                    </div>
                     <button 
                        onClick={handleSendRequest}
                        disabled={isLoading}
                        className="mt-auto w-full py-2 bg-brand-primary text-white rounded-lg flex items-center justify-center disabled:bg-brand-text-alt"
                     >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin"/> : <><Wand2 className="w-5 h-5 mr-2"/> Run AI Simulation</>}
                     </button>
                </div>
                {/* Response Panel */}
                <div className="bg-gray-800 p-4 rounded-lg flex flex-col">
                     <h3 className="text-sm font-semibold text-gray-400 mb-2">AI Simulation Results</h3>
                     <div className="flex-1 overflow-auto">
                        {isLoading && <div className="text-gray-400">Running multiverse simulations...</div>}
                        {response && <pre className="text-green-300 text-sm whitespace-pre-wrap">{response}</pre>}
                     </div>
                </div>
            </div>
        </div>
    );
};

export default MarketingSimulator;