import React from 'react';
import cx from '../../lib/cx';
import { ChevronDown } from '../../ui/Icons';

/**
 * Page control for the pickers. Twelve options is more than a chat column can
 * show at once without becoming a scroll of its own, so both pickers show four
 * and page through them — and both use this, so they can't drift into two
 * different controls for the same job.
 *
 * The arrows wrap rather than disabling at the ends: the set is a loop of
 * equally valid choices, not a sequence with a beginning and an end, and a
 * dead control at 1/3 invites a second click that does nothing.
 */
/** Four to a page — the grid is two by two and the column is narrow. */
export const PER_PAGE = 4;

export default function PickerPager({ page, pageCount, onChange }) {
  if (pageCount <= 1) return null;

  const go = (delta) => onChange((page + delta + pageCount) % pageCount);

  return (
    <div className="flex items-center gap-1 text-[14px] text-[#1F1F1F]">
      <Arrow direction="prev" onClick={() => go(-1)} />
      <span className="tabular-nums" aria-live="polite">
        {page + 1}/{pageCount}
      </span>
      <Arrow direction="next" onClick={() => go(1)} />
    </div>
  );
}

function Arrow({ direction, onClick }) {
  const isPrev = direction === 'prev';
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isPrev ? 'Previous options' : 'Next options'}
      // No border: two boxed arrows either side of the count read as a third
      // and fourth control next to the tiles above them. Bare glyphs with a
      // hover fill stay navigation.
      className={cx(
        'flex h-6 w-6 items-center justify-center rounded-[6px] text-[#1F1F1F]',
        'transition-colors duration-fast ease-standard hover:bg-surface-sunken'
      )}
    >
      {/* The one chevron in the set, turned — a separate left/right pair would
          be two more glyphs to keep consistent with this one. */}
      <ChevronDown
        width={14}
        height={14}
        style={{ transform: `rotate(${isPrev ? 90 : -90}deg)` }}
      />
    </button>
  );
}
