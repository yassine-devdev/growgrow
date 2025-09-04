

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import DataEmptyState from './DataEmptyState';
import { Briefcase, Ticket } from 'lucide-react';

const meta: Meta<typeof DataEmptyState> = {
  title: 'UI/DataEmptyState',
  component: DataEmptyState,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    icon: { control: { type: null } },
    title: { control: 'text' },
    description: { control: 'text' },
    action: { control: { type: null } },
  },
  decorators: [
    (Story) => <div className="w-96"><Story /></div>,
  ],
};

export default meta;
type Story = StoryObj<typeof DataEmptyState>;

export const Default: Story = {
  args: {
    icon: Ticket,
    title: 'No Support Tickets Yet',
    description: "When users submit support tickets, they will appear here in the 'New' column.",
  },
};

export const WithAction: Story = {
  args: {
    icon: Briefcase,
    title: 'No Campaigns Created',
    description: 'Start your first marketing campaign to track performance and engagement.',
    action: {
      label: 'New Campaign',
      onClick: () => alert('New Campaign button clicked!'),
    },
  },
};
