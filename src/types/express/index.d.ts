// FIX: The import was causing type conflicts with Express's RequestHandler.
// It has been removed and the Role type is now hardcoded to isolate this declaration file.
// import { User, Role } from '../../../../types';

// Extend the Express Request object to include the user payload from the JWT
declare global {
  namespace Express {
    export interface Request {
      user?: {
        id: string;
        role: 'Provider' | 'Admin' | 'Teacher' | 'Student' | 'Parent' | 'Admissions' | 'Individual';
      };
    }
  }
}

// FIX: Add empty export to ensure this file is treated as a module.
export {};
