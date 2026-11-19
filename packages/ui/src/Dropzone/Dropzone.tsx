import * as React from 'react';
import './Dropzone.css';
import '../shared.css';
import { Icon } from '../Icon/Icon';
import { Button } from '../Button/Button';

/**
 * @spec northgate/dropzone r1
 * An area that takes files dropped on it, with a button for choosing them instead. It only hands files over; showing their progress is the File row.
 */
export interface DropzoneProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onDrop' | 'title'> {
  /** What to do ("Drop a statement here, or browse"). */
  title: string;
  /** What is accepted ("CSV or MT940, up to 10 MB"). Replaced by `error` when there is one. */
  hint?: string;
  /** Why the last attempt failed. Turns the area red (Figma State=Error) and replaces the hint; read out at once. */
  error?: string;
  /** Called with the files that were dropped or chosen. */
  onFiles: (files: File[]) => void;
  /** File types the chooser offers, as for an input ("." + extension or a media type, comma separated). It does not filter drops: check them in `onFiles`. */
  accept?: string;
  /** Lets several files be chosen or dropped at once. */
  multiple?: boolean;
  /** Label of the button. Defaults to "Browse files". */
  browseLabel?: string;
}

export const Dropzone = React.forwardRef<HTMLDivElement, DropzoneProps>(function Dropzone(
  { title, hint, error, onFiles, accept, multiple = false, browseLabel = 'Browse files', className, ...rest },
  ref,
) {
  const input = React.useRef<HTMLInputElement>(null);
  const titleId = React.useId();
  const hintId = React.useId();
  const [depth, setDepth] = React.useState(0);
  const dragging = depth > 0;
  const state = error ? 'error' : dragging ? 'dragging' : 'default';
  const note = error ?? hint;
  const hasFiles = (e: React.DragEvent) => Array.from(e.dataTransfer?.types ?? []).includes('Files');

  return (
    <div
      ref={ref}
      role="group"
      aria-labelledby={titleId}
      aria-describedby={note ? hintId : undefined}
      className={className ? `ds-dropzone ${className}` : 'ds-dropzone'}
      data-state={state}
      onDragEnter={(e) => { if (hasFiles(e)) { e.preventDefault(); setDepth((d) => d + 1); } }}
      onDragOver={(e) => { if (hasFiles(e)) e.preventDefault(); }}
      onDragLeave={(e) => { if (hasFiles(e)) setDepth((d) => Math.max(0, d - 1)); }}
      onDrop={(e) => {
        if (!hasFiles(e)) return;
        e.preventDefault();
        setDepth(0);
        const files = Array.from(e.dataTransfer.files);
        if (files.length) onFiles(multiple ? files : files.slice(0, 1));
      }}
      {...rest}
    >
      <Icon name="upload" size={24} className="ds-dropzone__icon" />
      <div id={titleId} className="ds-dropzone__title">{title}</div>
      {note ? <div id={hintId} className="ds-dropzone__hint" role={error ? 'alert' : undefined}>{note}</div> : null}
      <Button variant="secondary" size="medium" onClick={() => input.current?.click()}>{browseLabel}</Button>
      <input
        ref={input}
        type="file"
        className="ds-visually-hidden"
        tabIndex={-1}
        aria-hidden="true"
        accept={accept}
        multiple={multiple}
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          if (files.length) onFiles(files);
          e.target.value = '';
        }}
      />
    </div>
  );
});
