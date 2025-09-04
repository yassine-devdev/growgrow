// This service generates mock data to power the frontend without a real database.

export const getProviderAnalytics = () => ({
  stats: [
    { label: 'MRR', value: '$125,630', change: '+2.1%', icon: 'DollarSign' },
    { label: 'Active Tenants', value: '78', change: '+2', icon: 'Building' },
    { label: 'Active Users', value: '15,789', change: '+8.2%', icon: 'Users' },
    { label: 'Churn Rate', value: '1.2%', change: '-0.3%', icon: 'TrendingDown' },
  ],
  chartData: [
    { name: 'Jan', mrr: 110000, tenants: 65 },
    { name: 'Feb', mrr: 112000, tenants: 68 },
    { name: 'Mar', mrr: 115000, tenants: 70 },
    { name: 'Apr', mrr: 118000, tenants: 72 },
    { name: 'May', mrr: 120000, tenants: 75 },
    { name: 'Jun', mrr: 125630, tenants: 78 },
  ],
});

export const getServiceStatus = () => ([
  { name: 'Authentication Service', status: 'Operational', responseTime: '15ms', uptime: '99.99%' },
  { name: 'Billing API', status: 'Operational', responseTime: '45ms', uptime: '99.98%' },
  { name: 'AI Gateway', status: 'Degraded Performance', responseTime: '450ms', uptime: '99.99%' },
  { name: 'Real-time Service (WebSockets)', status: 'Operational', responseTime: '5ms', uptime: '99.95%' },
]);

export const getCommandCenterData = () => ({
    overallStats: [
        { label: 'Total Schools', value: '78', icon: 'Building' },
        // FIX: Replaced invalid icon name 'HeartPulse' with a valid one 'Heart' from lucide-react.
        { label: 'Platform Health', value: '98.5%', change: '-0.1%', icon: 'Heart' },
        { label: 'Active Users (24h)', value: '8,123', icon: 'Users' },
        { label: 'Total Revenue', value: '$1.2M', icon: 'DollarSign' },
    ],
    schools: [
        { id: 'northwood-high', name: 'Northwood High', healthScore: 95, keyStats: [{ label: 'Users', value: '1,200' }, { label: 'Status', value: 'Active' }] },
        { id: 'south-park-elementary', name: 'South Park Elementary', healthScore: 75, keyStats: [{ label: 'Users', value: '450' }, { label: 'Status', value: 'Active' }] },
        { id: 'riverdale-university', name: 'Riverdale University', healthScore: 99, keyStats: [{ label: 'Users', value: '5,600' }, { label: 'Status', value: 'Active' }] },
    ]
});

export const getProviderSchools = () => ({
    rows: [
        { id: 'northwood-high', name: 'Northwood High', plan: 'Enterprise', users: 1200, status: 'Active' },
        { id: 'south-park-elementary', name: 'South Park Elementary', plan: 'Pro', users: 450, status: 'Active' },
    ],
    pageCount: 1,
    rowCount: 2,
});

export const getProviderSchoolDetails = (schoolId: string) => ({
    id: schoolId,
    name: schoolId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    stats: [
        { label: 'Active Users', value: '1,200', icon: 'Users' },
        { label: 'Data Storage', value: '250 GB', icon: 'Database' },
        { label: 'MRR', value: '$2,500', icon: 'DollarSign' },
        { label: 'Support Tickets', value: '3 Open', icon: 'Ticket' },
    ],
    healthHistory: [
        { date: 'Jan', score: 90 }, { date: 'Feb', score: 92 }, { date: 'Mar', score: 91 },
        { date: 'Apr', score: 95 }, { date: 'May', score: 94 }, { date: 'Jun', score: 95 }
    ]
});

export const getAdmins = () => ({
    rows: [
        { id: 'uuid-1', name: 'Jane Doe', email: 'admin@school.com', role: 'Admin', school: 'Northwood High', lastLogin: new Date().toISOString(), status: 'Active' }
    ],
    pageCount: 1,
    rowCount: 1,
});

// DASHBOARDS
export const getAdminDashboardData = () => ({
    stats: [
        { label: 'Total Students', value: '1,428', change: '+2.1%', icon: 'Users' },
        { label: 'Teaching Staff', value: '86', icon: 'GraduationCap' },
        { label: 'Avg. Attendance', value: '94.7%', change: '-0.5%', icon: 'UserCheck' },
        { label: 'Pending Applications', value: '12', icon: 'UserPlus' },
    ],
    enrollmentTrend: [
        { name: 'Jan', students: 1390 }, { name: 'Feb', students: 1400 }, { name: 'May', students: 1428 },
    ],
    actionItems: [ { id: '1', text: 'Review 5 new staff applications', icon: 'FileCheck', link: '#' } ],
    recentAnnouncements: [ { id: 'a1', title: 'Parent-Teacher Conferences Next Week', date: '2 days ago' } ],
});

export const getTeacherDashboardData = () => ({
    stats: [
        { label: 'Your Classes', value: '5', icon: 'BookOpen' },
        { label: 'Total Students', value: '124', icon: 'Users' },
    ],
    schedule: [ { time: '09:00', subject: 'Algebra II', class: 'Grade 10' } ],
    assignmentsToGrade: [
        { id: 'assign-1', title: 'Chapter 5 Homework', course: 'Algebra II', courseId: 'ALG-2', dueDate: 'Yesterday' }
    ],
    classrooms: [
        { id: 'c1', name: 'Homeroom 10B', attendance: { present: 28, total: 30 }, roster: ['Alex', 'Brian', 'Chloe'] }
    ]
});

export const getStudentDashboardData = () => ({
    stats: [
        { label: 'Current GPA', value: '3.8', icon: 'GraduationCap' },
        { label: 'Attendance', value: '98%', icon: 'UserCheck' },
    ],
    upcomingAssignments: [
        { id: 'assign-2', title: 'History Essay', course: 'World History', dueDate: 'Tomorrow', priority: 'High', status: 'Pending' }
    ]
});

export const getParentDashboardData = () => ({
    children: [
        { name: 'Alex Doe', stats: [{ label: 'GPA', value: '3.8', icon: 'GraduationCap' }] }
    ],
    announcements: [ { id: 'a1', title: 'Parent-Teacher Conferences Next Week', date: '2 days ago' } ],
    fees: { amountDue: 150.00, dueDate: '2024-10-01' },
    upcomingDeadlines: [ { id: 'd1', childName: 'Alex Doe', title: 'History Essay', type: 'assignment', dueDate: 'Tomorrow' } ],
    recentGrades: [ { id: 'g1', childName: 'Alex Doe', courseName: 'Algebra II', grade: 'A-', postedDate: 'Yesterday' } ]
});

export const getAdmissionsDashboardData = () => ({
    stats: [
        { label: 'New Applications', value: '58', change: '+10', icon: 'FilePlus' },
        { label: 'Pending Review', value: '12', icon: 'Eye' },
        { label: 'Offers Accepted', value: '25', change: '+5%', icon: 'UserCheck' },
        { label: 'Enrollment Rate', value: '65%', icon: 'TrendingUp' },
    ],
    applicationTrend: [
        { name: 'Jan', applications: 20 },
        { name: 'Feb', applications: 35 },
        { name: 'Mar', applications: 40 },
        { name: 'Apr', applications: 50 },
        { name: 'May', applications: 45 },
        { name: 'Jun', applications: 58 },
    ],
    needsReview: [
        { id: 'app-1', name: 'Charlie Brown', submitted: 'Today' },
        { id: 'app-2', name: 'Lucy van Pelt', submitted: 'Yesterday' },
        { id: 'app-3', name: 'Linus van Pelt', submitted: 'Yesterday' },
    ],
    applicantFunnel: [
        { stage: 'Applied', count: 150 },
        { stage: 'Reviewing', count: 58 },
        { stage: 'Interview', count: 35 },
        { stage: 'Accepted', count: 25 },
        { stage: 'Enrolled', count: 18 },
    ],
    demographics: [
        { name: 'Domestic', value: 120 },
        { name: 'International', value: 30 },
    ]
});

export const getIndividualDashboardData = () => ({
    stats: [
        { label: 'Courses Enrolled', value: '3', icon: 'BookOpen' }
    ],
    recentActivity: [ { id: 'act-1', description: 'Completed "Intro to Python"', timestamp: 'Yesterday' } ],
});

export const getNotifications = () => ([
    { id: '1', title: 'New Grade Posted', description: 'You received an A- in Algebra II.', timestamp: new Date().toISOString(), read: false, type: 'grade' },
    { id: '2', title: 'School Announcement', description: 'Parent-teacher conferences next week.', timestamp: new Date().toISOString(), read: true, type: 'announcement' },
]);

export const getProducts = () => ([
    { id: 1, name: 'Advanced Calculator', price: 75.99, rating: 4.8, category: 'electronics', image: 'https://picsum.photos/seed/calc/300' },
    { id: 2, name: 'Lab Notebook', price: 12.50, rating: 4.5, category: 'supplies', image: 'https://picsum.photos/seed/notebook/300' },
]);