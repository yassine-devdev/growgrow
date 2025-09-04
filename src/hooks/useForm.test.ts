/**
 * @jest-environment jsdom
 */
import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { useForm } from './useForm';
import { z } from 'zod';
import { jest, describe, beforeEach, it, expect } from '@jest/globals';

// --- Basic Schema ---
const testSchema = z.object({
  name: z.string().min(3, 'Name is too short'),
  email: z.string().email('Invalid email'),
});
type TestFormData = z.infer<typeof testSchema>;

// --- Schema with Nested Fields and Checkbox ---
const complexSchema = z.object({
    details: z.object({
        firstName: z.string().min(2, 'First name required'),
    }),
    agreed: z.boolean().refine(val => val === true, 'You must agree'),
});

// Mock onSubmit function
const mockSubmit = jest.fn(async (values: any) => {
  return Promise.resolve();
});

describe('useForm Hook', () => {

  beforeEach(() => {
    mockSubmit.mockClear();
  });

  it('should initialize with initial state', () => {
    const initialState = { name: 'John', email: 'john@test.com' };
    const { result } = renderHook(() => useForm(initialState, testSchema, mockSubmit));

    expect(result.current.values).toEqual(initialState);
    expect(result.current.errors).toEqual({});
    expect(result.current.isSubmitting).toBe(false);
  });

  it('should handle simple input changes correctly', () => {
    const { result } = renderHook(() => useForm({ name: '', email: '' }, testSchema, mockSubmit));

    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'Jane', type: 'text' },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.values.name).toBe('Jane');
  });

  it('should handle nested input changes correctly', () => {
    const initialState = { details: { firstName: '' }, agreed: false };
    const { result } = renderHook(() => useForm(initialState, complexSchema, mockSubmit));

    act(() => {
        result.current.handleChange({
            target: { name: 'details.firstName', value: 'John', type: 'text' }
        } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.values.details.firstName).toBe('John');
  });

  it('should handle checkbox changes correctly', () => {
    const initialState = { details: { firstName: '' }, agreed: false };
    const { result } = renderHook(() => useForm(initialState, complexSchema, mockSubmit));

    act(() => {
        result.current.handleChange({
            target: { name: 'agreed', checked: true, type: 'checkbox', value: 'on' }
        } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.values.agreed).toBe(true);
  });


  it('should not call onSubmit and should set errors if validation fails', async () => {
    const { result } = renderHook(() => useForm({ name: 'J', email: 'invalid' }, testSchema, mockSubmit));

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: () => {} } as React.FormEvent);
    });

    expect(mockSubmit).not.toHaveBeenCalled();
    expect(result.current.errors.name).toBe('Name is too short');
    expect(result.current.errors.email).toBe('Invalid email');
    expect(result.current.isSubmitting).toBe(false);
  });
  
  it('should set nested errors if complex validation fails', async () => {
      const initialState = { details: { firstName: 'J' }, agreed: false };
      const { result } = renderHook(() => useForm(initialState, complexSchema, mockSubmit));

      await act(async () => {
        await result.current.handleSubmit({ preventDefault: () => {} } as React.FormEvent);
      });
      
      expect(mockSubmit).not.toHaveBeenCalled();
      expect(result.current.errors['details.firstName']).toBe('First name required');
      expect(result.current.errors.agreed).toBe('You must agree');
  });


  it('should call onSubmit if validation succeeds', async () => {
    const validData: TestFormData = { name: 'Jane Doe', email: 'jane@test.com' };
    const { result } = renderHook(() => useForm(validData, testSchema, mockSubmit));

    await act(async () => {
      await result.current.handleSubmit({ preventDefault: () => {} } as React.FormEvent);
    });

    expect(mockSubmit).toHaveBeenCalledWith(validData);
    expect(result.current.errors).toEqual({});
    expect(result.current.isSubmitting).toBe(false);
  });
});