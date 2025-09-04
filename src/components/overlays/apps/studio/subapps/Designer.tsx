import React from 'react';
import { useQuery } from '@tanstack/react-query';
// FIX: Import correct API functions for Studio data
import { getStudioDesignTemplates, getStudioBrandKits } from '@/api/appModulesApi';
import { Loader2, Plus, Palette } from 'lucide-react';
import { Routes, Route, NavLink } from 'react-router-dom';

const LoadingSpinner = () => <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-brand-primary" /></div>;

const TemplatesView: React.FC = () => {
    const { data: templates, isLoading } = useQuery({ queryKey: ['studioTemplates'], queryFn: getStudioDesignTemplates });
    if (isLoading) return <LoadingSpinner />;
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* FIX: Ensure templates is an array before mapping */}
            {Array.isArray(templates) && templates.map(template => (
                <div key={template.id} className="aspect-[4/3] bg-brand-surface rounded-lg overflow-hidden group border border-brand-border hover:border-brand-primary">
                    <img src={template.thumbnailUrl} alt={template.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                </div>
            ))}
        </div>
    );
};

const BrandKitView: React.FC = () => {
    const { data: kits, isLoading } = useQuery({ queryKey: ['studioBrandKits'], queryFn: getStudioBrandKits });
     if (isLoading) return <LoadingSpinner />;
    return (
        <div className="space-y-4">
            {/* FIX: Ensure kits is an array before mapping */}
            {Array.isArray(kits) && kits.map(kit => (
                <div key={kit.id} className="p-4 bg-brand-surface border border-brand-border rounded-lg">
                    <h4 className="font-semibold">{kit.name}</h4>
                    <div className="flex gap-2 mt-2">
                        {kit.colors.map(color => <div key={color} className="w-6 h-6 rounded-full border" style={{ backgroundColor: color }} />)}
                    </div>
                </div>
            ))}
        </div>
    );
}

const Designer: React.FC = () => {
    const subNav = [
        { to: 'templates', label: 'Templates' },
        { to: 'create', label: 'Create New' },
        { to: 'designs', label: 'My Designs' },
        { to: 'brand-kit', label: 'Brand Kit' },
    ];
    return (
        <div className="p-6 flex flex-col h-full">
            <header className="mb-4">
                <h3 className="text-xl font-bold text-brand-text">Designer</h3>
                <nav className="flex items-center gap-4 border-b border-brand-border mt-2">
                    {subNav.map(item => (
                         <NavLink key={item.to} to={item.to} className={({isActive}) => `py-2 text-sm font-semibold border-b-2 ${isActive ? 'text-brand-primary border-brand-primary' : 'text-brand-text-alt border-transparent hover:border-brand-border'}`}>
                            {item.label}
                         </NavLink>
                    ))}
                </nav>
            </header>
            <div className="flex-1 overflow-y-auto pr-2">
                 <Routes>
                    <Route index element={<TemplatesView />} />
                    <Route path="templates" element={<TemplatesView />} />
                    <Route path="brand-kit" element={<BrandKitView />} />
                    {/* Add other routes here */}
                </Routes>
            </div>
        </div>
    );
};

export default Designer;