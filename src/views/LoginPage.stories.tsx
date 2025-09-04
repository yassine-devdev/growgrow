import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent } from '@storybook/test';
import LoginPage from './LoginPage';

const meta: Meta<typeof LoginPage> = {
  title: 'Views/LoginPage',
  component: LoginPage,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LoggingIn: Story = {
    name: 'Interaction: User Clicks Login',
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        
        // Find the "Provider" button by its accessible name (which comes from the translation files)
        const providerButton = await canvas.findByRole('button', { name: 'Provider' });

        // Simulate a user clicking the button
        await userEvent.click(providerButton);

        // The story will now show the component in its loading state.
        // In a real test, you could add assertions here to check for the loading spinner.
    },
};
