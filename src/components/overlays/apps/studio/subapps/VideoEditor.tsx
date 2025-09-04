import React from 'react';
import { useQuery } from '@tanstack/react-query';
// FIX: Import correct API function for Studio data
import { getStudioVideoProjects } from '@/api/appModulesApi';
import { Loader2, Film, Plus, Play, Scissors, Sparkles, Download, Clock } from 'lucide-react';

const VideoEditor: React.FC = () => {
    const { data: projects, isLoading } = useQuery({ queryKey: ['studioVideoProjects'], queryFn: getStudioVideoProjects });

    if (isLoading) return <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-brand-primary" /></div>;

    return (
        <div className="p-6 flex flex-col h-full bg-gray-800 text-white">
            <header className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Video Editor</h3>
                <div className="flex gap-2">
                    <button className="px-3 py-1.5 text-xs bg-white/10 rounded-md flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-purple-400" /> AI Enhancement</button>
                    <button className="px-3 py-1.5 text-xs bg-white/10 rounded-md flex items-center gap-1.5"><Download className="w-4 h-4"/> Export</button>
                </div>
            </header>
            <div className="flex-1 flex gap-6 min-h-0">
                <aside className="w-1/4 flex flex-col gap-4">
                    <button className="w-full py-2 bg-brand-primary rounded-md text-sm font-semibold flex items-center justify-center gap-2"><Plus className="w-4 h-4"/> New Video</button>
                    <div className="bg-white/5 rounded-lg p-2 flex-1 overflow-y-auto">
                        <h4 className="font-semibold text-sm mb-2 px-1">My Projects</h4>
                        {/* FIX: Ensure projects is an array before mapping */}
                        {Array.isArray(projects) && projects.map(p => (
                            <div key={p.id} className="p-2 rounded-md hover:bg-white/10 cursor-pointer">
                                <p className="font-semibold text-xs truncate">{p.name}</p>
                                <p className="text-xs text-gray-400">{p.duration}</p>
                            </div>
                        ))}
                    </div>
                </aside>
                <main className="w-3/4 flex flex-col gap-4">
                    <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                        <Play className="w-16 h-16 text-gray-500"/>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3 flex-1 flex flex-col">
                        <h4 className="text-sm font-semibold mb-2">Timeline</h4>
                        <div className="flex-1 bg-black/20 rounded-md flex items-center justify-center text-gray-400 text-sm">
                           <Clock className="w-4 h-4 mr-2"/> Drag media here to start editing
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default VideoEditor;