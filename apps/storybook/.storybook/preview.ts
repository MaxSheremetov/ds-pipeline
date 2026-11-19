import type { Preview } from '@storybook/react-vite';
import '@fontsource/ibm-plex-sans/400.css';
import '@fontsource/ibm-plex-sans/500.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import '../../../packages/tokens/dist/tokens.css';

const preview: Preview = {
  parameters: {
    options: { storySort: { order: ['Foundations', ['Colour', 'Typography', 'Spacing, shape and state'], 'Components'] } },
    controls: { expanded: true },
    backgrounds: { options: { page: { name: 'Page', value: 'var(--ds-colour-surface-page)' }, raised: { name: 'Raised', value: 'var(--ds-colour-surface-raised)' } } },
    a11y: { test: 'error' },
  },
  initialGlobals: { backgrounds: { value: 'page' } },
};
export default preview;
