import * as React from 'react';
import * as RadixSelect from '@radix-ui/react-select';
import * as Popover from '@radix-ui/react-popover';
import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';
import type { IconName } from '../Icon/Icon';
import '../Input/Input.css';
import '../shared.css';
import './Select.css';

export type SelectSize = 'large' | 'medium' | 'small';

export interface SelectOption {
  /** The value sent to the form and given to onValueChange. Must not be empty. */
  value: string;
  /** What the person reads. Normal case, one line; long text is cut with an ellipsis. */
  label: string;
  /** Shown as disabled and skipped by the keyboard. */
  disabled?: boolean;
}

/** @spec northgate/select r3 */
export interface SelectProps {
  /** The visible label above the field. Always required. Written in normal case, shown uppercase. */
  label: string;
  /** The choices, in the order they are shown. Aim for 4 to 15 without search; with `searchable` the list can be long. */
  options: SelectOption[];
  /** Shown while nothing is chosen. An instruction is fine here, for example "Select an account". */
  placeholder?: string;
  /** Helper text under the field. Replaced by `error` when an error is set. */
  hint?: string;
  /** Error message. Setting it switches the field to the error state and replaces the hint. Say what is wrong and how to fix it. */
  error?: string;
  /** Field height 40, 32 or 24 and value size 16, 14 or 12. Matches the Figma property Size (Large, Medium, Small). */
  size?: SelectSize;
  /** Icon at the start of the field, 16px, for example the kind of thing being chosen. An icon name from the Icon set (see the Icon docs), such as 'wallet'. Matches the Figma switch Show leading icon. */
  icon?: IconName;
  /** Adds a search field at the top of the menu that filters the options. Use it for long lists (more than about 15). */
  searchable?: boolean;
  /** Lets the person choose several options. The menu stays open while choosing, rows get checkboxes, and a footer shows the count and a Clear button. Use `values`, `defaultValues` and `onValuesChange` instead of `value`. Matches the Figma Show checkbox row and Show footer menu. */
  multiple?: boolean;
  /** Chosen values when `multiple` is on and the product controls them. Pair with onValuesChange. */
  values?: string[];
  /** Chosen values at the start when `multiple` is on and the component keeps them. */
  defaultValues?: string[];
  /** Called with all chosen values after a person checks, unchecks or clears. */
  onValuesChange?: (values: string[]) => void;
  /** Words for a count of chosen options, shown in the field (from two chosen) and in the footer. Receives the count. Replace it to translate or to say what is chosen, for example "2 accounts selected". */
  selectedLabel?: (count: number) => string;
  /** Text of the Clear button in the footer of a multiple Select. */
  clearLabel?: string;
  /** Placeholder of the search field. */
  searchPlaceholder?: string;
  /** Text shown when the search finds nothing. */
  noResultsLabel?: string;
  /** The chosen value when the product controls it. Pair with onValueChange. */
  value?: string;
  /** The chosen value at the start when the component keeps it. */
  defaultValue?: string;
  /** Called with the new value after a person chooses an option. */
  onValueChange?: (value: string) => void;
  /** Cannot be focused or opened. */
  disabled?: boolean;
  /** Can be focused but not opened or changed. */
  readOnly?: boolean;
  /** Form field name; the value is sent with the form. */
  name?: string;
  /** Id of the field (the button). Generated when left out. */
  id?: string;
  /** Extra class on the outer wrapper, for layout only. */
  className?: string;
}

/** Gap between the field and the menu: spacing-8 (Radix needs a number, not a CSS variable). It clears the 4px focus ring so the menu never touches it. */
const MENU_GAP = 8;

export const Select = React.forwardRef<HTMLButtonElement, SelectProps>(function Select(props, ref) {
  const {
    label, options, placeholder, hint, error, size = 'large', icon, searchable = false, searchPlaceholder = 'Search', noResultsLabel = 'No results',
    multiple = false, values, defaultValues, onValuesChange, selectedLabel = (n: number) => `${n} selected`, clearLabel = 'Clear',
    value, defaultValue, onValueChange, disabled, readOnly, name, id, className,
  } = props;
  const autoId = React.useId();
  const triggerId = id ?? `ds-select-${autoId}`;
  const labelId = `${triggerId}-label`;
  const messageId = `${triggerId}-message`;
  const message = error ?? hint;
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  React.useImperativeHandle(ref, () => triggerRef.current as HTMLButtonElement);
  const leading = icon ? <Icon name={icon} size={16} /> : null;
  const requestOpen = (next: boolean) => { if (!readOnly && !disabled) setOpen(next); };

  const wrapper = (field: React.ReactNode) => (
    <div
      className={className ? `ds-input ds-select ${className}` : 'ds-input ds-select'}
      data-size={size}
      data-invalid={error ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      data-readonly={readOnly ? '' : undefined}
    >
      {/* No htmlFor: a label click would open the menu, the spec says it only focuses the field. The name comes from aria-labelledby. */}
      <label className="ds-input__label" id={labelId} onClick={() => triggerRef.current?.focus()}>{label}</label>
      {field}
      {/* Always rendered so a screen reader announces the message when an error appears. */}
      <p className="ds-input__message" id={messageId} aria-live="polite">{message}</p>
    </div>
  );

  const triggerCommon = {
    id: triggerId,
    className: 'ds-input__field ds-select__trigger',
    'aria-labelledby': labelId,
    'aria-describedby': message ? messageId : undefined,
    'aria-invalid': error ? true : undefined,
    'aria-readonly': readOnly ? true : undefined,
  } as const;

  if (searchable || multiple) {
    return wrapper(
      <PanelMenu
        triggerRef={triggerRef} triggerProps={triggerCommon} leading={leading} options={options} placeholder={placeholder} size={size}
        searchPlaceholder={searchPlaceholder} noResultsLabel={noResultsLabel} label={label}
        searchable={searchable} multiple={multiple} values={values} defaultValues={defaultValues} onValuesChange={onValuesChange}
        selectedLabel={selectedLabel} clearLabel={clearLabel}
        value={value} defaultValue={defaultValue} onValueChange={onValueChange} disabled={disabled} name={name}
        open={open} setOpen={requestOpen}
      />,
    );
  }

  return wrapper(
    <RadixSelect.Root value={value} defaultValue={defaultValue} onValueChange={onValueChange} disabled={disabled} name={name} open={open} onOpenChange={requestOpen}>
      {/* The trigger is the field itself (border, padding, background), so the menu is anchored to the visible edge and matches its width. */}
      <RadixSelect.Trigger ref={triggerRef} {...triggerCommon}>
        {leading}
        <span className="ds-select__value"><RadixSelect.Value placeholder={placeholder} /></span>
        <RadixSelect.Icon asChild><Icon name="chevron-down" size={16} /></RadixSelect.Icon>
      </RadixSelect.Trigger>
      <RadixSelect.Portal>
        <RadixSelect.Content className="ds-select-menu" data-size={size} position="popper" side="bottom" align="start" sideOffset={MENU_GAP} collisionPadding={MENU_GAP}>
          <RadixSelect.Viewport className="ds-select-menu__list">
            {options.map((o) => (
              <RadixSelect.Item key={o.value} value={o.value} disabled={o.disabled} className="ds-select-option">
                <RadixSelect.ItemText>{o.label}</RadixSelect.ItemText>
                <RadixSelect.ItemIndicator className="ds-select-option__check"><Icon name="check" size={12} /></RadixSelect.ItemIndicator>
              </RadixSelect.Item>
            ))}
          </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>,
  );
});

interface PanelMenuProps {
  triggerRef: React.RefObject<HTMLButtonElement>;
  triggerProps: Record<string, unknown>;
  leading: React.ReactNode;
  options: SelectOption[];
  placeholder?: string;
  size: SelectSize;
  searchable: boolean;
  multiple: boolean;
  values?: string[];
  defaultValues?: string[];
  onValuesChange?: (values: string[]) => void;
  selectedLabel: (count: number) => string;
  clearLabel: string;
  searchPlaceholder: string;
  noResultsLabel: string;
  label: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  name?: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Tick = () => (
  <svg className="ds-select-option__tick" viewBox="0 0 8 6" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M1 3l2 2 4-4" /></svg>
);

/**
 * Menu panel for a Select that needs more than a plain list: a search field (`searchable`), several chosen options (`multiple`), or both.
 * A button opens a dialog holding the list. Radix Popover places it; the list keyboard is ours.
 */
function PanelMenu(p: PanelMenuProps) {
  const { options, open, setOpen, size, multiple, searchable } = p;
  const listId = React.useId();
  const [innerOne, setInnerOne] = React.useState(p.defaultValue);
  const [innerMany, setInnerMany] = React.useState<string[]>(p.defaultValues ?? []);
  const chosen: string[] = multiple ? (p.values ?? innerMany) : ((p.value ?? innerOne) !== undefined ? [(p.value ?? innerOne) as string] : []);
  const isChosen = (v: string) => chosen.includes(v);
  const [query, setQuery] = React.useState('');
  const [active, setActive] = React.useState<string | undefined>();
  const searchRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);
  const firstChosen = options.find((o) => isChosen(o.value));
  const shown = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? options.filter((o) => o.label.toLowerCase().includes(q)) : options;
  }, [options, query]);
  const enabled = shown.filter((o) => !o.disabled);
  const optionId = (v: string) => `${listId}-opt-${v}`;

  // Start on the first chosen option (or the first one) each time the menu opens, with an empty search.
  React.useEffect(() => { if (open) { setQuery(''); setActive(firstChosen && !firstChosen.disabled ? firstChosen.value : options.find((o) => !o.disabled)?.value); } }, [open]); // eslint-disable-line react-hooks/exhaustive-deps
  // Keep the active option among the shown ones when the search changes.
  React.useEffect(() => { if (open && !enabled.some((o) => o.value === active)) setActive(enabled[0]?.value); }, [query]); // eslint-disable-line react-hooks/exhaustive-deps
  React.useEffect(() => { if (open && active) document.getElementById(optionId(active))?.scrollIntoView?.({ block: 'nearest' }); }, [active, open]); // eslint-disable-line react-hooks/exhaustive-deps

  const setMany = (next: string[]) => { if (p.values === undefined) setInnerMany(next); p.onValuesChange?.(next); };
  const choose = (o: SelectOption) => {
    if (o.disabled) return;
    if (multiple) {
      // Keep the order of the options, not the order of clicking.
      const set = new Set(chosen);
      if (set.has(o.value)) set.delete(o.value); else set.add(o.value);
      setMany(options.filter((x) => set.has(x.value)).map((x) => x.value));
      return;
    }
    if (p.value === undefined) setInnerOne(o.value);
    p.onValueChange?.(o.value);
    setOpen(false);
  };
  const clear = () => { setMany([]); (searchable ? searchRef.current : listRef.current)?.focus(); };
  const move = (delta: number, to?: 'first' | 'last') => {
    if (!enabled.length) return;
    if (to) { setActive(enabled[to === 'first' ? 0 : enabled.length - 1].value); return; }
    const i = enabled.findIndex((o) => o.value === active);
    setActive(enabled[Math.min(enabled.length - 1, Math.max(0, i + delta))].value);
  };
  const onListKey = (e: React.KeyboardEvent<HTMLElement>, fromSearch: boolean) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
    else if (e.key === 'Home' && !fromSearch) { e.preventDefault(); move(0, 'first'); }
    else if (e.key === 'End' && !fromSearch) { e.preventDefault(); move(0, 'last'); }
    else if (e.key === 'Enter' || (e.key === ' ' && !fromSearch)) { e.preventDefault(); const o = enabled.find((x) => x.value === active); if (o) choose(o); }
    // A single-choice panel has nothing else to reach, so Tab closes it; a multiple one has the Clear button, so Tab moves on.
    else if (e.key === 'Tab' && !multiple) { e.preventDefault(); setOpen(false); p.triggerRef.current?.focus(); }
  };
  const onTriggerKey = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); setOpen(true); }
  };

  const summary = chosen.length === 0 ? p.placeholder : chosen.length === 1 ? firstChosen?.label : p.selectedLabel(chosen.length);

  return (
    <Popover.Root open={open} onOpenChange={setOpen} modal>
      <Popover.Anchor asChild>
        <button
          ref={p.triggerRef}
          type="button"
          {...p.triggerProps}
          // The visible value is part of the name (WCAG 2.5.3 Label in Name): "Account, 3 selected".
          aria-labelledby={`${p.triggerProps['aria-labelledby']} ${p.triggerProps.id}-value`}
          aria-haspopup="dialog"
          aria-expanded={open}
          data-state={open ? 'open' : 'closed'}
          data-placeholder={chosen.length ? undefined : ''}
          disabled={p.disabled}
          onClick={() => setOpen(!open)}
          onKeyDown={onTriggerKey}
        >
          {p.leading}
          <span className="ds-select__value" id={`${p.triggerProps.id}-value`}>{summary}</span>
          <Icon name="chevron-down" size={16} />
        </button>
      </Popover.Anchor>
      {p.name ? (multiple ? chosen.map((v) => <input key={v} type="hidden" name={p.name} value={v} />) : <input type="hidden" name={p.name} value={chosen[0] ?? ''} />) : null}
      <Popover.Portal>
        <Popover.Content
          className="ds-select-menu ds-select-menu--panel"
          data-size={size}
          side="bottom"
          align="start"
          sideOffset={MENU_GAP}
          collisionPadding={MENU_GAP}
          aria-label={p.label}
          // The anchor is not a Popover trigger, so give focus back to the field ourselves. Without a search field, focus starts on the list.
          onOpenAutoFocus={searchable ? undefined : (e) => { e.preventDefault(); listRef.current?.focus(); }}
          onCloseAutoFocus={(e) => { e.preventDefault(); p.triggerRef.current?.focus(); }}
        >
          {searchable ? (
            <div className="ds-input ds-select-search" data-size={size}>
              <div className="ds-input__field">
                <Icon name="search" size={16} />
                <input
                  ref={searchRef}
                  className="ds-input__control"
                  type="search"
                  role="combobox"
                  aria-expanded="true"
                  aria-controls={listId}
                  aria-activedescendant={active ? optionId(active) : undefined}
                  aria-autocomplete="list"
                  aria-label={`Search ${p.label}`}
                  placeholder={p.searchPlaceholder}
                  value={query}
                  autoComplete="off"
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => onListKey(e, true)}
                />
              </div>
            </div>
          ) : null}
          <div
            ref={listRef}
            className="ds-select-menu__list"
            role="listbox"
            id={listId}
            aria-label={p.label}
            aria-multiselectable={multiple || undefined}
            aria-activedescendant={!searchable && active ? optionId(active) : undefined}
            tabIndex={searchable ? undefined : 0}
            onKeyDown={searchable ? undefined : (e) => onListKey(e, false)}
          >
            {shown.map((o) => (
              <div
                key={o.value}
                id={optionId(o.value)}
                role="option"
                className="ds-select-option"
                data-multiple={multiple ? '' : undefined}
                aria-selected={isChosen(o.value)}
                aria-disabled={o.disabled || undefined}
                data-state={isChosen(o.value) ? 'checked' : 'unchecked'}
                data-highlighted={o.value === active ? '' : undefined}
                data-disabled={o.disabled ? '' : undefined}
                onMouseDown={(e) => { if (searchable) e.preventDefault(); }}
                onMouseMove={() => { if (!o.disabled) setActive(o.value); }}
                onClick={() => choose(o)}
              >
                {multiple ? <span className="ds-select-option__box" aria-hidden="true">{isChosen(o.value) ? <Tick /> : null}</span> : null}
                <span className="ds-select-option__label">{o.label}</span>
                {!multiple && isChosen(o.value) ? <span className="ds-select-option__check"><Icon name="check" size={12} /></span> : null}
              </div>
            ))}
          </div>
          {/* Outside the listbox: a listbox may only contain options (axe aria-required-children). */}
          {shown.length === 0 ? <div className="ds-select-empty">{p.noResultsLabel}</div> : null}
          {multiple ? (
            <div className="ds-select-footer">
              <span className="ds-select-footer__count">{p.selectedLabel(chosen.length)}</span>
              <Button variant="quiet" size="small" onClick={clear} disabled={chosen.length === 0}>{p.clearLabel}</Button>
            </div>
          ) : null}
          {/* Tells a screen reader how many options the search left, without moving focus. */}
          <p className="ds-visually-hidden" role="status">{open ? (shown.length === 0 ? p.noResultsLabel : `${shown.length} options`) : ''}</p>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
