/**
 * COMPLETION SUMMARY
 *
 * Written from the draft, the theme, and the sections that actually rendered —
 * not from a template string with blanks. A new content template or theme
 * produces an accurate summary without touching this file.
 *
 * Exported in pieces rather than as one block of text, because the summary is
 * built up live: the opening lands when generation starts, each list item lands
 * with its section, and the closing line only once everything is done. A single
 * pre-rendered string couldn't stay in step with the preview.
 */

/**
 * What to call a section in the summary. Prefers the real headline the template
 * generated ("What we make"), and falls back to a plain description of the slot
 * for sections that have no heading of their own.
 */
export function sectionLabel(spec, draft, blockName) {
  // Editorial's image band reads the hero slot too (for its photo), but the
  // hero's own section already claimed "Cover" — falling through to
  // `blockName` below ("Image") is what keeps the two from reading as
  // duplicates in the log.
  if (spec.type === 'image-band') return blockName;

  // Slots whose `title` is not a section name are matched first: the hero's
  // title is the business name, which would read as "2. Ceramics Studio Porto"
  // in a list of sections.
  if (spec.slot === 'hero') return 'Cover';
  if (spec.slot === 'items') return 'Product grid';
  if (spec.slot === 'testimonial') return 'Customer quote';

  const content = spec.content ?? (spec.slot ? draft[spec.slot] : null);
  if (content && content.title) return content.title;
  // Sections with fixed content (see notesLab.js) often name themselves via
  // an `eyebrow` instead — "Latest notes", "Current projects" — which reads
  // far better in the log than two sections both called "List".
  if (content && content.eyebrow) return content.eyebrow;
  return blockName;
}

/**
 * One sentence on what was built, echoing the specifics we actually inferred
 * from what they typed.
 */
export function summaryOpening({ draft, themeLabel }) {
  if (!draft) return '';

  const subject = draft.type === 'Business' ? 'business' : draft.type.toLowerCase();
  const where = draft.place ? ` in ${draft.place}` : '';
  const layout = themeLabel ? `${themeLabel.toLowerCase()} ` : '';
  // Agrees with whatever word actually follows — "an artisanal", "an editorial",
  // "a modern grid", "a homepage".
  const article = /^[aeiou]/i.test(themeLabel || 'homepage') ? 'an' : 'a';

  // The one genuinely conditional clause: it's here because the goods grid is
  // a section the theme chose to include, so the summary should say why.
  const goods = draft.sellsGoods
    ? ', including a product grid since you sell as well as make'
    : '';

  return `Built ${article} ${layout}homepage for your ${subject}${where}${goods}.`;
}
