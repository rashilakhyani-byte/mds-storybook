import type { Meta, StoryObj } from '@storybook/react';
import { Spacing } from './Spacing';

const meta: Meta<typeof Spacing> = {
  title: 'Foundations/Spacing',
  component: Spacing,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Primitive spacing scale from the Mystic Design System. Each step is visualised as a horizontal bar. Use these token names when building components.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Spacing>;

export const Scale: Story = {};
