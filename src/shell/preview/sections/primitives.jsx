import React, { useEffect, useRef, useState } from 'react';
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
export function Figure({ ratio = '4/3', className, gradient = false, image, rounded = true }) {
  if (image) {
    return <ImageFigure ratio={ratio} className={className} image={image} rounded={rounded} />;
  }

  return (
    <div
      aria-hidden
      className={cx(
        'w-full',
        rounded && 'rounded-nested',
        gradient ? 'bg-figure-gradient' : 'bg-surface-sunken',
        className
      )}
      style={{ aspectRatio: ratio }}
    />
  );
}

/**
 * A real photograph, with the section skeleton's shimmer standing in its place
 * until it arrives.
 *
 * Locally the files come off disk and this is never seen; over a network it's
 * the difference between a page that fills in and a page full of holes that
 * snap shut one by one. The box always occupies its final size — the ratio is
 * on the wrapper, not the image — so nothing below it moves when the picture
 * lands.
 */
function ImageFigure({ ratio, className, image, rounded = true }) {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef(null);

  // A cached image can finish before React has attached `onLoad`, which would
  // otherwise leave it shimmering behind a picture that's already there.
  useEffect(() => {
    const el = ref.current;
    if (el?.complete && el.naturalWidth > 0) setLoaded(true);
  }, []);

  return (
    <div
      aria-hidden
      className={cx(
        'w-full overflow-hidden',
        rounded && 'rounded-nested',
        loaded ? 'bg-surface-sunken' : 'shimmer',
        className
      )}
      style={{ aspectRatio: ratio }}
    >
      <img
        ref={ref}
        src={image}
        alt=""
        loading="lazy"
        decoding="async"
        // Treated as settled either way: a broken image should stop shimmering
        // rather than pretend it's still on its way.
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        className={cx(
          'h-full w-full object-cover transition-opacity duration-base ease-standard',
          loaded ? 'opacity-100' : 'opacity-0'
        )}
      />
    </div>
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
