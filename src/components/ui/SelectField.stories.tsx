import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import SelectField from './SelectField';

const meta: Meta<typeof SelectField> = {
  title: 'UI/Forms/SelectField',
  component: SelectField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
  },
  decorators: [(Story) => <div className="w-80"><Story /></div>]
};

export default meta;
type Story = StoryObj<typeof SelectField>;

const options = (
  <>
    <option value="k-12">K-12</option>
    <option value="university">University</option>
    <option value="vocational">Vocational</option>
    <option value="other">Other</option>
  </>
);

export const Default: Story = {
  args: {
    name: 'default',
    label: 'School Type',
    children: options,
  },
};

export const WithError: Story = {
  args: {
    ...Default.args,
    name: 'with-error',
    error: 'Please select an option.',
  },
};

export const Disabled: Story = {
    args: {
      ...Default.args,
      name: 'disabled',
      disabled: true,
      value: 'university'
    },
  };