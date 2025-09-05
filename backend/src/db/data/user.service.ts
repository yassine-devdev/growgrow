import { prisma } from "../prisma.service";
import { PaginatedResponse } from "types";

// Local DTOs for provider-facing data shapes to avoid importing frontend schema files
type Teacher = {
  id: string;
  name: string;
  email: string;
  school: string;
  subject: string;
  yearsExperience: number;
  status: string;
};
type SchoolUser = {
  id: string;
  name: string;
  email: string;
  school: string;
  grade?: number;
  children?: string[];
  status: string;
};
type Admin = {
  id: string;
  name: string;
  email: string | undefined;
  role: string;
  school: string;
  lastLogin: string;
  status: string;
};

// Avoid importing DB model types directly here to prevent coupling; use local aliases for mapped DB rows
type DBUser = {
  id: string;
  name: string;
  lastName: string;
  email: string;
  role: string;
  schoolId: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  lastLogin: string | Date;
  subject: string;
  grade: number;
  children: Array<Record<string, string>>;
};

interface PaginatedQuery {
  page?: string;
  pageSize?: string;
  search?: string;
  range?: string;
}

/**
 * A generic, reusable function to query, paginate, and format users by role.
 * This consolidates the logic previously duplicated in getAdmins, getTeachers, etc.
 * @param query - Pagination and search options.
 * @param role - The user role to filter by.
 * @param formatter - A function to transform a Prisma User object into the desired DTO.
 * @returns A paginated response of formatted user data.
 */
async function queryAndFormatUsers<T>(
  query: PaginatedQuery,
  role: "Admin" | "Teacher" | "Student" | "Parent",
  formatter: (user: DBUser) => T
): Promise<PaginatedResponse<T>> {
  const page = parseInt(query.page || "1");
  const pageSize = parseInt(query.pageSize || "10");

  const where = { role };

  const [users, totalCount] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.user.count({ where }),
  ]);

  const formattedUsers = users.map(formatter as (u: any) => T);

  const pageCount = Math.ceil(totalCount / pageSize);

  return { rows: formattedUsers, pageCount, rowCount: totalCount };
}

export const getAdmins = async (
  query: PaginatedQuery
): Promise<PaginatedResponse<Admin>> => {
  const formatter = (u: DBUser): Admin => ({
    id: u.id,
    name: `${u.name}${u.lastName ? ` ${u.lastName}` : ""}`.trim(),
    email: u.email,
    role: "Admin",
    school: u.schoolId || "N/A",
    lastLogin: new Date(
      u.lastLogin || u.updatedAt || u.createdAt
    ).toISOString(),
    status: "Active",
  });
  return queryAndFormatUsers(query, "Admin", formatter);
};

export const getTeachers = async (
  query: PaginatedQuery
): Promise<PaginatedResponse<Teacher>> => {
  const formatter = (t: DBUser): Teacher => ({
    id: t.id,
    name: `${t.name}${t.lastName ? ` ${t.lastName}` : ""}`.trim(),
    email: t.email,
    school: t.schoolId || "N/A",
    subject: t.subject || "General",
    yearsExperience: Math.max(
      1,
      Math.floor(new Date().getFullYear() - new Date(t.createdAt).getFullYear())
    ),
    status: "Active",
  });
  return queryAndFormatUsers(query, "Teacher", formatter);
};

export const getStudents = async (
  query: PaginatedQuery
): Promise<PaginatedResponse<SchoolUser>> => {
  const formatter = (s: DBUser): SchoolUser => ({
    id: s.id,
    name: `${s.name}${s.lastName ? ` ${s.lastName}` : ""}`.trim(),
    email: s.email,
    school: s.schoolId || "N/A",
    grade: typeof s.grade === "number" ? s.grade : 10,
    status: "Active",
  });
  return queryAndFormatUsers(query, "Student", formatter);
};

export const getParents = async (
  query: PaginatedQuery
): Promise<PaginatedResponse<SchoolUser>> => {
  const formatter = (p: DBUser): SchoolUser => ({
    id: p.id,
    name: `${p.name}${p.lastName ? ` ${p.lastName}` : ""}`.trim(),
    email: p.email,
    school: p.schoolId || "N/A",
    children: Array.isArray(p.children)
      ? p.children.map((c: { name?: string } | string) =>
          typeof c === "string" ? c : c.name || ""
        )
      : [],
    status: "Active",
  });
  return queryAndFormatUsers(query, "Parent", formatter);
};
