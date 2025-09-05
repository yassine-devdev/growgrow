// FIX: Changed from require to import to resolve module type issues.
// FIX: Changed from namespace import to named imports for PrismaClient and enums.
import { PrismaClient } from "@prisma/client";
// Local enum definitions to ensure seed works even if generated Prisma enums
// are not available at compile time. These mirror the values in schema.prisma
// and are safe to use at runtime (Prisma accepts the matching string values).
enum SchoolType {
  K_12 = "K_12",
  University = "University",
  Vocational = "Vocational",
  Other = "Other",
}

enum Plan {
  Basic = "Basic",
  Pro = "Pro",
  Enterprise = "Enterprise",
}

enum Status {
  Active = "Active",
  Inactive = "Inactive",
  Invited = "Invited",
  Suspended = "Suspended",
}

enum Role {
  Provider = "Provider",
  Admin = "Admin",
  Teacher = "Teacher",
  Student = "Student",
  Parent = "Parent",
  Admissions = "Admissions",
  Individual = "Individual",
}
import { v4 as uuidv4 } from "uuid";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  // Use bcrypt for secure, modern password hashing.
  const saltRounds = 10;
  return bcrypt.hashSync(password, saltRounds);
}

async function main(): Promise<void> {
  console.log("Start seeding...");

  // Seed Schools
  const northwood = await prisma.school.create({
    data: {
      id: "northwood-high",
      name: "Northwood High",
      domain: "northwood-high",
      type: SchoolType.K_12,
      plan: Plan.Enterprise,
      status: Status.Active,
    },
  });

  const southpark = await prisma.school.create({
    data: {
      id: "south-park-elementary",
      name: "South Park Elementary",
      domain: "south-park-elementary",
      type: SchoolType.K_12,
      plan: Plan.Pro,
      status: Status.Active,
    },
  });

  console.log("Seeded 2 schools");

  // Seed Users
  await prisma.user.create({
    data: {
      id: uuidv4(),
      name: "SaaS Provider",
      email: "provider@growyourneed.com",
      username: "provider",
      password: hashPassword("123"),
      role: Role.Provider,
      avatarUrl: `https://i.pravatar.cc/150?u=provider`,
    },
  });

  await prisma.user.create({
    data: {
      id: uuidv4(),
      name: "Jane Doe",
      email: "admin@northwood.com",
      username: "admin",
      password: hashPassword("123"),
      role: Role.Admin,
      avatarUrl: `https://i.pravatar.cc/150?u=admin`,
      schoolId: northwood.id,
    },
  });

  await prisma.user.create({
    data: {
      id: uuidv4(),
      name: "John Smith",
      email: "teacher@northwood.com",
      username: "teacher",
      password: hashPassword("123"),
      role: Role.Teacher,
      avatarUrl: `https://i.pravatar.cc/150?u=teacher`,
      schoolId: northwood.id,
    },
  });

  const student = await prisma.user.create({
    data: {
      id: uuidv4(),
      name: "Alex Doe",
      email: "student@northwood.com",
      username: "student",
      password: hashPassword("123"),
      role: Role.Student,
      avatarUrl: `https://i.pravatar.cc/150?u=student`,
      schoolId: northwood.id,
    },
  });

  await prisma.user.create({
    data: {
      id: uuidv4(),
      name: "Sarah Doe",
      email: "parent@family.com",
      username: "parent",
      password: hashPassword("123"),
      role: Role.Parent,
      avatarUrl: `https://i.pravatar.cc/150?u=parent`,
      // Establish the parent-child relationship
      children: {
        connect: { id: student.id },
      },
      schoolId: northwood.id,
    },
  });

  await prisma.user.create({
    data: {
      id: uuidv4(),
      name: "Emily White",
      email: "admissions@northwood.com",
      role: Role.Admissions,
      username: "admissions",
      password: hashPassword("123"),
      avatarUrl: `https://i.pravatar.cc/150?u=admissions`,
      schoolId: northwood.id,
    },
  });

  await prisma.user.create({
    data: {
      id: uuidv4(),
      name: "Chris Green",
      email: "chris@individual.com",
      role: Role.Individual,
      username: "individual",
      password: hashPassword("123"),
      avatarUrl: `https://i.pravatar.cc/150?u=individual`,
    },
  });

  console.log("Seeded 7 users");

  // Seed Audit Logs
  await prisma.auditLog.createMany({
    data: [
      {
        id: uuidv4(),
        timestamp: new Date(Date.now() - 1 * 3600000).toISOString(),
        actor: "Provider: john@growyourneed.com",
        action: "Generated new API key for 'Billing Integration'",
        ipAddress: "192.168.1.1",
      },
      {
        id: uuidv4(),
        timestamp: new Date(Date.now() - 5 * 3600000).toISOString(),
        actor: "Admin: admin@northwood.com",
        action: "Changed subscription plan from 'Pro' to 'Enterprise'",
        ipAddress: "203.0.113.25",
      },
      {
        id: uuidv4(),
        timestamp: new Date(Date.now() - 1 * 86400000).toISOString(),
        actor: "Provider: jane@growyourneed.com",
        action: "Deleted school 'South Park Elementary'",
        ipAddress: "198.51.100.12",
      },
      {
        id: uuidv4(),
        timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
        actor: "Admin: admin@northwood.com",
        action: "Updated school branding settings",
        ipAddress: "203.0.113.25",
      },
    ],
  });
  console.log("Seeded 4 audit logs");

  // Seed Security Roles
  await prisma.securityRole.createMany({
    data: [
      { id: "role-1", name: "Provider", permissions: 150 },
      { id: "role-2", name: "Admin", permissions: 120 },
      { id: "role-3", name: "Teacher", permissions: 80 },
      { id: "role-4", name: "Student", permissions: 30 },
      { id: "role-5", name: "Parent", permissions: 25 },
    ],
  });
  console.log("Seeded 5 security roles");

  // Seed API Keys
  await prisma.apiKey.createMany({
    data: [
      {
        id: uuidv4(),
        name: "Billing Integration Key",
        lastUsed: new Date(Date.now() - 1 * 3600000).toISOString(),
        status: "Active",
      },
      {
        id: uuidv4(),
        name: "Legacy Marketing API",
        lastUsed: new Date(Date.now() - 30 * 86400000).toISOString(),
        status: "Revoked",
      },
    ],
  });
  console.log("Seeded 2 API keys");

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    // Set exit code and exit with failure.
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
