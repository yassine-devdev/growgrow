import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Image from './Image';

const meta: Meta<typeof Image> = {
  title: 'UI/Image',
  component: Image,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    src: { control: 'text' },
    alt: { control: 'text' },
    className: { control: 'text' },
  },
  decorators: [
    (Story) => <div className="w-64 h-64"><Story /></div>
  ]
};

export default meta;
type Story = StoryObj<typeof Image>;

export const Default: Story = {
  args: {
    src: 'https://picsum.photos/seed/storybook-image/400/400',
    alt: 'A random image from Picsum',
    className: 'w-full h-full rounded-lg',
  },
  parameters: {
    docs: {
      story: {
        inline: false,
        iframeHeight: 300,
      },
      description: {
        story: 'This component implements a progressive, "blur-up" loading effect. It initially loads a very small version of the image and displays it blurred, then fades in the full-resolution image once it has loaded. This improves the perceived performance and user experience.'
      }
    }
  }
};

export const SlowLoading: Story = {
    name: "Simulated Slow Load",
    args: {
      // This is a special service that delays image loading
      src: 'https://www.deelay.me/2000/https://picsum.photos/seed/slow-image/400/400',
      alt: 'A slowly loading image',
      className: 'w-full h-full rounded-lg',
    },
     parameters: {
        docs: {
        description: {
            story: 'This story uses `deelay.me` to simulate a 2-second network delay, making the blur-up effect more obvious.'
        }
        }
    }
  };
