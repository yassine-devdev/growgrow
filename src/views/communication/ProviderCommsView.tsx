import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { getEmails } from '../../api/appModulesApi';
import { Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import type { Email } from '@/api/schemas/appModulesSchemas';
import EmptyState from '../EmptyState';

const LoadingSpinner = () => <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-brand-primary" /></div>;

const TemplatesManager = lazy(() => import('./provider/TemplatesManager'));

const Inbox = () => {
    const { data, isLoading } = useQuery<Email[]>({ queryKey: ['emails'], queryFn: getEmails });
    if (isLoading) return <LoadingSpinner />;
    if (!data) return null;

    return (
        <div className="h-full flex flex-col">
            <h2 className="text-xl font-bold mb-4">Inbox</h2>
            <div className="flex-1 border border-brand-border rounded-lg overflow-hidden">
                <div className="flex-1 overflow-y-auto">
                    {data.map((email) => (
                        <div key={email.id} className={`flex items-center p-3 gap-3 border-b border-brand-border ${!email.read ? 'bg-brand-primary/5' : ''}`}>
                            <div className={`w-2 h-2 rounded-full ${!email.read ? 'bg-brand-primary' : 'bg-transparent'}`} />
                            <div className="flex-1">
                                <p className={`font-semibold ${!email.read ? 'text-brand-text' : 'text-brand-text-alt'}`}>{email.from}</p>
                                <p className="text-sm text-brand-text truncate">{email.subject} - <span className="text-brand-text-alt">{email.snippet}</span></p>
                            </div>
                            <p className="text-xs text-brand-text-alt">{new Date(email.date).toLocaleTimeString()}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const CommsRouter: React.FC = () => {
    const { l1_id, l2_id } = useParams();

    if (l1_id === 'email') {
        switch(l2_id) {
            case 'inbox': return <Inbox />;
            case 'sent': return <EmptyState message="The 'Sent' mail view is coming soon." />;
            case 'compose': return <EmptyState message="The email composer is coming soon." />;
            case 'templates': return <TemplatesManager />;
            default: return <EmptyState message={`The ${l2_id} email view is coming soon.`} />;
        }
    }
    if (l1_id === 'templates') {
         switch(l2_id) {
            case 'email-templates': return <TemplatesManager />;
            case 'notification-templates': return <EmptyState message="The notification template manager is coming soon." />;
            case 'template-library': return <EmptyState message="The template library is coming soon." />;
            default: return <EmptyState message={`The ${l2_id} template manager is coming soon.`} />;
        }
    }
     if (l1_id === 'schedule') {
        return <EmptyState message={`The '${l2_id}' scheduling tool is under development.`} />;
    }
     if (l1_id === 'video-calls-social-media') {
        return <EmptyState message={`The '${l2_id}' tool is under development.`} />;
    }
    
    return <EmptyState message={`The ${l1_id} module is coming soon.`} />;
};

const ProviderCommsView: React.FC = () => {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <Routes>
                <Route index element={<Navigate to="email/inbox" replace />} />
                <Route path=":l1_id/:l2_id/*" element={<CommsRouter />} />
            </Routes>
        </Suspense>
    );
};

export default ProviderCommsView;