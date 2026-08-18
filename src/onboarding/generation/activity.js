/**
 * THE ACTIVITY LOG'S DATA MODEL
 *
 * Steps are derived, never hand-written. A new content template or theme
 * produces a coherent log with no copy changes here: labels come from the
 * theme's own name and from counters the preview panel reports as it renders.
 *
 * The first two steps are sequential and brief — they describe decisions taken
 * before anything can be drawn. The last two are render-tied: their counters
 * only move when a section actually appears on screen.
 */

export const Phase = {
  READING: 0,
  CHOOSING: 1,
  RENDERING: 2,
};

export const initialGeneration = {
  active: false,
  phase: Phase.READING,
  /** Set once the theme is matched — also the step-2 label. */
  themeLabel: null,
  /** Reported by the canvas once it knows how many sections it will draw. */
  total: 0,
  /** Sections mounted. */
  built: 0,
  /** Sections whose entrance has finished — i.e. their copy has landed. */
  written: 0,
  /**
   * `{ label, done }` in render order — appended the moment a section mounts,
   * flipped to done once its copy lands. This is the progress list itself:
   * it's what lets a row say which section is being written right now rather
   * than just how many have finished.
   */
  sections: [],
};

const DONE = 'done';
const ACTIVE = 'active';
const PENDING = 'pending';

/**
 * @returns {{id, label, state}[]} — callers render everything except PENDING,
 * which is what makes the list grow as work begins rather than showing a
 * checklist of things that haven't started.
 */
export function deriveSteps(generation) {
  const { phase, themeLabel } = generation;

  // Only the decisions taken before anything is drawn. Everything after this
  // is per-section, and the section list reports it directly — see the
  // progress list in ActivityLog, which replaced the two summary rows that
  // used to stand in for it.
  return [
    {
      id: 'read',
      label: 'Reading your description',
      state: phase > Phase.READING ? DONE : ACTIVE,
    },
    {
      id: 'layout',
      // The theme's own label — never a hardcoded theme name.
      label: themeLabel ? `Choosing a layout — ${themeLabel}` : 'Choosing a layout',
      state: phase > Phase.CHOOSING ? DONE : phase === Phase.CHOOSING ? ACTIVE : PENDING,
    },
  ];
}

export const isGenerationComplete = (generation) =>
  generation.total > 0 && generation.written >= generation.total;
