// FIX: Update import to reflect schema consolidation.
import { DataConnector, DataConnectorFormData } from '../../../../../api/schemas/appModulesSchemas';
import { v4 as uuidv4 } from 'uuid';

let mockDataConnectors: DataConnector[] = [
    { id: 'conn-1', name: 'Production Postgres', type: 'PostgreSQL', status: 'Connected', lastSync: new Date(Date.now() - 1 * 3600000).toISOString() },
    { id: 'conn-2', name: 'Main Website Analytics', type: 'Google Analytics', status: 'Syncing', lastSync: new Date(Date.now() - 24 * 3600000).toISOString() },
    { id: 'conn-3', name: 'Payment Processor', type: 'Stripe', status: 'Error', lastSync: new Date(Date.now() - 2 * 3600000).toISOString() },
];

export const getDataConnectors = async () => Promise.resolve(mockDataConnectors);

export const addConnector = async (data: DataConnectorFormData): Promise<DataConnector> => {
    const newConnector: DataConnector = {
        id: `conn-${uuidv4()}`,
        name: data.name,
        type: data.type,
        status: 'Syncing',
        lastSync: new Date().toISOString(),
    };
    mockDataConnectors.push(newConnector);
    // Simulate a delay for the sync
    setTimeout(() => {
        const index = mockDataConnectors.findIndex(c => c.id === newConnector.id);
        if (index > -1) {
            mockDataConnectors[index].status = 'Connected';
            mockDataConnectors[index].lastSync = new Date().toISOString();
        }
    }, 5000);
    return Promise.resolve(newConnector);
};

const mockSchemas = {
    'PostgreSQL': { columns: ['user_id', 'created_at', 'plan_type', 'monthly_spend'] },
    'Google Analytics': { columns: ['ga:date', 'ga:source', 'ga:medium', 'ga:users', 'ga:newUsers', 'ga:sessions'] },
    'Stripe': { columns: ['id', 'amount', 'created', 'currency', 'customer', 'description'] },
    'CSV Upload': { columns: [] },
    'SQL Database': { columns: [] },
};

export const getConnectorSchema = async (type: string) => Promise.resolve(mockSchemas[type as keyof typeof mockSchemas] || { columns: [] });
