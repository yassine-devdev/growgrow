import { prisma } from "../prisma.service";
import { PaginatedResponse } from "types";
import {
  LessonPlan,
  LessonPlanFormData,
} from "../../../../src/api/schemas/schoolHubSchemas";
import {
  AdminDashboardData,
  TeacherDashboardData,
  StudentDashboardData,
  ParentDashboardData,
  AdmissionsDashboardData,
} from "../../../../src/api/schemas/dashboardSchemas";
import { AcademicHealthData } from "../../../../src/api/schemas/adminSchemas";
import { v4 as uuidv4 } from "uuid";

// --- In-memory store for Lesson Plans ---
let lessonPlansStore: LessonPlan[] = [
  {
    id: "lp-1",
    title: "Introduction to Algebra",
    course: "Algebra II",
    date: "2024-09-05",
    objectives: "Understand variables and expressions.",
    materials: "Whiteboard, markers, textbook",
    activities:
      "- Lecture on variables\n- Group work on practice problems\n- Exit ticket quiz",
  },
  {
    id: "lp-2",
    title: "The Roman Empire",
    course: "World History",
    date: "2024-09-06",
    objectives: "Identify key figures of the Roman Empire.",
    materials: "Slideshow, map, handouts",
    activities:
      "- Presentation on Roman history\n- Map labeling activity\n- Class discussion",
  },
];

export const getLessonPlans = async (): Promise<LessonPlan[]> => {
  return Promise.resolve(lessonPlansStore);
};

export const saveLessonPlan = async (
  planData: LessonPlanFormData & { id?: string }
): Promise<LessonPlan> => {
  if (planData.id) {
    // Update
    const index = lessonPlansStore.findIndex((p) => p.id === planData.id);
    if (index > -1) {
      lessonPlansStore[index] = { ...lessonPlansStore[index], ...planData };
      return Promise.resolve(lessonPlansStore[index]);
    }
  }
  // Create
  const newPlan: LessonPlan = { ...planData, id: `lp-${uuidv4()}` };
  lessonPlansStore.push(newPlan);
  return Promise.resolve(newPlan);
};

export const deleteLessonPlan = async (
  id: string
): Promise<{ success: boolean }> => {
  lessonPlansStore = lessonPlansStore.filter((p) => p.id !== id);
  return Promise.resolve({ success: true });
};

export const getAcademicHealthData = async (): Promise<AcademicHealthData> => ({
  stats: [
    { label: "Avg. GPA", value: "3.4", icon: "GraduationCap" as const },
    { label: "Attendance Rate", value: "94.7%", icon: "UserCheck" as const },
    { label: "Passing Rate", value: "88%", icon: "TrendingUp" as const },
    { label: "At-Risk Students", value: "42", icon: "ShieldAlert" as const },
  ],
  enrollmentTrend: [
    { month: "Jan", enrollment: 1390 },
    { month: "Feb", enrollment: 1400 },
    { month: "Mar", enrollment: 1410 },
    { month: "Apr", enrollment: 1405 },
    { month: "May", enrollment: 1428 },
  ],
  subjectPerformance: [
    { subject: "Math", averageScore: 82, passRate: 88 },
    { subject: "Science", averageScore: 85, passRate: 92 },
    { subject: "History", averageScore: 88, passRate: 95 },
    { subject: "English", averageScore: 84, passRate: 90 },
  ],
});

export const getAdminDashboardData = async (): Promise<AdminDashboardData> => ({
  stats: [
    {
      label: "Total Students",
      value: "1,428",
      change: "+2.1%",
      icon: "Users" as const,
    },
    { label: "Teaching Staff", value: "86", icon: "GraduationCap" as const },
    {
      label: "Avg. Attendance",
      value: "94.7%",
      change: "-0.5%",
      icon: "UserCheck" as const,
    },
    { label: "Pending Applications", value: "12", icon: "UserPlus" as const },
  ],
  enrollmentTrend: [
    { name: "Jan", students: 1390 },
    { name: "Feb", students: 1400 },
    { name: "May", students: 1428 },
  ],
  actionItems: [
    {
      id: "1",
      text: "Review 5 new staff applications",
      icon: "FileCheck",
      link: "#",
    },
  ],
  recentAnnouncements: [
    {
      id: "a1",
      title: "Parent-Teacher Conferences Next Week",
      date: "2 days ago",
    },
  ],
});

export const getTeacherDashboardData =
  async (): Promise<TeacherDashboardData> => ({
    stats: [
      { label: "Your Classes", value: "5", icon: "BookOpen" as const },
      { label: "Total Students", value: "124", icon: "Users" as const },
    ],
    schedule: [{ time: "09:00", subject: "Algebra II", class: "Grade 10" }],
    assignmentsToGrade: [
      {
        id: "assign-1",
        title: "Chapter 5 Homework",
        course: "Algebra II",
        courseId: "ALG-2",
        dueDate: "Yesterday",
      },
    ],
    classrooms: [
      {
        id: "c1",
        name: "Homeroom 10B",
        attendance: { present: 28, total: 30 },
        roster: ["Alex", "Brian", "Chloe"],
      },
    ],
  });

export const getStudentDashboardData =
  async (): Promise<StudentDashboardData> => ({
    stats: [
      { label: "Current GPA", value: "3.8", icon: "GraduationCap" as const },
      { label: "Attendance", value: "98%", icon: "UserCheck" as const },
    ],
    grades: [],
    upcomingAssignments: [
      {
        id: "assign-2",
        title: "History Essay",
        course: "World History",
        dueDate: "Tomorrow",
        priority: "High",
        status: "Pending",
      },
    ],
  });

export const getParentDashboardData =
  async (): Promise<ParentDashboardData> => ({
    children: [
      {
        name: "Alex Doe",
        stats: [{ label: "GPA", value: "3.8", icon: "GraduationCap" as const }],
      },
    ],
    announcements: [
      {
        id: "a1",
        title: "Parent-Teacher Conferences Next Week",
        date: "2 days ago",
      },
    ],
    fees: { amountDue: 150.0, dueDate: "2024-10-01" },
    upcomingDeadlines: [
      {
        id: "d1",
        childName: "Alex Doe",
        title: "History Essay",
        type: "assignment",
        dueDate: "Tomorrow",
      },
    ],
    recentGrades: [
      {
        id: "g1",
        childName: "Alex Doe",
        courseName: "Algebra II",
        grade: "A-",
        postedDate: "Yesterday",
      },
    ],
  });

export const getAdmissionsDashboardData =
  async (): Promise<AdmissionsDashboardData> => ({
    stats: [
      {
        label: "New Applications",
        value: "58",
        change: "+10",
        icon: "FilePlus" as const,
      },
      { label: "Pending Review", value: "12", icon: "Eye" as const },
      {
        label: "Offers Accepted",
        value: "25",
        change: "+5%",
        icon: "UserCheck" as const,
      },
      { label: "Enrollment Rate", value: "65%", icon: "TrendingUp" as const },
    ],
    applicationTrend: [
      { name: "Jan", applications: 20 },
      { name: "Feb", applications: 35 },
      { name: "Mar", applications: 40 },
      { name: "Apr", applications: 50 },
    ],
    needsReview: [{ id: "app-1", name: "Charlie Brown", submitted: "Today" }],
    applicantFunnel: [
      { stage: "Applied", count: 150 },
      { stage: "Reviewing", count: 58 },
    ],
    demographics: [
      { name: "Domestic", value: 120 },
      { name: "International", value: 30 },
    ],
  });
