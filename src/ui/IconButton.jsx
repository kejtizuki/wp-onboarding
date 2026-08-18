import React, { forwardRef } from 'react';
import cx from '../lib/cx';

const VARIANTS = {
  ghost: 'text-ink-muted hover:bg-surface-sunken hover:text-ink',
  // Full-strength ink at rest, not muted — the app bar's document-editing
  // tools (edit, undo, redo, outline) read as live controls, not chrome.
  ink: 'text-ink hover:bg-surface-sunken',
  // The one filled icon button in the app bar's document cluster — reads as
  // the primary/active tool among a row of otherwise-inert ones.
  primary: 'bg-accent text-accent-ink hover:bg-accent-hover',
};

const SIZES = {
  sm: 'h-7 w-7',
  // The app bar's own scale — 41px, matching the height of its 42px buttons.
  bar: 'h-[41px] w-[41px]',
};

/**
 * A plain, non-toggling icon-only control — the app bar's document actions
 * (new, edit, undo, redo, outline), a panel's close button. Distinct from a
 * toggle like the preview panel's viewport switcher, which carries its own
 * pressed-state styling and stays a one-off next to what it controls.
 */
const IconButton = forwardRef(function IconButton(
  { label, variant = 'ghost', size = 'sm', className, children, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      title={label}
      className={cx(
        'flex shrink-0 items-center justify-center rounded-control',
        'transition-colors duration-fast ease-standard',
        SIZES[size],
        VARIANTS[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

export default IconButton;
