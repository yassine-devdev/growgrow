import React, { useState, useCallback } from 'react';
import { z } from 'zod';

/**
 * A generic object where keys are from type T, and values are strings.
 * Used for storing form validation errors.
 * @template T
 */
type FormErrors<T> = Partial<Record<keyof T, string>>;

/**
 * A generic hook for managing form state, handling changes, and performing validation with Zod.
 *
 * @template T - The type of the form's state object.
 * @param {T} initialState - The initial state of the form values.
 * @param {z.Schema<T>} schema - The Zod schema to use for validation.
 * @param {(values: T) => Promise<void>} onSubmit - An async function to be called with the validated form values upon successful submission.
 * @returns {{
 *   values: T,
 *   errors: FormErrors<T>,
 *   isSubmitting: boolean,
 *   handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void,
 *   handleSubmit: (e: React.FormEvent) => Promise<void>,
 *   setValues: React.Dispatch<React.SetStateAction<T>>
 * }} An object containing form state and handler functions.
 */
export const useForm = <T extends object>(
    initialState: T,
    schema: z.Schema<T>,
    onSubmit: (values: T) => Promise<void>
) => {
    const [values, setValues] = useState<T>(initialState);
    const [errors, setErrors] = useState<FormErrors<T>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    /**
     * Handles changes to form inputs and updates the form state.
     * Supports nested state objects (e.g., `name="section.field"`) and checkbox inputs.
     */
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target as any;
        
        let processedValue: string | boolean = value;
        if (type === 'checkbox') {
            // Some test environments mock events and may provide 'checked' or string 'on'.
            const targetAny: any = e.target;
            if (typeof targetAny.checked === 'boolean') {
                processedValue = targetAny.checked;
            } else if (value === 'on' || value === 'off') {
                processedValue = value === 'on';
            }
        }

        const nameParts = name.split('.');
        if (nameParts.length > 1) {
             setValues(prev => {
                const newState = { ...prev };
                let currentLevel: any = newState;
                for (let i = 0; i < nameParts.length - 1; i++) {
                    currentLevel = currentLevel[nameParts[i]];
                }
                currentLevel[nameParts[nameParts.length - 1]] = processedValue;
                return newState;
            });
        } else {
            setValues(prev => ({
                ...prev,
                [name]: processedValue,
            }));
        }
    }, []);

    /**
     * Handles the form submission event. It prevents the default form action,
     * validates the current form values against the Zod schema, and calls the
     * `onSubmit` callback if validation is successful. If validation fails, it
     * populates the `errors` state.
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        
        try {
            // FIX: Capture and use the validated values from Zod, which ensures correct types are passed to the submit handler.
            const validatedValues = schema.parse(values);
            setIsSubmitting(true);
            await onSubmit(validatedValues);
        } catch (error) {
            if (error instanceof z.ZodError) {
                const formErrors: FormErrors<T> = {};
                error.issues.forEach(err => {
                    const path = err.path.join('.');
                    if (!formErrors[path as keyof T]) {
                        formErrors[path as keyof T] = err.message;
                    }
                });
                setErrors(formErrors);
            } else {
                console.error("An unexpected error occurred:", error);
                // Optionally set a generic error message
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        values,
        errors,
        isSubmitting,
        handleChange,
        handleSubmit,
        setValues,
        setErrors,
    };
};