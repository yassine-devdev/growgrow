import React from 'react';
import { z } from 'zod';
import { getFlights } from '../../../api/appModulesApi';
import * as schemas from '../../../api/schemas/appModulesSchemas';
import { Loader2, Plane, Search, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

type Flight = z.infer<typeof schemas.flightSchema>;

const popularTours = [
    {id: 1, name: 'Historical City Walk', price: 50, image: 'https://picsum.photos/seed/tour1/400/300' },
    {id: 2, name: 'Mountain Adventure', price: 120, image: 'https://picsum.photos/seed/tour2/400/300' },
    {id: 3, name: 'Culinary Experience', price: 85, image: 'https://picsum.photos/seed/tour3/400/300' },
];

const LeisureOverlay: React.FC = () => {
    const { data: flights, isLoading } = useQuery<Flight[]>({
        queryKey: ['flights'],
        queryFn: getFlights,
    });

    return (
        <div className="w-full h-full flex flex-col gap-4">
            <div 
                className="rounded-lg p-8 flex flex-col justify-center items-center text-center text-white" 
                style={{backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(https://picsum.photos/seed/travel-bg/800/200)`, backgroundSize: 'cover', backgroundPosition: 'center'}}
            >
                <h2 className="text-3xl font-bold">Find Your Next Adventure</h2>
                <p className="mb-4">Book flights, tours, and more.</p>
                <div className="w-full max-w-lg bg-white/20 backdrop-blur-sm p-2 rounded-lg flex gap-2 items-center">
                    <input type="text" placeholder="From" className="flex-1 p-2 bg-transparent text-white placeholder-white/70 border-0 focus:ring-0" />
                    <ArrowRight className="w-5 h-5" />
                    <input type="text" placeholder="To" className="flex-1 p-2 bg-transparent text-white placeholder-white/70 border-0 focus:ring-0" />
                    <button className="p-2 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-md"><Search className="w-5 h-5"/></button>
                </div>
            </div>
            
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0">
                <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-bold">Featured Flights</h3>
                     <div className="flex-1 space-y-3 overflow-y-auto pr-2">
                        {isLoading ? <Loader2 className="m-auto w-8 h-8 animate-spin text-brand-primary" /> : flights?.map(flight => (
                            <div key={flight.id} className="flex justify-between items-center p-3 bg-brand-surface border border-brand-border rounded-lg hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3">
                                    <Plane className="w-6 h-6 text-brand-primary" />
                                    <div>
                                        <p className="font-bold">{flight.from} to {flight.to}</p>
                                        <p className="text-sm text-brand-text-alt">{flight.airline}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-brand-text-alt">From</p>
                                    <p className="font-semibold text-brand-primary">${flight.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                 <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-bold">Popular Tours</h3>
                    <div className="flex-1 grid grid-cols-1 gap-3 overflow-y-auto pr-2">
                        {popularTours.map(tour => (
                             <div key={tour.id} className="bg-brand-surface border border-brand-border rounded-lg flex items-center gap-3 group hover:shadow-md transition-shadow">
                                <img src={tour.image} className="w-24 h-full object-cover rounded-l-lg"/>
                                <div className="p-2 flex-1">
                                    <p className="font-bold text-sm group-hover:text-brand-primary">{tour.name}</p>
                                    <p className="text-sm text-brand-primary font-semibold">${tour.price}</p>
                                </div>
                                 <button className="mr-3 px-3 py-1 bg-brand-primary text-white text-xs font-semibold rounded-md">Book</button>
                             </div>
                         ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeisureOverlay;
