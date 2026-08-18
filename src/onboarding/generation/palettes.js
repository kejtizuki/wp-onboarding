/**
 * COLOR PALETTES — optional, user-picked, on top of whatever theme matched.
 *
 * A theme's own `tokens` (see themes/registry.js) set its default look. This
 * is a second, independent layer: alternate colour sets anyone can swap in
 * after the site is built, without changing the theme's structure. Picking
 * one overrides just these six tokens; everything else — radius, font, layout
 * — stays exactly what the theme chose.
 *
 * The alternates on offer depend on what was built. A ceramics studio and a
 * design agency want to look like different kinds of thing, so offering both
 * the same colourways makes the picker feel like a stock swatch book rather
 * than a suggestion. Each theme gets a family chosen for the kind of site it
 * is — see `palettesForTheme` at the bottom.
 *
 * Every alternate keeps a light surface. A palette only overrides six tokens;
 * `--color-line`, `--color-ink-muted` and `--color-ink-subtle` stay as they
 * are, and those are picked for light backgrounds — a dark surface here would
 * quietly break the contrast of every muted label on the page.
 */

/** `#RRGGBB` → `"R G B"`, the form Tailwind's `rgb(var(--x) / <alpha>)` needs. */
function toTriplet(hex) {
  const value = hex.replace('#', '');
  const n = parseInt(value, 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

/** Darken a hex by `amount` (0–1), for the accent's hover state. */
function darken(hex, amount = 0.18) {
  const value = hex.replace('#', '');
  const n = parseInt(value, 16);
  const shift = (channel) => Math.round(channel * (1 - amount));
  const r = shift((n >> 16) & 255);
  const g = shift((n >> 8) & 255);
  const b = shift(n & 255);
  return `${r} ${g} ${b}`;
}

/**
 * One palette from its four swatches, in the order the picker draws them:
 * surface, ink, accent, sunken. Declaring them once is the point — an earlier
 * version listed the hexes and the tokens separately and they had already
 * drifted apart on one palette, so the pill was showing colours the page
 * never used.
 */
function palette(id, name, [surface, ink, accent, sunken]) {
  return {
    id,
    name,
    swatches: [surface, ink, accent, sunken],
    tokens: {
      '--color-surface': toTriplet(surface),
      '--color-surface-sunken': toTriplet(sunken),
      '--color-ink': toTriplet(ink),
      '--color-accent': toTriplet(accent),
      '--color-accent-hover': darken(accent),
      '--color-accent-ink': '255 255 255',
    },
  };
}

/** Made by hand, sold in a shop: earthy, warm, quiet. */
const ARTISANAL_PALETTES = [
  palette('sage', 'Sage', ['#F7F8F4', '#1F2A1D', '#3F6B3D', '#DCE5D3']),
  palette('umber', 'Umber', ['#FAF3EA', '#3B2A1F', '#C1502E', '#EFE1D1']),
  palette('slate', 'Slate', ['#F5F6FA', '#15171F', '#3B4B8C', '#DEE2F0']),
  palette('clay', 'Clay', ['#FDF4EF', '#3E2B22', '#B4573A', '#F2DFD2']),
  palette('moss', 'Moss', ['#F4F7F2', '#1B2A1B', '#4A7C3F', '#DDE8D6']),
  palette('oat', 'Oat', ['#FBF8F2', '#332E26', '#8A7351', '#EDE5D6']),
  palette('rust', 'Rust', ['#FCF4F0', '#3A241C', '#A8442A', '#F1DDD3']),
  palette('olive', 'Olive', ['#F8F8F0', '#26281A', '#6B7233', '#E6E8D2']),
  palette('plum', 'Plum', ['#FAF5F7', '#2E1F29', '#7A3F5F', '#EEDDE6']),
  palette('sand', 'Sand', ['#FCF9F3', '#3A342A', '#A98B5C', '#F0E7D6']),
  palette('stone', 'Stone', ['#F7F7F6', '#2B2B29', '#6E6A62', '#E5E4E0']),
];

/**
 * A photography blog, where the pictures are the content. Named for the
 * processes rather than invented colour names — the set reads as darkroom
 * choices, and each one is a way photographs have actually been printed.
 */
const EDITORIAL_PALETTES = [
  palette('monochrome', 'Monochrome', ['#FFFFFF', '#111111', '#595959', '#EDEDED']),
  palette('sepia', 'Sepia', ['#FBF7F1', '#3A2F24', '#8C6A45', '#EFE5D6']),
  palette('cyanotype', 'Cyanotype', ['#F5F8FC', '#12263A', '#1C5D8C', '#DCE8F4']),
  palette('platinum', 'Platinum', ['#FAFAF8', '#26262A', '#7C7A72', '#E9E9E4']),
  palette('selenium', 'Selenium', ['#F7F6F9', '#221E2B', '#5A4E72', '#E4E1EC']),
  palette('albumen', 'Albumen', ['#FDFAF2', '#332C1E', '#9A7C3E', '#F1E9D6']),
  palette('kodachrome', 'Kodachrome', ['#FDF6F4', '#241715', '#C0392B', '#F4DED9']),
  palette('trix', 'Tri-X', ['#F6F6F6', '#0D0D0D', '#3D3D3D', '#E2E2E2']),
  palette('ferric', 'Ferric', ['#F9F6F4', '#2B211C', '#8E5A3C', '#EDE0D7']),
  palette('duotone', 'Duotone', ['#F5F7FA', '#101828', '#2E5AAC', '#DEE6F3']),
  palette('newsprint', 'Newsprint', ['#F8F7F3', '#1C1C1A', '#6B6558', '#E7E5DC']),
];

/**
 * A design agency, selling taste and confidence. Saturated, high-contrast,
 * closer to a brand than to a mood — the point is that the site looks like it
 * was art-directed rather than decorated.
 */
const MODERN_GRID_PALETTES = [
  palette('electric', 'Electric', ['#FFFFFF', '#0A0A0A', '#2B50F0', '#E8ECFE']),
  palette('punch', 'Punch', ['#FFFFFF', '#140C12', '#D6006E', '#FCE4F0']),
  palette('mint', 'Mint', ['#F6FBF9', '#0F2A24', '#0E9F6E', '#D8F0E6']),
  palette('signal', 'Signal', ['#FFFFFF', '#151210', '#E2481D', '#FCE6DE']),
  palette('ultraviolet', 'Ultraviolet', ['#FAF8FF', '#140E24', '#6733E8', '#E9E1FD']),
  palette('citrus', 'Citrus', ['#FFFCF5', '#1C1608', '#C97A06', '#FDEED2']),
  palette('cobalt', 'Cobalt', ['#F7FAFF', '#0B1220', '#0B5FD6', '#DEEAFB']),
  palette('coral', 'Coral', ['#FFF9F8', '#1E1210', '#E4573D', '#FCE3DE']),
  palette('lime', 'Lime', ['#FAFDF3', '#151A0C', '#5A9216', '#E7F3D4']),
  palette('ink', 'Ink', ['#FFFFFF', '#0B0B0B', '#2E2E2E', '#EAEAEA']),
  palette('teal', 'Teal', ['#F5FBFB', '#08201F', '#0E7C7B', '#D7EDEC']),
];

const PALETTE_SETS = {
  artisanal: ARTISANAL_PALETTES,
  editorial: EDITORIAL_PALETTES,
  'modern-grid': MODERN_GRID_PALETTES,
};

/**
 * The alternates to offer alongside the site's own colours. Eleven of them,
 * so with the theme's own first tile the picker holds twelve — three pages of
 * four. A theme with no set of its own falls back to the artisanal one rather
 * than showing nothing; every generated site can be recoloured.
 */
export function palettesForTheme(theme) {
  return PALETTE_SETS[theme?.id] || ARTISANAL_PALETTES;
}

// Lookup spans every set: a picked id has to keep resolving after the fact,
// and ids are unique across sets.
const ALL_PALETTES = [...ARTISANAL_PALETTES, ...EDITORIAL_PALETTES, ...MODERN_GRID_PALETTES];

export const getPalette = (id) => ALL_PALETTES.find((item) => item.id === id) || null;

/** `--color-x: "R G B"` → `#RRGGBB`, for rendering a swatch chip. */
function tripletToHex(triplet, fallback) {
  if (!triplet) return fallback;
  const [r, g, b] = triplet.split(' ').map(Number);
  return (
    '#' +
    [r, g, b]
      .map((n) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()
  );
}

/**
 * The theme's own four main colours, read straight from its `tokens` (or the
 * shared defaults in tokens.css, for a theme that doesn't set its own) — so
 * the picker's first tile is never a twelfth invented palette, just whichever
 * one the site already has. Picking it is the same as picking nothing:
 * `tokens: null` means "clear any override," see ResultCanvas.
 */
export function themeDefaultPalette(theme) {
  const tokens = theme?.tokens || {};
  return {
    id: 'default',
    name: theme?.label || 'Default',
    swatches: [
      tripletToHex(tokens['--color-surface'], '#FFFFFF'),
      tripletToHex(tokens['--color-ink'], '#1E1E1E'),
      tripletToHex(tokens['--color-accent'], '#3858E9'),
      tripletToHex(tokens['--color-surface-sunken'], '#F6F6F7'),
    ],
    tokens: null,
  };
}
