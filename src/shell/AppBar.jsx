import React from 'react';
import cx from '../lib/cx';
import Button from '../ui/Button';
import { WordPressBadge, AddBadge, Page, Lock, Desktop, Mobile } from '../ui/Icons';

/**
 * GLOBAL APP BAR — WordPress editor chrome, spanning both panels rather than
 * scoped to either. Reads as the real editor: the WordPress mark, "New", and
 * the viewport switcher on the left, the open document named in the center,
 * and the session's asks on the right.
 *
 * Only controls that do something live here. The editor's document tools
 * (edit, undo, redo, outline) were dropped rather than left inert — a row of
 * buttons that don't respond reads as broken, not as chrome.
 *
 * Launch stays visually locked (muted fill, no border, lock icon) rather
 * than simply disabled — the site isn't missing a step, launching it live is
 * the thing the upgrade unlocks. Both Launch and Upgrade resolve to the same
 * paywall. No border anywhere here — the bar is set off from the page by its
 * own fill against the canvas around it, not a stroke.
 */
export default function AppBar({
  title = 'Untitled',
  onLaunch,
  onHome,
  actionsEnabled = false,
  viewport,
  onViewportChange,
}) {
  return (
    <div className="flex h-appbar shrink-0 bg-surface">
      <div className="flex flex-1 items-center gap-3 px-3 py-2">
        <div className="flex flex-1 items-center gap-2">
          {/* The supplied badge asset, sitting in the same padded row as
              everything else now, clipped to a uniform 8px on every corner.
              The mark is the way home, as it is in the real editor — it
              abandons the session and returns to the entry screen. */}
          <button
            type="button"
            onClick={onHome}
            aria-label="WordPress — start over"
            title="Start over"
            className="shrink-0 rounded-[8px]"
          >
            <WordPressBadge aria-hidden className="h-[41px] w-[41px] rounded-[8px]" />
          </button>

          {/* The supplied "New" asset, rendered at its own exact
              dimensions — not run through IconButton's sizing. */}
          <button type="button" aria-label="New" className="shrink-0">
            <AddBadge width={32} height={32} />
          </button>

          {/* Moved here from the preview panel's own toolbar — the panel
              carries no chrome of its own now, see PreviewPanel.jsx. */}
          <div className="flex items-center gap-0.5 rounded-control bg-surface-sunken p-0.5">
            <ViewportButton
              active={viewport === 'desktop'}
              onClick={() => onViewportChange('desktop')}
              label="Desktop preview"
            >
              <Desktop width={16} height={16} />
            </ViewportButton>
            <ViewportButton
              active={viewport === 'mobile'}
              onClick={() => onViewportChange('mobile')}
              label="Mobile preview"
            >
              <Mobile width={16} height={16} />
            </ViewportButton>
          </div>
        </div>

        <div className="hidden min-w-0 flex-1 items-center justify-center stage:flex">
          <div className="flex h-9 w-full max-w-[18rem] items-center justify-between gap-3 truncate rounded-[8px] bg-surface-sunken px-3">
            <span className="flex min-w-0 items-center gap-1.5 truncate text-micro text-ink">
              <Page width={14} height={14} className="shrink-0" />
              <span className="truncate">{title}</span>
            </span>
            <span className="shrink-0 text-micro text-ink-subtle">⌘K</span>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2">
          <Button
            variant="muted"
            size="bar"
            radius="bar"
            disabled={!actionsEnabled}
            className="gap-1.5"
            onClick={onLaunch}
          >
            <Lock width={12} height={12} />
            Launch
          </Button>
          <Button variant="secondary" size="bar" radius="bar" disabled={!actionsEnabled}>
            Save as draft
          </Button>
          <Button variant="primary" size="bar" radius="bar" onClick={onLaunch}>
            Upgrade
          </Button>
        </div>
      </div>
    </div>
  );
}

function ViewportButton({ active, onClick, label, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={cx(
        'flex h-8 w-9 items-center justify-center rounded-[calc(var(--radius-control)-2px)]',
        'transition-colors duration-fast ease-standard',
        active ? 'bg-surface text-ink shadow-composer' : 'text-ink-subtle hover:text-ink-muted'
      )}
    >
      {children}
    </button>
  );
}
