import type { Meta, StoryObj } from '@storybook/react';
import { ColorPalette } from './ColorPalette';

const meta: Meta<typeof ColorPalette> = {
  title: 'Foundations/Colors',
  component: ColorPalette,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'All primitive color tokens from the Mystic Design System (MDS). Each swatch shows the hex value and token name. Switch between Light and Dark mode using the controls below.',
      },
    },
  },
  argTypes: {
    mode: {
      control: 'radio',
      options: ['light', 'dark'],
      description: 'Preview color values in light or dark mode',
    },
  },
  args: { mode: 'light' },
};

export default meta;
type Story = StoryObj<typeof ColorPalette>;

export const LightMode: Story = {
  args: { mode: 'light' },
};

export const DarkMode: Story = {
  args: { mode: 'dark' },
  parameters: { backgrounds: { default: 'dark' } },
};
