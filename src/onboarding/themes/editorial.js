/**
 * EDITORIAL — a strict asymmetric grid, modelled on a Swiss-style layout
 * reference: a narrow column (mostly whitespace) beside a wide one, repeated
 * down the page, with full-width breaks for the imagery. Nothing here is
 * shared with another theme — `grid-header`, `grid-hero` and `prose-block`
 * are all editorial-exclusive, which is what let this become a genuinely
 * different silhouette rather than a reskin of the other three.
 *
 * The rhythm: header (wordmark narrow, nav wide), hero (eyebrow narrow, the
 * one big statement wide), a full-bleed image with corner captions, two more
 * narrow-label/wide-copy rows, the gallery (when the prompt named one), a
 * pullquote, then the footer. The whole theme runs full-width (`wide: true`
 * at the theme level, same flag NotesLab set per-section) — the text still
 * keeps to its own `col-span` within that width, so it's the row that
 * bleeds, not the reading measure.
 *
 * `tokens` pushes the palette toward high-contrast newsprint — near-black
 * ink on warm paper, one oxblood accent — rather than the shared blueberry —
 * squares off every corner (`--radius-nested`, `--radius-control` both 0),
 * the newsprint edge carried all the way through — and repoints
 * `--font-serif` to Space Grotesk (see fonts.css), a grotesk in a theme
 * whose whole voice is otherwise built from Recoleta everywhere else.
 */
const editorial = {
  id: 'editorial',
  label: 'Editorial',
  blurb: 'One column, big type, words doing the work.',
  built: true,
  // Every section runs full-width — see ResultCanvas's `theme?.wide` check.
  wide: true,

  tokens: {
    '--color-surface': '255 255 255', // white
    '--color-surface-sunken': '240 238 232',
    '--color-line': '223 220 210',
    '--color-line-strong': '197 193 178',
    '--color-ink': '20 20 20', // near-black, for newsprint contrast
    '--color-ink-muted': '90 88 84',
    '--color-ink-subtle': '140 137 130',
    '--color-ink-inverse': '255 255 255',
    '--color-accent': '140 30 30', // oxblood
    '--color-accent-hover': '115 22 22',
    '--color-accent-ink': '255 255 255',
    '--color-accent-soft': '243 224 224',
    '--radius-nested': '0px', // square hero image, gallery, pullquote
    '--radius-control': '0px', // square CTA button
    '--font-serif': "'Space Grotesk', ui-sans-serif, system-ui, sans-serif",
  },

  sections: [
    { type: 'grid-header' },
    { type: 'grid-hero', slot: 'hero' },
    { type: 'image-band', slot: 'hero' },
    { type: 'prose-block', slot: 'offering', list: 'bullets' },
    // Only when the draft actually has one.
    { type: 'photo-grid', slot: 'gallery', when: (draft) => draft.gallery?.length > 0 },
    { type: 'prose-block', slot: 'story', cta: 'inline' },
    { type: 'quote-band', slot: 'testimonial' },
    { type: 'site-footer' },
  ],
};

export default editorial;
