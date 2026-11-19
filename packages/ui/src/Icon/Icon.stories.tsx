import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon } from './Icon';
import { ICONS } from './icons';

/**
 * A small outline pictogram from the Figma icon set (Lucide, 140 icons). Size comes from spacing tokens, stroke is 1.5 at every size, colour is inherited.
 */
const meta = {
  title: 'Components/Icon',
  component: Icon,
  tags: ['autodocs'],
  args: { name: 'arrow-right', size: 24 },
  argTypes: { size: { control: 'inline-radio', options: [12, 16, 20, 24] } },
} satisfies Meta<typeof Icon>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The four sizes. The stroke stays 1.5 in all of them. */
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 'var(--ds-spacing-16)', alignItems: 'center', color: 'var(--ds-colour-text-primary)' }}>
      {([12, 16, 20, 24] as const).map((s) => <Icon key={s} {...args} size={s} />)}
    </div>
  ),
};

/** The whole set, as named in Figma. */
export const AllIcons: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => (
    <ul style={{ listStyle: 'none', margin: 0, padding: 'var(--ds-spacing-24)', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 'var(--ds-spacing-12)', color: 'var(--ds-colour-text-primary)', fontFamily: 'var(--ds-type-font-text)', fontSize: 'var(--ds-type-fs-meta)' }}>
      {Object.keys(ICONS).map((n) => (
        <li key={n} style={{ display: 'flex', alignItems: 'center', gap: 'var(--ds-spacing-8)' }}>
          <Icon name={n as keyof typeof ICONS} size={24} /> {n}
        </li>
      ))}
    </ul>
  ),
};
