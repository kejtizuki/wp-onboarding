import artisanal from './artisanal';
import editorial from './editorial';
import modernGrid from './modernGrid';
import notesLab from './notesLab';

/**
 * THEME REGISTRY
 *
 * A theme is layout structure first — section order and composition, built
 * from the same shared renderers every other theme uses. Spacing, radii,
 * motion and the base scale always come from tokens.css, the same for all
 * four.
 *
 * Colour and display type are the one axis a theme is allowed to own: any
 * theme may set a `tokens` object of CSS custom-property overrides (a
 * palette, sometimes a `--font-serif` repoint), which ResultCanvas applies
 * scoped to its own wrapper — see notesLab.js, the first to do this, for the
 * full reasoning.
 */
export const THEMES = [artisanal, editorial, modernGrid, notesLab];

export const DEFAULT_THEME_ID = artisanal.id;

export const getTheme = (id) => THEMES.find((theme) => theme.id === id) || artisanal;

/**
 * What the canvas should actually render.
 *
 * A theme can be matched before it can be drawn — its section renderers may not
 * exist yet. Rather than render a half-empty page, fall back to the default and
 * say so. Same shape as the path registry's unbuilt-intent fallback.
 */
export function getRenderableTheme(id) {
  const theme = getTheme(id);
  if (theme.built) return theme;

  console.info(
    `[themes] "${theme.id}" is declared but not built yet — rendering "${DEFAULT_THEME_ID}"`
  );
  return getTheme(DEFAULT_THEME_ID);
}
