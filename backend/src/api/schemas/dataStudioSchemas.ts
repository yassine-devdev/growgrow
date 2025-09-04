import { z } from 'zod';

export const dataConnectorSchema = z.object({
    id: z.string(),
    name: z.string(),
    type: z.enum(['PostgreSQL', 'Google Analytics', 'Stripe', 'CSV Upload', 'SQL Database']),
    status: z.enum(['Connected', 'Error', 'Syncing']),
    lastSync: z.string().datetime(),
});
export type DataConnector = z.infer<typeof dataConnectorSchema>;


export const dataConnectorFormSchema = z.object({
    name: z.string().min(3, 'A descriptive name is required.'),
    type: z.enum(['PostgreSQL', 'Google Analytics', 'Stripe', 'CSV Upload', 'SQL Database']),
    connectionString: z.string().optional(),
}).refine(data => {
    if (data.type === 'SQL Database') {
        return !!data.connectionString && data.connectionString.trim().length > 0;
    }
    return true;
}, {
    message: "Connection string is required for SQL Database type.",
    path: ["connectionString"],
});
export type DataConnectorFormData = z.infer<typeof dataConnectorFormSchema>;

export const connectorSchema = z.object({
    columns: z.array(z.string()),
});
export type ConnectorSchema = z.infer<typeof connectorSchema>;
