import promptPath from './PromptPath';
import migratePath from './MigratePath';

/**
 * PATH REGISTRY — the switch.
 *
 * A path owns its entry step, its generation copy, its flow timing, and its
 * chrome labels. The shell owns layout, the reflow, and the preview panel.
 * Adding a path is a descriptor plus one line here.
 *
 * Order is the order the chips appear at the door.
 */
export const PATHS = [
  promptPath,
  migratePath,
  // explorePath — Path 3, not built yet
];

/** Typing and hitting enter without picking a chip falls back here. */
export const DEFAULT_PATH_ID = promptPath.id;

export const getPathById = (id) => PATHS.find((path) => path.id === id) || promptPath;

/**
 * The classifier speaks in intents; the registry speaks in path ids. This is
 * the seam between them — an intent whose path isn't built yet lands on the
 * default rather than breaking the flow.
 */
const INTENT_TO_PATH_ID = {
  draft: 'prompt',
  migrate: 'migrate',
  explore: 'explore', // not registered yet — resolves to DEFAULT_PATH_ID below
};

export function pathIdForIntent(intent) {
  const pathId = INTENT_TO_PATH_ID[intent];
  const built = PATHS.some((path) => path.id === pathId);

  if (!built) {
    console.info(
      `[registry] intent "${intent}" has no path yet — routing to "${DEFAULT_PATH_ID}"`
    );
    return DEFAULT_PATH_ID;
  }

  return pathId;
}
