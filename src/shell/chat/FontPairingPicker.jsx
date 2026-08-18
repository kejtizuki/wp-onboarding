import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { settle, snap } from '../../design/motion';
import { FONT_PAIRINGS } from '../../onboarding/generation/fontPairings';
import { pickerTile } from './pickerTile';
import PickerPager, { PER_PAGE } from './PickerPager';

/**
 * FONT PAIRING PICKER — offered when the colour palette is skipped (see
 * ColorPalettePicker). Same shape and mechanics as the colour picker: the
 * first tile is the site's own current heading face (`defaultPairing`),
 * highlighted by default and equivalent to `onSelect(null)`; eleven
 * alternates follow, four to a page. Each tile shows "Aa" set in the
 * heading face beside "Aa" in the shared body face — a glance at the
 * pairing, not a read — the same shorthand the swatches use for palettes.
 *
 * This is the last thing offered, so once it's settled — picked or skipped —
 * it hands the conversation back with an open question rather than just
 * going quiet. Same treatment as the palette picker: the block stays put,
 * only its Skip button goes.
 */
export default function FontPairingPicker({ selectedId, onSelect, defaultPairing }) {
  const [resolved, setResolved] = useState(false);
  const [page, setPage] = useState(0);

  // The theme's own face leads, then the alternates — twelve in all, four to
  // a page, same as the palette picker above it.
  const pairings = [defaultPairing, ...FONT_PAIRINGS];
  const pageCount = Math.ceil(pairings.length / PER_PAGE);
  const visible = pairings.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={settle}
      className="flex flex-col gap-3"
    >
      <p className="text-[14px] text-[#1F1F1F]">Choose your font pairing:</p>

      {/* Same two-tier treatment as the colour palette: an F6F7F7 container
          carrying the selection border, a rounded-pill sample inside it. */}
      <div className="grid grid-cols-2 gap-4">
        {visible.map((pairing) => {
          const isDefault = pairing.id === 'default';
          const active = isDefault ? selectedId == null : selectedId === pairing.id;
          return (
            <motion.button
              key={pairing.id}
              type="button"
              onClick={() => {
                onSelect(isDefault ? null : pairing.id);
                setResolved(true);
              }}
              whileTap={{ scale: 0.97 }}
              transition={snap}
              aria-pressed={active}
              aria-label={`${pairing.name} font pairing`}
              title={pairing.name}
              className={pickerTile(active)}
            >
              {/* Exact halves (`basis-1/2`, not `flex-1`) so the divider sits
                  dead centre on every card, and `leading-none` on both so the
                  glyph is centred on its own box rather than on a line box
                  whose height varies with the font's metrics. The two sizes
                  are fixed and explicit — heading larger than body — so the
                  only thing that differs between cards is the typeface. */}
              {/* `h-8` to match the palette swatches exactly — the two
                  pickers sit in the same column and any difference in tile
                  height reads as one of them being more important. */}
              <span className="flex h-8 overflow-hidden rounded-pill bg-white">
                <span
                  className="flex basis-1/2 items-center justify-center text-[20px] leading-none text-[#1F1F1F]"
                  style={{ fontFamily: pairing.heading }}
                >
                  Aa
                </span>
                <span
                  className="flex basis-1/2 items-center justify-center border-l border-line text-[14px] leading-none text-[#1F1F1F]"
                  style={{ fontFamily: pairing.body }}
                >
                  Aa
                </span>
              </span>
            </motion.button>
          );
        })}
      </div>

      <div className="flex items-center justify-end gap-3">
          {!resolved && (
          <button
            type="button"
            onClick={() => setResolved(true)}
            className="rounded-[8px] border border-line px-3 py-1.5 text-[14px] text-[#1F1F1F] transition-colors duration-fast hover:border-line-strong"
          >
            Skip
          </button>
        )}
        <PickerPager page={page} pageCount={pageCount} onChange={setPage} />
      </div>

      {resolved && (
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={settle}
          /* Handing the conversation back is a new turn, not another part of
             the picker — so it sits the full 24px away like any other
             message, not the 12px that spaces this block's own parts. */
          className="mt-3 text-[14px] text-[#1F1F1F]"
        >
          What do you want to change now?
        </motion.p>
      )}
    </motion.div>
  );
}
