import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Composer from '../composer/Composer';
import MessageList from './MessageList';
import ResetConfirmDialog from './ResetConfirmDialog';
import { builderContentEnter } from '../../design/motion';

const DOCKED_PLACEHOLDER = 'Ask for a change…';

/**
 * CONVERSATION COLUMN — builder only. The entry screen has its own input.
 *
 * Named header now that the session actions live in the global app bar (see
 * `shell/AppBar.jsx`) rather than the preview panel's own toolbar — this
 * column needed something to identify itself by. "Reset" is the same action
 * the app bar's "Start over" triggers, just phrased for the chat — but here
 * it opens a confirmation first, since the chat is where the actual edits
 * being discarded are visible.
 *
 * Fades in a beat after the builder shell itself, so the surface settles before
 * content appears inside it.
 */
export default function ChatColumn({ messages, onSubmit, onReset, activity = null }) {
  const [value, setValue] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleSubmit = (text) => {
    onSubmit(text);
    setValue('');
  };

  const confirmReset = () => {
    setConfirmOpen(false);
    onReset?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={builderContentEnter}
      className="flex h-full min-h-0 flex-col"
    >
      {/* The fill has to carry the panel's own top corners: the sidebar isn't
          clipped (the reset popover overhangs it), so an opaque header with
          square corners would paint straight over them. */}
      <div className="relative z-10 flex shrink-0 items-center justify-between rounded-t-panel bg-surface px-3 py-3">
        {/* No rule under the header — the content fades out beneath it
            instead, so a message scrolling up dissolves rather than sliding
            under a line. Sits outside the header's own box (hence the
            negative offset) so it covers the first 16px of the scroller. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-full h-4 bg-gradient-to-b from-surface to-transparent"
        />
        <span className="text-body font-semibold text-ink">AI-Builder</span>
        {/* Reset is never re-rendered somewhere else — it stays exactly where
            it is and the confirmation grows out from underneath it, so the
            word itself doesn't move a pixel on expand. It only needs to sit
            above the expanding surface. */}
        <div className="flex items-center gap-3">
          {onReset && (
            <button
              type="button"
              onClick={() => setConfirmOpen((open) => !open)}
              className="relative z-20 text-caption font-medium text-accent transition-colors duration-fast ease-standard hover:text-accent-hover"
            >
              Reset
            </button>
          )}
        </div>

        <AnimatePresence>
          {confirmOpen && (
            /* Catches a click anywhere outside the popover to dismiss it —
               this is a lightweight confirmation, not a modal, so it
               shouldn't need its own explicit dismissal to go away. */
            <div key="reset-backdrop" className="fixed inset-0 z-[5]" onClick={() => setConfirmOpen(false)} />
          )}
          {confirmOpen && (
            <ResetConfirmDialog
              key="reset-confirm"
              onConfirm={confirmReset}
              onCancel={() => setConfirmOpen(false)}
            />
          )}
        </AnimatePresence>
      </div>

      {/* No bottom padding: the auto-scroll aligns its sentinel to the
          scrollport's bottom edge (see MessageList), which would drag any
          padding here out of view exactly when the gap is meant to show. The
          16px below lives outside the scroller instead, so it holds at every
          scroll position. */}
      <div className="min-h-0 flex-1 overflow-y-auto scroll-slim px-3 pt-4">
        <MessageList messages={messages} afterFirst={activity} />
      </div>

      {/* 12px inset — matches the message list's px-3 and is what makes
          rounded-nested sit parallel to the sidebar's rounded-panel.
          `relative` so the fade below can hang off its top edge. */}
      <div className="relative shrink-0 px-3 pb-3 pt-4">
        {/* The mirror of the header's fade: content scrolling past the
            composer dissolves into the panel instead of being cut off at a
            hard line. Sits above this box, over the last 16px of the
            scroller, and lets clicks through to whatever is under it. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-full h-4 bg-gradient-to-t from-surface to-transparent"
        />
        <Composer
          compact
          value={value}
          onChange={setValue}
          onSubmit={handleSubmit}
          placeholder={DOCKED_PLACEHOLDER}
          submitLabel="Send"
        />
      </div>
    </motion.div>
  );
}
