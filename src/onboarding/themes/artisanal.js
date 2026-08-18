/**
 * ARTISANAL — structure modelled on WordPress.com's Marl.
 *
 * A theme is an ordered list of sections. Each section names a renderer
 * (`type`) and the content slot it reads (`slot`). It never names a business,
 * a headline, or a product — that all lives in the draft. Swap the draft and
 * this theme renders someone else's site; swap the theme and the same draft
 * lays out differently. That decoupling is the whole point.
 *
 * Rhythm: a split hero, then two alternating media+text bands, then a
 * full-bleed quote to break the alternation, then goods if there are any.
 *
 * `tokens` gives it a warm, handmade palette of its own — clay and cream
 * rather than the shared blueberry/gray — plus fully rounded, slightly
 * larger CTAs (+8px padding each direction), a softer touch than the sharp
 * `radius-control` corners every other theme's buttons use. It also repoints
 * `--font-serif` to Lastik Free, a hand-drawn display face (see fonts.css),
 * in place of Recoleta. See registry.js for how `tokens` is applied and
 * notesLab.js for where the idea started.
 */
const artisanal = {
  id: 'artisanal',
  label: 'Artisanal',
  /** Shown in the generation ticker and, later, in a theme picker. */
  blurb: 'Photography-led, with an unhurried alternating rhythm.',
  /** Only built themes can render — see themes/registry.js */
  built: true,

  tokens: {
    '--color-surface': '248 248 247', // #F8F8F7
    '--color-surface-sunken': '241 233 222',
    '--color-line': '224 212 196',
    '--color-line-strong': '199 182 157',
    '--color-ink': '58 41 30', // warm dark brown
    '--color-ink-muted': '120 100 82',
    '--color-ink-subtle': '163 145 122',
    '--color-ink-inverse': '250 246 240',
    '--color-accent': '178 90 46', // terracotta
    '--color-accent-hover': '150 74 36',
    '--color-accent-ink': '255 255 255',
    '--color-accent-soft': '241 220 205',
    '--radius-control': '9999px', // fully rounded CTAs
    '--cta-padding-x': '1.5rem', // 1rem default + 8px
    '--cta-padding-y': '1rem', // 0.5rem default + 8px
    '--font-serif': "'Lastik Free', ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif",
  },

  sections: [
    { type: 'site-header', variant: 'minimal' },

    // Headline + CTA on ~40%, photography filling the rest.
    { type: 'split-hero', slot: 'hero', mediaWidth: 'wide' },

    // What you offer: image left, copy + value props right.
    { type: 'media-text', slot: 'offering', media: 'left', list: 'bullets' },

    // The story: reversed, image right, single outlined CTA.
    { type: 'media-text', slot: 'story', media: 'right', cta: 'outlined' },

    // Full-bleed band — breaks the alternation before the grid.
    { type: 'quote-band', slot: 'testimonial' },

    // Only for businesses that actually sell something.
    { type: 'item-grid', slot: 'items', columns: 4, when: (draft) => draft.sellsGoods },

    { type: 'site-footer' },
  ],
};

export default artisanal;
