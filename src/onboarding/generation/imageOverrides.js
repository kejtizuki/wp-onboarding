/**
 * UPLOADED IMAGES, DROPPED INTO THE TEMPLATE'S OWN SLOTS.
 *
 * Someone attaching photos to the chat means "use these instead" — so rather
 * than inventing a new section to hold them, they fill the picture slots the
 * template already has, in the order those slots appear down the page. Four
 * photos onto a theme with a hero, an offering and a story fills those three
 * and stops; three photos onto a seven-up gallery fills the first three and
 * leaves the rest as they were.
 *
 * Slots are found by key, not by position: `image` and `bandImage` are single
 * pictures, `gallery` is a list of them. Every one of those is a slot whether
 * or not it currently holds anything — an empty slot renders as a placeholder
 * block, and replacing a placeholder is exactly as much "use this photo" as
 * replacing a stock shot is.
 */

const IMAGE_KEYS = new Set(['image', 'bandImage']);
const IMAGE_LIST_KEYS = new Set(['gallery']);

/**
 * Fill this content's picture slots from `queue`, consuming it as it goes.
 *
 * `queue` is shared across every section on the page and mutated by shifting,
 * which is what makes "in the order they appear down the page" work — see
 * ResultCanvas, which walks the sections in render order with one queue.
 *
 * Returns the original object identity when nothing was replaced, so sections
 * with no picture slots don't re-render for someone else's upload.
 */
export function applyUploads(node, queue) {
  if (!queue.length || node === null || typeof node !== 'object') return node;

  if (Array.isArray(node)) {
    let changed = false;
    const out = node.map((item) => {
      const next = applyUploads(item, queue);
      if (next !== item) changed = true;
      return next;
    });
    return changed ? out : node;
  }

  let changed = false;
  const out = {};

  for (const [key, value] of Object.entries(node)) {
    let next;

    if (IMAGE_KEYS.has(key) && queue.length) {
      next = queue.shift();
    } else if (IMAGE_LIST_KEYS.has(key) && Array.isArray(value)) {
      // Runs dry mid-list rather than all-or-nothing: the slots that got a
      // photo take it, the rest keep whatever they had.
      next = value.map((src) => (queue.length ? queue.shift() : src));
    } else {
      next = applyUploads(value, queue);
    }

    if (next !== value) changed = true;
    out[key] = next;
  }

  return changed ? out : node;
}

/**
 * Resolve every section's content in one pass, so the queue drains down the
 * page in render order. `resolve` is how a spec finds its own slot — kept out
 * here because only the canvas knows about drafts.
 *
 * Two rules keep the queue landing where it can actually be seen:
 *
 * A section with neither a slot nor its own content falls back to the whole
 * draft — the headers and footers, which read it for the site's name. Those
 * are skipped: every one of them sits at the top of its theme, and the draft
 * they'd be handed contains every picture slot on the page, so filling there
 * would drain the queue into an object that renders no pictures at all and
 * leave the real slots below untouched. Slots belong to sections that own one.
 *
 * And two sections can share a slot — editorial points both its hero and its
 * image band at `hero`. That's one set of pictures, so it's filled once and
 * the result shared, rather than the first section quietly eating a photo the
 * second one was going to show.
 */
export function contentWithUploads(specs, resolve, uploads) {
  const queue = uploads ? [...uploads] : [];
  const filled = new Map();

  return specs.map((spec) => {
    const raw = resolve(spec);
    if (!spec.content && !spec.slot) return raw;
    if (filled.has(raw)) return filled.get(raw);

    const next = applyUploads(raw, queue);
    filled.set(raw, next);
    return next;
  });
}
