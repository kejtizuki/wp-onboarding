/**
 * MODERN GRID — cards throughout, no alternating rhythm.
 *
 * Every section is the same shape: a bordered card, or a grid of them. Nothing
 * is given more weight than anything else, which suits businesses with a lot of
 * comparable things to show and no single hero item.
 *
 * The hero is a card too — that's the deliberate difference from artisanal,
 * where the hero is the one section allowed to break the pattern. Cover and
 * Pullquote both run full-width (`wide: true` — see ResultCanvas), the one
 * place two of this theme's cards get to be a different size.
 *
 * `tokens` repoints the display font to the sans stack instead of Recoleta —
 * a crisp, product-y voice next to the other themes' literary serif — and
 * swaps the accent for a bold primary red, on an otherwise near-neutral
 * black-on-white palette.
 */
const modernGrid = {
  id: 'modern-grid',
  label: 'Modern grid',
  blurb: 'Everything on cards, evenly weighted, nothing buried.',
  built: true,

  tokens: {
    '--color-ink': '17 17 17',
    '--color-ink-muted': '102 102 102',
    '--color-ink-subtle': '150 150 150',
    '--color-accent': '224 32 32', // primary red
    '--color-accent-hover': '184 20 20',
    '--color-accent-ink': '255 255 255',
    '--color-accent-soft': '253 224 224',
    '--font-serif': 'var(--font-sans)',
  },

  sections: [
    { type: 'site-header', variant: 'split' },
    { type: 'banner-hero', slot: 'hero', wide: true },
    // Value props as numbered cards, two up.
    { type: 'card-grid', slot: 'offering', source: 'bullets', columns: 2 },
    // Products in a single row of four — same card, image instead of a number.
    { type: 'card-grid', slot: 'items', columns: 4, when: (draft) => draft.sellsGoods },
    { type: 'quote-band', slot: 'testimonial', wide: true },
    { type: 'site-footer' },
  ],
};

export default modernGrid;
