// FIX: Changed from require to import to resolve module type issues.
// FIX: Changed from namespace import to named imports for PrismaClient and enums.
import { PrismaClient, SchoolType, Plan, Status, Role } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';


const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('Start seeding...');

  // Seed Schools
  const northwood = await prisma.school.create({
    data: {
      id: 'northwood-high',
      name: 'Northwood High',
      domain: 'northwood-high',
      type: SchoolType.K_12,
      plan: Plan.Enterprise,
      status: Status.Active,
    },
  });

  const southpark = await prisma.school.create({
    data: {
      id: 'south-park-elementary',
      name: 'South Park Elementary',
      domain: 'south-park-elementary',
      type: SchoolType.K_12,
      plan: Plan.Pro,
      status: Status.Active,
    },
  });

  console.log('Seeded 2 schools');

  // Seed Users
  await prisma.user.create({
    data: {
      id: uuidv4(),
      name: 'SaaS Provider',
      email: 'provider@growyourneed.com',
      role: Role.Provider,
      avatarUrl: `https://i.pravatar.cc/150?u=provider`,
    },
  });
  
  await prisma.user.create({
    data: {
      id: uuidv4(),
      name: 'Jane Doe',
      email: 'admin@northwood.com',
      role: Role.Admin,
      avatarUrl: `https://i.pravatar.cc/150?u=admin`,
      schoolId: northwood.id,
    },
  });

  await prisma.user.create({
    data: {
      id: uuidv4(),
      name: 'John Smith',
      email: 'teacher@northwood.com',
      role: Role.Teacher,
      avatarUrl: `https://i.pravatar.cc/150?u=teacher`,
      schoolId: northwood.id,
    },
  });

  await prisma.user.create({
    data: {
      id: uuidv4(),
      name: 'Alex Doe',
      email: 'student@northwood.com',
      role: Role.Student,
      avatarUrl: `https://i.pravatar.cc/150?u=student`,
      schoolId: northwood.id,
    },
  });
  
  await prisma.user.create({
    data: {
      id: uuidv4(),
      name: 'Sarah Doe',
      email: 'parent@family.com',
      role: Role.Parent,
      avatarUrl: `https://i.pravatar.cc/150?u=parent`,
      schoolId: northwood.id,
    },
  });
  
   await prisma.user.create({
    data: {
      id: uuidv4(),
      name: 'Emily White',
      email: 'admissions@northwood.com',
      role: Role.Admissions,
      avatarUrl: `https://i.pravatar.cc/150?u=admissions`,
      schoolId: northwood.id,
    },
  });

   await prisma.user.create({
    data: {
      id: uuidv4(),
      name: 'Chris Green',
      email: 'chris@individual.com',
      role: Role.Individual,
      avatarUrl: `https://i.pravatar.cc/150?u=individual`,
    },
  });


  console.log('Seeded 7 users');

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    // FIX: Cast process to `any` to bypass TS error when types are misconfigured.
    (process as any).exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });