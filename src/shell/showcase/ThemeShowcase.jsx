import React, { useCallback, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import cx from '../../lib/cx';
import ThemeThumb from './ThemeThumb';
import { SHOWCASE_THEMES } from './showcaseThemes';
import { ArrowUp } from '../../ui/Icons';
import { snap } from '../../design/motion';

/** Pixels per frame of ambient drift — slow enough to read a caption. */
const DRIFT = 0.32;
/** How hard each frame closes the gap to an arrow's target. */
const EASE = 0.16;

/**
 * THEME SHOWCASE
 *
 * One long row of other people's sites, drifting sideways beneath the input —
 * a wall of what WordPress makes, close enough to tap. Tapping a tile opens
 * that template directly (see EntryScreen's `handleShowcasePick`).
 *
 * The list renders twice and is scrolled by `scrollLeft`, rolled back by
 * exactly half whenever it passes the halfway mark — the second copy is
 * already in that position, so the loop has no seam. Keeping it a real scroll
 * offset rather than a CSS transform is what lets the arrows move it: the
 * drift and the arrows are the same one animation, so a click can't land
 * mid-keyframe and fight it.
 */
export default function ThemeShowcase({ className, onPick }) {
  const doubled = [...SHOWCASE_THEMES, ...SHOWCASE_THEMES];
  const scrollerRef = useRef(null);
  /** Hovering holds the row still so a caption can actually be read. */
  const pausedRef = useRef(false);
  /** Non-null while an arrow's move is still playing out. */
  const targetRef = useRef(null);
  const reducedRef = useRef(false);

  useEffect(() => {
    reducedRef.current =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return undefined;

    let frame = requestAnimationFrame(function tick() {
      // Half the doubled track — one full pass of the real list.
      const half = el.scrollWidth / 2;

      if (half > 0) {
        if (targetRef.current != null) {
          const gap = targetRef.current - el.scrollLeft;
          if (Math.abs(gap) < 0.5) {
            el.scrollLeft = targetRef.current;
            targetRef.current = null;
          } else {
            el.scrollLeft += gap * EASE;
          }
        } else if (!pausedRef.current && !reducedRef.current) {
          el.scrollLeft += DRIFT;
        }

        // Roll back onto the first copy. Any in-flight target has to move with
        // it, or the remaining distance would be measured against the old
        // offset and the row would lurch.
        if (el.scrollLeft >= half) {
          el.scrollLeft -= half;
          if (targetRef.current != null) targetRef.current -= half;
        }
      }

      frame = requestAnimationFrame(tick);
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  /**
   * `direction` is -1 or 1. Going backwards past zero isn't expressible as a
   * scroll offset, so the row is first jumped forward by half a track —
   * invisible, since that position shows identical cards — and the move is
   * measured from there.
   */
  const nudge = useCallback((direction) => {
    const el = scrollerRef.current;
    if (!el) return;

    const half = el.scrollWidth / 2;
    const step = Math.max(240, el.clientWidth * 0.8);
    let from = targetRef.current ?? el.scrollLeft;

    if (direction < 0 && from - step < 0) {
      el.scrollLeft = from + half;
      from += half;
    }

    const next = from + direction * step;
    if (reducedRef.current) {
      el.scrollLeft = next;
      return;
    }
    targetRef.current = next;
  }, []);

  return (
    <div
      className={className}
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
    >
      {/* The arrows anchor to this, not to the outer element — that one
          carries the section's top padding, which would offset them above
          the row by exactly that much. */}
      <div className="relative">
        {/* The fade mask lives on the scroller, not its parent, so it doesn't
            also dissolve the arrows sitting on top of it. */}
        <div ref={scrollerRef} className="showcase-fade-x showcase-scroller">
          <div className="flex w-max gap-4">
            {doubled.map((theme, index) => (
              // Index is part of the key on purpose: the list is duplicated,
              // so names alone are not unique.
              <button
                key={`${theme.name}-${index}`}
                type="button"
                onClick={() => onPick(theme)}
                tabIndex={index < SHOWCASE_THEMES.length ? 0 : -1}
                aria-hidden={index < SHOWCASE_THEMES.length ? undefined : true}
                aria-label={`Use a prompt inspired by ${theme.name}: ${theme.prompt}`}
                className="w-56 shrink-0 text-left transition-opacity duration-fast hover:opacity-80"
              >
                <ThemeThumb theme={theme} />
              </button>
            ))}
          </div>
        </div>

        <Arrow direction={-1} onClick={() => nudge(-1)} label="Previous templates" />
        <Arrow direction={1} onClick={() => nudge(1)} label="Next templates" />
      </div>
    </div>
  );
}

/**
 * The composer's send button, in white — same pill, same size, same press
 * feedback, with its arrow turned to point the way it moves.
 *
 * Positioning sits on a wrapper rather than the button: Framer writes hover
 * and tap as an inline `transform`, which would otherwise overwrite the
 * centring translate and drop the button out of place the moment it's
 * touched.
 *
 * Centred on the thumbnail rather than the figure — the caption below it
 * would otherwise pull the arrows visibly low. Tiles are `w-56` at 4/3, so
 * the image is 10.5rem tall and its middle is half that. Straddling the
 * container edge puts each arrow centrally on the edge of the card under it.
 */
function Arrow({ direction, onClick, label }) {
  return (
    <div
      className={cx(
        'absolute top-[5.25rem] z-10 -translate-y-1/2',
        direction < 0 ? 'left-0 -translate-x-1/2' : 'right-0 translate-x-1/2'
      )}
    >
      <motion.button
        type="button"
        onClick={onClick}
        aria-label={label}
        title={label}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.94 }}
        transition={snap}
        className={cx(
          'flex h-9 w-9 items-center justify-center rounded-pill',
          'border border-line bg-surface text-ink shadow-composer',
          'transition-colors duration-fast ease-standard hover:border-line-strong'
        )}
      >
        <ArrowUp
          width={16}
          height={16}
          strokeWidth={1.75}
          style={{ transform: `rotate(${direction < 0 ? -90 : 90}deg)` }}
        />
      </motion.button>
    </div>
  );
}
