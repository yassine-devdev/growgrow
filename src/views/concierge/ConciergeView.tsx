import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import EmptyState from '../EmptyState';

// Lazy load chat and new tools
const ChatInterface = lazy(() => import('./ChatInterface'));
const LogAnalyzer = lazy(() => import('./tools/LogAnalyzer'));
const BusinessHelp = lazy(() => import('./tools/BusinessHelp'));

const LoadingSpinner = () => <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-brand-primary" /></div>;

/**
 * The router component for the Concierge module.
 * It determines which specific AI tool or chat interface to render based on the URL.
 * This is now the production-ready version for the Provider, offering multiple tools.
 */
const ConciergeRouter: React.FC = () => {
    const { l1_id, l2_id } = useParams();

    // The main chat interfaces
    if (l1_id === 'chat') {
        // We can differentiate chats later if needed based on l2_id
        return <ChatInterface />;
    }
    
    // Technical Help tools
    if (l1_id === 'technical-help') {
        switch(l2_id) {
            case 'log-analyzer': return <LogAnalyzer />;
            // Add cases for 'debug-assistant', 'issue-diagnosis' etc. here
            default: return <EmptyState message={`The '${l2_id}' technical tool is coming soon.`} />;
        }
    }

    // Business Help tools
    if (l1_id === 'business-help') {
         switch(l2_id) {
            case 'market-research': return <BusinessHelp />;
            // Add cases for 'marketing-planner', 'sales-strategy' etc. here
            default: return <EmptyState message={`The '${l2_id}' business tool is coming soon.`} />;
        }
    }
    
    // Fallback for other sections
    return <EmptyState message={`The '${l1_id}' AI module is under construction.`} />;
};


const ConciergeView: React.FC = () => {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <Routes>
                {/* Default route for the concierge module, redirects to general chat */}
                <Route index element={<Navigate to="chat/general-chat" replace />} />
                
                {/* The router now handles all combinations of l1 and l2 ids */}
                <Route path=":l1_id/:l2_id/*" element={<ConciergeRouter />} />
                <Route path="*" element={<EmptyState message="AI tool not found." />} />
            </Routes>
        </Suspense>
    );
};

export default ConciergeView;
