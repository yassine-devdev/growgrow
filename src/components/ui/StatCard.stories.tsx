import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import StatCard from './StatCard';

const meta: Meta<typeof StatCard> = {
  title: 'UI/StatCard',
  component: StatCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    value: { control: 'text' },
    change: { control: 'text' },
    icon: { control: 'select', options: ['DollarSign', 'Users', 'TrendingUp', 'TrendingDown'] },
  },
  decorators: [
    (Story) => <div className="w-64"><Story /></div>,
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Monthly Recurring Revenue',
    value: '$125,630',
    icon: 'DollarSign',
  },
};

export const WithPositiveChange: Story = {
  args: {
    label: 'Active Users (MAU)',
    value: '15,789',
    change: '+8.2%',
    icon: 'Users',
  },
};

export const WithNegativeChange: Story = {
  args: {
    label: 'MRR Churn Rate',
    value: '1.2%',
    change: '-0.3%',
    icon: 'TrendingDown',
  },
};
