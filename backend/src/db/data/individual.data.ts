
export const getIndividualDashboardData = async () => ({
    stats: [{ label: 'Courses Enrolled', value: '3', icon: 'BookOpen' as const }],
    recentActivity: [{ id: 'act-1', description: 'Completed "Intro to Python"', timestamp: 'Yesterday' }]
});
