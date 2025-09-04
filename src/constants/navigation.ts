import { Role, ModuleConfig, RoleConfig } from '@/types/index.ts';
import {
    LayoutDashboard, Users, Mail, Bot, FolderKanban, Settings, Building2, UserCheck, CreditCard, Palette, MonitorPlay,
    DollarSign, GitBranch, Database, TestTube2, TestTube, Briefcase, MessageSquare, Cog, ShieldCheck,
    Library, Ticket, ShoppingCart, Heart, GraduationCap, Building,
    FileText, BarChart2, Bell, Shield, Key, GitPullRequest, DatabaseZap, History, Recycle, UserCog, UserPlus, FileCheck, FileSearch, Home,
    Notebook, CalendarDays, Star, Wrench, Handshake, BriefcaseBusiness, BookCopy, Search as SearchIcon, PenSquare, LineChart, ClipboardList, TrendingUp, LayoutTemplate, BarChartBig, FileSignature, BrainCircuit, ClipboardEdit, Wand2, BarChartHorizontal, UserMinus, Group, Siren, Users2, FlaskConical, CircleDollarSign, Filter, ToggleRight, KanbanSquare, ClipboardCheck, Workflow, ListChecks, CalendarClock, Video, ShieldQuestion, Gavel, Zap, Grape, UploadCloud,
    Globe, Server, Repeat, ShieldAlert, User, Share2, RefreshCw, Command, HeartHandshake, CodeXml, UsersRound
} from 'lucide-react';

/**
 * An array of all possible user roles, used for populating the login page.
 * @type {Role[]}
 */
export const ROLES: Role[] = ['Provider', 'Admin', 'Teacher', 'Student', 'Parent', 'Admissions', 'Individual'];

/**
 * Defines the navigation structure for the 'Provider' role, updated to match the detailed specification.
 * @type {ModuleConfig[]}
 */
const PROVIDER_MODULES: ModuleConfig[] = [
    {
        id: 'dashboard', label: 'nav.modules.dashboard', icon: LayoutDashboard, headerNav: [
            { id: 'command-center', label: 'nav.header.command-center', icon: Command, children: [] },
            {
                id: 'analytics', label: 'nav.header.analytics', icon: BarChart2, children: [
                    { id: 'usage-stats', label: 'nav.subnav.usage-stats', icon: Users },
                    { id: 'revenue-reports', label: 'nav.subnav.revenue-reports', icon: DollarSign },
                    { id: 'active-users', label: 'nav.subnav.active-users', icon: UserCheck },
                    { id: 'growth-trends', label: 'nav.subnav.growth-trends', icon: TrendingUp },
                    { id: 'predictive-analytics', label: 'nav.subnav.predictive-analytics', icon: BrainCircuit },
                    { id: 'engagement-insights', label: 'nav.subnav.engagement-insights', icon: BarChartHorizontal },
                    { id: 'churn-retention', label: 'nav.subnav.churn-retention', icon: UserMinus },
                    { id: 'parent-engagement-analytics', label: 'nav.subnav.parent-engagement-analytics', icon: Users2 },
                    { id: 'cohort-analysis', label: 'nav.subnav.cohort-analysis', icon: Group },
                ]
            },
            {
                id: 'monitoring', label: 'nav.header.monitoring', icon: MonitorPlay, children: [
                    { id: 'server-status', label: 'nav.subnav.server-status', icon: Server },
                    { id: 'logs', label: 'nav.subnav.logs', icon: FileText },
                    { id: 'incidents', label: 'nav.subnav.incidents', icon: Siren },
                    { id: 'alerts', label: 'nav.subnav.alerts', icon: Bell },
                    { id: 'system-health-dashboard', label: 'nav.subnav.system-health-dashboard', icon: Heart },
                    { id: 'incident-response-dashboard', label: 'nav.subnav.incident-response-dashboard', icon: ShieldAlert },
                ]
            }
        ]
    },
    {
        id: 'schools', label: 'nav.modules.schools', icon: Building2, headerNav: [
            {
                id: 'management', label: 'nav.header.management', icon: Building, children: [
                    { id: 'all-schools', label: 'nav.subnav.all-schools', icon: Building2 },
                ]
            },
            {
                id: 'onboarding', label: 'nav.header.onboarding', icon: UserPlus, children: [
                    { id: 'new-school-wizard', label: 'nav.subnav.new-school-wizard', icon: Wand2 },
                    { id: 'required-docs', label: 'nav.subnav.required-docs', icon: FileCheck },
                    { id: 'config-setup', label: 'nav.subnav.config-setup', icon: Cog },
                ]
            },
            {
                id: 'users', label: 'nav.header.users', icon: Users, children: [
                    { id: 'admins', label: 'nav.subnav.admins', icon: UserCog },
                    { id: 'teachers', label: 'nav.subnav.teachers', icon: GraduationCap },
                    { id: 'students', label: 'nav.subnav.students', icon: Users },
                    { id: 'parents', label: 'nav.subnav.parents', icon: Users2 },
                ]
            },
            {
                id: 'customer-success', label: 'nav.header.customer-success', icon: HeartHandshake, children: [
                    { id: 'health-scoring', label: 'nav.subnav.health-scoring', icon: BarChartBig },
                    { id: 'playbooks', label: 'nav.subnav.playbooks', icon: ListChecks },
                    { id: 'renewals', label: 'nav.subnav.renewals', icon: CalendarClock },
                ]
            },
            {
                id: 'billing', label: 'nav.header.billing', icon: CreditCard, children: [
                    { id: 'subscriptions', label: 'nav.subnav.subscriptions', icon: Repeat },
                    { id: 'invoices', label: 'nav.subnav.invoices', icon: FileText },
                ]
            },
            {
                id: 'white-labeling', label: 'nav.header.white-labeling', icon: Palette, children: [
                    { id: 'branding', label: 'nav.subnav.branding', icon: Palette },
                    { id: 'domains', label: 'nav.subnav.domains', icon: Globe },
                    { id: 'themes', label: 'nav.subnav.themes', icon: LayoutTemplate },
                ]
            },
            {
                id: 'support', label: 'nav.header.support', icon: MessageSquare, children: [
                    { id: 'tickets', label: 'nav.subnav.tickets', icon: Ticket },
                    { id: 'kb-analytics', label: 'nav.subnav.kb-analytics', icon: BarChart2 },
                ]
            }
        ]
    },
    {
        id: 'crm', label: 'nav.modules.crm', icon: BriefcaseBusiness, headerNav: [
            { id: 'leads', label: 'nav.header.leads', icon: Users, children: [] },
            { id: 'deals', label: 'nav.header.deals', icon: KanbanSquare, children: [] },
            { id: 'analytics', label: 'nav.header.analytics', icon: BarChart2, children: [] }
        ]
    },
     {
        id: 'hrm', label: 'nav.modules.hrm', icon: UsersRound, headerNav: [
            { id: 'directory', label: 'nav.header.directory', icon: Users, children: [] },
            { id: 'roles', label: 'nav.header.roles', icon: UserCog, children: [] },
            { id: 'permissions', label: 'nav.header.permissions', icon: ShieldCheck, children: [] },
        ]
    },
    {
        id: 'tools', label: 'nav.modules.tools', icon: Wrench, headerNav: [
            {
                id: 'marketing', label: 'nav.header.marketing', icon: Briefcase, children: [
                    { id: 'campaigns', label: 'nav.subnav.campaigns', icon: ClipboardList },
                    { id: 'analytics', label: 'nav.subnav.analytics', icon: BarChart2 },
                    { id: 'automation', label: 'nav.subnav.automation', icon: Wand2 },
                ]
            },
            {
                id: 'finance', label: 'nav.header.finance', icon: DollarSign, children: [
                    { id: 'finance-dashboard', label: 'nav.modules.dashboard', icon: LayoutDashboard },
                    { id: 'budgeting', label: 'nav.subnav.budgeting', icon: CircleDollarSign },
                    { id: 'sales-pipelines', label: 'nav.subnav.sales-pipelines', icon: Filter },
                    { id: 'forecasting', label: 'nav.subnav.forecasting', icon: TrendingUp },
                    { id: 'reports', label: 'nav.subnav.reports', icon: FileText },
                ]
            },
            {
                id: 'updates', label: 'nav.header.updates', icon: GitBranch, children: [
                    { id: 'version-control', label: 'nav.subnav.version-control', icon: GitPullRequest },
                    { id: 'feature-rollouts', label: 'nav.subnav.feature-rollouts', icon: ToggleRight },
                    { id: 'changelog', label: 'nav.subnav.changelog', icon: FileSignature },
                ]
            },
            {
                id: 'data-studio', label: 'nav.header.data-studio', icon: Database, children: [
                    { id: 'dashboard-builder', label: 'nav.subnav.dashboard-builder', icon: BarChartBig },
                    { id: 'report-builder', label: 'nav.subnav.report-builder', icon: FileSignature },
                    { id: 'data-sources', label: 'nav.subnav.data-sources', icon: DatabaseZap },
                ]
            },
            {
                id: 'sandbox', label: 'nav.header.sandbox', icon: TestTube2, children: [
                    { id: 'beta-features', label: 'nav.subnav.beta-features', icon: TestTube },
                    { id: 'api-testing', label: 'nav.subnav.api-testing', icon: TestTube2 },
                    { id: 'vector-database', label: 'nav.subnav.vector-database', icon: DatabaseZap },
                ]
            },
            {
                id: 'collaboration', label: 'nav.header.collaboration', icon: Users2, children: [
                    { id: 'project-boards', label: 'nav.subnav.project-boards', icon: KanbanSquare },
                    { id: 'documents', label: 'nav.subnav.documents', icon: FileText },
                    { id: 'team-chat', label: 'nav.subnav.team-chat', icon: MessageSquare },
                ]
            },
            {
                id: 'testing-automation', label: 'nav.header.testing-automation', icon: FlaskConical, children: [
                    { id: 'qa-tools', label: 'nav.subnav.qa-tools', icon: ClipboardCheck },
                    { id: 'workflow-builder', label: 'nav.subnav.workflow-builder', icon: Workflow },
                    { id: 'test-suites', label: 'nav.subnav.test-suites', icon: ListChecks },
                ]
            },
        ]
    },
    {
        id: 'communication', label: 'nav.modules.communication', icon: Mail, headerNav: [
            {
                id: 'email', label: 'nav.header.email', icon: Mail, children: [
                    { id: 'inbox', label: 'nav.subnav.inbox', icon: Mail },
                    { id: 'sent', label: 'nav.subnav.sent', icon: Mail },
                    { id: 'compose', label: 'nav.subnav.compose', icon: PenSquare },
                    { id: 'templates', label: 'nav.subnav.templates', icon: Notebook },
                ]
            },
            {
                id: 'templates', label: 'nav.header.templates', icon: Notebook, children: [
                    { id: 'email-templates', label: 'nav.subnav.email-templates', icon: Notebook },
                    { id: 'notification-templates', label: 'nav.subnav.notification-templates', icon: Bell },
                    { id: 'template-library', label: 'nav.subnav.template-library', icon: Library },
                ]
            },
            {
                id: 'schedule', label: 'nav.header.schedule', icon: CalendarClock, children: [
                    { id: 'calendar', label: 'nav.subnav.calendar', icon: CalendarDays },
                    { id: 'queue', label: 'nav.subnav.queue', icon: ListChecks },
                    { id: 'automation', label: 'nav.subnav.automation', icon: Wand2 },
                ]
            },
            {
                id: 'video-calls-social-media', label: 'nav.header.video-calls-social-media', icon: Video, children: [
                    { id: 'video-meetings', label: 'nav.subnav.video-meetings', icon: Video },
                    { id: 'social-media', label: 'nav.subnav.social-media', icon: Share2 },
                    { id: 'integrations', label: 'nav.subnav.integrations', icon: Zap },
                ]
            },
        ]
    },
    {
        id: 'concierge', label: 'nav.modules.concierge', icon: Bot, headerNav: [
            {
                id: 'chat', label: 'nav.header.chat', icon: MessageSquare, children: [
                    { id: 'general-chat', label: 'nav.subnav.general-chat', icon: MessageSquare },
                    { id: 'technical-chat', label: 'nav.subnav.technical-chat', icon: Wrench },
                    { id: 'business-chat', label: 'nav.subnav.business-chat', icon: Briefcase },
                    { id: 'school-chat', label: 'nav.subnav.school-chat', icon: GraduationCap },
                ]
            },
            {
                id: 'technical-help', label: 'nav.header.technical-help', icon: ShieldQuestion, children: [
                    { id: 'debug-assistant', label: 'nav.subnav.debug-assistant', icon: Cog },
                    { id: 'log-analyzer', label: 'nav.subnav.log-analyzer', icon: FileSearch },
                    { id: 'issue-diagnosis', label: 'nav.subnav.issue-diagnosis', icon: ShieldAlert },
                    { id: 'performance-analysis', label: 'nav.subnav.performance-analysis', icon: LineChart },
                ]
            },
            {
                id: 'business-help', label: 'nav.header.business-help', icon: Briefcase, children: [
                    { id: 'marketing-planner', label: 'nav.subnav.marketing-planner', icon: BriefcaseBusiness },
                    { id: 'sales-strategy', label: 'nav.subnav.sales-strategy', icon: DollarSign },
                    { id: 'market-research', label: 'nav.subnav.market-research', icon: SearchIcon },
                    { id: 'business-analytics', label: 'nav.subnav.business-analytics', icon: BarChartBig },
                ]
            },
            {
                id: 'productivity-hub', label: 'nav.header.productivity-hub', icon: Zap, children: [
                    { id: 'meeting-summarizer', label: 'nav.subnav.meeting-summarizer', icon: Users },
                    { id: 'task-manager', label: 'nav.subnav.task-manager', icon: ClipboardList },
                    { id: 'document-generator', label: 'nav.subnav.document-generator', icon: FileText },
                    { id: 'time-tracker', label: 'nav.subnav.time-tracker', icon: CalendarClock },
                ]
            },
            {
                id: 'ai-governance', label: 'nav.header.ai-governance', icon: Gavel, children: [
                    { id: 'model-monitoring', label: 'nav.subnav.model-monitoring', icon: BarChart2 },
                    { id: 'ethics-dashboard', label: 'nav.subnav.ethics-dashboard', icon: ShieldCheck },
                    { id: 'usage-analytics', label: 'nav.subnav.usage-analytics', icon: BarChartHorizontal },
                    { id: 'compliance-reports', label: 'nav.subnav.compliance-reports', icon: FileSignature },
                ]
            },
        ]
    },
    {
        id: 'directories', label: 'nav.modules.directories', icon: FolderKanban, headerNav: [
            {
                id: 'staff', label: 'nav.header.staff', icon: Users, children: [
                    { id: 'all-staff', label: 'nav.subnav.all-staff', icon: Users },
                    { id: 'staff-search', label: 'nav.subnav.staff-search', icon: SearchIcon },
                    { id: 'staff-profiles', label: 'nav.subnav.staff-profiles', icon: UserCog },
                    { id: 'department-view', label: 'nav.subnav.department-view', icon: Building },
                ]
            },
            {
                id: 'students', label: 'nav.header.students', icon: GraduationCap, children: [
                    { id: 'all-students', label: 'nav.subnav.all-students', icon: Users },
                    { id: 'student-search', label: 'nav.subnav.student-search', icon: SearchIcon },
                    { id: 'student-profiles', label: 'nav.subnav.student-profiles', icon: User },
                    { id: 'class-view', label: 'nav.subnav.class-view', icon: Users2 },
                ]
            },
            {
                id: 'parents', label: 'nav.header.parents', icon: Users2, children: [
                    { id: 'all-parents', label: 'nav.subnav.all-parents', icon: Users2 },
                    { id: 'parent-search', label: 'nav.subnav.parent-search', icon: SearchIcon },
                    { id: 'parent-profiles', label: 'nav.subnav.parent-profiles', icon: User },
                    { id: 'family-view', label: 'nav.subnav.family-view', icon: Home },
                ]
            },
            {
                id: 'partners', label: 'nav.header.partners', icon: Handshake, children: [
                    { id: 'all-partners', label: 'nav.subnav.all-partners', icon: Handshake },
                    { id: 'partner-search', label: 'nav.subnav.partner-search', icon: SearchIcon },
                    { id: 'partner-profiles', label: 'nav.subnav.partner-profiles', icon: User },
                    { id: 'relationship-management', label: 'nav.subnav.relationship-management', icon: Heart },
                ]
            },
            {
                id: 'alumni-community', label: 'nav.header.alumni-community', icon: Grape, children: [
                    { id: 'alumni-directory', label: 'nav.subnav.alumni-directory', icon: Users },
                    { id: 'alumni-search', label: 'nav.subnav.alumni-search', icon: SearchIcon },
                    { id: 'community-groups', label: 'nav.subnav.community-groups', icon: Group },
                    { id: 'events', label: 'nav.subnav.events', icon: CalendarDays },
                ]
            }
        ]
    },
    {
        id: 'system', label: 'nav.modules.system', icon: Settings, headerNav: [
            {
                id: 'general-settings', label: 'nav.header.general-settings', icon: Cog, children: [
                    { id: 'provider-profile', label: 'nav.subnav.provider-profile', icon: UserCog },
                    { id: 'platform-branding', label: 'nav.subnav.platform-branding', icon: Palette },
                    { id: 'language-settings', label: 'nav.subnav.language-settings', icon: Globe },
                    { id: 'appearance', label: 'nav.subnav.appearance', icon: Palette },
                    { id: 'regional-settings', label: 'nav.subnav.regional-settings', icon: Globe },
                ]
            },
            {
                id: 'security', label: 'nav.header.security', icon: Shield, children: [
                    { id: 'roles-permissions', label: 'nav.subnav.roles-permissions', icon: UserCog },
                    { id: 'authentication', label: 'nav.subnav.authentication', icon: Key },
                    { id: 'sso-configuration', label: 'nav.subnav.sso-configuration', icon: ShieldCheck },
                    { id: 'mfa-settings', label: 'nav.subnav.mfa-settings', icon: ShieldCheck },
                    { id: 'security-policies', label: 'nav.subnav.security-policies', icon: Shield },
                ]
            },
            {
                id: 'integrations', label: 'nav.header.integrations', icon: DatabaseZap, children: [
                    { id: 'third-party-apps', label: 'nav.subnav.third-party-apps', icon: DatabaseZap },
                    { id: 'api-integrations', label: 'nav.subnav.api-integrations', icon: Zap },
                    { id: 'webhooks', label: 'nav.subnav.webhooks', icon: Zap },
                    { id: 'data-sync', label: 'nav.subnav.data-sync', icon: RefreshCw },
                ]
            },
            {
                id: 'developer-platform', label: 'nav.header.developer-platform', icon: CodeXml, children: [
                    { id: 'portal', label: 'nav.subnav.portal', icon: BookCopy },
                    { id: 'app-reviews', label: 'nav.subnav.app-reviews', icon: ClipboardCheck },
                    { id: 'revenue-sharing', label: 'nav.subnav.revenue-sharing', icon: CircleDollarSign },
                ]
            },
            {
                id: 'api-keys', label: 'nav.header.api-keys', icon: Key, children: [
                    { id: 'key-management', label: 'nav.subnav.key-management', icon: Key },
                    { id: 'key-analytics', label: 'nav.subnav.key-analytics', icon: BarChart2 },
                    { id: 'key-permissions', label: 'nav.subnav.key-permissions', icon: ShieldCheck },
                    { id: 'key-rotation', label: 'nav.subnav.key-rotation', icon: History },
                ]
            },
            {
                id: 'logs', label: 'nav.header.logs', icon: FileText, children: [
                    { id: 'system-logs', label: 'nav.subnav.system-logs', icon: FileText },
                    { id: 'audit-logs', label: 'nav.subnav.audit-logs', icon: ShieldCheck },
                    { id: 'access-logs', label: 'nav.subnav.access-logs', icon: FileText },
                    { id: 'log-analytics', label: 'nav.subnav.log-analytics', icon: BarChart2 },
                ]
            },
            {
                id: 'backup-recovery', label: 'nav.header.backup-recovery', icon: Recycle, children: [
                    { id: 'backup-configuration', label: 'nav.subnav.backup-configuration', icon: Cog },
                    { id: 'recovery-plans', label: 'nav.subnav.recovery-plans', icon: Recycle },
                    { id: 'backup-history', label: 'nav.subnav.backup-history', icon: History },
                    { id: 'restore-tools', label: 'nav.subnav.restore-tools', icon: Recycle },
                ]
            },
            {
                id: 'multi-tenancy', label: 'nav.header.multi-tenancy', icon: Building2, children: [
                    { id: 'tenant-settings', label: 'nav.subnav.tenant-settings', icon: Cog },
                    { id: 'resource-quotas', label: 'nav.subnav.resource-quotas', icon: DatabaseZap },
                    { id: 'tenant-dashboards', label: 'nav.subnav.tenant-dashboards', icon: LayoutDashboard },
                    { id: 'tenant-templates', label: 'nav.subnav.tenant-templates', icon: LayoutTemplate },
                ]
            },
            { id: 'bulk-operations', label: 'nav.header.bulk-operations', icon: UploadCloud, children: [] },
            { id: 'legal-compliance', label: 'nav.header.legal-compliance', icon: Gavel, children: [] },
        ]
    },
];


/**
 * Defines the base set of navigation modules available to all school-related roles.
 * @type {ModuleConfig[]}
 */
const SCHOOL_BASE_MODULES: ModuleConfig[] = [
    {
        id: 'dashboard', label: 'nav.modules.dashboard', icon: LayoutDashboard, headerNav: [
            { id: 'overview', label: 'nav.header.overview', icon: LayoutDashboard, children: [
                { id: 'main', label: 'nav.subnav.main', icon: LayoutDashboard }
            ]}
        ]
    },
    {
        id: 'school-hub', label: 'nav.modules.school-hub', icon: Building2, headerNav: [
            { id: 'academics', label: 'nav.header.academics', icon: GraduationCap, children: [
                { id: 'courses', label: 'nav.subnav.courses', icon: BookCopy },
                { id: 'assignments', label: 'nav.subnav.assignments', icon: ClipboardList },
                { id: 'grades', label: 'nav.subnav.grades', icon: FileText },
            ]},
            { id: 'people', label: 'nav.header.people', icon: Users, children: [
                { id: 'teachers', label: 'nav.subnav.teachers', icon: GraduationCap },
                { id: 'students', label: 'nav.subnav.students', icon: Users },
                { id: 'parents', label: 'nav.subnav.parents', icon: Users2 },
            ]},
            { id: 'planning', label: 'nav.header.planning', icon: ClipboardEdit, children: [
                { id: 'lesson-plans', label: 'nav.subnav.lesson-plans', icon: ClipboardList },
            ]},
            { id: 'billing', label: 'nav.header.billing', icon: CreditCard, children: [
                { id: 'pay-fees', label: 'nav.subnav.pay-fees', icon: DollarSign },
            ]},
        ]
    },
    {
        id: 'tools', label: 'nav.modules.tools', icon: Wrench, headerNav: [
            { id: 'planner', label: 'nav.header.planner', icon: CalendarDays, children: [
                { id: 'calendar', label: 'nav.subnav.calendar', icon: CalendarDays },
            ]}
        ]
    },
    {
        id: 'comms', label: 'nav.modules.comms', icon: Mail, headerNav: [
             { id: 'messages', label: 'nav.header.messages', icon: Mail, children: [
                 { id: 'inbox', label: 'nav.subnav.inbox', icon: Mail },
                 { id: 'announcements', label: 'nav.subnav.announcements', icon: Bell }
             ]}
        ]
    },
    {
        id: 'knowledge', label: 'nav.modules.knowledge', icon: Library, headerNav: [
            { id: 'library', label: 'nav.header.library', icon: Library, children: [
                { id: 'resources', label: 'nav.subnav.resources', icon: BookCopy }
            ]}
        ]
    },
    {
        id: 'concierge', label: 'nav.modules.concierge', icon: Bot, headerNav: [
            { id: 'ai-assist', label: 'nav.header.ai-assist', icon: Bot, children: [
                { id: 'chat', label: 'nav.subnav.general-chat', icon: MessageSquare }
            ]}
        ]
    },
    {
        id: 'system', label: 'nav.modules.system', icon: Settings, headerNav: [
            { id: 'settings', label: 'nav.header.settings', icon: Cog, children: [
                { id: 'profile', label: 'nav.subnav.profile', icon: UserCog },
                { id: 'notifications', label: 'nav.subnav.notifications', icon: Bell }
            ]},
            { id: 'health', label: 'nav.header.health', icon: BarChart2, children: [
                { id: 'academic-health', label: 'nav.subnav.academic-health', icon: LineChart }
            ]}
        ]
    }
];

/**
 * Defines the navigation structure for the 'Individual' user role.
 * It combines unique modules with a subset of the school base modules.
 * @type {ModuleConfig[]}
 */
const INDIVIDUAL_MODULES: ModuleConfig[] = [
    {
        id: 'dashboard', label: 'nav.modules.dashboard', icon: LayoutDashboard, headerNav: [
            { id: 'overview', label: 'nav.header.overview', icon: LayoutDashboard, children: [
                { id: 'main', label: 'nav.subnav.main', icon: LayoutDashboard }
            ]}
        ]
    },
    {
        id: 'personal-hub', label: 'nav.modules.personal-hub', icon: Home, headerNav: [
            { id: 'lifestyle', label: 'nav.header.lifestyle', icon: Heart, children: [
                { id: 'bookings', label: 'nav.subnav.bookings', icon: Ticket },
            ]},
            { id: 'marketplace', label: 'nav.header.marketplace', icon: ShoppingCart, children: [
                { id: 'my-orders', label: 'nav.subnav.my-orders', icon: FileText }
            ]}
        ]
    },
    ...SCHOOL_BASE_MODULES.filter(m => !['dashboard', 'school-hub'].includes(m.id))
];

/**
 * The master configuration object for all application navigation.
 * It maps each user role to its specific array of module configurations,
 * defining the entire navigation structure for every type of user.
 * @type {RoleConfig}
 */
export const NAVIGATION_CONFIG: RoleConfig = {
    Provider: PROVIDER_MODULES,
    Admin: SCHOOL_BASE_MODULES,
    Teacher: SCHOOL_BASE_MODULES,
    Student: SCHOOL_BASE_MODULES,
    Parent: SCHOOL_BASE_MODULES,
    Admissions: SCHOOL_BASE_MODULES,
    Individual: INDIVIDUAL_MODULES,
};