import React from 'react';
import { useQuery } from '@tanstack/react-query';
// FIX: Import correct API function for Studio data
import { getStudioMarketplaceAssets } from '@/api/appModulesApi';
import { Loader2, Search, Image as ImageIcon, Music, Shapes, Type } from 'lucide-react';

const assetIcons = {
    photo: ImageIcon,
    audio: Music,
    '3d-model': Shapes,
    font: Type,
};

const Marketplace: React.FC = () => {
    const { data: assets, isLoading } = useQuery({ queryKey: ['studioAssets'], queryFn: getStudioMarketplaceAssets });

    return (
        <div className="p-6 flex flex-col h-full">
             <header className="mb-4">
                <h3 className="text-xl font-bold text-brand-text">Asset Marketplace</h3>
                <div className="relative mt-2">
                     <input type="text" placeholder="Search for photos, audio, fonts..." className="w-full max-w-sm p-2 pl-10 border border-brand-border rounded-lg bg-brand-surface"/>
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-alt"/>
                </div>
            </header>
            {isLoading ? <Loader2 className="w-8 h-8 animate-spin text-brand-primary mx-auto my-auto"/> : (
                 <div className="flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto pr-2">
                    {/* FIX: Ensure assets is an array before mapping */}
                    {Array.isArray(assets) && assets.map(asset => {
                        const Icon = assetIcons[asset.type as keyof typeof assetIcons];
                        return (
                        <div key={asset.id} className="aspect-square bg-brand-surface rounded-lg overflow-hidden group border border-brand-border">
                             <div className="w-full h-2/3 bg-cover bg-center" style={{backgroundImage: `url(${asset.thumbnailUrl})`}} />
                             <div className="p-2 h-1/3 flex flex-col justify-between">
                                 <p className="text-xs font-semibold truncate">{asset.name}</p>
                                 <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-1 text-xs text-brand-text-alt">
                                        <Icon className="w-3 h-3"/>
                                        <span className="capitalize">{asset.type}</span>
                                    </div>
                                    <span className="text-xs font-bold text-brand-primary">${asset.price.toFixed(2)}</span>
                                 </div>
                             </div>
                        </div>
                    )})}
                 </div>
            )}
        </div>
    );
};

export default Marketplace;