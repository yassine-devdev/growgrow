import React, { useState } from 'react';
import { z } from 'zod';
import { getProServices } from '../../../api/appModulesApi';
import * as schemas from '../../../api/schemas/appModulesSchemas';
import { Loader2, Search, Briefcase, Check } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

type ProService = z.infer<typeof schemas.proServiceSchema>;

const ServicesOverlay: React.FC = () => {
    const { data: services, isLoading } = useQuery<ProService[]>({
        queryKey: ['proServices'],
        queryFn: getProServices,
    });
    const [requestedQuotes, setRequestedQuotes] = useState<string[]>([]);

    const handleRequestQuote = (serviceId: string) => {
        if (!requestedQuotes.includes(serviceId)) {
            setRequestedQuotes(prev => [...prev, serviceId]);
        }
    };

    if (isLoading) {
        return <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-brand-primary" /></div>;
    }

    return (
        <div className="w-full h-full flex flex-col gap-4">
            <h2 className="text-xl font-bold text-brand-text">Professional Services</h2>
            <div className="relative">
                <input type="text" placeholder="Search for services like 'legal', 'marketing'..." className="w-full p-3 pl-10 border border-brand-border rounded-lg" />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-alt" />
            </div>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services?.map(service => {
                    const isRequested = requestedQuotes.includes(service.id);
                    return (
                    <div key={service.id} className="bg-brand-surface border border-brand-border rounded-lg p-4 flex flex-col items-center text-center">
                        <Briefcase className="w-10 h-10 text-brand-primary mb-3" />
                        <h3 className="font-bold">{service.name}</h3>
                        <button 
                            onClick={() => handleRequestQuote(service.id)}
                            disabled={isRequested}
                            className="mt-auto w-full py-2 bg-brand-primary text-white rounded-lg mt-4 disabled:bg-green-500 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
                        >
                             {isRequested ? (
                                <>
                                    <Check className="w-4 h-4" />
                                    Quote Requested
                                </>
                            ) : (
                                'Request Quote'
                            )}
                        </button>
                    </div>
                )})}
            </div>
        </div>
    );
};

export default ServicesOverlay;