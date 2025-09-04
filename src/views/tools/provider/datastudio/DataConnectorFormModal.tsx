
import React, { useEffect, useState } from 'react';
import { useForm } from '@/hooks/useForm';
// FIX: Update import path for data connector schemas
import { dataConnectorFormSchema, type DataConnectorFormData, type DataConnector } from '@/api/schemas/appModulesSchemas';
import { addConnector, getConnectorSchema } from '@/api/dataStudioApi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { GoogleGenAI, Type } from "@google/genai";
import Modal from '@/components/ui/Modal';
import Dialog from '@/components/ui/Dialog';
import { Loader2, Wand2, ArrowRight, BrainCircuit } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useTranslation } from 'react-i18next';
import InputField from '@/components/ui/InputField';
import SelectField from '@/components/ui/SelectField';

interface DataConnectorFormModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AIFieldMapping: React.FC<{ connector: DataConnector, onComplete: () => void }> = ({ connector, onComplete }) => {
    const { data: schema, isLoading: isLoadingSchema } = useQuery({
        queryKey: ['connectorSchema', connector.id],
        queryFn: () => getConnectorSchema(connector.type),
    });
    
    const [isMapping, setIsMapping] = useState(false);
    const [mappedFields, setMappedFields] = useState<string | null>(null);

    const handleAutomap = async () => {
        if (!schema) return;
        setIsMapping(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `I have a new data source of type "${connector.type}" with the following columns: ${schema.columns.join(', ')}. Map these columns to standardized business intelligence fields (e.g., Date, Revenue, User ID, Campaign Name, Transaction ID). If a direct mapping doesn't exist for a BI field, suggest "N/A". Return a simple, readable text summary of the suggested mappings in a "BI Field -> Source Column" format.`;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setMappedFields(response.text);
        } catch (e) {
            console.error(e);
            setMappedFields('Could not generate AI mapping. Please try again.');
        }
        setIsMapping(false);
    };

    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-brand-text">Step 2: Review AI Field Mappings</h3>
            <div className="p-3 bg-brand-surface-alt rounded-md">
                <p className="text-sm font-semibold">Detected Schema Columns:</p>
                {isLoadingSchema ? <Loader2 className="animate-spin" /> : <p className="text-xs text-brand-text-alt">{schema?.columns.join(', ')}</p>}
            </div>
             <button
                onClick={handleAutomap}
                disabled={isMapping || !schema}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-primary-hover disabled:bg-brand-text-alt"
            >
                {isMapping ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                Auto-map fields with AI
            </button>
            {mappedFields && (
                 <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm font-semibold text-blue-800 flex items-center gap-2"><BrainCircuit className="w-4 h-4" /> AI Suggested Mapping:</p>
                    <pre className="text-sm text-blue-700 whitespace-pre-wrap mt-2 font-sans bg-white p-2 rounded">{mappedFields}</pre>
                </div>
            )}
            <div className="mt-6 flex justify-end">
                <button
                    onClick={onComplete}
                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                    Finish Setup
                </button>
            </div>
        </div>
    );
};

const initialState: DataConnectorFormData = { name: '', type: 'PostgreSQL', connectionString: '' };

const DataConnectorFormModal: React.FC<DataConnectorFormModalProps> = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const addToast = useAppStore(s => s.addToast);
    const [step, setStep] = useState(1);
    const [newConnector, setNewConnector] = useState<DataConnector | null>(null);
    const [isAiConfirmOpen, setIsAiConfirmOpen] = useState(false);
    const [pendingFormData, setPendingFormData] = useState<DataConnectorFormData | null>(null);

    const mutation = useMutation({
        mutationFn: (vars: { formData: DataConnectorFormData; shouldMap?: boolean }) => addConnector(vars.formData),
        onSuccess: (data, variables) => {
            addToast({ message: 'Connector added successfully.', type: 'success' });
            queryClient.invalidateQueries({ queryKey: ['dataConnectors'] });

            if (variables.shouldMap) {
                setNewConnector(data);
                setStep(2);
            } else {
                handleClose();
            }
        },
        onError: (error: Error) => {
            addToast({ message: error.message || 'Failed to add connector', type: 'error' });
        }
    });

    const handleFormSubmit = async (vals: DataConnectorFormData) => {
        if (['Google Analytics', 'Stripe'].includes(vals.type)) {
            setPendingFormData(vals);
            setIsAiConfirmOpen(true);
        } else {
            mutation.mutate({ formData: vals, shouldMap: false });
        }
    };

    const { values, errors, isSubmitting, handleChange, handleSubmit, setValues } = useForm(
        initialState,
        dataConnectorFormSchema,
        handleFormSubmit
    );
    
    const handleClose = () => {
        setStep(1);
        setNewConnector(null);
        setPendingFormData(null);
        setValues(initialState);
        onClose();
    };

    const handleConfirmAi = () => {
        if (pendingFormData) {
            mutation.mutate({ formData: pendingFormData, shouldMap: true });
        }
        setIsAiConfirmOpen(false);
    };

    const handleDeclineAi = () => {
        if (pendingFormData) {
            mutation.mutate({ formData: pendingFormData, shouldMap: false });
        }
        setIsAiConfirmOpen(false);
    };

    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setNewConnector(null);
            setValues(initialState);
        }
    }, [isOpen, setValues]);
    
    const title = step === 1 ? 'Add New Data Connector' : `Map Fields for ${newConnector?.name}`;

    return (
        <>
            <Modal isOpen={isOpen} onClose={handleClose} title={title}>
                {step === 1 ? (
                    <form onSubmit={handleSubmit} noValidate>
                        <p className="text-sm text-brand-text-alt mb-4">Manually configure your new data source connection.</p>
                        <div className="space-y-4">
                            <InputField name="name" label="Connection Name" value={values.name} onChange={handleChange} error={errors.name} placeholder="e.g., Production Postgres DB" />
                            <SelectField name="type" label="Connector Type" value={values.type} onChange={handleChange} error={errors.type}>
                                <option>PostgreSQL</option>
                                <option>SQL Database</option>
                                <option>Google Analytics</option>
                                <option>Stripe</option>
                                <option>CSV Upload</option>
                            </SelectField>
                            {values.type === 'SQL Database' && (
                                <InputField 
                                    name="connectionString" 
                                    label="Connection String" 
                                    value={values.connectionString || ''} 
                                    onChange={handleChange} 
                                    error={errors.connectionString} 
                                    placeholder="e.g., postgresql://user:pass@host:port/db" 
                                />
                            )}
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-primary-hover disabled:bg-brand-text-alt">
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isSubmitting ? 'Connecting...' : 'Connect & Proceed'}
                                {!isSubmitting && <ArrowRight className="w-4 h-4" />}
                            </button>
                        </div>
                    </form>
                ) : newConnector ? (
                    <AIFieldMapping connector={newConnector} onComplete={handleClose} />
                ) : null}
            </Modal>
            <Dialog
                isOpen={isAiConfirmOpen}
                onClose={handleDeclineAi}
                onConfirm={handleConfirmAi}
                title={t('views.dataConnectorForm.aiConfirmTitle')}
                description={t('views.dataConnectorForm.aiConfirmDescription')}
                confirmText={t('views.dataConnectorForm.aiConfirmButton')}
                cancelText={t('views.dataConnectorForm.aiSkipButton')}
            />
        </>
    );
};

export default DataConnectorFormModal;
