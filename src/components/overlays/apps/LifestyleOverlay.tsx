import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLifestyleServices } from '@/api/appModulesApi';
import { addBooking } from '@/api/individualApi';
import { QUERY_KEYS } from '@/constants/queries';
import { Loader2, Calendar, Sparkles, Dumbbell, Utensils, Plane } from 'lucide-react';
import type { LifestyleService } from '@/api/schemas/appModulesSchemas';
import Dialog from '@/components/ui/Dialog';
import { useAppStore } from '@/store/useAppStore';

const serviceIcons: { [key: string]: React.ElementType } = {
    'spa': Sparkles,
    'fitness': Dumbbell,
    'dining': Utensils,
    'yoga': Plane, // Re-using for variety
};

const LifestyleOverlay: React.FC = () => {
    const queryClient = useQueryClient();
    const addToast = useAppStore(s => s.addToast);
    const [bookingService, setBookingService] = useState<LifestyleService | null>(null);

    const { data: services, isLoading } = useQuery<LifestyleService[]>({
        queryKey: QUERY_KEYS.lifestyleServices,
        queryFn: getLifestyleServices,
    });

    const bookingMutation = useMutation({
        mutationFn: addBooking,
        onSuccess: (data) => {
            addToast({ message: `Successfully booked "${data.service}"!`, type: 'success' });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bookings });
            setBookingService(null);
        },
        onError: (error: Error) => {
            addToast({ message: error.message || 'Booking failed.', type: 'error' });
        }
    });

    const handleConfirmBooking = () => {
        if (!bookingService) return;
        const bookingData = {
            serviceId: bookingService.id,
            serviceName: bookingService.name,
            date: new Date().toISOString(),
        };
        bookingMutation.mutate(bookingData);
    };

    if (isLoading) {
        return <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-brand-primary" /></div>;
    }

    return (
        <>
            <div className="w-full h-full flex flex-col gap-4">
                <h2 className="text-xl font-bold text-brand-text">Book a Lifestyle Service</h2>
                <div className="flex-1 space-y-3 overflow-y-auto pr-2">
                    {services?.map(service => {
                        const Icon = serviceIcons[service.id] || Sparkles;
                        return (
                            <div key={service.id} className="bg-brand-surface border border-brand-border rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-4">
                                    <Icon className="w-8 h-8 text-brand-primary"/>
                                    <div>
                                        <h3 className="text-lg font-bold">{service.name}</h3>
                                        <p className="text-sm text-brand-text-alt">Starting from ${service.price}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setBookingService(service)}
                                    className="px-4 py-2 bg-brand-primary text-white rounded-lg flex items-center justify-center gap-2 text-sm font-semibold hover:bg-brand-primary-hover"
                                >
                                    <Calendar className="w-4 h-4"/>
                                    Book Now
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
            {bookingService && (
                 <Dialog
                    isOpen={!!bookingService}
                    onClose={() => setBookingService(null)}
                    onConfirm={handleConfirmBooking}
                    title={`Confirm Booking: ${bookingService.name}`}
                    description={`Are you sure you want to book the "${bookingService.name}" service for $${bookingService.price}?`}
                    confirmText="Yes, Book Now"
                    isConfirming={bookingMutation.isPending}
                />
            )}
        </>
    );
};

export default LifestyleOverlay;