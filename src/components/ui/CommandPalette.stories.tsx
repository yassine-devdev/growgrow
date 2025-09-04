

import React, { useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within, expect } from '@storybook/test';
import CommandPalette from './CommandPalette';
import { useAppStore } from '../../store/useAppStore';
import { User } from '../../types';
import DashboardLayout from '../layout/DashboardLayout';

// Mock user to populate navigation
const mockUser: User = {
    id: 'provider-1',
    name: 'Storybook Provider',
    email: 'storybook@provider.com',
    role: 'Provider',
};

const meta: Meta<typeof CommandPalette> = {
  title: 'UI/CommandPalette',
  component: CommandPalette,
  parameters: {
    layout: 'fullscreen',
  },
  // We render inside DashboardLayout to provide context, like the header and sidebars
  // which are hidden by the palette overlay but are part of the expected DOM structure.
  decorators: [
    (Story) => {
      // Set the user in the Zustand store before the story renders
      useEffect(() => {
        useAppStore.setState({ user: mockUser, isCommandPaletteOpen: false });
        return () => {
            useAppStore.setState({ isCommandPaletteOpen: false }); // Cleanup
        };
      }, []);

      return <Story />;
    },
  ],
};

export default meta;
type Story = StoryObj<typeof CommandPalette>;

// This template renders the full layout because the command palette is a global component
// that interacts with the whole app state.
const PaletteTemplate: Story['render'] = () => {
    // CommandPalette is rendered inside DashboardLayout, so we just render that
    return <DashboardLayout />;
};


export const Closed: Story = {
  name: 'State: Closed',
  render: PaletteTemplate,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Initially, the dialog should not be present
    await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument();
  },
};

export const Open: Story = {
  name: 'State: Open',
  render: PaletteTemplate,
  play: async ({ canvasElement }) => {
    // Open the palette
    await new Promise(resolve => setTimeout(resolve, 100)); // wait for store effect
    useAppStore.getState().toggleCommandPalette();

    const dialog = await within(canvasElement).findByRole('dialog');
    await expect(dialog).toBeVisible();

    // Check if some navigation items are rendered
    await expect(await within(dialog).findByText('Usage Stats')).toBeVisible();
    await expect(await within(dialog).findByText('Server Status')).toBeVisible();
  },
};

export const Searching: Story = {
    name: 'Interaction: Searching',
    render: PaletteTemplate,
    play: async (context) => {
        // Reuse the play function from 'Open' story
        await Open.play!(context);
        
        const canvas = within(context.canvasElement);
        const dialog = await canvas.findByRole('dialog');
        const searchInput = await within(dialog).findByPlaceholderText('Search for a page or action...');

        // Type into the search input
        await userEvent.type(searchInput, 'admin', { delay: 50 });

        // Check that the results are filtered
        await expect(await within(dialog).findByText('Manage Admins')).toBeVisible();
        await expect(within(dialog).queryByText('Usage Stats')).not.toBeInTheDocument();
    }
};

export const KeyboardNavigation: Story = {
    name: 'Interaction: Keyboard Navigation',
    render: PaletteTemplate,
    play: async (context) => {
        await Open.play!(context);

        const canvas = within(context.canvasElement);
        const dialog = await canvas.findByRole('dialog');
        const searchInput = await within(dialog).findByPlaceholderText('Search for a page or action...');
        
        // The first item should be "Command Center" by default for a provider
        const firstItem = await within(dialog).findByText('Command Center');
        // Check if the parent button has the highlighted background color
        await expect(firstItem.closest('button')).toHaveClass('bg-brand-primary/10');

        // Press ArrowDown
        await userEvent.type(searchInput, '{arrowdown}');
        
        // Now the second item, "Usage Stats", should be highlighted
        const secondItem = await within(dialog).findByText('Usage Stats');
        await expect(secondItem.closest('button')).toHaveClass('bg-brand-primary/10');
        await expect(firstItem.closest('button')).not.toHaveClass('bg-brand-primary/10');
    }
};