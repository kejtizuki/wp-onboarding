import React, { cloneElement, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Phase } from '../onboarding/session/phases';
import { backgroundSettle, timeline } from '../design/motion';

/** Stage 1 → 2 → 3. See design/motion.js `timeline`. */
const Stage = {
  ENTRY: 'entry',
  EXITING: 'exiting', // entry dissolving in place
  GAP: 'gap', // nothing on screen; background settling
  BUILDER: 'builder',
};

/**
 * SHELL — owns the viewport, the entry→builder transition, and the overlay layer.
 *
 * The transition is hide-then-reveal: the entry screen dissolves where it
 * stands, the background settles with nothing on screen, then the builder
 * arrives as one unit. The two screens never coexist and share no elements.
 *
 * The stage machine is driven by explicit timers rather than AnimatePresence's
 * `mode="wait"`. That isn't a style preference — a path's flow dispatches
 * several state updates the instant it mounts, and every one of those
 * re-renders interrupted the exit animation, so `onExitComplete` never fired
 * and the builder never mounted at all. Timers can't get stuck, and they make
 * the three durations legible in one place.
 *
 * `ready` is the one thing that can extend the sequence: when intent is being
 * classified, the builder waits at the end of stage 2 — background settled,
 * nothing on screen — rather than revealing content for the wrong path. Typical
 * classification beats the animation, so this hold is usually zero.
 */
export default function Shell({ phase, ready = true, entry, builder, overlay }) {
  const [stage, setStage] = useState(Stage.ENTRY);
  const gapAt = useRef(0);

  useEffect(() => {
    if (phase === Phase.ENTRY) {
      setStage(Stage.ENTRY);
      return undefined;
    }

    setStage(Stage.EXITING);
    const toGap = setTimeout(() => {
      gapAt.current = Date.now();
      setStage(Stage.GAP);
    }, timeline.exitDuration * 1000);

    return () => clearTimeout(toGap);
  }, [phase]);

  // Stage 2 → 3. Runs the hold out, then waits for `ready` if it isn't yet.
  useEffect(() => {
    if (stage !== Stage.GAP || !ready) return undefined;
    const elapsed = Date.now() - gapAt.current;
    const remaining = Math.max(0, timeline.holdDuration * 1000 - elapsed);
    const toBuilder = setTimeout(() => setStage(Stage.BUILDER), remaining);
    return () => clearTimeout(toBuilder);
  }, [stage, ready]);

  const showEntry = stage === Stage.ENTRY || stage === Stage.EXITING;
  const inBuilder = phase !== Phase.ENTRY;

  return (
    <div
      className="relative h-full w-full overflow-hidden bg-canvas"
      style={{ backgroundImage: 'var(--gradient-canvas)' }}
    >
      {/* Stage 2. A wash rather than an animated background-color, because the
          palette lives in CSS variables and `var()` can't be interpolated. */}
      <motion.div
        aria-hidden
        initial={false}
        animate={{ opacity: inBuilder ? 1 : 0 }}
        transition={backgroundSettle}
        className="pointer-events-none absolute inset-0 bg-surface"
      />

      <div className="relative flex h-full w-full flex-col">
        {showEntry && cloneElement(entry, { exiting: stage === Stage.EXITING })}
        {stage === Stage.BUILDER && builder}
      </div>

      <AnimatePresence>{overlay}</AnimatePresence>
    </div>
  );
}
