import React from 'react';
import { z } from 'zod';
import { getSportsGames } from '../../../api/appModulesApi';
import * as schemas from '../../../api/schemas/appModulesSchemas';
import { Loader2, Trophy } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

type Game = z.infer<typeof schemas.sportsGameSchema>;

const standings = [
    { rank: 1, team: 'Innovators', wins: 10, losses: 2 },
    { rank: 2, team: 'Disruptors', wins: 8, losses: 4 },
];

const SportsOverlay: React.FC = () => {
    const { data: games, isLoading } = useQuery<Game[]>({
        queryKey: ['sportsGames'],
        queryFn: getSportsGames,
    });

    if (isLoading) {
        return <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-brand-primary" /></div>;
    }

    return (
        <div className="w-full h-full flex gap-6 p-2">
            <div className="w-1/2 flex flex-col gap-4">
                <h2 className="text-xl font-bold text-brand-text">Upcoming Games</h2>
                <div className="space-y-3">
                    {games?.map(game => (
                        <div key={game.id} className="bg-brand-surface border border-brand-border rounded-lg p-4 text-center">
                            <p className="text-sm text-brand-text-alt">{game.time}</p>
                            <div className="flex justify-around items-center mt-1">
                                <span className="font-bold text-lg">{game.teamA}</span>
                                <span className="text-brand-text-alt">VS</span>
                                <span className="font-bold text-lg">{game.teamB}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
             <div className="w-1/2 flex flex-col gap-4">
                <h2 className="text-xl font-bold text-brand-text">League Standings</h2>
                <div className="bg-brand-surface border border-brand-border rounded-lg p-2">
                    {standings.map(s => (
                        <div key={s.rank} className="flex items-center p-2 gap-4">
                            <Trophy className="w-5 h-5 text-yellow-500" />
                            <span className="flex-1 font-semibold">{s.team}</span>
                            <span>{s.wins}W - {s.losses}L</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SportsOverlay;