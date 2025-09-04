import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getIndividualDashboardData } from '@/api/dashboardApi';
import { getEnrolledCourses, getSuggestedProducts } from '@/api/individualApi';
import { getLifestyleServices } from '@/api/appModulesApi';
import { QUERY_KEYS } from '@/constants/queries';
import StatCard from '@/components/ui/StatCard';
import { Loader2, History, ShoppingCart, Plane } from 'lucide-react';
import Image from '@/components/ui/Image';
import type { Product, OverlayApp } from '@/types/index.ts';
import { Stat } from '@/api/schemas/commonSchemas';
import { useAppStore } from '@/store/useAppStore';
import type { IndividualDashboardData } from '@/api/schemas/dashboardSchemas';
import type { LifestyleService } from '@/api/schemas/appModulesSchemas';
import { Sparkles, Dumbbell, Utensils } from 'lucide-react';

const serviceIcons: { [key: string]: React.ElementType } = {
    'spa': Sparkles,
    'fitness': Dumbbell,
    'dining': Utensils,
};

const SuggestedProducts: React.FC = () => {
    const openOverlay = useAppStore(s => s.openOverlay);
    const { data: courses } = useQuery({
        queryKey: QUERY_KEYS.enrolledCourses,
        queryFn: getEnrolledCourses,
    });
    
    const courseIds = courses?.map(c => c.id) || [];
    
    const { data: products, isLoading } = useQuery({
        queryKey: QUERY_KEYS.suggestedProducts(courseIds),
        queryFn: () => getSuggestedProducts(courseIds),
        enabled: courseIds.length > 0,
    });

    if (isLoading) return <div className="flex items-center justify-center h-full"><Loader2 className="w-8 h-8 animate-spin text-brand-primary" /></div>;
    if (!products || products.length === 0) return <div className="text-center text-sm text-brand-text-alt py-4">No suggestions right now.</div>;

    return (
        <div className="grid grid-cols-2 gap-4">
            {products.map((item: Product) => (
                 <div key={item.id} className="bg-brand-surface-alt rounded-lg overflow-hidden group cursor-pointer" onClick={() => openOverlay('market')}>
                    <Image src={item.image} alt={item.name} className="w-full h-24" />
                    <div className="p-3">
                        <p className="font-bold text-sm text-brand-text group-hover:text-brand-primary">{item.name}</p>
                        <p className="text-xs text-brand-text-alt">${item.price.toFixed(2)}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

const SuggestedServices: React.FC = () => {
    const openOverlay = useAppStore(s => s.openOverlay);
    const { data: services, isLoading } = useQuery({
        queryKey: QUERY_KEYS.lifestyleServices,
        queryFn: getLifestyleServices,
    });

    if (isLoading) return <div className="flex items-center justify-center h-full"><Loader2 className="w-8 h-8 animate-spin text-brand-primary" /></div>;
    if (!services || services.length === 0) return <div className="text-center text-sm text-brand-text-alt py-4">No services available.</div>;

    return (
        <div className="space-y-3">
            {services.map((service: LifestyleService) => {
                const Icon = serviceIcons[service.id] || Plane;
                return (
                    <div key={service.id} className="bg-brand-surface-alt rounded-lg p-3 flex items-center gap-4 group cursor-pointer" onClick={() => openOverlay('lifestyle')}>
                        <Icon className="w-8 h-8 text-brand-primary" />
                        <div>
                             <p className="font-bold text-sm text-brand-text group-hover:text-brand-primary">{service.name}</p>
                             <p className="text-xs text-brand-text-alt">From ${service.price.toFixed(2)}</p>
                        </div>
                    </div>
                )
            })}
        </div>
    );
};


const IndividualDashboard: React.FC = () => {
    const { data, isLoading } = useQuery<IndividualDashboardData>({
        queryKey: QUERY_KEYS.individualDashboard,
        queryFn: () => getIndividualDashboardData(),
    });

    if (isLoading) {
        return <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-brand-primary" /></div>;
    }

    if (!data) return null;
    
    return (
        <div className="flex flex-col h-full gap-4">
            <h1 className="text-2xl font-bold text-brand-text">My Dashboard</h1>
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {data.stats.map((stat: Stat) => (
                    <StatCard key={stat.label} {...stat} />
                ))}
            </div>
             <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 flex flex-col gap-4">
                    <div className="bg-brand-surface border border-brand-border rounded-lg p-4 flex flex-col">
                        <h3 className="text-lg font-bold mb-4 text-brand-text flex items-center gap-2">
                            <ShoppingCart className="w-5 h-5 text-brand-primary" /> Product Suggestions
                        </h3>
                        <SuggestedProducts />
                    </div>
                    <div className="bg-brand-surface border border-brand-border rounded-lg p-4 flex flex-col">
                        <h3 className="text-lg font-bold mb-4 text-brand-text flex items-center gap-2">
                            <Plane className="w-5 h-5 text-brand-primary" /> Service Recommendations
                        </h3>
                        <SuggestedServices />
                    </div>
                </div>
                <div className="bg-brand-surface border border-brand-border rounded-lg p-4 flex flex-col">
                     <h3 className="text-lg font-bold mb-4 text-brand-text flex items-center gap-2">
                        <History className="w-5 h-5 text-brand-primary" /> Recent Activity
                    </h3>
                    <div className="space-y-3">
                        {data.recentActivity.map(item => (
                            <div key={item.id} className="p-2 border-l-2 border-brand-primary/50">
                                <p className="text-sm text-brand-text">{item.description}</p>
                                <p className="text-xs text-brand-text-alt">{item.timestamp}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IndividualDashboard;