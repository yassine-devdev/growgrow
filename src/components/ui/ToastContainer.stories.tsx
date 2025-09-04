import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import ToastContainer from './ToastContainer';
import { useAppStore } from '../../store/useAppStore';

const meta: Meta<typeof ToastContainer> = {
  title: 'UI/ToastContainer',
  component: ToastContainer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-screen h-screen">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ToastContainer>;

const ToastController: React.FC = () => {
    const addToast = useAppStore(state => state.addToast);

    return (
        <div className="p-8 bg-white rounded-lg shadow-md flex flex-col gap-4">
            <h2 className="font-bold text-lg">Toast Controls</h2>
            <p className="text-sm text-gray-600">Click buttons to trigger toasts. They will appear at the top-right of the screen.</p>
            <button 
                onClick={() => addToast({ message: 'This is a success message!', type: 'success' })}
                className="px-4 py-2 bg-green-500 text-white rounded-md"
            >
                Show Success Toast
            </button>
             <button 
                onClick={() => addToast({ message: 'This is an error message.', type: 'error' })}
                className="px-4 py-2 bg-red-500 text-white rounded-md"
            >
                Show Error Toast
            </button>
             <button 
                onClick={() => addToast({ message: 'This is an informational message.', type: 'info' })}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
                Show Info Toast
            </button>
        </div>
    );
};

export const Default: Story = {
    render: () => {
        // The ToastContainer reads from the global zustand store, so we just need to render it
        // and a controller component that can call the store's actions.
        return (
            <>
                <ToastContainer />
                <div className="flex items-center justify-center h-full">
                    <ToastController />
                </div>
            </>
        );
    }
};
