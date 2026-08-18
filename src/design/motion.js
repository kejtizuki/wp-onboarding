/**
 * MOTION TOKENS — every transition pulls from here.
 */

/**
 * Slow-motion review: append `?slow=4` to stretch the entry→builder transition
 * without changing its proportions. 1–20.
 */
const slowFactor = (() => {
  if (typeof window === 'undefined') return 1;
  const value = Number(new URLSearchParams(window.location.search).get('slow'));
  return Number.isFinite(value) && value > 0 ? Math.min(value, 20) : 1;
})();

const t = (seconds) => +(seconds * slowFactor).toFixed(4);

/**
 * ENTRY → BUILDER, as hide-then-reveal.
 *
 * Nothing travels across the screen. The entry state dissolves where it stands,
 * the background settles on its own, then the builder arrives as one unit.
 * Three discrete stages, no shared elements between them.
 *
 *   1. EXIT    entry screen fades + scales down slightly, in place
 *   2. HOLD    nothing on screen; background crossfades gray → white
 *   3. REVEAL  builder fades and lifts in as a single unit
 *              └ its contents (chat, docked input) follow a beat later
 *
 * ~0.93s total.
 */
export const timeline = {
  exitDuration: t(0.22),
  holdDuration: t(0.13),
  revealDuration: t(0.58),
  /** Chat bubbles and the docked input, after the shell has settled. */
  contentDelay: t(0.13),
};

/** When the builder becomes visible, measured from submit. */
timeline.builderAt = +(timeline.exitDuration + timeline.holdDuration).toFixed(4);

const easeOut = [0.22, 1, 0.36, 1];
const easeIn = [0.4, 0, 1, 1];

/** The entry screen arriving on first load. */
export const entryEnter = { duration: t(0.32), ease: easeOut };

/** Stage 1 — the entry screen dissolving in place. */
export const entryExit = {
  duration: timeline.exitDuration,
  ease: easeIn,
};

/**
 * Stage 3 — the builder arriving. No delay: Shell already held for the
 * background settle before mounting this, so the hold is real time with nothing
 * on screen rather than an animation offset.
 */
export const builderEnter = {
  duration: timeline.revealDuration,
  ease: easeOut,
};

/** Contents inside the builder, a beat behind the shell. */
export const builderContentEnter = {
  duration: timeline.revealDuration * 0.7,
  delay: timeline.contentDelay,
  ease: easeOut,
};

/** The background crossfade, during the hold. */
export const backgroundSettle = {
  duration: timeline.holdDuration,
  delay: timeline.exitDuration,
  ease: easeOut,
};

/** Elements settling into place inside a panel. */
export const settle = { type: 'spring', stiffness: 320, damping: 34, mass: 0.8 };

/** Small, immediate feedback — hovers, presses. */
export const snap = { type: 'spring', stiffness: 520, damping: 32, mass: 0.5 };

/** Opacity-only crossfades; springs on opacity look mushy. */
export const fade = { duration: 0.28, ease: easeOut };
export const fadeFast = { duration: 0.16, ease: easeOut };

/** Content leaving should go quicker than it arrived. */
export const exit = { duration: 0.2, ease: easeIn };

/**
 * Section-by-section generation pacing.
 *
 * Sections are revealed by chaining — each mounts only once the previous one has
 * finished — so these are the two knobs that set how fast the site builds. They
 * are perception settings: the user has to be able to watch a section resolve
 * and catch the counter tick in the chat beside it.
 */
timeline.skeletonHold = t(0.45); // how long a section shimmers before its content lands
timeline.revealGap = t(0.15); // pause after a section finishes, before the next starts

/** Offsets within the preview panel's own contents. */
export const beat = {
  previewChrome: 0.12,
  previewBody: 0.26,
  stagger: 0.05,
};

export const messageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: settle },
  exit: { opacity: 0, y: -4, transition: exit },
};
