import type { Preview } from '@storybook/react';
import '../src/index.css';

const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#f7f8f9' },
        { name: 'dark', value: '#181b20' },
        { name: 'white', value: '#ffffff' },
      ],
    },
  },
};

export default preview;
