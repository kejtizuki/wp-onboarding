/**
 * Two screens, not one morphing layout.
 *
 *   ENTRY   single column: question, input, path chips
 *   ACTIVE  the builder: preview panel + chat sidebar + docked input
 *
 * They share no elements. The transition between them is a hide-then-reveal
 * crossfade owned by Shell; timings live in design/motion.js (`timeline`).
 */
export const Phase = {
  ENTRY: 'entry',
  ACTIVE: 'active',
};

/**
 * STEPS — the single place to see where a user is inside a path.
 *
 *   Path 1 (prompt)   ENTRY -> GENERATING -> RESULT
 *   Path 2 (migrate)  ENTRY -> SCANNING ---> COMPARE -> RESULT
 *   Path 3 (explore)  ENTRY -> GENERATING -> RESULT
 *
 * Everything from GENERATING on renders inside the preview panel; the builder
 * around it is identical for all three.
 */
export const Step = {
  ENTRY: 'entry',
  GENERATING: 'generating',
  SCANNING: 'scanning',
  COMPARE: 'compare',
  RESULT: 'result',
};

/** What the preview panel body should render. */
export const PreviewStageState = {
  IDLE: 'idle',
  GENERATING: 'generating',
  COMPARE: 'compare',
  RESULT: 'result',
};

export const previewStateForStep = (step) => {
  switch (step) {
    case Step.GENERATING:
    case Step.SCANNING:
      return PreviewStageState.GENERATING;
    case Step.COMPARE:
      return PreviewStageState.COMPARE;
    case Step.RESULT:
      return PreviewStageState.RESULT;
    default:
      return PreviewStageState.IDLE;
  }
};
