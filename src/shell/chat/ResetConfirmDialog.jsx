import React from 'react';
import { motion } from 'framer-motion';
import { Warning } from '../../ui/Icons';
import { settle, fade } from '../../design/motion';

/**
 * RESET CONFIRMATION — the surface behind the header's Reset link, grown.
 *
 * It deliberately does NOT render its own "Reset" label: the real one stays
 * put in the header at a higher z-index and this box opens out from under
 * it, so the word doesn't shift by a pixel on expand. The box is anchored
 * top-right and clears the link with its own top padding; the close icon
 * ends up covered, which is what the design shows.
 *
 * The two actions are the chat's Skip button, verbatim (see
 * ColorPalettePicker) — same 8px radius, same hairline, same 14px ink.
 */
const ACTION =
  'whitespace-nowrap rounded-[8px] border border-line px-3 py-1.5 text-[14px] text-[#1F1F1F] transition-colors duration-fast hover:border-line-strong';

export default function ResetConfirmDialog({ onConfirm, onCancel }) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0, scaleX: 0.86 }}
      animate={{ opacity: 1, height: 'auto', scaleX: 1 }}
      exit={{ opacity: 0, height: 0, scaleX: 0.86 }}
      transition={settle}
      style={{ borderRadius: 16, transformOrigin: 'top right' }}
      /* Sized to its own content, not to the column: the widest thing in it
         is the pair of buttons, so the card ends up exactly as wide as they
         need and no wider. Anchored right, stopping short of the close icon,
         so it reads as belonging to "Reset" above it. */
      className="absolute right-10 top-1.5 z-10 w-fit max-w-[calc(100%-3.25rem)] overflow-hidden bg-surface shadow-raised"
    >
      {/* pt clears the Reset link sitting on top of this box. */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.08 } }}
        transition={{ ...fade, delay: 0.06 }}
        /* 16px all round; the top is deeper only because the Reset link is
           sitting on top of this box and has to be cleared. */
        className="px-4 pb-4 pt-11"
      >
        <p className="text-body font-semibold text-ink">Do you want to start again?</p>

        <div className="mt-2 flex items-center gap-2 text-caption text-ink-muted">
          <Warning width={16} height={16} className="shrink-0" />
          <span>Your edits won't be saved.</span>
        </div>

        <div className="mt-4 flex gap-2">
          <button type="button" className={ACTION} onClick={onCancel}>
            No, keep editing
          </button>
          <button type="button" className={ACTION} onClick={onConfirm}>
            Yes, start over
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
