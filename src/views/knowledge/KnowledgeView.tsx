import React, { useState, useMemo } from 'react';
import { getResources } from '../../api/schoolHubApi';
import { Loader2, FileText, Link, Video } from 'lucide-react';
import { Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

const LoadingSpinner = () => <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-brand-primary" /></div>;

const icons = { document: FileText, link: Link, video: Video };

const KnowledgeView: React.FC = () => {
    const { data, isLoading } = useQuery({ queryKey: ['resources'], queryFn: getResources, initialData: [] });
    const [searchTerm, setSearchTerm] = useState('');

    const filteredResources = useMemo(() => {
        if (!data) return [];
        if (!searchTerm.trim()) return data;

        return data.filter(resource =>
            resource.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [data, searchTerm]);


    if (isLoading) return <LoadingSpinner />;

    return (
        <div className="h-full flex flex-col gap-4">
            <h2 className="text-xl font-bold">Resource Library</h2>
             <div className="relative">
                <input 
                    type="text" 
                    placeholder="Search resources by title..." 
                    className="w-full max-w-md bg-brand-surface-alt border border-brand-border rounded-lg p-2 pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-alt"/>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto pr-2">
                {filteredResources.length > 0 ? (
                    filteredResources.map(res => {
                        const Icon = icons[res.type as keyof typeof icons];
                        return (
                            <div key={res.id} className="p-3 bg-brand-surface border border-brand-border rounded-lg flex items-center gap-3">
                                <Icon className="w-5 h-5 text-brand-primary" />
                                <p className="font-semibold">{res.title}</p>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-10 text-brand-text-alt">
                        <p>No resources found for "{searchTerm}".</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default KnowledgeView;