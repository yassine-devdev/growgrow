import React, { useState, useMemo } from 'react';
import { getCalendarEvents } from '../../api/schoolHubApi';
import { Loader2, Book, Building } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import type { CalendarEvent } from '@/api/schemas/schoolHubSchemas';

const LoadingSpinner = () => <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-brand-primary" /></div>;

const EventPill: React.FC<{ event: CalendarEvent }> = ({ event }) => {
    const isAcademic = event.type === 'academic';
    const colorClasses = isAcademic ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800';
    const Icon = isAcademic ? Book : Building;

    return (
        <div className={`p-1 rounded-md text-xs flex items-center gap-1 ${colorClasses}`}>
            <Icon className="w-3 h-3 shrink-0" />
            <span className="truncate">{event.title}</span>
        </div>
    );
};

const SchoolToolsView: React.FC = () => {
    const { data: events, isLoading } = useQuery({ queryKey: ['calendarEvents'], queryFn: getCalendarEvents, initialData: [] });
    const [currentDate, setCurrentDate] = useState(new Date('2024-11-01')); // Mocking November 2024

    const daysInMonth = useMemo(() => new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate(), [currentDate]);
    const firstDayOfMonth = useMemo(() => new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(), [currentDate]);

    const eventsByDay = useMemo(() => {
        return events.reduce((acc, event) => {
            const day = new Date(event.date).getDate();
            if (!acc[day]) {
                acc[day] = [];
            }
            acc[day].push(event);
            return acc;
        }, {} as Record<number, CalendarEvent[]>);
    }, [events]);

    const calendarDays = useMemo(() => {
        const blanks = Array(firstDayOfMonth).fill(null);
        const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
        return [...blanks, ...days];
    }, [firstDayOfMonth, daysInMonth]);

    if (isLoading) return <LoadingSpinner />;

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                    {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
                </h2>
                {/* Future: Add month navigation buttons here */}
            </div>
            <div className="flex-1 grid grid-cols-7 grid-rows-5 gap-1 border-t border-l border-brand-border bg-brand-border">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center font-bold text-xs p-2 bg-brand-surface-alt border-b border-r border-brand-border">{day}</div>
                ))}
                {calendarDays.map((day, index) => (
                    <div key={index} className="p-1 bg-brand-surface border-b border-r border-brand-border relative min-h-[100px] flex flex-col">
                        {day && (
                            <>
                                <span className="text-xs font-semibold self-start">{day}</span>
                                <div className="flex-1 mt-1 space-y-1 overflow-hidden">
                                    {eventsByDay[day]?.map(event => (
                                        <EventPill key={event.id} event={event} />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SchoolToolsView;