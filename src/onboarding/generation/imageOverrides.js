/**
 * UPLOADED IMAGES, DROPPED INTO THE TEMPLATE'S OWN SLOTS.
 *
 * Someone attaching photos to the chat means "use these instead" — so rather
 * than inventing a new section to hold them, they fill the picture slots the
 * template already has, in the order those slots appear down the page. Four
 * photos onto a theme with a hero and a three-up gallery fills the hero and
 * all three; three photos onto a seven-up gallery fills the first three and
 * leaves the rest as they were.
 *
 * Which slots exist is declared by the renderer that draws them — see
 * `images` in sections/index.jsx — not inferred from the shape of the data.
 * That distinction is the whole point: editorial's prose blocks are handed
 * content carrying an `image` they never render, so a photo matched by shape
 * alone would be consumed into a section that shows nothing, and the slots
 * further down the page would never see it. A slot only counts if something
 * draws it.
 *
 * Path syntax, resolved against a section's content:
 *
 *   'image'              content.image — one picture
 *   '[]'                 content is itself the list of pictures (a gallery)
 *   '[].image'           content is a list; each entry's `image`
 *   'members[].image'    content.members is a list; each entry's `image`
 *
 * Every slot counts whether or not it currently holds anything — an empty one
 * renders as a placeholder block, and replacing a placeholder is exactly as
 * much "use this photo" as replacing a stock shot is.
 */

/** Fill a list of pictures, running dry mid-list rather than all-or-nothing. */
function fillList(list, queue) {
  if (!Array.isArray(list) || !queue.length) return list;
  return list.map((entry) => (queue.length ? queue.shift() : entry));
}

/** Fill one declared path. Returns the original identity when nothing changed. */
function fillPath(content, path, queue) {
  if (!queue.length || content === null || typeof content !== 'object') return content;

  // The content is the list of pictures itself — a gallery.
  if (path === '[]') return fillList(content, queue);

  // '[].key' — the content is a list of objects, each holding one picture.
  if (path.startsWith('[].')) {
    if (!Array.isArray(content)) return content;
    const key = path.slice(3);
    let changed = false;
    const out = content.map((entry) => {
      if (!queue.length || entry === null || typeof entry !== 'object') return entry;
      changed = true;
      return { ...entry, [key]: queue.shift() };
    });
    return changed ? out : content;
  }

  // 'list[].key' — a named list of objects hanging off the content.
  const nested = path.indexOf('[].');
  if (nested > 0) {
    const listKey = path.slice(0, nested);
    const next = fillPath(content[listKey], `[].${path.slice(nested + 3)}`, queue);
    return next === content[listKey] ? content : { ...content, [listKey]: next };
  }

  // A plain key holding one picture.
  return { ...content, [path]: queue.shift() };
}

/** Fill every declared slot on one section's content, in the order declared. */
export function applyUploads(content, paths, queue) {
  if (!paths?.length || !queue.length) return content;
  return paths.reduce((current, path) => fillPath(current, path, queue), content);
}

/**
 * Resolve every section's content in one pass, so the queue drains down the
 * page in render order.
 *
 * `resolve` is how a spec finds its own content and `imagesFor` is which slots
 * its renderer draws — both passed in because only the canvas knows about
 * drafts and only the section registry knows about renderers.
 *
 * Sections that draw nothing are handed straight back and never recorded:
 * editorial points both its hero and its image band at `hero`, and the hero
 * draws no picture, so caching its no-op under that content would stop the
 * band from ever filling. Where two sections genuinely draw the same slot the
 * same way, the fill is shared rather than the first quietly eating a photo
 * the second was going to show.
 */
export function contentWithUploads(specs, resolve, imagesFor, uploads) {
  const queue = uploads ? [...uploads] : [];
  const filled = new Map();

  return specs.map((spec) => {
    const raw = resolve(spec);
    const paths = imagesFor(spec);
    if (!paths?.length) return raw;

    const signature = paths.join('|');
    const seen = filled.get(raw);
    if (seen && seen.signature === signature) return seen.value;

    const value = applyUploads(raw, paths, queue);
    filled.set(raw, { signature, value });
    return value;
  });
}
