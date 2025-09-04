

import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect } from '@storybook/test';
import Modal from './Modal';

const meta: Meta<typeof Modal> = {
  title: 'UI/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: { control: 'boolean', description: 'Controls if the modal is open or not' },
    title: { control: 'text' },
    children: { control: { type: null } },
    onClose: { action: 'closed' }
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

const ModalTemplate: Story['render'] = (args) => {
  // Storybook's state management for interactive components
  const [isOpen, setIsOpen] = useState(args.isOpen || false);

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="px-4 py-2 bg-brand-primary text-white rounded-md">
        Open Modal
      </button>
      <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <p>This is the content of the modal. You can put any React components here.</p>
        <div className="mt-4 flex justify-end gap-2">
           <button onClick={() => setIsOpen(false)} className="px-4 py-2 bg-brand-surface-alt text-brand-text rounded-md">
            Cancel
          </button>
          <button onClick={() => setIsOpen(false)} className="px-4 py-2 bg-brand-primary text-white rounded-md">
            Confirm
          </button>
        </div>
      </Modal>
    </>
  );
};

export const Default: Story = {
  render: ModalTemplate,
  args: {
    title: 'Default Modal',
    isOpen: false,
  },
};

export const OpenedByDefault: Story = {
    render: ModalTemplate,
    name: 'State: Opened by Default',
    args: {
        title: 'Opened Modal',
        isOpen: true
    }
};

export const InteractionTest: Story = {
  render: ModalTemplate,
  name: 'Interaction: Open and Close',
  args: {
    title: 'Interaction Test Modal',
    isOpen: false,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Initial state: Modal is not visible', async () => {
        expect(canvas.queryByRole('dialog')).not.toBeInTheDocument();
    });

    await step('User clicks "Open Modal" button', async () => {
        const openButton = await canvas.findByRole('button', { name: 'Open Modal' });
        await userEvent.click(openButton);
    });

    await step('Modal becomes visible and displays title', async () => {
        const modal = await canvas.findByRole('dialog');
        await expect(modal).toBeVisible();
        await expect(within(modal).getByText('Interaction Test Modal')).toBeVisible();
    });

    await step('User clicks the "Confirm" button to close', async () => {
        const confirmButton = await canvas.findByRole('button', { name: 'Confirm' });
        await userEvent.click(confirmButton);
    });

    await step('Final state: Modal is no longer visible', async () => {
        await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument();
    });
  },
};
