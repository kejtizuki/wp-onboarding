import React from 'react';
import { motion } from 'framer-motion';
import cx from '../lib/cx';
import { useIsStageWidth } from '../lib/useMediaQuery';
import { builderEnter } from '../design/motion';
import AppBar from './AppBar';

/**
 * BUILDER STAGE — stage 3 of the transition.
 *
 * The app bar + preview panel + chat sidebar arrive as ONE unit: a single
 * fade and a small lift. No piece flies in from its own direction, and
 * nothing here is a continuation of anything on the entry screen.
 *
 * Its contents (chat bubbles, docked input) carry their own slightly later
 * entrance — see `builderContentEnter`. The skeleton build-in inside the panel
 * runs on its own stagger, unchanged.
 *
 * Slots in / no knowledge out: no awareness of prompts, scanning, or WordPress
 * beyond the chrome labels passed to the app bar.
 *
 * One container holds the app bar and the preview/chat row together — full
 * width, its own off-white fill (`#F9F9FA`) distinct from the panels sitting
 * on it, padded 16px on top and 24px on every other side. The panels
 * separate from that fill with a soft shadow, not a stroke — see
 * `--shadow-panel` in tokens.css.
 */
export default function BuilderStage({
  chat,
  preview,
  title,
  onLaunch,
  onHome,
  actionsEnabled = false,
  viewport,
  onViewportChange,
}) {
  const isStage = useIsStageWidth();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.16 } }}
      transition={builderEnter}
      className="flex min-h-0 flex-1 flex-col bg-[#F9F9FA] px-6 pb-6 pt-4"
    >
      <AppBar
        title={title}
        onLaunch={onLaunch}
        onHome={onHome}
        actionsEnabled={actionsEnabled}
        viewport={viewport}
        onViewportChange={onViewportChange}
      />

      <div
        className={cx(
          'mt-4 flex min-h-0 flex-1 gap-3 stage:gap-4',
          isStage ? 'flex-row' : 'flex-col'
        )}
      >
        <section
          aria-label="Site preview"
          className={cx('min-w-0', isStage ? 'h-full flex-1' : 'h-[46vh] w-full shrink-0')}
        >
          {preview}
        </section>

        <aside
          aria-label="Conversation"
          className={cx(
            'relative flex min-h-0 flex-col rounded-panel bg-surface shadow-panel',
            isStage ? 'h-full w-chat shrink-0' : 'w-full min-h-0 flex-1'
          )}
        >
          {chat}
        </aside>
      </div>
    </motion.div>
  );
}
