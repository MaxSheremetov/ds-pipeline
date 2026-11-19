import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within, screen } from 'storybook/test';
import { Tooltip } from './Tooltip';
import { Button } from '../Button/Button';

/**
 * A short hint that appears when the person hovers or focuses an element: the date behind a relative time, what an icon does.
 * It describes the trigger; it does not replace its name, and it cannot hold links or buttons. Keyboard focus shows it at once, Escape hides it.
 * Mirrors Figma `Tooltip` (Side).
 */
const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  args: { content: 'Settled on 18 Sep', side: 'top', children: <Button variant="secondary">Settled</Button> },
  argTypes: { side: { control: 'inline-radio', options: ['top', 'bottom', 'left', 'right'] } },
  decorators: [(Story) => <div style={{ padding: 'var(--ds-spacing-64) var(--ds-spacing-96)' }}><Story /></div>],
} satisfies Meta<typeof Tooltip>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.tab();
    await expect(within(canvasElement.ownerDocument.body).getByRole('tooltip')).toHaveTextContent('Settled on 18 Sep');
  },
};
/** Held open so the bubble can be compared with Figma. */
export const Open: Story = { args: { open: true } };
export const Sides: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, auto)', columnGap: 'var(--ds-spacing-160)', rowGap: 'var(--ds-spacing-96)', justifyContent: 'start' }}>
      {(['top', 'bottom', 'left', 'right'] as const).map((s) => (
        <Tooltip key={s} {...args} side={s} open><Button variant="secondary">{s}</Button></Tooltip>
      ))}
    </div>
  ),
};
