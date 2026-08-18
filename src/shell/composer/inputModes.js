/**
 * COMPOSER INPUT MODES
 *
 * The entry composer is not "a textarea". It is a surface that accepts one or
 * more kinds of low-friction input, all of which feed the same intake string
 * that gets classified in `paths/intent.js`.
 *
 * Only FREEFORM is turned on. The others are registered but disabled — adding
 * one means writing its accessory component and flipping `enabled`, not
 * restructuring the composer.
 */
export const InputMode = {
  /** Type a sentence. Built. */
  FREEFORM: 'freeform',
  /** Paste an existing site URL. Reserved. */
  URL: 'url',
  /** Tap a quick-start chip ("Restaurant", "Portfolio", "Store"). Reserved. */
  QUICK_START: 'quick-start',
};

export const INPUT_MODES = {
  [InputMode.FREEFORM]: {
    id: InputMode.FREEFORM,
    enabled: true,
    /** Rendered inside the composer body. `null` = the plain textarea. */
    Accessory: null,
  },
  [InputMode.URL]: {
    id: InputMode.URL,
    enabled: false,
    Accessory: null, // <UrlPasteField />
  },
  [InputMode.QUICK_START]: {
    id: InputMode.QUICK_START,
    enabled: false,
    Accessory: null, // <QuickStartChips onPick={...} />
  },
};

export const enabledModes = (modes = Object.keys(INPUT_MODES)) =>
  modes.map((id) => INPUT_MODES[id]).filter((mode) => mode && mode.enabled);
