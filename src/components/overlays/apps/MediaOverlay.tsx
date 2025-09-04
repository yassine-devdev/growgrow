import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { getMedia } from '../../../api/appModulesApi';
import * as schemas from '../../../api/schemas/appModulesSchemas';
import { Loader2, Film, Image as ImageIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

type MediaItem = z.infer<typeof schemas.mediaItemSchema>;

const MediaLightbox: React.FC<{
    items: MediaItem[];
    selectedIndex: number;
    onClose: () => void;
    onNavigate: (newIndex: number) => void;
}> = ({ items, selectedIndex, onClose, onNavigate }) => {
    const item = items[selectedIndex];

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') {
                onNavigate((selectedIndex + 1) % items.length);
            } else if (e.key === 'ArrowLeft') {
                onNavigate((selectedIndex - 1 + items.length) % items.length);
            } else if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedIndex, items.length, onNavigate, onClose]);

    if (!item) return null;

    return (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center animate-fade-in" onClick={onClose}>
            <button onClick={onClose} className="absolute top-4 right-4 text-white p-2 rounded-full hover:bg-white/10"><X className="w-6 h-6" /></button>
            <button
                onClick={(e) => { e.stopPropagation(); onNavigate((selectedIndex - 1 + items.length) % items.length); }}
                className="absolute left-4 text-white p-3 rounded-full hover:bg-white/10"
            >
                <ChevronLeft className="w-8 h-8" />
            </button>
            <button
                onClick={(e) => { e.stopPropagation(); onNavigate((selectedIndex + 1) % items.length); }}
                className="absolute right-4 text-white p-3 rounded-full hover:bg-white/10"
            >
                <ChevronRight className="w-8 h-8" />
            </button>
            <div className="max-w-[90vw] max-h-[90vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
                {item.type === 'video' ? (
                    <video src={item.url} controls autoPlay className="max-w-full max-h-full rounded-lg" />
                ) : (
                    <img src={item.url} alt={item.title} className="max-w-full max-h-full rounded-lg" />
                )}
                <p className="text-white mt-4 font-semibold">{item.title}</p>
            </div>
        </div>
    );
};


const MediaOverlay: React.FC = () => {
    const { data: media = [], isLoading } = useQuery<MediaItem[]>({
        queryKey: ['media'],
        queryFn: getMedia,
    });
    const [filter, setFilter] = useState('all');
    const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);

    const filteredMedia = media.filter(item => {
        if (filter === 'all') return true;
        return item.type === filter;
    });

    if (isLoading) {
        return <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-brand-primary" /></div>;
    }

    return (
        <div className="w-full h-full flex flex-col gap-4">
            <header className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-brand-text">Media Gallery</h2>
                <div className="flex gap-2 p-1 bg-brand-surface-alt rounded-lg">
                    <button onClick={() => setFilter('all')} className={`px-3 py-1 rounded-md text-sm ${filter === 'all' ? 'bg-brand-primary text-white' : ''}`}>All</button>
                    <button onClick={() => setFilter('image')} className={`px-3 py-1 rounded-md text-sm ${filter === 'image' ? 'bg-brand-primary text-white' : ''}`}>Images</button>
                    <button onClick={() => setFilter('video')} className={`px-3 py-1 rounded-md text-sm ${filter === 'video' ? 'bg-brand-primary text-white' : ''}`}>Videos</button>
                </div>
            </header>
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 overflow-y-auto pr-2">
                {filteredMedia.map((item, index) => (
                    <div
                        key={item.id}
                        onClick={() => setSelectedItemIndex(index)}
                        className="group relative aspect-square rounded-lg overflow-hidden border border-brand-border cursor-pointer"
                    >
                        <img src={item.url} alt={item.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                            {item.type === 'video' ? <Film className="w-6 h-6 text-white" /> : <ImageIcon className="w-6 h-6 text-white" />}
                            <p className="text-white font-semibold text-sm mt-1 truncate">{item.title}</p>
                        </div>
                    </div>
                ))}
            </div>
            {selectedItemIndex !== null && (
                 <MediaLightbox 
                    items={filteredMedia}
                    selectedIndex={selectedItemIndex}
                    onClose={() => setSelectedItemIndex(null)}
                    onNavigate={setSelectedItemIndex}
                />
            )}
        </div>
    );
};

export default MediaOverlay;