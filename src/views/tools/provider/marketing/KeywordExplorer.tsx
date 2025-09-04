import React, { useState, useMemo, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Loader2, Wand2, Plus, Trash2, ArrowDown, ArrowUp, Upload, Download } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

interface Keyword {
    text: string;
    trend: number;
    intent: string;
}

interface KeywordExplorerProps {
    data: Keyword[];
    onDataChange: (data: Keyword[]) => void;
    onSimulatorUpdate: (data: { keywords: string }) => void;
}

type SortableKeywordKeys = keyof Keyword;

const KeywordExplorer: React.FC<KeywordExplorerProps> = ({ data, onDataChange, onSimulatorUpdate }) => {
    const addToast = useAppStore(s => s.addToast);
    const [isLoading, setIsLoading] = useState(false);
    const [seed, setSeed] = useState('');
    const [competitorUrls, setCompetitorUrls] = useState('');
    const [manualKeyword, setManualKeyword] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: SortableKeywordKeys; direction: 'ascending' | 'descending' } | null>({ key: 'trend', direction: 'descending' });
    
    useEffect(() => {
        const keywordsString = data.map(k => k.text).join(', ');
        onSimulatorUpdate({ keywords: keywordsString });
    }, [data, onSimulatorUpdate]);

    const sortedKeywords = useMemo(() => {
        let sortableItems = [...data];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [data, sortConfig]);

    const requestSort = (key: SortableKeywordKeys) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const handleKeywordChange = (index: number, field: keyof Keyword, value: string | number) => {
        const newKeywords = [...data];
        const originalIndex = data.findIndex(k => k.text === sortedKeywords[index].text);
        if (originalIndex > -1) {
            newKeywords[originalIndex] = { ...newKeywords[originalIndex], [field]: value };
            onDataChange(newKeywords);
        }
    };
    
    const handleGenerate = async () => {
        if (!seed) { addToast({ message: 'Please enter at least one seed keyword.', type: 'error' }); return; }
        setIsLoading(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Act as an SEO expert. Given the seed keyword(s) "${seed}" and competitor URLs "${competitorUrls}", generate a list of 15 related keywords. For each, provide a user search intent (Informational, Navigational, Transactional, Commercial) and an estimated trend score from 0-100 representing its popularity and relevance. Format as a JSON array of objects with "keyword", "intent", and "trend" keys.`;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            const resultText = response.text.replace(/```json|```/g, '').trim();
            const result = JSON.parse(resultText);
            const newKeywords = result.map((item: any) => ({ text: item.keyword, intent: item.intent, trend: Number(item.trend) || 0, }));
            onDataChange([...data, ...newKeywords]);
        } catch (e) {
            addToast({ message: 'Failed to generate keywords.', type: 'error' });
        }
        setIsLoading(false);
    };

    const handleAddManual = () => {
        if (manualKeyword && !data.some(k => k.text === manualKeyword)) {
            onDataChange([...data, { text: manualKeyword, trend: 50, intent: 'Manual' }]);
            setManualKeyword('');
        }
    };
    
    const handleExport = () => {
        const header = "text,trend,intent\n";
        const csv = data.map(k => `"${k.text.replace(/"/g, '""')}",${k.trend},${k.intent}`).join("\n");
        const blob = new Blob([header + csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "keywords.csv";
        link.click();
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            const lines = text.split('\n').slice(1); // Skip header
            const importedKeywords: Keyword[] = lines.map(line => {
                const [text, trend, intent] = line.split(',');
                return { text: text?.trim(), trend: parseInt(trend, 10) || 0, intent: intent?.trim() || 'Imported' };
            }).filter(k => k.text);
            onDataChange([...data, ...importedKeywords]);
            addToast({ message: `${importedKeywords.length} keywords imported.`, type: 'success' });
        };
        reader.readAsText(file);
        event.target.value = ''; // Reset file input
    };

    const SortableHeader: React.FC<{ sortKey: SortableKeywordKeys; children: React.ReactNode }> = ({ sortKey, children }) => {
        const isSorted = sortConfig?.key === sortKey;
        const Icon = isSorted ? (sortConfig?.direction === 'ascending' ? ArrowUp : ArrowDown) : null;
        return (
            <th className="p-2"><button onClick={() => requestSort(sortKey)} className="flex items-center gap-1 font-semibold">{children} {Icon && <Icon className="w-4 h-4" />}</button></th>
        );
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" value={seed} onChange={e => setSeed(e.target.value)} placeholder="Enter seed keywords..." className="p-2 border rounded-md w-full" />
                <textarea value={competitorUrls} onChange={e => setCompetitorUrls(e.target.value)} placeholder="Enter competitor URLs (optional, one per line)..." className="p-2 border rounded-md w-full h-20 md:h-auto" />
            </div>
            <button onClick={handleGenerate} disabled={isLoading} className="w-full px-4 py-2 bg-brand-primary text-white rounded-md flex items-center justify-center gap-2 disabled:bg-gray-400">
                {isLoading ? <Loader2 className="animate-spin" /> : <Wand2 />} Generate AI Suggestions
            </button>
            <div className="p-4 border rounded-lg bg-brand-surface">
                 <div className="flex flex-wrap gap-2 mb-4">
                     <input type="text" value={manualKeyword} onChange={e => setManualKeyword(e.target.value)} placeholder="Add keyword manually..." className="flex-1 p-2 border rounded-md" />
                     <button onClick={handleAddManual} className="px-4 py-2 bg-gray-200 text-black rounded-md flex items-center gap-2"><Plus /> Add</button>
                     <input type="file" id="csv-import" className="hidden" accept=".csv" onChange={handleImport} />
                     <label htmlFor="csv-import" className="cursor-pointer px-4 py-2 bg-gray-200 text-black rounded-md flex items-center gap-2"><Upload /> Import CSV</label>
                     <button onClick={handleExport} disabled={data.length === 0} className="px-4 py-2 bg-gray-200 text-black rounded-md flex items-center gap-2 disabled:opacity-50"><Download /> Export CSV</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead><tr className="text-left text-gray-500 bg-brand-surface-alt"><SortableHeader sortKey="text">Keyword</SortableHeader><SortableHeader sortKey="trend">Trend Score</SortableHeader><SortableHeader sortKey="intent">Intent</SortableHeader><th className="p-2 font-semibold">Actions</th></tr></thead>
                        <tbody>
                            {sortedKeywords.map((kw, i) => (
                                <tr key={kw.text} className="border-t hover:bg-brand-surface-alt/50">
                                    <td className="p-1"><input type="text" value={kw.text} onChange={(e) => handleKeywordChange(i, 'text', e.target.value)} className="w-full bg-transparent p-1 rounded focus:bg-white focus:ring-1 focus:ring-brand-primary"/></td>
                                    <td className="p-1"><input type="number" value={kw.trend} onChange={(e) => handleKeywordChange(i, 'trend', parseInt(e.target.value, 10))} className="w-20 bg-transparent p-1 rounded focus:bg-white focus:ring-1 focus:ring-brand-primary"/></td>
                                    <td className="p-1"><input type="text" value={kw.intent} onChange={(e) => handleKeywordChange(i, 'intent', e.target.value)} className="w-full bg-transparent p-1 rounded focus:bg-white focus:ring-1 focus:ring-brand-primary"/></td>
                                    <td className="p-1"><button onClick={() => onDataChange(data.filter(k => k.text !== kw.text))} className="p-2 hover:bg-red-100 rounded-full"><Trash2 className="w-4 h-4 text-red-500"/></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default KeywordExplorer;