import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import KeywordExplorer from './KeywordExplorer';
import EmailSubjects from './EmailSubjects';
import AdCopyGenerator from './AdCopyGenerator';
import CompetitorInsights from './CompetitorInsights';
import CampaignSimulator from './CampaignSimulator';
import type { MarketingProjectData } from '@/api/schemas/appModulesSchemas';

const MarketingProjectWorkspace: React.FC = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('keywords');
    const [projectData, setProjectData] = useState<MarketingProjectData>({
        keywords: [],
        emailSubjects: [],
        adCopy: [],
        competitorInsights: '',
        campaignSimulator: { keywords: '', emailSubject: '', adCopy: '', budget: 5000 },
    });

    const handleDataChange = (key: keyof MarketingProjectData, data: any) => {
        setProjectData(prev => ({ ...prev, [key]: data }));
    };

    const tabs = [
        { id: 'keywords', label: 'Keyword Explorer' },
        { id: 'email', label: 'Email Subjects' },
        { id: 'ad-copy', label: 'Ad Copy' },
        { id: 'competitor', label: 'Competitor Insights' },
        { id: 'simulator', label: 'Campaign Simulator' },
    ];

    return (
        <div className="flex flex-col h-full gap-4">
            <div className="border-b border-brand-border flex-shrink-0">
                <nav className="flex space-x-4">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`py-2 px-3 text-sm font-semibold ${activeTab === tab.id ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-brand-text-alt hover:text-brand-text'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>
            <div className="flex-1 overflow-y-auto pr-2">
                {activeTab === 'keywords' && <KeywordExplorer data={projectData.keywords} onDataChange={(data) => handleDataChange('keywords', data)} onSimulatorUpdate={(simData) => setProjectData(p => ({...p, campaignSimulator: {...p.campaignSimulator, ...simData}}))} />}
                {activeTab === 'email' && <EmailSubjects data={projectData.emailSubjects} onDataChange={(data) => handleDataChange('emailSubjects', data)} />}
                {activeTab === 'ad-copy' && <AdCopyGenerator data={projectData.adCopy} onDataChange={(data) => handleDataChange('adCopy', data)} />}
                {activeTab === 'competitor' && <CompetitorInsights data={projectData.competitorInsights} onDataChange={(data) => handleDataChange('competitorInsights', data)} />}
                {activeTab === 'simulator' && <CampaignSimulator projectData={projectData} onDataChange={(data) => handleDataChange('campaignSimulator', data)} />}
            </div>
        </div>
    );
};

export default MarketingProjectWorkspace;