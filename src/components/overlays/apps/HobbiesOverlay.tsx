import React from 'react';
import { z } from 'zod';
import { getHobbies } from '../../../api/appModulesApi';
import * as schemas from '../../../api/schemas/appModulesSchemas';
import { Loader2, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

type Hobby = z.infer<typeof schemas.hobbySchema>;

const HobbiesOverlay: React.FC = () => {
    const { data: hobbies, isLoading } = useQuery<Hobby[]>({
        queryKey: ['hobbies'],
        queryFn: getHobbies,
    });

    if (isLoading) {
        return <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-brand-primary" /></div>;
    }

    return (
        <div className="w-full h-full flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-brand-text">Discover Hobbies</h2>
                <div className="relative w-1/3">
                    <input type="text" placeholder="Search hobbies..." className="w-full p-2 pl-8 border border-brand-border rounded-lg" />
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-alt" />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-brand-primary text-white rounded-lg p-6 flex flex-col justify-between" style={{backgroundImage: `url(https://picsum.photos/seed/hobbies-bg/600/400)`}}>
                    <div>
                        <p className="text-sm opacity-80">Hobby of the Day</p>
                        <h3 className="text-2xl font-bold">Photography</h3>
                    </div>
                    <button className="self-start mt-4 px-4 py-2 bg-white/20 rounded-lg">Learn More</button>
                </div>
                 <div className="grid grid-cols-2 gap-4">
                     {hobbies?.map(hobby => (
                         <div key={hobby.id} className="bg-brand-surface border border-brand-border rounded-lg p-4 text-center">
                             <h4 className="font-bold">{hobby.name}</h4>
                             <p className="text-sm text-brand-text-alt">{hobby.category}</p>
                         </div>
                     ))}
                 </div>
            </div>
        </div>
    );
};

export default HobbiesOverlay;