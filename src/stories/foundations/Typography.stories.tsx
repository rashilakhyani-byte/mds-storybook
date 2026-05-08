import type { Meta, StoryObj } from '@storybook/react';
import { Typography } from './Typography';

const meta: Meta<typeof Typography> = {
  title: 'Foundations/Typography',
  component: Typography,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          '36 text styles from the Mystic Design System across 5 groups: Interface Titles, Interface Body, Interface Labels, Content, and Code Editor. All use Inter (UI) or Roboto Mono (code).',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Typography>;

export const AllStyles: Story = {};
