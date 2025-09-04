import React, { useEffect, useRef } from 'react';
import { getSystemLogs } from '@/api/appModulesApi';
import { Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/queries';

const SystemLogsView: React.FC = () => {
    const { data: logs, isLoading } = useQuery({
        queryKey: QUERY_KEYS.systemLogs,
        queryFn: getSystemLogs,
        initialData: [],
    });
    const logsEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);
    
    const getLogColor = (log: string) => {
        if (log.includes('[ERROR]')) return 'text-red-400';
        if (log.includes('[WARN]')) return 'text-yellow-400';
        return 'text-gray-400';
    };

    return (
        <div className="h-full flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-brand-text">System Logs</h1>
            <div className="flex-1 bg-gray-900 font-mono text-xs rounded-lg p-4 overflow-y-auto">
                {isLoading ? (
                    <div className="w-full h-full flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
                    </div>
                ) : (
                    <>
                        {logs.map((log, index) => (
                           <p key={index} className={getLogColor(log)}>
                               <span className="text-gray-600 mr-4 select-none">&gt;</span>
                               {log}
                           </p>
                        ))}
                        <div ref={logsEndRef} />
                    </>
                )}
            </div>
        </div>
    );
};

export default SystemLogsView;
