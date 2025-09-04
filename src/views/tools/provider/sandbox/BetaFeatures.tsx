import React, { useState } from 'react';
import { Loader2, Wand2, Scale } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const ABTestingWorkspace: React.FC = () => {
    const [variationA, setVariationA] = useState('Headline: "Learn to Code in 30 Days"\nCTA: "Sign Up Now"');
    const [variationB, setVariationB] = useState('Headline: "Master Python with Our New Course"\nCTA: "Start Your Free Trial"');
    const [goal, setGoal] = useState('Maximize click-through rate for a new coding course ad.');
    const [prediction, setPrediction] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handlePredict = async () => {
        setIsLoading(true);
        setPrediction(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Act as a conversion rate optimization expert. Given two variations for an A/B test and a goal, predict which variation is more likely to win and explain why in a few sentences.
            
            Goal: "${goal}"

            Variation A:
            ${variationA}

            Variation B:
            ${variationB}
            `;
            const result = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setPrediction(result.text);
        } catch (e) {
            console.error(e);
            setPrediction('Error: Could not get a prediction. Please check your API key and try again.');
        }
        setIsLoading(false);
    };

    return (
        <div className="h-full flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-brand-text">A/B Testing Workspace</h1>
            <div className="p-4 bg-brand-surface-alt rounded-lg">
                <label className="block text-sm font-medium text-brand-text-alt mb-1">Primary Goal of the Test</label>
                <input 
                    type="text" 
                    value={goal} 
                    onChange={(e) => setGoal(e.target.value)}
                    className="w-full bg-brand-surface border border-brand-border rounded-lg p-2"
                />
            </div>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h3 className="font-bold mb-2">Variation A</h3>
                    <textarea 
                        value={variationA}
                        onChange={(e) => setVariationA(e.target.value)}
                        className="w-full h-40 p-2 border rounded-md"
                    />
                </div>
                 <div>
                    <h3 className="font-bold mb-2">Variation B</h3>
                    <textarea 
                        value={variationB}
                        onChange={(e) => setVariationB(e.target.value)}
                        className="w-full h-40 p-2 border rounded-md"
                    />
                </div>
            </div>
            <div className="text-center">
                <button 
                    onClick={handlePredict}
                    disabled={isLoading}
                    className="px-6 py-3 bg-brand-primary text-white rounded-lg flex items-center gap-2 disabled:bg-gray-400 mx-auto"
                >
                    {isLoading ? <Loader2 className="animate-spin" /> : <Wand2 />} AI Predict Winner
                </button>
            </div>
            {prediction && (
                <div className="p-4 bg-blue-50 border-2 border-dashed border-blue-200 rounded-lg">
                    <h3 className="font-bold text-blue-800 flex items-center gap-2"><Scale /> AI Prediction:</h3>
                    <p className="text-sm text-blue-700 mt-2 whitespace-pre-wrap">{prediction}</p>
                </div>
            )}
        </div>
    );
};

export default ABTestingWorkspace;