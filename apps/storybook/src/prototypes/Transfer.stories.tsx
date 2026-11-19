import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Badge, Button, Checkbox, Input, Notice, Select, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '@ds/ui';
import type { BadgeStatus } from '@ds/ui';

/** @spec northgate/feature/transfer-between-accounts r1 */
const accounts = [
  { value: 'current', label: 'Current account · 4412', balance: 3240 },
  { value: 'savings', label: 'Savings account · 9081', balance: 12800.5 },
  { value: 'business', label: 'Business account · 2290', balance: 560 },
  { value: 'closed', label: 'Old account · 1003 (closed)', balance: 0, disabled: true },
];
const money = (n: number) => n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

interface Transfer { date: string; to: string; status: { label: string; status: BadgeStatus }; amount: string }
const history: Transfer[] = [
  { date: '12 Nov 2026', to: 'Savings account · 9081', status: { label: 'Settled', status: 'success' }, amount: '-500.00' },
  { date: '03 Nov 2026', to: 'Business account · 2290', status: { label: 'Settled', status: 'success' }, amount: '-120.00' },
  { date: '28 Oct 2026', to: 'Savings account · 9081', status: { label: 'Failed', status: 'error' }, amount: '-2,000.00' },
];

type Errors = Partial<Record<'from' | 'to' | 'amount' | 'reference', string>>;

function TransferScreen() {
  const [from, setFrom] = React.useState<string | undefined>();
  const [to, setTo] = React.useState<string | undefined>();
  const [amount, setAmount] = React.useState('');
  const [reference, setReference] = React.useState('');
  const [email, setEmail] = React.useState(false);
  const [errors, setErrors] = React.useState<Errors>({});
  const [sending, setSending] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [rows, setRows] = React.useState(history);
  const [formKey, setFormKey] = React.useState(0);
  const fromRef = React.useRef<HTMLButtonElement>(null);
  const toRef = React.useRef<HTMLButtonElement>(null);
  const amountRef = React.useRef<HTMLInputElement>(null);
  const referenceRef = React.useRef<HTMLInputElement>(null);

  const source = accounts.find((a) => a.value === from);
  const target = accounts.find((a) => a.value === to);
  const num = Number(amount);

  const validate = (): Errors => {
    const e: Errors = {};
    if (!from) e.from = 'Choose the account to take money from';
    if (!to) e.to = 'Choose the account to put money into';
    else if (to === from) e.to = 'Choose a different account from the one you are taking money from';
    if (!amount || !(num > 0)) e.amount = 'Enter an amount greater than zero';
    else if (source && num > source.balance) e.amount = `Enter an amount up to ${money(source.balance)}`;
    if (reference.length > 35) e.reference = 'Use 35 characters or fewer';
    return e;
  };

  const reset = () => { setFrom(undefined); setTo(undefined); setAmount(''); setReference(''); setEmail(false); setErrors({}); setFormKey((k) => k + 1); };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (sending) return;
    const e = validate();
    setErrors(e);
    setMessage('');
    if (Object.keys(e).length) {
      const first = (['from', 'to', 'amount', 'reference'] as const).find((k) => e[k]);
      ({ from: fromRef, to: toRef, amount: amountRef, reference: referenceRef })[first!].current?.focus();
      return;
    }
    setSending(true);
    setTimeout(() => {
      setRows((r) => [{ date: '18 Nov 2026', to: target!.label, status: { label: 'Pending', status: 'warning' }, amount: `-${money(num)}` }, ...r]);
      setMessage(`Transfer of ${money(num)} to ${target!.label} was accepted`);
      setSending(false);
      reset();
      setTimeout(() => fromRef.current?.focus(), 0);
    }, 600);
  };

  return (
    <main style={{ maxWidth: 560, margin: '0 auto', padding: 'var(--ds-spacing-24)', display: 'grid', gap: 'var(--ds-spacing-24)', fontFamily: 'var(--ds-type-font-text), system-ui, sans-serif', color: 'var(--ds-colour-text-primary)' }}>
      <h1 style={{ margin: 0, font: 'inherit', fontSize: 'var(--ds-type-fs-body-lg)', lineHeight: 'var(--ds-type-line-body-lg)', fontWeight: 'var(--ds-type-weight-medium)' }}>Transfer between accounts</h1>
      <form key={formKey} onSubmit={submit} noValidate style={{ display: 'grid', gap: 'var(--ds-spacing-16)' }}>
        <Select
          ref={fromRef} label="From" icon="wallet" placeholder="Select an account" options={accounts}
          value={from} onValueChange={(v) => { setFrom(v); setErrors((e) => ({ ...e, from: undefined })); }}
          error={errors.from} name="from"
        />
        <Select
          ref={toRef} label="To" icon="piggy-bank" placeholder="Select an account" options={accounts}
          value={to} onValueChange={(v) => { setTo(v); setErrors((e) => ({ ...e, to: undefined })); }}
          error={errors.to} name="to"
        />
        <Input
          ref={amountRef} label="Amount" type="number" inputMode="decimal" step="0.01" min="0" value={amount}
          onChange={(e) => { setAmount(e.target.value); setErrors((x) => ({ ...x, amount: undefined })); }}
          hint={source ? `Available ${money(source.balance)}` : undefined} error={errors.amount}
        />
        <Input
          ref={referenceRef} label="Reference" value={reference}
          onChange={(e) => { setReference(e.target.value); setErrors((x) => ({ ...x, reference: undefined })); }}
          hint="Optional, up to 35 characters" error={errors.reference}
        />
        <Checkbox label="Email me a confirmation" checked={email} onChange={(e) => setEmail(e.target.checked)} />
        <div style={{ display: 'flex', gap: 'var(--ds-spacing-8)', justifyContent: 'flex-end' }}>
          <Button type="button" variant="secondary" onClick={reset}>Cancel</Button>
          <Button type="submit" loading={sending}>Confirm transfer</Button>
        </div>
        {/* The live region is always in the page so that the message is announced when it arrives; the Notice inside it only draws it. */}
        <div role="status">
          {message ? <Notice role="none" status="success" onClose={() => setMessage('')}>{message}</Notice> : null}
        </div>
      </form>
      <Table caption="Recent transfers">
        <TableHead>
          <TableRow>
            <TableHeaderCell>Date</TableHeaderCell>
            <TableHeaderCell>To</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell align="end">Amount</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((r, i) => (
            <TableRow key={`${r.date}-${i}`}>
              <TableCell kind="secondary">{r.date}</TableCell>
              <TableCell>{r.to}</TableCell>
              <TableCell><Badge size="small" appearance="outline" status={r.status.status}>{r.status.label}</Badge></TableCell>
              <TableCell align="end" kind="debit">{r.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  );
}

/**
 * Prototype built from library components only, from the feature spec `specs/features/transfer-between-accounts.md`.
 * The play functions walk the acceptance list of that spec.
 */
const meta = { title: 'Prototypes/Transfer between accounts', component: TransferScreen, tags: ['!manifest'], parameters: { layout: 'fullscreen' } } satisfies Meta<typeof TransferScreen>;
export default meta;
type Story = StoryObj<typeof meta>;

const choose = async (canvas: ReturnType<typeof within>, field: string, option: RegExp) => {
  await userEvent.click(canvas.getByRole('combobox', { name: field }));
  await userEvent.click(await within(document.body).findByRole('option', { name: option }));
};

export const Empty: Story = {};

/** Acceptance 2: Confirm on an empty form shows three errors and moves focus to From. */
export const EmptyFormErrors: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await userEvent.click(c.getByRole('button', { name: 'Confirm transfer' }));
    await expect(c.getByText('Choose the account to take money from')).toBeInTheDocument();
    await expect(c.getByText('Choose the account to put money into')).toBeInTheDocument();
    await expect(c.getByText('Enter an amount greater than zero')).toBeInTheDocument();
    await waitFor(() => expect(c.getByRole('combobox', { name: 'From' })).toHaveFocus());
  },
};

/** Acceptance 3 and 4: the same account twice, and an amount above the balance. */
export const SameAccountAndTooMuch: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await choose(c, 'From', /Current account/);
    await choose(c, 'To', /Current account/);
    await userEvent.type(c.getByLabelText('Amount'), '5000');
    await userEvent.click(c.getByRole('button', { name: 'Confirm transfer' }));
    await expect(c.getByText('Choose a different account from the one you are taking money from')).toBeInTheDocument();
    await expect(c.getByText('Enter an amount up to 3,240.00')).toBeInTheDocument();
  },
};

/** Acceptance 5: a valid form sends, then clears, and the new row is first with the status Pending. */
export const Success: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement);
    await choose(c, 'From', /Current account/);
    await choose(c, 'To', /Savings account/);
    await userEvent.type(c.getByLabelText('Amount'), '250');
    await userEvent.click(c.getByRole('button', { name: 'Confirm transfer' }));
    await waitFor(() => expect(c.getByText('Transfer of 250.00 to Savings account · 9081 was accepted')).toBeInTheDocument());
    const first = c.getAllByRole('row')[1];
    await expect(within(first).getByText('Pending')).toBeInTheDocument();
    await waitFor(() => expect(c.getByRole('combobox', { name: 'From' })).toHaveFocus());
  },
};
