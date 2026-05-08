import type { Meta, StoryObj } from '@storybook/react';
import { SemanticTokens } from './SemanticTokens';

const meta: Meta<typeof SemanticTokens> = {
  title: 'Foundations/Semantic Tokens',
  component: SemanticTokens,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Semantic design tokens from the Mystic Design System: Surface, Text, Strokes, and Status colors. These are the tokens components actually reference — they resolve to primitives via aliases and flip correctly between light and dark mode.',
      },
    },
  },
  argTypes: {
    mode: {
      control: 'radio',
      options: ['light', 'dark'],
      description: 'Resolve token aliases in light or dark mode',
    },
  },
  args: { mode: 'light' },
};

export default meta;
type Story = StoryObj<typeof SemanticTokens>;

export const LightMode: Story = {
  args: { mode: 'light' },
};

export const DarkMode: Story = {
  args: { mode: 'dark' },
  parameters: { backgrounds: { default: 'dark' } },
};
