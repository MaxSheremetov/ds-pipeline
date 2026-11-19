import * as React from 'react';
import './FileRow.css';
import '../shared.css';
import { Icon } from '../Icon/Icon';
import { InteractiveIcon } from '../InteractiveIcon/InteractiveIcon';
import { ProgressBar } from '../ProgressBar/ProgressBar';

export type FileRowStatus = 'uploading' | 'done' | 'error';

/**
 * @spec northgate/file-row r1
 * One file in an upload list: its name and size, how far it got, and what the person can do with it.
 */
export interface FileRowProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** The file name. Cut with an ellipsis when it does not fit. */
  name: string;
  /** The size, already formatted ("1.4 MB"). */
  size?: string;
  /** Where the upload stands. Matches the Figma property State. */
  status: FileRowStatus;
  /** Progress from 0 to 100, shown while uploading. */
  progress?: number;
  /** Why the upload failed and what to do ("Upload failed. Check the connection and retry."). Shown in the Error state. */
  message?: string;
  /** Shows the remove button and calls this when it is pressed. */
  onRemove?: () => void;
  /** Shows a retry button in the Error state and calls this when it is pressed. */
  onRetry?: () => void;
  /** Word for "Remove", before the file name in the button's name. Defaults to "Remove". */
  removeLabel?: string;
  /** Word for "Retry", before the file name in the button's name. Defaults to "Retry". */
  retryLabel?: string;
}

export const FileRow = React.forwardRef<HTMLDivElement, FileRowProps>(function FileRow(
  { name, size, status, progress = 0, message, onRemove, onRetry, removeLabel = 'Remove', retryLabel = 'Retry', className, ...rest },
  ref,
) {
  return (
    <div ref={ref} role="group" aria-label={name} className={className ? `ds-file-row ${className}` : 'ds-file-row'} data-status={status} {...rest}>
      <Icon name="file-text" size={20} className="ds-file-row__file" />
      <div className="ds-file-row__text">
        <div className="ds-file-row__name">{name}</div>
        {status === 'uploading' ? <ProgressBar label={`Uploading ${name}`} value={progress} size="large" showLabel={false} showValue={false} hatched={false} /> : null}
        {status === 'error' && message ? <div className="ds-file-row__message" role="alert">{message}</div> : null}
      </div>
      {size ? <div className="ds-file-row__size">{size}</div> : null}
      {status === 'done' ? <Icon name="circle-check" size={16} label="Uploaded" className="ds-file-row__status" /> : null}
      {status === 'error' ? <Icon name="circle-alert" size={16} label="Failed" className="ds-file-row__status" /> : null}
      {status === 'error' && onRetry ? <InteractiveIcon size="medium" icon="refresh-cw" label={`${retryLabel} ${name}`} onClick={onRetry} /> : null}
      {onRemove ? <InteractiveIcon size="medium" icon="x" label={`${removeLabel} ${name}`} onClick={onRemove} /> : null}
    </div>
  );
});
