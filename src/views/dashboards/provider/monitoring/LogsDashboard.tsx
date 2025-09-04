import React, { useEffect, useRef } from 'react';
import { getLiveLogs } from '@/api/providerApi';
import { Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useVirtualizer } from '@tanstack/react-virtual';

/**
 * Renders the 'Live Logs' dashboard for the Provider role.
 * It displays a stream of system logs, using `@tanstack/react-virtual`
 * to efficiently render a potentially large number of log entries.
 *
 * @returns {JSX.Element} The rendered logs dashboard.
 */
const LogsDashboard: React.FC = () => {
    const { data: logs, isLoading } = useQuery({
        queryKey: ['liveLogs'],
        queryFn: getLiveLogs,
        initialData: [],
    });
    const parentRef = useRef<HTMLDivElement>(null);

    const rowVirtualizer = useVirtualizer({
        count: logs.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 18, // Estimated height of a single log line
        overscan: 10,
    });

    useEffect(() => {
        if (logs.length > 0) {
            rowVirtualizer.scrollToIndex(logs.length - 1);
        }
    }, [logs, rowVirtualizer]);

    if (isLoading) {
        return <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-brand-primary" /></div>;
    }

    /**
     * Determines the CSS color class for a log entry based on its content.
     * @param {string} log - The log message string.
     * @returns {string} The Tailwind CSS text color class.
     */
    const getLogColor = (log: string) => {
        if (log.includes('[ERROR]')) return 'text-red-400';
        if (log.includes('[WARN]')) return 'text-yellow-400';
        if (log.includes('[DEBUG]')) return 'text-blue-400';
        if (log.includes('[INFO]')) return 'text-green-400';
        return 'text-gray-400';
    };

    return (
        <div className="h-full flex flex-col gap-4">
            <h2 className="text-xl font-bold text-brand-text">Live Log Stream</h2>
            <div ref={parentRef} className="flex-1 bg-gray-900 font-mono text-xs rounded-lg p-4 overflow-y-auto">
                <div
                    style={{
                        height: `${rowVirtualizer.getTotalSize()}px`,
                        width: '100%',
                        position: 'relative',
                    }}
                >
                    {rowVirtualizer.getVirtualItems().map((virtualItem) => {
                        const log = logs[virtualItem.index];
                        return (
                            <div
                                key={virtualItem.key}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: `${virtualItem.size}px`,
                                    transform: `translateY(${virtualItem.start}px)`,
                                    display: 'flex',
                                }}
                            >
                                <span className="text-gray-600 mr-4 shrink-0">{`>`}</span>
                                <p className={`${getLogColor(log)} whitespace-pre-wrap`}>{log}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default LogsDashboard;
