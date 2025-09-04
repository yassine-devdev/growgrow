import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Dialog from './Dialog';

const meta: Meta<typeof Dialog> = {
  title: 'UI/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: { control: 'boolean' },
    title: { control: 'text' },
    description: { control: 'text' },
    confirmText: { control: 'text' },
    cancelText: { control: 'text' },
    isConfirming: { control: 'boolean' },
    confirmVariant: { control: 'radio', options: ['primary', 'destructive'] },
  },
};

export default meta;
type Story = StoryObj<typeof Dialog>;

const DialogTemplate: Story['render'] = (args) => {
  const [isOpen, setIsOpen] = useState(args.isOpen || false);
  return (
    <>
      <button onClick={() => setIsOpen(true)} className="px-4 py-2 bg-brand-primary text-white rounded-md">
        Open Dialog
      </button>
      <Dialog {...args} isOpen={isOpen} onClose={() => setIsOpen(false)} onConfirm={() => setIsOpen(false)} />
    </>
  );
};

export const Default: Story = {
  render: DialogTemplate,
  args: {
    title: 'Are you sure?',
    description: 'This action cannot be undone. This will permanently delete the item from our servers.',
    confirmText: 'Yes, proceed',
    cancelText: 'No, cancel',
  },
};

export const Destructive: Story = {
  render: DialogTemplate,
  args: {
    ...Default.args,
    confirmText: 'Yes, delete it',
    confirmVariant: 'destructive',
  },
};

export const Confirming: Story = {
  render: DialogTemplate,
  args: {
    ...Default.args,
    isConfirming: true,
  },
};