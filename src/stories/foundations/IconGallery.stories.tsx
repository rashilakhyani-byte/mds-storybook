import type { Meta, StoryObj } from '@storybook/react';
import { IconGallery } from './IconGallery';

const meta: Meta<typeof IconGallery> = {
  title: 'Foundations/Icons',
  component: IconGallery,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'All 1,512 Phosphor icons. Search by name, then click to copy the icon name. Paste it into the **leadingIcon** or **trailingIcon** control in any Button story.',
      },
    },
  },
  argTypes: {
    weight: {
      control: 'radio',
      options: ['regular', 'bold', 'fill', 'light', 'thin', 'duotone'],
    },
    size: {
      control: { type: 'range', min: 12, max: 48, step: 4 },
    },
  },
  args: {
    weight: 'regular',
    size: 24,
  },
};

export default meta;
type Story = StoryObj<typeof IconGallery>;

export const AllIcons: Story = {};
