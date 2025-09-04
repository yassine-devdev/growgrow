import { z } from 'zod';
import { statSchema } from './commonSchemas';

// Admin Dashboard
export const adminDashboardSchema = z.object({
    stats: z.array(statSchema),
    enrollmentTrend: z.array(z.object({
        name: z.string(),
        students: z.number(),
    })),
    actionItems: z.array(z.object({
        id: z.string(),
        text: z.string(),
        icon: z.string(),
        link: z.string(),
    })),
    recentAnnouncements: z.array(z.object({
        id: z.string(),
        title: z.string(),
        date: z.string(),
    })),
});
export type AdminDashboardData = z.infer<typeof adminDashboardSchema>;

export const classroomSchema = z.object({
    id: z.string(),
    name: z.string(),
    attendance: z.object({
        present: z.number(),
        total: z.number(),
    }),
    roster: z.array(z.string()),
});
export type Classroom = z.infer<typeof classroomSchema>;

// Teacher Dashboard
export const teacherDashboardSchema = z.object({
    stats: z.array(statSchema),
    schedule: z.array(z.object({
        time: z.string(),
        subject: z.string(),
        class: z.string(),
    })),
    assignmentsToGrade: z.array(z.object({
        id: z.string(),
        title: z.string(),
        course: z.string(),
        courseId: z.string(),
        dueDate: z.string(),
    })),
    classrooms: z.array(classroomSchema),
});
export type TeacherDashboardData = z.infer<typeof teacherDashboardSchema>;

// Student Dashboard
export const studentDashboardSchema = z.object({
    stats: z.array(statSchema),
    grades: z.array(z.object({
        subject: z.string(),
        score: z.number(),
    })),
    upcomingAssignments: z.array(z.object({
        id: z.string(),
        title: z.string(),
        course: z.string(),
        dueDate: z.string(),
        priority: z.enum(['High', 'Medium', 'Low']),
        status: z.enum(['Completed', 'Pending']),
    })),
});
export type StudentDashboardData = z.infer<typeof studentDashboardSchema>;

// Parent Dashboard
const deadlineSchema = z.object({
    id: z.string(),
    childName: z.string(),
    title: z.string(),
    type: z.enum(['assignment', 'event']),
    dueDate: z.string(),
});

const recentGradeSchema = z.object({
    id: z.string(),
    childName: z.string(),
    courseName: z.string(),
    grade: z.string(),
    postedDate: z.string(),
});

export const parentDashboardSchema = z.object({
    children: z.array(z.object({
        name: z.string(),
        stats: z.array(statSchema),
    })),
    announcements: z.array(z.object({
        id: z.string(),
        title: z.string(),
        date: z.string(),
    })),
    fees: z.object({
        amountDue: z.number(),
        dueDate: z.string(),
    }),
    upcomingDeadlines: z.array(deadlineSchema),
    recentGrades: z.array(recentGradeSchema),
});
export type ParentDashboardData = z.infer<typeof parentDashboardSchema>;

// Admissions Dashboard
export const admissionsDashboardSchema = z.object({
    stats: z.array(statSchema),
    applicationTrend: z.array(z.object({
        name: z.string(),
        applications: z.number(),
    })),
    needsReview: z.array(z.object({
        id: z.string(),
        name: z.string(),
        submitted: z.string(),
    })),
    applicantFunnel: z.array(z.object({
        stage: z.string(),
        count: z.number(),
    })),
    demographics: z.array(z.object({
        name: z.string(),
        value: z.number(),
    })),
});
export type AdmissionsDashboardData = z.infer<typeof admissionsDashboardSchema>;


// Individual Dashboard
export const individualDashboardSchema = z.object({
    stats: z.array(statSchema),
    recentActivity: z.array(z.object({
        id: z.string(),
        description: z.string(),
        timestamp: z.string(),
    })),
    suggestions: z.array(z.object({
        id: z.string(),
        name: z.string(),
        category: z.string(),
        image: z.string().url(),
    }))
});
export type IndividualDashboardData = z.infer<typeof individualDashboardSchema>;