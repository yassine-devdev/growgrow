import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import ToggleSwitch from './ToggleSwitch';

const meta: Meta<typeof ToggleSwitch> = {
  title: 'UI/Forms/ToggleSwitch',
  component: ToggleSwitch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    description: { control: 'text' },
    checked: { control: 'boolean' },
  },
  decorators: [(Story) => <div className="w-96"><Story /></div>]
};

export default meta;
type Story = StoryObj<typeof ToggleSwitch>;

const ToggleTemplate: Story['render'] = (args) => {
    const [isChecked, setIsChecked] = useState(args.checked || false);
    return <ToggleSwitch {...args} checked={isChecked} onChange={(e) => setIsChecked(e.target.checked)} />;
};

export const Default: Story = {
    render: ToggleTemplate,
    args: {
        name: 'default-toggle',
        label: 'Send Welcome Email',
        description: 'Send a welcome email to the new administrator upon creation.',
        checked: true,
    },
};

export const Unchecked: Story = {
    render: ToggleTemplate,
    args: {
        ...Default.args,
        name: 'unchecked-toggle',
        checked: false,
    },
};