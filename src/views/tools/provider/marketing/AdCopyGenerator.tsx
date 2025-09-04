import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Loader2, Wand2 } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

type AdCopy = { world: string; copy: { headline: string; cta: string } };

interface AdCopyGeneratorProps {
    data: AdCopy[];
    onDataChange: (data: AdCopy[]) => void;
}

const AdCopyGenerator: React.FC<AdCopyGeneratorProps> = ({ data, onDataChange }) => {
    const addToast = useAppStore(s => s.addToast);
    const [isLoading, setIsLoading] = useState(false);
    const [product, setProduct] = useState('');
    const [objective, setObjective] = useState('');

    const handleGenerate = async () => {
        if (!product || !objective) {
            addToast({ message: 'Please provide both product and objective.', type: 'error' });
            return;
        }
        setIsLoading(true);
        const worlds = ['Emotional', 'Benefit-driven', 'Urgency'];
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        try {
            const promises = worlds.map(world => 
                ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: `Generate one ad copy for a product/service: "${product}". The campaign objective is: "${objective}". The ad angle should be ${world}. Return only a single valid JSON object with "headline" and "cta" keys.`
                }).then(res => {
                    const resultText = res.text.replace(/```json|```/g, '').trim();
                    return { world, copy: JSON.parse(resultText) };
                })
            );
            const responses = await Promise.all(promises);
            onDataChange(responses);
        } catch (e) {
            console.error(e);
            addToast({ message: 'Failed to generate ad copy.', type: 'error' });
        }
        setIsLoading(false);
    };
    
    const handleCopyChange = (index: number, field: 'headline' | 'cta', value: string) => {
        const newData = [...data];
        newData[index].copy[field] = value;
        onDataChange(newData);
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
                <input type="text" value={product} onChange={e => setProduct(e.target.value)} placeholder="Product/Service (e.g., 'Online Math Course')" className="p-2 border rounded-md" />
                <input type="text" value={objective} onChange={e => setObjective(e.target.value)} placeholder="Campaign Objective (e.g., 'Get signups')" className="p-2 border rounded-md" />
            </div>
            <button onClick={handleGenerate} disabled={isLoading} className="w-full px-4 py-2 bg-brand-primary text-white rounded-md flex items-center justify-center gap-2 disabled:bg-gray-400">
                {isLoading ? <Loader2 className="animate-spin" /> : <Wand2 />} Generate Ad Copy
            </button>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {data.map((res, index) => (
                    <div key={res.world} className="p-4 border rounded-lg bg-brand-surface">
                        <h3 className="font-bold mb-2">{res.world} Angle</h3>
                        <div className="space-y-2 text-sm">
                            <label className="font-semibold">Headline:</label>
                            <textarea value={res.copy.headline} onChange={(e) => handleCopyChange(index, 'headline', e.target.value)} className="w-full p-1 bg-brand-surface-alt rounded-md h-20"/>
                             <label className="font-semibold">CTA:</label>
                             <input type="text" value={res.copy.cta} onChange={(e) => handleCopyChange(index, 'cta', e.target.value)} className="w-full p-1 bg-brand-surface-alt rounded-md"/>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdCopyGenerator;