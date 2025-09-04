import React, { useEffect } from 'react';
import { useForm } from '@/hooks/useForm';
import { messageFormSchema, type MessageFormData } from '@/api/schemas/schoolHubSchemas';
import { sendMessage } from '@/api/schoolHubApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Modal from '@/components/ui/Modal';
import { Loader2 } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { QUERY_KEYS } from '@/constants/queries';
import InputField from '@/components/ui/InputField';

interface MessageComposerModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const initialState: MessageFormData = { to: '', subject: '', body: '' };

const MessageComposerModal: React.FC<MessageComposerModalProps> = ({ isOpen, onClose }) => {
    const queryClient = useQueryClient();
    const addToast = useAppStore(s => s.addToast);
    
    const mutation = useMutation({
        mutationFn: sendMessage,
        onSuccess: () => {
            addToast({ message: 'Message sent successfully!', type: 'success' });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.messages });
            onClose();
        },
        onError: (error: Error) => {
            addToast({ message: error.message || 'Failed to send message', type: 'error' });
        }
    });

    const { values, errors, isSubmitting, handleChange, handleSubmit, setValues } = useForm(
        initialState,
        messageFormSchema,
        async (vals) => { await mutation.mutateAsync(vals); }
    );

    useEffect(() => {
        if (isOpen) {
            setValues(initialState);
        }
    }, [isOpen, setValues]);
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="New Message">
            <form onSubmit={handleSubmit} noValidate>
                <div className="space-y-4">
                    <InputField name="to" label="To" type="email" value={values.to} onChange={handleChange} error={errors.to} placeholder="recipient@example.com" />
                    <InputField name="subject" label="Subject" value={values.subject} onChange={handleChange} error={errors.subject} />
                    <div>
                        <label htmlFor="body" className="block text-sm font-medium text-brand-text-alt">Body</label>
                        <textarea
                            id="body"
                            name="body"
                            value={values.body}
                            onChange={handleChange}
                            rows={8}
                            className={`mt-1 block w-full px-3 py-2 bg-brand-surface border ${errors.body ? 'border-red-500' : 'border-brand-border'} rounded-md`}
                        />
                        {errors.body && <p className="mt-1 text-sm text-red-500">{errors.body}</p>}
                    </div>
                </div>
                <div className="mt-6 flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-primary hover:bg-brand-primary-hover disabled:bg-brand-text-alt"
                    >
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Send
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default MessageComposerModal;