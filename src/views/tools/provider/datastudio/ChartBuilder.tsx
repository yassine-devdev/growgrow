import React, { useState, useEffect } from 'react';
import { BarChart2, PieChart, LineChart, Table, Users, DollarSign, UserCheck, CheckCircle, Wand2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const dataSources = [
    { id: 'users', name: 'Users', icon: Users, description: 'Data about all users across tenants.' },
    { id: 'billing', name: 'Billing', icon: DollarSign, description: 'Subscription and revenue data.' },
    { id: 'engagement', name: 'Engagement', icon: UserCheck, description: 'Active user and session metrics.' }
];

const chartTypes = [
    { id: 'bar', name: 'Bar Chart', icon: BarChart2 },
    { id: 'line', name: 'Line Chart', icon: LineChart },
    { id: 'pie', name: 'Pie Chart', icon: PieChart },
    { id: 'table', name: 'Data Table', icon: Table },
];

const DashboardBuilderView: React.FC = () => {
    const location = useLocation();
    const initialConfig = location.state?.initialConfig;

    const [step, setStep] = useState(1);
    const [selectedSource, setSelectedSource] = useState<string | null>(null);
    const [selectedChart, setSelectedChart] = useState<string | null>(null);
    const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);

    useEffect(() => {
        if (initialConfig) {
            setSelectedSource(initialConfig.source);
            setSelectedChart(initialConfig.chart);
            setStep(3);
        }
    }, [initialConfig]);

    const handleReset = () => {
        setStep(1);
        setSelectedSource(null);
        setSelectedChart(null);
        setAiSuggestion(null);
    };

    const handleGetSuggestion = () => {
        if (!selectedSource) return;
        // Simple mock logic for AI suggestion
        if (selectedSource === 'users') setAiSuggestion('pie'); // Good for categorical data
        else if (selectedSource === 'billing' || selectedSource === 'engagement') setAiSuggestion('line'); // Good for time-series data
        else setAiSuggestion('bar');
    };

    return (
        <div className="h-full flex flex-col gap-4">
             <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold text-brand-text">Dashboard Builder</h1>
                <button onClick={handleReset} className="text-sm text-brand-primary hover:underline">Start Over</button>
            </div>
            
            <div className="flex-1 grid grid-cols-3 gap-6">
                {/* Step 1: Data Source */}
                <div className={`p-4 rounded-lg border-2 ${step === 1 ? 'border-brand-primary bg-brand-primary/5' : 'border-brand-border bg-brand-surface'}`}>
                    <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${step >= 1 ? 'bg-brand-primary text-white' : 'bg-brand-border text-brand-text-alt'}`}>1</span>
                        Select Data Source
                    </h2>
                    <div className="space-y-2">
                        {dataSources.map(source => (
                            <button 
                                key={source.id} 
                                onClick={() => { setSelectedSource(source.id); setStep(2); setAiSuggestion(null); }}
                                disabled={step !== 1 && selectedSource !== source.id}
                                className={`w-full p-3 rounded-md text-left border ${selectedSource === source.id ? 'border-brand-primary bg-white ring-2 ring-brand-primary' : 'border-brand-border bg-white hover:border-brand-primary/50'} disabled:opacity-50 disabled:hover:border-brand-border`}
                            >
                               <div className="flex items-center gap-3">
                                    <source.icon className="w-6 h-6 text-brand-primary" />
                                    <div>
                                        <p className="font-semibold">{source.name}</p>
                                        <p className="text-xs text-brand-text-alt">{source.description}</p>
                                    </div>
                               </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Step 2: Visualization */}
                <div className={`p-4 rounded-lg border-2 ${step === 2 ? 'border-brand-primary bg-brand-primary/5' : 'border-brand-border bg-brand-surface'}`}>
                     <div className="flex justify-between items-center mb-4">
                        <h2 className="font-bold text-lg flex items-center gap-2">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${step >= 2 ? 'bg-brand-primary text-white' : 'bg-brand-border text-brand-text-alt'}`}>2</span>
                            Choose Visualization
                        </h2>
                        <button onClick={handleGetSuggestion} disabled={step !== 2} className="text-xs px-2 py-1 bg-brand-primary/10 text-brand-primary rounded-md flex items-center gap-1 disabled:opacity-50">
                            <Wand2 className="w-3 h-3"/> AI Suggestion
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                         {chartTypes.map(chart => (
                            <button 
                                key={chart.id} 
                                onClick={() => { setSelectedChart(chart.id); setStep(3); }}
                                disabled={step !== 2 && selectedChart !== chart.id}
                                className={`relative flex flex-col items-center justify-center p-4 rounded-md border ${selectedChart === chart.id ? 'border-brand-primary bg-white ring-2 ring-brand-primary' : 'border-brand-border bg-white hover:border-brand-primary/50'} disabled:opacity-50 disabled:hover:border-brand-border transition-all duration-300 ${aiSuggestion === chart.id ? 'shadow-glow border-brand-primary' : ''}`}
                            >
                                {aiSuggestion === chart.id && <span className="absolute top-1 right-1 text-[10px] bg-brand-primary text-white px-1.5 py-0.5 rounded-full">Suggested</span>}
                                <chart.icon className="w-8 h-8 text-brand-primary mb-2" />
                                <span className="text-sm font-semibold">{chart.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
                
                {/* Step 3: Generate */}
                <div className={`p-4 rounded-lg border-2 ${step === 3 ? 'border-brand-primary bg-brand-primary/5' : 'border-brand-border bg-brand-surface'}`}>
                    <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${step >= 3 ? 'bg-brand-primary text-white' : 'bg-brand-border text-brand-text-alt'}`}>3</span>
                        Generate Report
                    </h2>
                     {step === 3 ? (
                        <div className="text-center flex flex-col items-center justify-center h-full">
                            <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
                            <p className="font-semibold">Ready to Generate</p>
                            <p className="text-sm text-brand-text-alt mb-4">
                                Generating a {chartTypes.find(c=>c.id === selectedChart)?.name} report from {dataSources.find(s=>s.id === selectedSource)?.name} data.
                            </p>
                            <button className="w-full py-2 bg-brand-primary text-white rounded-lg">Generate</button>
                        </div>
                    ) : (
                        <div className="text-center text-sm text-brand-text-alt pt-10">
                            Complete previous steps.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardBuilderView;