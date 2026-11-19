import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  stories: ['../src/**/*.stories.@(ts|tsx)', '../../../packages/ui/src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-mcp', 'storybook-addon-pseudo-states'],
  // The components manifest is what lets agents (through the MCP server) read props, stories and docs.
  features: { componentsManifest: true },
  typescript: { reactDocgen: 'react-docgen' },
};
export default config;
