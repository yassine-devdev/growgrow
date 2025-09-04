import React from 'react';
import { z } from 'zod';
import { getReligionEvents } from '../../../api/appModulesApi';
import * as schemas from '../../../api/schemas/appModulesSchemas';
import { Loader2, MapPin, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

type ReligionEvent = z.infer<typeof schemas.religionEventSchema>;

const ReligionOverlay: React.FC = () => {
    const { data: events, isLoading } = useQuery<ReligionEvent[]>({
        queryKey: ['religionEvents'],
        queryFn: getReligionEvents,
    });

    if (isLoading) {
        return <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-brand-primary" /></div>;
    }

    return (
        <div className="w-full h-full flex flex-col gap-4">
            <h2 className="text-xl font-bold text-brand-text">Community & Events</h2>
            <div className="bg-brand-surface border border-brand-border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Find a Location</h3>
                <input type="text" placeholder="Search by city or zip code" className="w-full p-2 border border-brand-border rounded-lg" />
            </div>
            <div className="flex-1 flex flex-col gap-2">
                 <h3 className="font-semibold">Upcoming Events</h3>
                 {events?.map(event => (
                     <div key={event.id} className="p-3 bg-brand-surface border border-brand-border rounded-lg flex items-center gap-4">
                        <Calendar className="w-5 h-5 text-brand-primary" />
                        <div>
                             <p className="font-bold">{event.name}</p>
                             <div className="flex items-center gap-1 text-sm text-brand-text-alt">
                                <MapPin className="w-3 h-3"/>
                                <span>{event.location}</span>
                             </div>
                        </div>
                     </div>
                 ))}
            </div>
        </div>
    );
};

export default ReligionOverlay;