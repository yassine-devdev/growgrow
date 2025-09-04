import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import InputField from './InputField';

const meta: Meta<typeof InputField> = {
  title: 'UI/Forms/InputField',
  component: InputField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    type: { control: 'select', options: ['text', 'email', 'password', 'number'] },
    placeholder: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
  },
  decorators: [(Story) => <div className="w-80"><Story /></div>]
};

export default meta;
type Story = StoryObj<typeof InputField>;

export const Default: Story = {
  args: {
    name: 'default',
    label: 'Full Name',
    placeholder: 'e.g., Jane Doe',
  },
};

export const WithValue: Story = {
    args: {
      ...Default.args,
      name: 'with-value',
      value: 'John Smith',
    },
  };

export const WithError: Story = {
  args: {
    ...Default.args,
    name: 'with-error',
    error: 'This field is required.',
    value: 'Invalid Input',
  },
};

export const Password: Story = {
    args: {
      ...Default.args,
      name: 'password',
      label: 'Password',
      type: 'password',
      value: 'password123',
    },
  };

export const Disabled: Story = {
    args: {
      ...Default.args,
      name: 'disabled',
      value: 'Cannot be edited',
      disabled: true,
    },
  };