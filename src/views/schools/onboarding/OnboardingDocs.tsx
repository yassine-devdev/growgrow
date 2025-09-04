
import React from 'react';
import { getOnboardingDocs } from '@/api/schoolOnboardingApi';
import { Loader2, Check } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { OnboardingDocsData } from '@/api/schemas/schoolOnboardingSchemas';

/**
 * Renders the provider onboarding documentation page.
 * It fetches instructional content from an API and displays it in a structured,
 * easy-to-read format.
 *
 * @returns {JSX.Element} The rendered documentation page.
 */
const OnboardingDocs: React.FC = () => {
    const { data: docs, isLoading } = useQuery<OnboardingDocsData>({
        queryKey: ['onboardingDocs'],
        queryFn: getOnboardingDocs
    });
    
    if (isLoading) {
        return <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-brand-primary" /></div>;
    }

    if (!docs) return null;

    return (
        <div className="max-w-4xl mx-auto prose prose-indigo">
            <h1 className="text-3xl font-bold text-brand-text mb-6">{docs.title}</h1>
            <div className="space-y-8">
                {docs.sections.map((section, index) => (
                    <div key={index} className="p-6 bg-brand-surface-alt/50 border border-brand-border rounded-lg">
                        <h2 className="text-xl font-semibold text-brand-text !mt-0 !mb-4">{section.title}</h2>
                        {section.content && <p className="text-brand-text-alt">{section.content}</p>}
                        {section.code && (
                            <pre className="bg-gray-800 text-white p-4 rounded-md text-sm my-4 overflow-x-auto">
                                <code>{section.code}</code>
                            </pre>
                        )}
                        {section.checklist && (
                            <ul className="mt-4 space-y-2">
                                {section.checklist.map((item, i) => (
                                    <li key={i} className="flex items-start">
                                        <div className="flex-shrink-0 w-6 h-6 bg-green-500/20 text-green-600 rounded-full flex items-center justify-center mr-3" aria-hidden="true">
                                            <Check className="w-4 h-4"/>
                                        </div>
                                        <span className="text-brand-text">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OnboardingDocs;
