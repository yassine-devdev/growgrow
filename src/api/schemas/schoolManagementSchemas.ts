import { z } from 'zod';
import { statSchema } from './commonSchemas';

// USER MANAGEMENT
/**
 * Zod schema for an Admin user record.
 */
export const adminSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    email: z.string().email(),
    role: z.literal('Admin'),
    school: z.string(),
    lastLogin: z.string().datetime(),
    status: z.enum(['Active', 'Invited', 'Suspended']),
});
export type Admin = z.infer<typeof adminSchema>;

/**
 * Zod schema for the Add/Edit Admin form.
 */
export const adminFormSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters.'),
    email: z.string().email('Please enter a valid email address.'),
    school: z.string().min(2, 'School name is required.'),
    status: z.enum(['Active', 'Invited', 'Suspended']),
});
export type AdminFormData = z.infer<typeof adminFormSchema>;


/**
 * Zod schema for a Teacher user record.
 */
export const teacherSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    email: z.string().email(),
    school: z.string(),
    subject: z.string(),
    yearsExperience: z.number(),
    status: z.enum(['Active', 'On Leave', 'Archived']),
});
export type Teacher = z.infer<typeof teacherSchema>;

/**
 * Zod schema for the Add/Edit Teacher form.
 */
export const teacherFormSchema = z.object({
    name: z.string().min(3, 'Name is required.'),
    email: z.string().email('A valid email is required.'),
    school: z.string().min(2, 'School is required.'),
    subject: z.string().min(2, 'Subject is required.'),
    yearsExperience: z.coerce.number().min(0, 'Experience cannot be negative.'),
    status: z.enum(['Active', 'On Leave', 'Archived']),
});
export type TeacherFormData = z.infer<typeof teacherFormSchema>;

/**
 * A shared Zod schema for Student and Parent users for simplicity.
 */
export const schoolUserSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    email: z.string().email(),
    school: z.string(),
    grade: z.number().optional(), // For students
    children: z.array(z.string()).optional(), // For parents
    status: z.enum(['Active', 'Inactive']),
});
export type SchoolUser = z.infer<typeof schoolUserSchema>;

/**
 * Zod schema for the Add/Edit Student form.
 */
export const studentFormSchema = z.object({
    name: z.string().min(3, 'Name is required.'),
    email: z.string().email('A valid email is required.'),
    school: z.string().min(2, 'School is required.'),
    grade: z.coerce.number().min(1, 'Grade is required.'),
    status: z.enum(['Active', 'Inactive']),
});
export type StudentFormData = z.infer<typeof studentFormSchema>;

/**
 * Zod schema for the Add/Edit Parent form.
 */
export const parentFormSchema = z.object({
    name: z.string().min(3, 'Name is required.'),
    email: z.string().email('A valid email is required.'),
    school: z.string().min(2, 'School is required.'),
    children: z.string().min(1, "At least one child's name is required."), // Simplified to a comma-separated string for the form
    status: z.enum(['Active', 'Inactive']),
});
export type ParentFormData = z.infer<typeof parentFormSchema>;


// BILLING MANAGEMENT
/**
 * Zod schema for a school's subscription record.
 */
export const subscriptionSchema = z.object({
    id: z.string().uuid(),
    school: z.string(),
    plan: z.enum(['Basic', 'Pro', 'Enterprise']),
    status: z.enum(['Active', 'Trialing', 'Canceled', 'Past Due']),
    mrr: z.number(),
    nextBillingDate: z.string(),
});
export type Subscription = z.infer<typeof subscriptionSchema>;

/**
 * Zod schema for a billing invoice.
 */
export const invoiceSchema = z.object({
    id: z.string(),
    school: z.string(),
    amount: z.number(),
    date: z.string(),
    dueDate: z.string(),
    status: z.enum(['Paid', 'Pending', 'Overdue']),
});
export type Invoice = z.infer<typeof invoiceSchema>;

export const invoiceFormSchema = z.object({
    school: z.string().min(3, 'School name is required.'),
    amount: z.coerce.number().positive('Amount must be a positive number.'),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
    dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid due date" }),
    status: z.enum(['Paid', 'Pending', 'Overdue']),
});
export type InvoiceFormData = z.infer<typeof invoiceFormSchema>;

export const expenseSchema = z.object({
    id: z.string(),
    date: z.string(),
    category: z.enum(['Marketing', 'Software', 'Office', 'Travel']),
    amount: z.number(),
    description: z.string(),
    // Additions for recurrence
    isRecurring: z.boolean().optional(),
    recurrenceType: z.enum(['daily', 'weekly', 'monthly', 'yearly']).optional(),
    endDate: z.string().optional().nullable(),
    parentId: z.string().optional().nullable(),
});
export type Expense = z.infer<typeof expenseSchema>;

export const expenseFormSchema = z.object({
    date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "A valid date is required" }),
    category: z.enum(['Marketing', 'Software', 'Office', 'Travel']),
    amount: z.coerce.number().positive('Amount must be a positive number.'),
    description: z.string().min(3, 'A description is required.'),
    // Additions for recurrence
    isRecurring: z.boolean(),
    recurrenceType: z.enum(['daily', 'weekly', 'monthly', 'yearly']).optional(),
    endDate: z.string().optional().nullable(),
}).refine(data => {
    if (data.isRecurring) {
        return !!data.recurrenceType; // If recurring, type must be set
    }
    return true;
}, {
    message: "Recurrence type is required for recurring expenses.",
    path: ["recurrenceType"],
});
export type ExpenseFormData = z.infer<typeof expenseFormSchema>;


// WHITE LABEL MANAGEMENT
/**
 * Zod schema for a school's branding settings.
 */
export const brandingSettingsSchema = z.object({
    schoolId: z.string(),
    logoUrl: z.string().url().optional(),
    primaryColor: z.string().regex(/^#[0-9a-f]{6}$/i),
});
export type BrandingSettings = z.infer<typeof brandingSettingsSchema>;

/**
 * Zod schema for a custom domain record.
 */
export const domainSchema = z.object({
    id: z.string().uuid(),
    domainName: z.string(),
    isPrimary: z.boolean(),
    status: z.enum(['Verified', 'Pending', 'Failed']),
});
export type Domain = z.infer<typeof domainSchema>;

/**
 * Zod schema for the Add/Edit Domain form.
 */
export const domainFormSchema = z.object({
    domainName: z.string().min(5, 'A valid domain name is required.'),
    isPrimary: z.boolean(),
    status: z.enum(['Verified', 'Pending', 'Failed']),
});
export type DomainFormData = z.infer<typeof domainFormSchema>;

/**
 * Zod schema for a selectable theme.
 */
export const themeSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    thumbnailUrl: z.string().url(),
});
export type Theme = z.infer<typeof themeSchema>;


// SUPPORT MANAGEMENT
/**
 * Zod schema for a support ticket record.
 */
export const supportTicketSchema = z.object({
    id: z.string(),
    school: z.string(),
    subject: z.string(),
    priority: z.enum(['Low', 'Medium', 'High']),
    status: z.enum(['New', 'In Progress', 'Resolved']),
    lastUpdate: z.string(),
    tags: z.array(z.string()).optional(),
});
export type SupportTicket = z.infer<typeof supportTicketSchema>;

/**
 * Zod schema for knowledge base analytics data.
 */
export const kbAnalyticsSchema = z.object({
    stats: z.array(statSchema),
    topSearches: z.array(z.object({ term: z.string(), count: z.number() })),
    deflectionData: z.array(z.object({ name: z.string(), tickets: z.number(), deflected: z.number() })),
});
export type KbAnalytics = z.infer<typeof kbAnalyticsSchema>;

// PROVIDER SCHOOL MANAGEMENT
export const providerSchoolSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    plan: z.enum(['Basic', 'Pro', 'Enterprise']),
    users: z.number(),
    status: z.enum(['Active', 'Inactive']),
});
export type ProviderSchool = z.infer<typeof providerSchoolSchema>;

export const providerSchoolFormSchema = z.object({
    name: z.string().min(3, 'School name must be at least 3 characters.'),
    plan: z.enum(['Basic', 'Pro', 'Enterprise']),
    status: z.enum(['Active', 'Inactive']),
});
export type ProviderSchoolFormData = z.infer<typeof providerSchoolFormSchema>;