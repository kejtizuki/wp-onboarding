/**
 * FONT PAIRINGS — optional, offered after the colour palette is skipped (see
 * ColorPalettePicker). Same idea as palettes.js, same mechanism: an override
 * on top of whatever theme matched, touching only `--font-serif` — the one
 * display-font token every theme already knows how to repoint (artisanal →
 * Lastik Free, editorial → Space Grotesk, NotesLab → mono). Body copy never
 * changes; it's always the shared sans stack, on every theme already.
 *
 * Reuses faces already loaded for this project (fonts.css) rather than
 * pulling in new ones, the same way the alternate colour palettes reuse
 * tokens the app already has.
 */

const BODY_STACK = 'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
const RECOLETA_STACK = "'Recoleta', ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif";
const GROTESK_STACK = "'Space Grotesk', ui-sans-serif, system-ui, sans-serif";
const MONO_STACK = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

const LASTIK_STACK = "'Lastik Free', ui-serif, Georgia, serif";

/**
 * Only three faces are actually shipped with this project (see fonts.css) —
 * Recoleta, Lastik Free and Space Grotesk. The rest are system families that
 * every desktop has some form of, each with a fallback of the same flavour,
 * so a pairing always lands on something of the right shape even where the
 * first choice is missing.
 */
const GEORGIA_STACK = "Georgia, 'Times New Roman', serif";
const TIMES_STACK = "'Times New Roman', Times, serif";
const PALATINO_STACK = "Palatino, 'Palatino Linotype', 'Book Antiqua', Georgia, serif";
const BASKERVILLE_STACK = "Baskerville, 'Libre Baskerville', Georgia, serif";
const DIDOT_STACK = "Didot, 'Bodoni MT', 'Playfair Display', Georgia, serif";
const FUTURA_STACK = "Futura, 'Century Gothic', 'Avenir Next', system-ui, sans-serif";
const AVENIR_STACK = "'Avenir Next', Avenir, 'Segoe UI', system-ui, sans-serif";

/**
 * Eleven alternates, so with the theme's own face first the picker holds
 * twelve — three pages of four. Only `--font-serif` is ever overridden: it's
 * the display-font token every theme already knows how to repoint, and body
 * copy stays on the shared sans on every theme.
 */
export const FONT_PAIRINGS = [
  { id: 'classic', name: 'Classic Serif', heading: RECOLETA_STACK },
  { id: 'grotesk', name: 'Grotesk', heading: GROTESK_STACK },
  { id: 'mono', name: 'Mono', heading: MONO_STACK },
  { id: 'lastik', name: 'Lastik', heading: LASTIK_STACK },
  { id: 'georgia', name: 'Georgia', heading: GEORGIA_STACK },
  { id: 'times', name: 'Times', heading: TIMES_STACK },
  { id: 'palatino', name: 'Palatino', heading: PALATINO_STACK },
  { id: 'baskerville', name: 'Baskerville', heading: BASKERVILLE_STACK },
  { id: 'didot', name: 'Didot', heading: DIDOT_STACK },
  { id: 'futura', name: 'Futura', heading: FUTURA_STACK },
  { id: 'avenir', name: 'Avenir', heading: AVENIR_STACK },
].map((pairing) => ({
  ...pairing,
  body: BODY_STACK,
  tokens: { '--font-serif': pairing.heading },
}));

export const getFontPairing = (id) => FONT_PAIRINGS.find((pairing) => pairing.id === id) || null;

/**
 * The theme's own current heading face, read straight from its `tokens` (or
 * Recoleta, the shared default in tokens.css, for a theme that doesn't set
 * one) — the picker's first tile, same logic as `themeDefaultPalette`.
 */
export function themeDefaultFontPairing(theme) {
  const heading = theme?.tokens?.['--font-serif'] || RECOLETA_STACK;
  return {
    id: 'default',
    name: theme?.label || 'Default',
    heading,
    body: BODY_STACK,
    tokens: null,
  };
}
