import type { Meta, StoryObj } from '@storybook/react-vite';
import { Breadcrumbs, BreadcrumbItem } from './Breadcrumbs';

/**
 * The trail above a page title: where am I, and what is above me. Not a history of where the person has been; that is the back button.
 * Use it for a hierarchy more than two levels deep or a record reached from a list. Every crumb but the last is a link; the last is the current page, as text. Mirrors the Figma components Breadcrumb item and Breadcrumbs.
 */
const meta = {
  title: 'Components/Breadcrumbs',
  component: Breadcrumbs,
  subcomponents: { BreadcrumbItem },
  tags: ['autodocs'],
  args: {
    children: [
      <BreadcrumbItem key="h" href="#home" icon="home">Home</BreadcrumbItem>,
      <BreadcrumbItem key="a" href="#accounts">Accounts</BreadcrumbItem>,
      <BreadcrumbItem key="c" current>Current account 4412</BreadcrumbItem>,
    ],
  },
} satisfies Meta<typeof Breadcrumbs>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithoutIcon: Story = {
  args: {
    children: [
      <BreadcrumbItem key="a" href="#accounts">Accounts</BreadcrumbItem>,
      <BreadcrumbItem key="b" href="#savings">Savings</BreadcrumbItem>,
      <BreadcrumbItem key="c" current>Reserve account 0021</BreadcrumbItem>,
    ],
  },
};
/** Hover and focus are forced so they can be compared with Figma. */
export const States: Story = {
  parameters: { pseudo: { hover: ['#bc-hover a'], focusVisible: ['#bc-focus a'] } },
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--ds-spacing-24)', padding: 'var(--ds-spacing-8)' }}>
      <div><Breadcrumbs label="Link"><BreadcrumbItem href="#a">Link</BreadcrumbItem><BreadcrumbItem current>Current</BreadcrumbItem></Breadcrumbs></div>
      <div id="bc-hover"><Breadcrumbs label="Hover"><BreadcrumbItem href="#a">Hover</BreadcrumbItem><BreadcrumbItem current>Current</BreadcrumbItem></Breadcrumbs></div>
      <div id="bc-focus"><Breadcrumbs label="Focus"><BreadcrumbItem href="#a">Focus</BreadcrumbItem><BreadcrumbItem current>Current</BreadcrumbItem></Breadcrumbs></div>
    </div>
  ),
};

/** A trail longer than four crumbs keeps the first and the last two; the ones between sit behind the ellipsis. Matches the Figma state Overflow. */
export const Collapsed: Story = {
  args: {
    children: [
      <BreadcrumbItem key="h" href="#home" icon="home">Home</BreadcrumbItem>,
      <BreadcrumbItem key="r" href="#reports">Reports</BreadcrumbItem>,
      <BreadcrumbItem key="q" href="#statements">Quarterly statements</BreadcrumbItem>,
      <BreadcrumbItem key="a" href="#accounts">Accounts</BreadcrumbItem>,
      <BreadcrumbItem key="c" current>Savings account</BreadcrumbItem>,
    ],
  },
};
