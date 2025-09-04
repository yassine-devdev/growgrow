import { 
    dataConnectorSchema,
    type DataConnector,
    type DataConnectorFormData,
    connectorSchema,
    type ConnectorSchema
} from './schemas/appModulesSchemas';
import { apiClient } from './apiClient';

export const getDataConnectors = async (): Promise<DataConnector[]> => {
    const data = await apiClient<DataConnector[]>('/datastudio/connectors');
    return dataConnectorSchema.array().parse(data);
};

export const addConnector = (data: DataConnectorFormData): Promise<DataConnector> => {
    return apiClient('/datastudio/connectors', {
        method: 'POST',
        body: JSON.stringify(data),
    });
};

export const getConnectorSchema = async (type: DataConnectorFormData['type']): Promise<ConnectorSchema> => {
    const data = await apiClient<ConnectorSchema>(`/datastudio/connectors/schema?type=${encodeURIComponent(type)}`);
    return connectorSchema.parse(data);
};
