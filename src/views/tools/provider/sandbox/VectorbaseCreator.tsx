import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { GoogleGenAI, Type } from "@google/genai";
import { Loader2, Wand2, BrainCircuit, FileText, Trash2, Scale, Sigma, TextQuote } from 'lucide-react';
import Skeleton from '@/components/ui/Skeleton';
import { useAppStore } from '@/store/useAppStore';

const sampleText = `GROW YouR NEED is a SaaS Super App founded on the conviction that technology should simplify life. It unifies education, media, and e-commerce into one ecosystem. The platform is designed for schools and individuals, offering role-based UIs for teachers, students, and administrators. Our mission is to replace digital chaos with integrated harmony.`;

const ResultSkeleton = () => (
    <div className="space-y-4 animate-pulse">
        <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
        </div>
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-16 w-full" />
    </div>
);

const VectorizationResult = ({ result }: { result: any }) => (
    <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-brand-surface dark:bg-dark-surface rounded-lg border border-brand-border dark:border-dark-border">
                <div className="flex items-center gap-3">
                    <Scale className="w-6 h-6 text-brand-primary" />
                    <div>
                        <p className="text-sm text-brand-text-alt dark:text-dark-text-alt">Chunks Created</p>
                        <p className="text-2xl font-bold text-brand-text dark:text-dark-text">{result.chunksCreated}</p>
                    </div>
                </div>
            </div>
            <div className="p-4 bg-brand-surface dark:bg-dark-surface rounded-lg border border-brand-border dark:border-dark-border">
                <div className="flex items-center gap-3">
                    <Sigma className="w-6 h-6 text-brand-primary" />
                    <div>
                        <p className="text-sm text-brand-text-alt dark:text-dark-text-alt">Vector Dimensions</p>
                        <p className="text-2xl font-bold text-brand-text dark:text-dark-text">{result.vectorDimensions}</p>
                    </div>
                </div>
            </div>
        </div>
        <div>
            <h4 className="font-semibold text-brand-text dark:text-dark-text mb-2 flex items-center gap-2"><TextQuote className="w-4 h-4" /> Sample Chunk</h4>
            <blockquote className="text-sm text-brand-text-alt dark:text-dark-text-alt border-l-4 border-brand-primary pl-4 py-2 bg-brand-surface dark:bg-dark-surface rounded-r-lg">
                "{result.sampleChunk}"
            </blockquote>
        </div>
        <div>
            <h4 className="font-semibold text-brand-text dark:text-dark-text mb-2 flex items-center gap-2"><BrainCircuit className="w-4 h-4" /> Sample Vector (first 5 dimensions)</h4>
            <div className="flex gap-2 p-3 bg-brand-surface dark:bg-dark-surface rounded-lg border border-brand-border dark:border-dark-border">
                {result.sampleVector.map((val: number, index: number) => (
                    <div key={index} className="flex-1 text-center p-2 bg-brand-surface-alt dark:bg-dark-surface-alt rounded">
                        <p className="text-xs text-brand-text-alt dark:text-dark-text-alt">Dim {index + 1}</p>
                        <p className="font-mono font-semibold text-brand-primary">{val.toFixed(4)}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
);


const VectorbaseCreator: React.FC = () => {
    const addToast = useAppStore(s => s.addToast);
    const [sourceText, setSourceText] = useState('');

    const { mutate, data: result, isPending, error, reset } = useMutation({
        mutationFn: async (text: string) => {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Act as a vector database specialist. I will provide you with a block of text. Your task is to simulate the process of vectorizing this text for a knowledge base. Provide a summary of the vectorization process.`;
            const response = await ai.models.generateContent({
                 model: 'gemini-2.5-flash', 
                 contents: prompt,
                 config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            chunksCreated: { type: Type.INTEGER, description: 'Number of chunks the text was split into.' },
                            vectorDimensions: { type: Type.INTEGER, description: 'The dimensionality of the vectors (e.g., 768).' },
                            sampleChunk: { type: Type.STRING, description: 'The text content of the first chunk.' },
                            sampleVector: {
                                type: Type.ARRAY,
                                items: { type: Type.NUMBER },
                                description: 'An array of 5 floating-point numbers representing the first 5 dimensions of the vector for the sample chunk.'
                            }
                        }
                    }
                 }
            });
            const resultJson = JSON.parse(response.text);
            return resultJson;
        },
    });

    const handleCreateVectorBase = () => {
        if (!sourceText.trim()) return;
        mutate(sourceText);
    };
    
    const handleClear = () => {
        setSourceText('');
        reset();
    };

    return (
        <div className="h-full flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-brand-text dark:text-dark-text">AI Vector Base Creator</h1>
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
                <div className="flex flex-col gap-2 bg-brand-surface-alt/50 dark:bg-dark-surface-alt/50 p-4 rounded-lg border border-brand-border dark:border-dark-border">
                    <div className="flex justify-between items-center">
                        <label className="font-semibold text-brand-text dark:text-dark-text">1. Source Text</label>
                        <div className="flex gap-2">
                             <button onClick={() => setSourceText(sampleText)} className="text-xs px-2 py-1 bg-brand-surface dark:bg-dark-surface rounded-md flex items-center gap-1 hover:bg-brand-border dark:hover:bg-dark-border">
                                <FileText className="w-3 h-3"/> Load Sample
                            </button>
                             <button onClick={handleClear} className="text-xs px-2 py-1 bg-brand-surface dark:bg-dark-surface rounded-md flex items-center gap-1 hover:bg-brand-border dark:hover:bg-dark-border">
                                <Trash2 className="w-3 h-3"/> Clear
                            </button>
                        </div>
                    </div>
                    <textarea 
                        value={sourceText}
                        onChange={(e) => setSourceText(e.target.value)}
                        className="w-full flex-1 p-2 border border-brand-border dark:border-dark-border rounded-md font-sans text-sm bg-brand-surface dark:bg-dark-surface text-brand-text dark:text-dark-text focus:ring-brand-primary focus:border-brand-primary"
                        aria-label="Source text for vectorization"
                        placeholder="Paste your knowledge base articles, documentation, or any other text here..."
                    />
                     <button 
                        onClick={handleCreateVectorBase}
                        disabled={isPending || !sourceText.trim()}
                        className="w-full mt-2 py-2 bg-brand-primary text-white rounded-lg flex items-center justify-center gap-2 disabled:bg-brand-text-alt dark:disabled:bg-dark-border disabled:cursor-not-allowed transition-colors"
                     >
                        {isPending ? <Loader2 className="w-5 h-5 animate-spin"/> : <><Wand2 className="w-5 h-5"/> Create Vector Base</>}
                     </button>
                </div>

                 <div className="p-4 bg-brand-surface-alt/50 dark:bg-dark-surface-alt/50 rounded-lg border border-brand-border dark:border-dark-border flex flex-col">
                    <h3 className="text-sm font-semibold text-brand-text dark:text-dark-text mb-2 flex items-center gap-2">
                        <BrainCircuit className="w-5 h-5 text-brand-primary"/> 2. Vectorization Summary
                    </h3>
                    <div className="flex-1 overflow-y-auto pr-2 rounded-md">
                        {isPending && <ResultSkeleton />}
                        {error && <div className="p-4 text-red-500 bg-red-500/10 rounded-md text-sm">{error.message}</div>}
                        {result && <VectorizationResult result={result} />}
                        {!result && !isPending && !error && (
                             <div className="p-4 text-center text-brand-text-alt dark:text-dark-text-alt h-full flex flex-col justify-center items-center">
                                <BrainCircuit className="w-12 h-12 mb-2 text-brand-border dark:text-dark-border" />
                                <p>Results will appear here.</p>
                            </div>
                        )}
                    </div>
                 </div>
            </div>
        </div>
    );
};

export default VectorbaseCreator;