import React, { useState, useMemo } from 'react';
import { z } from 'zod';
import { getKnowledgeArticles } from '@/api/appModulesApi';
import * as schemas from '@/api/schemas/appModulesSchemas';
import { Loader2, BookOpen, Search, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

type Article = z.infer<typeof schemas.knowledgeArticleSchema>;

const KnowledgeOverlay: React.FC = () => {
    const { data: articles = [], isLoading } = useQuery<Article[]>({
        queryKey: ['knowledgeArticles'],
        queryFn: getKnowledgeArticles,
    });
    
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('All');

    const categories = useMemo(() => ['All', ...Array.from(new Set(articles.map(a => a.category)))], [articles]);
    
    const filteredArticles = useMemo(() => {
        return articles.filter(article => {
            const categoryMatch = category === 'All' || article.category === category;
            const searchMatch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) || article.snippet.toLowerCase().includes(searchTerm.toLowerCase());
            return categoryMatch && searchMatch;
        });
    }, [articles, category, searchTerm]);

    if (isLoading) {
        return <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-brand-primary" /></div>;
    }

    return (
        <div className="w-full h-full flex flex-col gap-4">
            <h2 className="text-xl font-bold text-brand-text">Knowledge Base</h2>
            
            <div className="flex gap-4">
                <div className="relative flex-1">
                    <input 
                        type="text" 
                        placeholder="Search articles..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 pl-10 border border-brand-border rounded-lg bg-brand-surface"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-alt"/>
                </div>
                <select 
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="p-2 border border-brand-border rounded-lg bg-brand-surface"
                >
                    {categories.map((cat: string) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto pr-2">
                {filteredArticles.map(article => (
                     <details key={article.id} className="bg-brand-surface border border-brand-border rounded-lg group">
                        <summary className="p-3 flex justify-between items-center cursor-pointer list-none">
                            <div className="flex items-center gap-3">
                                <BookOpen className="w-5 h-5 text-brand-primary" />
                                <h3 className="font-bold text-brand-text">{article.title}</h3>
                            </div>
                            <ChevronRight className="w-5 h-5 text-brand-text-alt transition-transform group-open:rotate-90" />
                        </summary>
                        <div className="px-3 pb-3 border-t border-brand-border">
                            <p className="text-sm text-brand-text-alt mt-2">{article.snippet}</p>
                        </div>
                    </details>
                ))}
            </div>
        </div>
    );
};

export default KnowledgeOverlay;
