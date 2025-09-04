/**
 * @file Centralized TanStack Query keys for the entire application.
 * This approach prevents typos and magic strings in components, making the codebase
 * more maintainable and refactorable. Each key is structured hierarchically
 * to reflect the API endpoint it corresponds to.
 */

export const QUERY_KEYS = {
    // Provider Analytics
    providerAnalytics: ['providerAnalytics'],
    revenueData: ['revenueData'],
    activeUsersData: ['activeUsersData'],
    growthTrendsData: ['growthTrendsData'],
    predictiveAnalyticsData: ['predictiveAnalyticsData'],
    cohortAnalysisData: ['cohortAnalysisData'],
    providerProfile: ['providerProfile'],
    providerFinanceDashboard: ['providerFinanceDashboard'],

    // Provider Monitoring
    serviceStatus: ['serviceStatus'],
    activeIncidents: ['activeIncidents'],
    liveLogs: ['liveLogs'],
    systemAlerts: ['systemAlerts'],
    
    // School Onboarding
    onboardingDocs: ['onboardingDocs'],
    onboardingConfig: ['onboardingConfig'],

    // School Management
    admins: ['admins'],
    teachers: ['teachers'],
    students: ['students'],
    parents: ['parents'],
    subscriptions: ['subscriptions'],
    invoices: ['invoices'],
    expenses: ['expenses'],
    brandingSettings: ['brandingSettings'],
    domains: ['domains'],
    themes: ['themes'],
    supportTickets: ['supportTickets'],
    kbAnalytics: ['kbAnalytics'],
    providerSchools: ['providerSchools'],

    // Provider App Modules
    marketingProjects: ['marketingProjects'],
    dashboardTemplates: ['dashboardTemplates'],
    marketingCampaigns: ['marketingCampaigns'],
    marketingAnalytics: ['marketingAnalytics'],
    financeBudgets: ['financeBudgets'],
    updates: ['updates'],
    versionControlCommits: ['versionControlCommits'],
    reports: ['reports'],
    emails: ['emails'],
    emailTemplates: ['emailTemplates'],
    directorySchools: ['directorySchools'],
    directoryStaff: ['directoryStaff'],
    directoryPartners: ['directoryPartners'],
    systemBranding: ['systemBranding'],
    securityRoles: ['securityRoles'],
    authSettings: ['authSettings'],
    apiKeys: ['apiKeys'],
    backups: ['backups'],
    auditLogs: ['auditLogs'],
    dataConnectors: ['dataConnectors'],
    connectorSchema: (id: string) => ['connectorSchema', id],
    // New System-level query keys for provider
    integrations: ['integrations'],
    multiTenancySettings: ['multiTenancySettings'],
    backupConfig: ['backupConfig'],
    bulkOperations: ['bulkOperations'],
    legalDocuments: ['legalDocuments'],
    apiKeyAnalytics: ['apiKeyAnalytics'],
    systemLogs: ['systemLogs'],

    // NEW Provider Business Modules
    crmLeads: ['crmLeads'],
    crmDeals: ['crmDeals'],
    crmAnalytics: ['crmAnalytics'],
    hrmTeamMembers: ['hrmTeamMembers'],
    hrmRolesAndPermissions: ['hrmRolesAndPermissions'],
    hrmAllPermissions: ['hrmAllPermissions'],
    customerSuccessHealth: ['customerSuccessHealth'],
    customerSuccessRenewals: ['customerSuccessRenewals'],
    developerAppReviews: ['developerAppReviews'],


    // School Hub & related
    schoolStats: (user: string | null) => ['schoolStats', user],
    schoolBillingSummary: ['schoolBillingSummary'],
    courses: (user: string) => ['courses', user],
    courseDetails: (courseId: string) => ['courseDetails', courseId],
    grades: (studentId: string) => ['grades', studentId],
    gradebook: (courseId: string) => ['gradebook', courseId],
    peopleList: (type: 'students' | 'teachers') => ['peopleList', type],
    calendarEvents: ['calendarEvents'],
    messages: ['messages'],
    announcements: ['announcements'],
    resources: ['resources'],
    profile: ['profile'],
    assignmentDetails: (assignmentId: string) => ['assignmentDetails', assignmentId],
    recentMoods: ['recentMoods'],
    lessonPlans: ['lessonPlans'],

    // Role-specific Dashboards
    adminDashboard: ['adminDashboard'],
    teacherDashboard: ['teacherDashboard'],
    studentDashboard: ['studentDashboard'],
    parentDashboard: ['parentDashboard'],
    admissionsDashboard: ['admissionsDashboard'],
    individualDashboard: ['individualDashboard'],
    feeDetails: (childId: string) => ['feeDetails', childId],
    processPayment: ['processPayment'],
    academicHealthData: ['academicHealthData'],
    commandCenterData: ['commandCenterData'],
    providerSchoolDetails: (schoolId: string) => ['providerSchoolDetails', schoolId],

    // Individual Hub
    bookings: ['bookings'],
    orders: ['orders'],
    enrolledCourses: ['enrolledCourses'],
    suggestedProducts: (courseIds: string[]) => ['suggestedProducts', courseIds],
    
    // Notifications
    notifications: ['notifications'],

    // Overlay Apps
    media: ['media'],
    leaderboard: ['leaderboard'],
    flights: ['flights'],
    lifestyleServices: ['lifestyleServices'],
    hobbies: ['hobbies'],
    knowledgeArticles: ['knowledgeArticles'],
    sportsGames: ['sportsGames'],
    religionEvents: ['religionEvents'],
    proServices: ['proServices'],
    products: ['products'],
    checkout: ['checkout'],
    financeData: ['financeData'],
};