import { z } from 'zod';

/**
 * Zod schema for a single service's status.
 */
export const serviceStatusSchema = z.object({
  name: z.string(),
  status: z.enum(['Operational', 'Degraded Performance', 'Under Maintenance', 'Outage']),
  responseTime: z.string(),
  uptime: z.string(),
});
export type ServiceStatus = z.infer<typeof serviceStatusSchema>;

/**
 * Zod schema for a system incident.
 */
export const incidentSchema = z.object({
  id: z.string(),
  service: z.string(),
  severity: z.enum(['Low', 'Medium', 'High', 'Critical']),
  status: z.enum(['Investigating', 'Identified', 'Monitoring', 'Resolved']),
  timestamp: z.string().datetime(),
});
export type Incident = z.infer<typeof incidentSchema>;

/**
 * Zod schema for system logs.
 */
export const logSchema = z.array(z.string());
export type Log = z.infer<typeof logSchema>;

/**
 * Zod schema for a system alert.
 */
export const alertSchema = z.object({
  id: z.string(),
  severity: z.enum(['Info', 'Warning', 'Critical']),
  message: z.string(),
  timestamp: z.string().datetime(),
});
export type Alert = z.infer<typeof alertSchema>;