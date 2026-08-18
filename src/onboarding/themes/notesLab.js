import {
  LAB_NAV,
  LAB_HERO,
  MISSION,
  LATEST_NOTES,
  CURRENT_PROJECTS,
  TEAM,
  NEWSLETTER,
} from './notesLabContent';

/**
 * NOTES LAB — the one theme built to reproduce a specific real site, not to
 * lay out an arbitrary business description.
 *
 * Every other theme in this registry draws the draft — whatever business
 * someone typed in, run through `deriveBrand`/`buildDraft`. This one mostly
 * doesn't: its sections carry their own fixed `content` (see
 * notesLabContent.js) instead of reading a slot off the draft, because the
 * point of clicking the NotesLab tile isn't "generate something inspired by
 * this" the way the other showcase tiles work — it's "show me this, for
 * real." ResultCanvas's `spec.content` fallback and the renderers below
 * (`lab-nav`, `statement-split`, `entry-list`, `team-grid`,
 * `newsletter-footer`) exist only because this theme needed them.
 *
 * Reachable one way only: clicking the NotesLab tile in the entry showcase
 * forces this theme (see showcaseThemes.js's `themeId` and EntryScreen's
 * forced-theme plumbing) rather than it being matched by `matchTheme` —
 * nothing typed by hand routes here.
 *
 * It also carries its own `tokens` — a palette and a type override, lifted
 * from the showcase tile's own colours (see registry.js for how every
 * theme's `tokens` is applied).
 */
const notesLab = {
  id: 'notes-lab',
  label: 'Notes Lab',
  blurb: 'A faithful rebuild of the real NotesLab site, stats and all.',
  built: true,
  // Reference runs edge-to-edge rather than sitting in the shared centered
  // column — see ResultCanvas's `theme?.wide` check.
  wide: true,

  tokens: {
    '--color-surface': '242 240 234', // cream, from the NotesLab screenshot
    '--color-surface-sunken': '231 227 213',
    '--color-line': '221 213 194',
    '--color-line-strong': '198 188 164',
    '--color-ink': '42 26 46', // deep plum
    '--color-ink-muted': '96 79 62',
    '--color-ink-subtle': '138 122 92',
    '--color-ink-inverse': '250 248 242',
    '--color-accent': '107 90 42', // bronze
    '--color-accent-hover': '89 74 34',
    '--color-accent-ink': '255 255 255',
    '--color-accent-soft': '234 227 202',
    // Repoints the shared serif-display token to the mono stack — every
    // heading in the theme picks this up with no per-renderer change, which
    // is what gives NotesLab its spec-sheet voice instead of Recoleta's.
    '--font-serif': 'var(--font-mono)',
  },

  sections: [
    { type: 'lab-nav', content: LAB_NAV },
    { type: 'lab-hero', content: LAB_HERO },
    { type: 'statement-split', content: MISSION },
    { type: 'entry-list', content: LATEST_NOTES, variant: 'notes' },
    { type: 'entry-list', content: CURRENT_PROJECTS, variant: 'projects' },
    { type: 'team-grid', content: TEAM },
    { type: 'newsletter-footer', content: NEWSLETTER },
  ],
};

export default notesLab;
