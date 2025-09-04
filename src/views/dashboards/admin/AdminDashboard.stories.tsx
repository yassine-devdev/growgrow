import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import AdminDashboard from './AdminDashboard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { QUERY_KEYS } from '../../../constants/queries';
import { AdminDashboardData } from '../../../api/schemas/dashboardSchemas';
import { MemoryRouter } from 'react-router-dom';

const meta: Meta<typeof AdminDashboard> = {
  title: 'Views/Dashboards/AdminDashboard',
  component: AdminDashboard,
  parameters: {
    layout: 'fullscreen',
  },
  // Wrap stories in MemoryRouter because components use <Link>
  decorators: [(Story) => <div className="p-6 bg-brand-bg"><MemoryRouter><Story /></MemoryRouter></div>],
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockAdminData: AdminDashboardData = {
    stats: [
        { label: 'Total Students', value: '1,428', change: '+2.1%', icon: 'Users' },
        { label: 'Teaching Staff', value: '86', icon: 'GraduationCap' },
        { label: 'Avg. Attendance', value: '94.7%', change: '-0.5%', icon: 'UserCheck' },
        { label: 'Pending Applications', value: '12', icon: 'UserPlus' },
    ],
    enrollmentTrend: [
        { name: 'Jan', students: 1390 },
        { name: 'Feb', students: 1400 },
        { name: 'Mar', students: 1410 },
        { name: 'Apr', students: 1405 },
        { name: 'May', students: 1428 },
    ],
    actionItems: [
        { id: '1', text: 'Review 5 new staff applications', icon: 'FileCheck', link: '#' },
        { id: '2', text: 'Approve Q3 budget proposal', icon: 'DollarSign', link: '#' },
        { id: '3', text: '3 unresolved support tickets', icon: 'MailWarning', link: '#' },
    ],
    recentAnnouncements: [
        { id: 'a1', title: 'Parent-Teacher Conferences Next Week', date: '2 days ago' },
        { id: 'a2', title: 'School Closed for Holiday', date: '5 days ago' },
    ],
};

const withQueryClient = (data: any, isLoading = false) => {
    const queryClient = new QueryClient();
    if (!isLoading) {
        queryClient.setQueryData(QUERY_KEYS.adminDashboard, data);
    } else {
        // For loading state, we set a query that never resolves
        queryClient.setQueryData(QUERY_KEYS.adminDashboard, undefined);
        queryClient.setDefaultOptions({ queries: { queryFn: () => new Promise(() => {}) } });
    }
    return (Story: React.FC) => (
        <QueryClientProvider client={queryClient}>
            <Story />
        </QueryClientProvider>
    );
};

export const Default: Story = {
    name: 'Default View',
    decorators: [withQueryClient(mockAdminData)],
};

export const Loading: Story = {
    name: 'State: Loading',
    decorators: [withQueryClient(null, true)],
};