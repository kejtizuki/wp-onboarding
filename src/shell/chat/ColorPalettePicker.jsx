import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { settle, snap } from '../../design/motion';
import FontPairingPicker from './FontPairingPicker';
import PickerPager, { PER_PAGE } from './PickerPager';
import { pickerTile } from './pickerTile';

/**
 * COLOR PALETTE PICKER — offered once, right after the completion summary.
 *
 * The first tile is always the site's own current colours (`defaultPalette`
 * — see palettes.js's `themeDefaultPalette`, computed fresh per theme, never
 * a fixed fifth option), followed by three fixed alternates. Highlighted by
 * default, since it's what's already showing in the preview; picking it back
 * is the same as `onSelect(null)` — no override, not a real fourth choice.
 * Each is a single pill of four swatches rather than a labelled row — the
 * same shorthand a real palette-picker uses, so choosing is a glance, not a
 * read. Either "Skip" or an actual pick settles this step — the palette
 * block itself never disappears (so the choice stays visible in the chat's
 * history), it just hands off to the font pairing picker underneath, the
 * next thing worth offering once colour is settled.
 */
export default function ColorPalettePicker({
  selectedId,
  onSelect,
  defaultPalette,
  /** The alternates for this kind of site — see `palettesForTheme`. */
  alternates,
  fontPairingId,
  onSelectFontPairing,
  defaultFontPairing,
}) {
  const [resolved, setResolved] = useState(false);
  const [page, setPage] = useState(0);

  // The site's own colours lead, then the alternates — twelve in all, four to
  // a page. The current pick can be on any page; the ring travels with it.
  const palettes = [defaultPalette, ...alternates];
  const pageCount = Math.ceil(palettes.length / PER_PAGE);
  const visible = palettes.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  return (
    // No gap on this wrapper: the space between the two questions is set by
    // the rule below, not shared with the spacing inside either of them.
    <div className="flex flex-col">
      <motion.div
        layout="position"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={settle}
        className="flex flex-col gap-3"
      >
        <p className="text-[14px] text-[#1F1F1F]">Choose your color palette:</p>

        {/* Each palette is a pill of swatches sitting inside its own padded
            container — the container carries the selection border, not the
            pill, so picking one draws a rectangle around the whole tile rather
            than just outlining the colours. See pickerTile, shared with the
            font picker. */}
        <div className="grid grid-cols-2 gap-4">
          {visible.map((palette) => {
            const isDefault = palette.id === 'default';
            const active = isDefault ? selectedId == null : selectedId === palette.id;
            return (
              <motion.button
                key={palette.id}
                type="button"
                onClick={() => {
                  onSelect(isDefault ? null : palette.id);
                  setResolved(true);
                }}
                whileTap={{ scale: 0.97 }}
                transition={snap}
                aria-pressed={active}
                aria-label={`${palette.name} palette`}
                title={palette.name}
                className={pickerTile(active)}
              >
                <span className="flex overflow-hidden rounded-pill">
                  {palette.swatches.map((hex, index) => (
                    <span key={index} className="h-8 flex-1" style={{ backgroundColor: hex }} />
                  ))}
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
      </motion.div>

      {/* Colour and type are two decisions, not one long list. A tile-gap
          apart they read as more of the same, so the second question gets
          noticeably more room above it than anything inside either one. */}
      {resolved && (
        <div className="mt-6">
          <FontPairingPicker
            selectedId={fontPairingId}
            onSelect={onSelectFontPairing}
            defaultPairing={defaultFontPairing}
          />
        </div>
      )}
    </div>
  );
}
