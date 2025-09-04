# Application Navigation Map

This document provides a complete, hierarchical breakdown of the application's entire user interface for every user role. It maps the navigation flow from the right sidebar (L0) to the header (L1) and left sub-navigation (L2), and describes the specific content view rendered for each final navigation item.

---

## Role: Provider

### Module (L0): Dashboard (`/dashboard`)
- **Header (L1): Command Center (`/dashboard/command-center`)**
    - **Content View**: Renders `CommandCenterDashboard`. Displays platform-wide `StatCard`s and a list of all school tenants with their individual health scores and key metrics. Each school card links to a detailed view.
- **Header (L1): Analytics (`/dashboard/analytics`)**
  - **Sub-nav (L2): Usage Stats (`/dashboard/analytics/usage-stats`)**
    - **Content View**: Renders `UsageStatsDashboard`. Displays four key `StatCard` components and a "Growth Overview" area chart.
  - **Sub-nav (L2): Revenue Reports (`/dashboard/analytics/revenue-reports`)**
    - **Content View**: Renders `RevenueDashboard`. Shows financial `StatCard`s, a bar chart of MRR by plan, and a table of recent transactions.
  - **Sub-nav (L2): Active Users (`/dashboard/analytics/active-users`)**
    - **Content View**: Renders `ActiveUsersDashboard`. Shows user engagement `StatCard`s, a pie chart of user distribution, and a DAU history chart.
  - **Sub-nav (L2): Growth Trends (`/dashboard/analytics/growth-trends`)**
    - **Content View**: Renders `GrowthTrendsDashboard`. Displays acquisition `StatCard`s, and charts for user/tenant growth.
- **Header (L1): Monitoring (`/dashboard/monitoring`)**
  - **Sub-nav (L2): Server Status, Logs, Incidents, Alerts**
    - **Content View**: Renders the respective real-time monitoring dashboards (`ServerStatusDashboard`, etc.).

### Module (L0): Schools (`/schools`)
- **Header (L1): Onboarding (`/schools/onboarding`)**
  - **Sub-nav (L2): Manage Schools (`/schools/onboarding/manage-schools`)**
    - **Content View**: Renders `ManageSchools`. A data table view for managing all school tenants, with edit and delete functionality.
  - **Sub-nav (L2): New School, Docs, Config**
    - **Content View**: Renders the `NewSchoolForm`, `OnboardingDocs`, and `OnboardingConfig` pages.
- **Header (L1): Users (`/schools/users`)**
  - **Sub-nav (L2): Admins, Teachers, Students, Parents**
    - **Content View**: Renders the respective user management tables (`AdminsManager`, `TeachersManager`, etc.) with full CRUD functionality via modals.
- **Header (L1): Billing (`/schools/billing`)**
  - **Sub-nav (L2): Subscriptions, Invoices**
    - **Content View**: Renders `SubscriptionsManager` and `InvoicesManager` for viewing and managing billing data.
- **Header (L1): White Label (`/schools/white-label`)**
  - **Sub-nav (L2): Branding, Domains, Themes**
    - **Content View**: Renders the respective white-label management pages.
- **Header (L1): Support (`/schools/support`)**
  - **Sub-nav (L2): Tickets, KB Analytics**
    - **Content View**: Renders `TicketsManager` (Kanban board) and `KbAnalytics` dashboard.
- **Detail View**: **School Details (`/schools/detail/:schoolId`)**
  - **Content View**: Renders `ProviderSchoolDetailView`. A detailed drill-down view showing specific stats and health history for a single school.

### Module (L0): Tools (`/tools`)
- **Header (L1): Marketing, Finance, Updates, Data Studio, Sandbox**
  - **Content View**: Renders the respective tool views (`MarketingView`, `FinanceView`, etc.), which are feature-rich workspaces, many powered by AI.

### Module (L0): Communication (`/communication`)
- **Header (L1): Email (`/communication/email`)**
  - **Sub-nav (L2): Inbox, Templates**
    - **Content View**: Renders a mock email inbox and a full CRUD interface for managing email templates.

### Module (L0): Concierge (`/concierge`)
- **Header (L1): Chat (`/concierge/chat`)**
  - **Sub-nav (L2): General Chat (`/concierge/chat/general-chat`)**
    - **Content View**: Renders `ConciergeView`. A full-featured chat interface with conversation history for interacting with the Gemini AI.

### Module (L0): Directories & System
- **Content View**: These modules render data tables for viewing all schools, staff, partners, and managing system settings like authentication and API keys.

---

## Roles: Admin, Teacher, Student, Parent, Admissions

### Module (L0): Dashboard (`/dashboard`)
- **Header (L1): Overview (`/dashboard/overview`)**
  - **Sub-nav (L2): Main (`/dashboard/overview/main`)**
    - **Content View**: Renders a role-specific dashboard (`AdminDashboard`, `TeacherDashboard`, etc.), each tailored with unique components like Quick Links (Admin), Assignments to Grade (Teacher), Wellness Check-in (Student), and Child Overviews (Parent).

### Module (L0): School Hub (`/school-hub`)
- **Header (L1): Academics (`/school-hub/academics`)**
  - **Sub-nav (L2): Courses (`/school-hub/academics/courses`)**
    - **Content View**: Shows a list of courses relevant to the user's role.
  - **Sub-nav (L2): Grades (`/school-hub/academics/grades`)**
    - **Content View**: For Teachers, renders the interactive `TeacherGradebook`. For Students/Parents, shows an overview of grades.
- **Header (L1): People (`/school-hub/people`)**
  - **Content View**: For Admins/Teachers, provides data tables for viewing student and teacher directories.
- **Header (L1): Billing (`/school-hub/billing`)**
  - **Sub-nav (L2): Pay Fees (`/school-hub/billing/pay-fees`)**
    - **Content View**: For Parents, renders the `PaymentView` form. For Admins/Teachers, shows the read-only `BillingSummary`.
- **Detail View**: **Assignment Details (`/school-hub/academics/assignments/:assignmentId`)**
  - **Content View**: Renders `AssignmentView`. A detailed view for students to view instructions and submit their work.

### Module (L0): Tools, Comms, Knowledge, Concierge
- **Content View**: These modules provide access to the school calendar, messaging, resource library, and AI assistant.

### Module (L0): System (`/system`)
- **Header (L1): Settings (`/system/settings`)**
  - **Sub-nav (L2): Profile (`/system/settings/profile`)**
    - **Content View**: Renders `ProfileManager` for updating personal info.
  - **Sub-nav (L2): Notifications (`/system/settings/notifications`)**
    - **Content View**: Renders `NotificationsSettingsView` for managing notification preferences.
- **Header (L1): Health (`/system/health`)**
  - **Sub-nav (L2): Academic Health (`/system/health/academic-health`)**
    - **Content View**: Renders `AcademicHealth` monitor with charts for enrollment and subject performance (Admin-only).

---

## Role: Individual

### Module (L0): Dashboard (`/dashboard`)
- **Content View**: Renders `IndividualDashboard` with personal stats, AI-powered product suggestions, and a recent activity feed.

### Module (L0): Personal Hub (`/personal-hub`)
- **Header (L1): Lifestyle (`/personal-hub/lifestyle`)**
  - **Sub-nav (L2): Bookings (`/personal-hub/lifestyle/bookings`)**
    - **Content View**: A data table listing the user's service bookings.
- **Header (L1): Marketplace (`/personal-hub/marketplace`)**
  - **Sub-nav (L2): My Orders (`/personal-hub/marketplace/my-orders`)**
    - **Content View**: A data table listing the user's past marketplace orders.

*(The Individual role also inherits the `Tools`, `Comms`, `Knowledge`, `Concierge`, and `System` modules.)*