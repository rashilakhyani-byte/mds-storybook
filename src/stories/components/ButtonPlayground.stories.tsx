import type { Meta, StoryObj } from '@storybook/react';
import { ButtonPlayground } from './ButtonPlayground';

const meta: Meta<typeof ButtonPlayground> = {
  title: 'Components/Button Playground',
  component: ButtonPlayground,
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    docs: {
      description: {
        component:
          'Interactive playground — pick any Phosphor icon visually, swap variants/sizes, and see the live JSX snippet.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ButtonPlayground>;

export const Playground: Story = {};
