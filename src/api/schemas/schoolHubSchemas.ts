import { z } from 'zod';

// ACADEMICS
export const courseSchema = z.object({
    id: z.string(),
    name: z.string(),
    teacher: z.string(),
    period: z.number(),
    students: z.number(),
});
export type Course = z.infer<typeof courseSchema>;

export const courseResourceSchema = z.object({
    id: z.string(),
    title: z.string(),
    type: z.enum(['document', 'link', 'video']),
});
export type CourseResource = z.infer<typeof courseResourceSchema>;

export const courseDetailSchema = z.object({
    id: z.string(),
    name: z.string(),
    teacher: z.string(),
    description: z.string(),
    assignments: z.array(z.object({
        id: z.string(),
        title: z.string(),
        dueDate: z.string(),
    })),
    resources: z.array(courseResourceSchema),
    roster: z.array(z.object({
        id: z.string(),
        name: z.string(),
    })).optional(), // Roster is optional (e.g., for students)
});
export type CourseDetail = z.infer<typeof courseDetailSchema>;

export const gradeSchema = z.object({
    courseId: z.string(),
    courseName: z.string(),
    grade: z.string(),
    score: z.number(),
});
export type Grade = z.infer<typeof gradeSchema>;

export const assignmentSchema = z.object({
    id: z.string(),
    title: z.string(),
    course: z.string(),
    dueDate: z.string(),
    maxPoints: z.number(),
    status: z.enum(['Submitted', 'Graded', 'Not Submitted']).optional(),
});
export type Assignment = z.infer<typeof assignmentSchema>;

export const assignmentFormSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters.'),
    description: z.string().min(10, 'Description must be at least 10 characters.'),
    course: z.string().min(1, 'Please select a course.'),
    dueDate: z.string().refine(val => !isNaN(Date.parse(val)), { message: 'Invalid date format.' }),
    maxPoints: z.coerce.number().int().min(1, 'Max points must be at least 1.'),
});
export type AssignmentFormData = z.infer<typeof assignmentFormSchema>;

export const submissionSchema = z.object({
    studentId: z.string(),
    studentName: z.string(),
    status: z.enum(['Submitted', 'Not Submitted', 'Graded']),
    submittedAt: z.string().datetime().nullable(),
    grade: z.number().nullable(),
});
export type Submission = z.infer<typeof submissionSchema>;

export const assignmentSubmissionsSchema = z.object({
    assignment: assignmentSchema.extend({ description: z.string() }), // Details view needs description
    submissions: z.array(submissionSchema),
});
export type AssignmentSubmissions = z.infer<typeof assignmentSubmissionsSchema>;

export const lessonPlanSchema = z.object({
    id: z.string(),
    title: z.string(),
    course: z.string(),
    date: z.string(),
    objectives: z.string(),
    materials: z.string(),
    activities: z.string(),
});
export type LessonPlan = z.infer<typeof lessonPlanSchema>;

export const lessonPlanFormSchema = z.object({
    title: z.string().min(3, 'Title is required.'),
    course: z.string().min(1, 'Course is required.'),
    date: z.string().refine(val => !isNaN(Date.parse(val)), { message: "Invalid date" }),
    objectives: z.string().min(10, 'Objectives are required.'),
    materials: z.string(),
    activities: z.string().min(10, 'Activities are required.'),
});
export type LessonPlanFormData = z.infer<typeof lessonPlanFormSchema>;


// GRADEBOOK
export const gradebookAssignmentSchema = z.object({
    id: z.string(),
    title: z.string(),
    maxPoints: z.number(),
});
export type GradebookAssignment = z.infer<typeof gradebookAssignmentSchema>;

export const studentGradeSchema = z.object({
    studentId: z.string(),
    assignmentId: z.string(),
    score: z.number().nullable(),
    feedback: z.string().optional(),
});
export type StudentGrade = z.infer<typeof studentGradeSchema>;

export const gradebookStudentSchema = z.object({
    id: z.string(),
    name: z.string(),
});
export type GradebookStudent = z.infer<typeof gradebookStudentSchema>;

export const gradebookSchema = z.object({
    courseName: z.string(),
    assignments: z.array(gradebookAssignmentSchema),
    students: z.array(gradebookStudentSchema),
    grades: z.array(studentGradeSchema),
});
export type GradebookData = z.infer<typeof gradebookSchema>;


// PEOPLE
export const personSchema = z.object({
    id: z.string(),
    name: z.string(),
    gradeLevel: z.number().optional(),
    department: z.string().optional(),
});
export type Person = z.infer<typeof personSchema>;

// BILLING
export const schoolBillingSummarySchema = z.object({
    subscription: z.object({
        plan: z.string(),
        status: z.string(),
        nextBillingDate: z.string(),
        amount: z.number(),
    }),
    invoiceHistory: z.array(z.object({
        id: z.string(),
        date: z.string(),
        amount: z.number(),
        status: z.string(),
    })),
});
export type SchoolBillingSummary = z.infer<typeof schoolBillingSummarySchema>;

// TOOLS
export const calendarEventSchema = z.object({
    id: z.number(),
    title: z.string(),
    date: z.string(),
    type: z.enum(['academic', 'school', 'personal']),
});
export type CalendarEvent = z.infer<typeof calendarEventSchema>;

// COMMS
export const messageSchema = z.object({
    id: z.number(),
    from: z.string(),
    subject: z.string(),
    read: z.boolean(),
    body: z.string(),
});
export type Message = z.infer<typeof messageSchema>;

export const messageFormSchema = z.object({
    to: z.string().email('Please enter a valid recipient email.'),
    subject: z.string().min(3, 'Subject is required.'),
    body: z.string().min(1, 'Message body cannot be empty.'),
});
export type MessageFormData = z.infer<typeof messageFormSchema>;


export const announcementSchema = z.object({
    id: z.number(),
    title: z.string(),
    date: z.string(),
    content: z.string(),
});
export type Announcement = z.infer<typeof announcementSchema>;

export const announcementFormSchema = z.object({
    title: z.string().min(3, 'Title is required.'),
    content: z.string().min(10, 'Content must be at least 10 characters.'),
});
export type AnnouncementFormData = z.infer<typeof announcementFormSchema>;


// KNOWLEDGE
export const resourceSchema = z.object({
    id: z.number(),
    title: z.string(),
    type: z.enum(['document', 'link', 'video']),
});
export type Resource = z.infer<typeof resourceSchema>;

// SYSTEM
export const profileSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    role: z.string(),
    avatarUrl: z.string().url().optional(),
    notificationPreferences: z.object({
        email: z.boolean(),
        push: z.boolean(),
    }),
});
export type Profile = z.infer<typeof profileSchema>;

export const profileFormSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters.'),
    email: z.string().email('Please enter a valid email address.'),
    notificationPreferences: z.object({
        email: z.boolean(),
        push: z.boolean(),
    }),
});
export type ProfileFormData = z.infer<typeof profileFormSchema>;

export const notificationChannelSchema = z.object({
    email: z.boolean(),
    push: z.boolean(),
});

export const notificationSettingsSchema = z.object({
    grades: notificationChannelSchema,
    assignments: notificationChannelSchema,
    announcements: notificationChannelSchema,
});
export type NotificationSettings = z.infer<typeof notificationSettingsSchema>;