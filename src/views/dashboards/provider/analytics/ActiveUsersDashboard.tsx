
import React from 'react';
import { getActiveUsersData } from '@/api/providerApi';
import StatCard from '@/components/ui/StatCard';
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Stat } from '@/api/schemas/commonSchemas';
import { QUERY_KEYS } from '@/constants/queries';
import { useAnalyticsFilter } from '@/context/AnalyticsFilterContext';

/**
 * Predefined colors for the user distribution pie chart.
 */
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

/**
 * Type definition for a data point in the role distribution chart.
 */
interface RoleDistribution {
    name: string;
    value: number;
}

/**
 * Renders the 'Active Users' dashboard for the Provider role.
 * It displays key user engagement metrics, a pie chart of user distribution by role,
 * and an area chart showing Daily Active Users (DAU) over the last 30 days.
 *
 * @returns {JSX.Element} The rendered active users dashboard.
 */
const ActiveUsersDashboard: React.FC = () => {
    const { dateRange } = useAnalyticsFilter();
    const { data, isLoading } = useQuery({
        queryKey: [QUERY_KEYS.activeUsersData, dateRange],
        queryFn: () => getActiveUsersData(dateRange),
    });

    if (isLoading) {
        return <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-brand-primary" /></div>;
    }
    
    if (!data) return null;

    return (
        <div className="h-full flex flex-col gap-4">
            <div className="grid grid-cols-4 gap-4">
                {data.stats.map((stat: Stat) => (
                    <StatCard key={stat.label} {...stat} />
                ))}
            </div>
            <div className="flex-1 grid grid-cols-3 gap-4">
                <div className="col-span-1 bg-brand-surface border border-brand-border rounded-lg p-4 flex flex-col">
                    <h3 className="text-lg font-bold mb-4 text-brand-text">User Distribution by Role</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data.roleDistribution}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                                label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                                    const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
                                    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                                    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                                    return (
                                        <text x={x} y={y} fill="#6b7280" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12}>
                                            {`${(percent * 100).toFixed(0)}%`}
                                        </text>
                                    );
                                }}
                            >
                                {data.roleDistribution.map((entry: RoleDistribution, index: number) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend wrapperStyle={{fontSize: "12px"}}/>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="col-span-2 bg-brand-surface border border-brand-border rounded-lg p-4 flex flex-col">
                    <h3 className="text-lg font-bold mb-4 text-brand-text">Daily Active Users (DAU)</h3>
                    <ResponsiveContainer width="100%" height="100%">
                         <AreaChart data={data.dauHistory} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                            <defs>
                                <linearGradient id="colorDau" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="name" stroke="#6b7280" tick={{fontSize: 12}} />
                            <YAxis stroke="#6b7280" tick={{fontSize: 12}} />
                            <Tooltip />
                            <Area type="monotone" dataKey="users" stroke="#82ca9d" fill="url(#colorDau)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default ActiveUsersDashboard;
