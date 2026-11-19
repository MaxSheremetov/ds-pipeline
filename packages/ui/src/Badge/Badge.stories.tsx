import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './Badge';

/**
 * A short status label. Three styles (Subtle, Outline, Solid), five statuses, three sizes; mirrors Figma `Badge`.
 * Use Outline on zebra table rows, where a Subtle fill disappears into the stripe.
 */
const meta = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: { children: 'Settled', status: 'success', appearance: 'subtle', size: 'medium' },
  argTypes: {
    status: { control: 'inline-radio', options: ['neutral', 'success', 'warning', 'error', 'info'] },
    appearance: { control: 'inline-radio', options: ['subtle', 'outline', 'solid'] },
    size: { control: 'inline-radio', options: ['large', 'medium', 'small'] },
  },
} satisfies Meta<typeof Badge>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithIcon: Story = { args: { icon: 'circle-check', children: 'Verified' } };

const label: Record<string, string> = { neutral: 'Draft', success: 'Settled', warning: 'Pending', error: 'Failed', info: 'Scheduled' };

/** All 45 combinations: size by status by style. */
export const Matrix: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 'var(--ds-spacing-12)', padding: 'var(--ds-spacing-8)' }}>
      {(['large', 'medium', 'small'] as const).map((sz) =>
        (['subtle', 'outline', 'solid'] as const).map((sty) => (
          <div key={sz + sty} style={{ display: 'flex', gap: 'var(--ds-spacing-12)', alignItems: 'center' }}>
            {(['neutral', 'success', 'warning', 'error', 'info'] as const).map((st) => <Badge key={st} {...args} size={sz} appearance={sty} status={st}>{label[st]}</Badge>)}
          </div>
        )),
      )}
    </div>
  ),
};
