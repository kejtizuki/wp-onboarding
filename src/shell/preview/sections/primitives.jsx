import React from 'react';
import cx from '../../../lib/cx';

/**
 * Shared pieces every section renderer uses.
 *
 * No hardcoded colour or type here — everything below reaches for the same
 * token classes (`bg-surface-sunken`, `text-ink`, `font-serif`...) that a
 * theme's own `tokens` can repoint (see registry.js). A `Figure` is a plain
 * box in every theme; what changes theme to theme is whether it sits beside
 * the copy, above it, in a grid — or, now, what colour "plain" resolves to.
 */

/**
 * Stand-in for photography. Ratio is the only thing most themes vary.
 *
 * Two ways a section can ask for more than the flat grey fill, both driven by
 * content rather than the renderer: `gradient` sweeps through the theme's own
 * ink/accent tokens for a warped-abstract-band feel with no asset at all;
 * `image` (a bundler-resolved import, same convention as showcaseThemes.js)
 * drops in a real picture when one exists, as NotesLab's cover eventually did.
 * `image` wins if both are set.
 */
export function Figure({ ratio = '4/3', className, gradient = false, image }) {
  if (image) {
    return (
      <img
        src={image}
        alt=""
        aria-hidden="true"
        className={cx('w-full rounded-nested object-cover', className)}
        style={{ aspectRatio: ratio }}
      />
    );
  }

  return (
    <div
      aria-hidden
      className={cx('w-full rounded-nested', gradient ? 'bg-figure-gradient' : 'bg-surface-sunken', className)}
      style={{ aspectRatio: ratio }}
    />
  );
}

/** Padding as a token, not a Tailwind class, so a theme can size its own CTAs
    (see artisanal.js) without a per-button variant prop. */
const ctaPadding = { padding: 'var(--cta-padding-y) var(--cta-padding-x)' };

/** Filled call to action. */
export function Cta({ children }) {
  return (
    <span
      className="inline-flex items-center rounded-control bg-accent text-caption font-medium text-accent-ink"
      style={ctaPadding}
    >
      {children}
    </span>
  );
}

/** Outlined variant — themes ask for this when a section should sit quieter. */
export function OutlinedCta({ children }) {
  return (
    <span
      className="inline-flex items-center rounded-control border border-ink text-caption font-medium text-ink"
      style={ctaPadding}
    >
      {children}
    </span>
  );
}

export function SectionHeading({ children, compact }) {
  return (
    <h2
      className={cx(
        'font-serif tracking-tight text-ink',
        compact ? 'text-lg-20' : 'text-lg-28'
      )}
    >
      {children}
    </h2>
  );
}
