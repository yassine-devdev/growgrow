import React from 'react';
import { z } from 'zod';
import { getLeaderboard } from '../../../api/appModulesApi';
import * as schemas from '../../../api/schemas/appModulesSchemas';
import { Loader2, Trophy, Star, Shield } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

type LeaderboardEntry = z.infer<typeof schemas.leaderboardEntrySchema>;

// Enhanced achievements with descriptions
const achievements = [
    { id: 1, name: 'First Steps', description: 'Log in for the first time.', icon: Star, progress: 100 },
    { id: 2, name: 'Knowledge Seeker', description: 'Read 5 articles in the Knowledge app.', icon: Shield, progress: 75 },
    { id: 3, name: 'Top of the Class', description: 'Achieve a rank in the top 10 on the leaderboard.', icon: Trophy, progress: 30 },
    { id: 4, name: 'Creative Spark', description: 'Save a project in the Studio app.', icon: Star, progress: 0},
];

const AchievementCard: React.FC<typeof achievements[0]> = ({ name, description, icon: Icon, progress }) => {
    const isCompleted = progress === 100;
    
    return (
        <div className={`p-4 bg-brand-surface border border-brand-border rounded-lg ${isCompleted ? 'opacity-70' : ''}`}>
            <div className="flex items-start gap-4">
                <div className={`p-2 rounded-full ${isCompleted ? 'bg-yellow-400/20' : 'bg-brand-primary/10'}`}>
                    <Icon className={`w-6 h-6 ${isCompleted ? 'text-yellow-500' : 'text-brand-primary'}`} />
                </div>
                <div>
                    <h4 className="font-bold text-brand-text">{name}</h4>
                    <p className="text-xs text-brand-text-alt">{description}</p>
                </div>
            </div>
            <div className="mt-3 flex items-center gap-3">
                 <div className="w-full bg-brand-surface-alt rounded-full h-2.5">
                    <div className={`${isCompleted ? 'bg-yellow-400' : 'bg-brand-accent'} h-2.5 rounded-full`} style={{ width: `${progress}%` }}></div>
                </div>
                <span className="text-xs font-semibold text-brand-text-alt">{progress}%</span>
            </div>
        </div>
    );
};


const GamificationOverlay: React.FC = () => {
    const { data: leaderboard, isLoading } = useQuery<LeaderboardEntry[]>({
        queryKey: ['leaderboard'],
        queryFn: getLeaderboard,
    });

    if (isLoading) {
        return <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-brand-primary" /></div>;
    }

    return (
        <div className="w-full h-full flex gap-6 p-2">
            <div className="w-2/3 flex flex-col gap-4">
                <h2 className="text-xl font-bold text-brand-text">Leaderboard</h2>
                <div className="flex-1 bg-brand-surface border border-brand-border rounded-lg overflow-y-auto">
                    {leaderboard?.map((entry, index) => (
                        <div key={entry.rank} className={`flex items-center p-3 gap-4 ${index < 3 ? 'bg-yellow-400/10' : ''} border-b border-brand-border last:border-b-0`}>
                            <span className={`font-bold text-lg w-8 text-center ${index < 3 ? 'text-yellow-500' : 'text-brand-text-alt'}`}>{entry.rank}</span>
                            <span className="flex-1 font-semibold text-brand-text">{entry.name}</span>
                            <span className="font-bold text-brand-primary">{entry.points.toLocaleString()} PTS</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="w-1/3 flex flex-col gap-4">
                <h2 className="text-xl font-bold text-brand-text">My Achievements</h2>
                <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                    {achievements.map(ach => <AchievementCard key={ach.id} {...ach} />)}
                </div>
            </div>
        </div>
    );
};

export default GamificationOverlay;
