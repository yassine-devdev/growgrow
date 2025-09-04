import jwt from 'jsonwebtoken';
import config from '../config';
import { Role, User } from '../../../../types';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../db/prisma.service';

// A local type to represent the user object from Prisma, avoiding `any`.
type PrismaUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl: string | null;
  schoolId: string | null;
};

// A simple map to generate mock user data based on role
const userTemplates: Record<Role, Omit<User, 'id' | 'role'>> = {
    Provider: { name: 'SaaS Provider', email: 'provider@growyourneed.com', avatarUrl: 'https://i.pravatar.cc/150?u=provider' },
    Admin: { name: 'Jane Doe', email: 'admin@northwood.com', avatarUrl: 'https://i.pravatar.cc/150?u=admin' },
    Teacher: { name: 'John Smith', email: 'teacher@northwood.com', avatarUrl: 'https://i.pravatar.cc/150?u=teacher' },
    Student: { name: 'Alex Doe', email: 'student@northwood.com', avatarUrl: 'https://i.pravatar.cc/150?u=student' },
    Parent: { name: 'Sarah Doe', email: 'parent@family.com', avatarUrl: 'https://i.pravatar.cc/150?u=parent' },
    Admissions: { name: 'Emily White', email: 'admissions@northwood.com', avatarUrl: 'https://i.pravatar.cc/150?u=admissions' },
    Individual: { name: 'Chris Green', email: 'chris@individual.com', avatarUrl: 'https://i.pravatar.cc/150?u=individual' },
};

const mapPrismaUserToAppUser = (prismaUser: PrismaUser): User => {
    return {
        id: prismaUser.id,
        name: prismaUser.name,
        email: prismaUser.email,
        role: prismaUser.role as Role,
        avatarUrl: prismaUser.avatarUrl || undefined,
    };
};


export const generateTokenAndUser = async (role: Role): Promise<{ token: string; user: User }> => {
    if (!userTemplates[role]) {
        throw new Error('Invalid role specified');
    }

    const template = userTemplates[role];
    
    // Find or create the user in the database
    let dbUser = await prisma.user.findUnique({
        where: { email: template.email },
    });
    
    if (!dbUser) {
        // In a real app, schoolId would be dynamic
        const school = await prisma.school.findFirst();
        dbUser = await prisma.user.create({
            data: {
                name: template.name,
                email: template.email,
                role: role,
                avatarUrl: template.avatarUrl,
                schoolId: (role !== 'Provider' && role !== 'Individual' && school) ? school.id : null,
            }
        });
    }
    
    const user = mapPrismaUserToAppUser(dbUser);

    const payload = {
        id: user.id,
        role: user.role,
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 1 day
    };

    const token = jwt.sign(payload, config.jwt.secret);

    return { token, user };
};