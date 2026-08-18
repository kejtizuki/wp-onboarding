import React from 'react';
import cx from '../../../lib/cx';
import { Figure, Cta, OutlinedCta, SectionHeading } from './primitives';
import { Search, WordPressMark } from '../../../ui/Icons';

/**
 * SECTION RENDERERS
 *
 * Every renderer takes the same three things — the section spec from the theme,
 * the content slot from the draft, and whether it's rendering narrow — and
 * knows nothing about which theme invoked it or what business it's describing.
 *
 * Adding a theme means composing these in a new order, or writing a new
 * renderer and registering it at the bottom of this file.
 */

/* ── Site header ─────────────────────────────────────────────────────────── */

function SiteHeader({ draft, compact }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-caption font-semibold uppercase tracking-[0.16em] text-ink">
        {draft.siteName}
      </span>
      {!compact && (
        <nav className="flex gap-5">
          {draft.nav.map((item) => (
            <span key={item} className="text-micro text-ink-muted">
              {item}
            </span>
          ))}
        </nav>
      )}
    </div>
  );
}

/* ── Grid header (editorial) ─────────────────────────────────────────────── */

/**
 * The wordmark sits alone in the narrow column; the nav lives in the wide
 * one, clustered left with the last item pushed out to the far right edge —
 * not an even `justify-between` spread, which would space every item alike
 * and lose the one asymmetric gap that makes it read as designed.
 */
function GridHeader({ draft, compact }) {
  const [lastItem, ...rest] = [...draft.nav].reverse();
  const leadingItems = rest.reverse();

  return (
    <div className={cx('grid', compact ? 'grid-cols-1 gap-3' : 'grid-cols-12 gap-8')}>
      <div className={compact ? '' : 'col-span-3'}>
        <span className="font-serif text-lg-18 text-ink">{draft.siteName}</span>
      </div>
      {!compact && (
        <nav className="col-span-9 flex items-center justify-between">
          <div className="flex items-center gap-6">
            {leadingItems.map((item) => (
              <span key={item} className="text-micro uppercase tracking-[0.1em] text-ink-muted">
                {item}
              </span>
            ))}
          </div>
          <span className="text-micro uppercase tracking-[0.1em] text-ink-muted">{lastItem}</span>
        </nav>
      )}
    </div>
  );
}

/* ── Split hero ──────────────────────────────────────────────────────────── */

/** Copy on ~40%, photography filling the rest. Artisanal's signature move. */
function SplitHero({ content, compact }) {
  return (
    <div className={cx('grid items-center gap-8', compact ? 'grid-cols-1' : 'grid-cols-5')}>
      <div className={compact ? '' : 'col-span-2'}>
        <p className="mb-3 text-micro uppercase tracking-[0.16em] text-ink-subtle">
          {content.eyebrow}
        </p>
        <h1
          className={cx(
            'font-serif tracking-tight text-ink',
            compact ? 'text-xl-serif' : 'text-xl-serif-big'
          )}
        >
          {content.title}
        </h1>
        <p className="mt-4 text-body text-ink-muted">{content.body}</p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Cta>{content.cta}</Cta>
          <span className="text-caption text-ink-muted">{content.secondaryCta}</span>
        </div>
      </div>

      <div className={compact ? '' : 'col-span-3'}>
        {/* `content.image` is only ever set for a prompt that named its own
            photo for this slot (see draft.js's `images` option) — everything
            else gets artisanal's plain placeholder. */}
        <Figure ratio={compact ? '4/3' : '5/4'} image={content.image} />
      </div>
    </div>
  );
}

/* ── Lab nav (NotesLab) ──────────────────────────────────────────────────── */

/**
 * A search glyph, plain nav text, and one filled button — not a shared pill,
 * which is what makes it read as a real product nav rather than a decoration.
 */
function LabNav({ content, compact }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-pill border border-line px-4 py-2.5">
      <Search width={15} height={15} className="text-ink-subtle" />
      {!compact && (
        <nav className="flex items-center gap-5">
          {content.items.map((item) => (
            <span key={item} className="text-caption text-ink-muted">
              {item}
            </span>
          ))}
        </nav>
      )}
      <span className="rounded-pill bg-ink px-3.5 py-1.5 text-caption font-medium text-ink-inverse">
        {content.cta}
      </span>
    </div>
  );
}

/* ── Lab hero (NotesLab) ─────────────────────────────────────────────────── */

/**
 * The brand mark doubling as the headline, a one-line mission statement with
 * an inline link, two stat readouts instead of a CTA pair, and the reference's
 * actual distorted cover image (via `content.bandImage` — `Figure` falls back
 * to its gradient sweep if that's ever unset). The headline uses `font-serif`
 * like every other hero, but NotesLab repoints that token to its own mono
 * stack (see notesLab.js) — what gives it a spec-sheet voice the other themes
 * don't have.
 */
function LabHero({ content, compact }) {
  return (
    <div>
      <h1
        className={cx(
          'max-w-prose font-serif uppercase leading-[1.05] tracking-tight text-ink',
          compact ? 'text-xl-serif' : 'text-xl-serif-big'
        )}
      >
        <span className="block">{content.brand}</span>
        {content.headline}
      </h1>

      <div
        className={cx(
          'mt-6 flex gap-8',
          compact ? 'flex-col' : 'flex-row items-end justify-between'
        )}
      >
        <p className="max-w-prose text-body text-ink-muted">
          {content.body}{' '}
          <span className="text-ink underline underline-offset-4">{content.linkLabel}</span>.
        </p>

        <div className="flex shrink-0 gap-8">
          {content.stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-micro uppercase tracking-[0.1em] text-ink-subtle">
                {stat.label}
              </p>
              <p className="mt-1 font-serif text-xl-serif text-ink">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      <Figure
        ratio={compact ? '16/9' : '21/9'}
        image={content.bandImage}
        gradient
        className="mt-10"
      />
    </div>
  );
}

/* ── Statement split (NotesLab) ──────────────────────────────────────────── */

/** A big claim on the left, a short supporting note on the right — no image. */
function StatementSplit({ content, compact }) {
  return (
    <div className={cx('flex gap-8', compact ? 'flex-col' : 'flex-row')}>
      <div className={compact ? '' : 'w-3/5 shrink-0'}>
        <p className="mb-3 text-micro uppercase tracking-[0.16em] text-ink-subtle">
          {content.eyebrow}
        </p>
        <p
          className={cx(
            'font-serif tracking-tight text-ink',
            compact ? 'text-xl-serif' : 'text-xl-serif-big'
          )}
        >
          {content.statement}
        </p>
      </div>
      <p className="text-caption text-ink-muted">{content.description}</p>
    </div>
  );
}

/* ── Entry list (NotesLab) ───────────────────────────────────────────────── */

/**
 * "Latest notes" and "Current projects" are the same shape — a dated list
 * with a link to see the rest — so one renderer draws both. `variant`
 * decides the secondary line: a teaser + byline for notes, a tag pill for
 * projects.
 */
function EntryList({ content, spec, compact }) {
  const rows = spec.variant === 'projects' ? content.projects : content.posts;

  return (
    <div>
      <div className="flex items-baseline justify-between border-b border-line pb-3">
        <p className="text-micro uppercase tracking-[0.16em] text-ink-subtle">
          {content.eyebrow}
        </p>
        {!compact && (
          <span className="text-caption text-ink-muted">{content.archiveLabel} →</span>
        )}
      </div>

      <ul className="flex flex-col">
        {rows.map((row) =>
          spec.variant === 'projects' ? (
            // One row: date, title, tag — all on the same line.
            <li
              key={row.title}
              className={cx(
                'flex items-center gap-4 border-b border-line py-4',
                compact && 'flex-wrap'
              )}
            >
              <p className="w-24 shrink-0 text-micro text-ink-subtle">{row.date}</p>
              <p className="flex-1 text-body font-medium text-ink">{row.title}</p>
              <span className="shrink-0 rounded-control border border-line px-2 py-0.5 text-micro text-ink-muted">
                {row.tag}
              </span>
            </li>
          ) : (
            // Date beside a taller content block — title, teaser, byline.
            <li
              key={row.title}
              className={cx(
                'grid gap-2 border-b border-line py-5',
                compact ? 'grid-cols-1' : 'grid-cols-[7rem_1fr] items-start'
              )}
            >
              <p className="text-micro text-ink-subtle">{row.date}</p>
              <div>
                <p className="text-body font-medium text-ink">{row.title}</p>
                <p className="mt-2 text-caption text-ink-muted">{row.teaser}</p>
                <p className="mt-3 text-micro uppercase tracking-[0.1em] text-ink-subtle">
                  {row.author} · {row.readTime}
                </p>
              </div>
            </li>
          )
        )}
      </ul>
    </div>
  );
}

/* ── Team grid (NotesLab) ─────────────────────────────────────────────────── */

/**
 * Flat-tinted squares stand in for the reference's portraits — same logic as
 * `Figure`, just one hue per person instead of the theme's shared gradient,
 * since the point here is telling four people apart at a glance.
 */
function TeamGrid({ content, compact }) {
  return (
    <div>
      <SectionHeading compact={compact}>{content.heading}</SectionHeading>

      <div className={cx('mt-8 grid gap-8', compact ? 'grid-cols-1' : 'grid-cols-2')}>
        {content.members.map((member, index) => (
          <div key={member.name}>
            <div
              aria-hidden
              className="w-full rounded-nested"
              style={{
                aspectRatio: '4 / 3',
                background: `rgb(${content.tints[index % content.tints.length]})`,
              }}
            />
            <p className="mt-3 text-body font-medium text-ink">{member.name}</p>
            <p className="text-micro text-ink-subtle">{member.role}</p>
            <p className="mt-1 text-micro text-ink-muted">{member.tags}</p>
          </div>
        ))}
      </div>

      <div
        className={cx(
          'mt-10 grid gap-8 border-t border-line pt-8',
          compact ? 'grid-cols-1' : 'grid-cols-2'
        )}
      >
        <div>
          <p className="text-micro uppercase tracking-[0.16em] text-ink-subtle">
            {content.collaborate.eyebrow}
          </p>
          <p className="mt-2 text-caption text-ink-muted">{content.collaborate.body}</p>
        </div>
        <div>
          <p className="text-micro uppercase tracking-[0.16em] text-ink-subtle">
            {content.acknowledgements.eyebrow}
          </p>
          <p className="mt-2 text-caption text-ink-muted">{content.acknowledgements.body}</p>
        </div>
      </div>
    </div>
  );
}

/* ── Newsletter + footer (NotesLab) ──────────────────────────────────────── */

/** A visual-only signup form — nothing here submits anywhere. */
function NewsletterFooter({ content, compact }) {
  return (
    <div>
      <div className={cx('grid gap-8', compact ? 'grid-cols-1' : 'grid-cols-2')}>
        <div>
          <p className="mb-3 text-micro uppercase tracking-[0.16em] text-ink-subtle">
            {content.eyebrow}
          </p>
          <p
            className={cx(
              'font-serif uppercase leading-[1.05] tracking-tight text-ink',
              compact ? 'text-xl-serif' : 'text-xl-serif-big'
            )}
          >
            {content.headline}
          </p>
          <p className="mt-4 max-w-prose text-body text-ink-muted">{content.body}</p>
        </div>

        <div>
          <label className="block">
            <span className="text-caption font-medium text-ink">Name</span>
            <div className="mt-1.5 rounded-control border border-line bg-surface px-3 py-2 text-body text-ink-subtle">
              Your name
            </div>
          </label>
          <label className="mt-3 block">
            <span className="text-caption font-medium text-ink">Email</span>
            <div className="mt-1.5 rounded-control border border-line bg-surface px-3 py-2 text-body text-ink-subtle">
              you@example.com
            </div>
          </label>
          <p className="mt-3 text-micro text-ink-subtle">{content.disclaimer}</p>
          <span className="mt-4 inline-flex w-full items-center justify-center rounded-control bg-ink px-4 py-2.5 text-caption font-medium text-ink-inverse">
            {content.submitLabel}
          </span>
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between border-t border-line pt-5">
        <nav className="flex gap-4">
          {content.socialLinks.map((link) => (
            <span key={link} className="text-micro text-ink-subtle">
              {link}
            </span>
          ))}
        </nav>
        <span className="flex items-center gap-1.5 text-micro text-ink-subtle">
          {content.credit} <WordPressMark width={13} height={13} />
        </span>
      </div>
    </div>
  );
}

/* ── Media + text ────────────────────────────────────────────────────────── */

/** Image one side, copy the other. `media` flips it; alternating gives rhythm. */
function MediaText({ content, spec, compact }) {
  const mediaRight = spec.media === 'right';

  const copy = (
    <div>
      <SectionHeading compact={compact}>{content.title}</SectionHeading>
      <p className="mt-3 text-body text-ink-muted">{content.body}</p>

      {spec.list && content[spec.list] && (
        <ul className="mt-5 flex flex-col gap-2.5">
          {content[spec.list].map((item) => (
            <li key={item} className="flex gap-3 text-caption text-ink">
              <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-pill bg-ink" />
              {item}
            </li>
          ))}
        </ul>
      )}

      {content.cta && (
        <div className="mt-6">
          {spec.cta === 'outlined' ? (
            <OutlinedCta>{content.cta}</OutlinedCta>
          ) : (
            <Cta>{content.cta}</Cta>
          )}
        </div>
      )}
    </div>
  );

  // `content.image` is only ever set for a prompt that named its own photo
  // for this slot (see draft.js's `images` option) — the offering slot never
  // sets one, so it always gets the plain placeholder.
  const media = <Figure ratio="1/1" image={content.image} />;

  return (
    <div className={cx('grid items-center gap-8', compact ? 'grid-cols-1' : 'grid-cols-2')}>
      {/* On narrow widths the image always leads — alternation only reads as
          rhythm when the two columns sit side by side. */}
      {compact || !mediaRight ? (
        <>
          {media}
          {copy}
        </>
      ) : (
        <>
          {copy}
          {media}
        </>
      )}
    </div>
  );
}

/* ── Quote band ──────────────────────────────────────────────────────────── */

/** Full-bleed, centered. Breaks the alternating rhythm before the grid. */
function QuoteBand({ content, compact }) {
  return (
    <div
      className={cx(
        'rounded-nested bg-surface-sunken text-center',
        compact ? 'px-6 py-10' : 'px-12 py-16'
      )}
    >
      <blockquote
        className={cx(
          'mx-auto max-w-prose font-serif tracking-tight text-ink',
          compact ? 'text-lg-20' : 'text-lg-28'
        )}
      >
        “{content.quote}”
      </blockquote>
      <p className="mt-5 text-micro uppercase tracking-[0.16em] text-ink-subtle">
        {content.attribution}
      </p>
    </div>
  );
}

/* ── Item grid ───────────────────────────────────────────────────────────── */

function ItemGrid({ content, spec, compact }) {
  const columns = compact ? 2 : spec.columns || 4;
  return (
    <div
      className="grid gap-5"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {content.map((item) => (
        <div key={item.name}>
          <Figure ratio="1/1" image={item.image} />
          <p className="mt-3 text-caption font-medium text-ink">{item.name}</p>
          <p className="mt-0.5 text-micro text-ink-subtle">{item.meta}</p>
        </div>
      ))}
    </div>
  );
}

/* ── Grid hero (editorial) ───────────────────────────────────────────────── */

/**
 * The eyebrow sits alone in the narrow column — mostly whitespace, the way
 * the reference grid leaves that cell almost empty — while the wide column
 * carries the one big typographic moment: the actual description sentence
 * (`content.body`, not the brand name — the name already ran in the header).
 */
function GridHero({ content, compact }) {
  return (
    <div className={cx('grid', compact ? 'grid-cols-1 gap-4' : 'grid-cols-12 gap-8')}>
      <div className={compact ? '' : 'col-span-3'}>
        <p className="text-micro uppercase tracking-[0.16em] text-ink-subtle">
          {content.eyebrow}
        </p>
      </div>
      <div className={compact ? '' : 'col-span-9'}>
        <p
          className={cx(
            'font-serif tracking-tight text-ink',
            compact ? 'text-xl-serif' : 'text-xl-serif-big'
          )}
        >
          {content.body}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <span className="text-caption text-ink underline underline-offset-4">
            {content.cta}
          </span>
          <span className="text-caption text-ink-muted">{content.secondaryCta}</span>
        </div>
      </div>
    </div>
  );
}

/* ── Image band (editorial) ──────────────────────────────────────────────── */

/**
 * The theme's whole imagery budget, full-width, with small caption labels at
 * each bottom corner rather than a caption line underneath — the reference's
 * treatment of its own placeholder block. `content.image` is only ever set
 * for a prompt that named its own photo (see draft.js's `images` option);
 * everything else gets the plain placeholder.
 */
function ImageBand({ content, draft, compact }) {
  return (
    <div>
      <Figure ratio={compact ? '4/3' : '21/9'} image={content.image} />
      <div className="mt-3 flex items-center justify-between text-micro uppercase tracking-[0.1em] text-ink-subtle">
        <span>{draft.siteName}</span>
        <span>{content.eyebrow}</span>
      </div>
    </div>
  );
}

/* ── Photo grid (editorial) ──────────────────────────────────────────────── */

/**
 * A 12-column grid, not a masonry flow — deliberately art-directed rather
 * than left to fall wherever a column has room. `TILE_PATTERN` repeats every
 * seven images: each entry is a column span (never below 3) paired with an
 * aspect ratio suited to that width, so wide tiles read as landscape and
 * narrow ones as portrait rather than all sharing one box shape. Every row
 * in the pattern sums to exactly 12, so the grid never leaves a gap.
 *
 * Spans are applied via inline `gridColumn`, not a `col-span-N` class —
 * Tailwind's build only keeps classes it can see literally in source, and
 * `col-span-${n}` built from a runtime index would silently vanish from the
 * production CSS.
 */
const TILE_PATTERN = [
  { span: 8, ratio: '3/2' },
  { span: 4, ratio: '3/4' },
  { span: 3, ratio: '2/3' },
  { span: 4, ratio: '3/4' },
  { span: 5, ratio: '1/1' },
  { span: 6, ratio: '4/3' },
  { span: 6, ratio: '4/3' },
];

/**
 * Full-width, generously gapped wall of photos. Only ever appears when the
 * draft actually has a `gallery` (see draft.js's `images.gallery` option) —
 * no theme composes this into its section list unconditionally.
 */
function PhotoGrid({ content }) {
  return (
    <div className="grid grid-cols-12 gap-6">
      {content.map((src, index) => {
        const { span, ratio } = TILE_PATTERN[index % TILE_PATTERN.length];
        return (
          <img
            key={index}
            src={src}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="w-full object-cover"
            style={{ gridColumn: `span ${span} / span ${span}`, aspectRatio: ratio }}
          />
        );
      })}
    </div>
  );
}

/* ── Prose block (editorial) ─────────────────────────────────────────────── */

/**
 * The same asymmetric grid as `GridHero` and `GridHeader` — a short label in
 * the narrow column, the running text in the wide one. No image slot at all;
 * editorial's whole imagery budget lives in `ImageBand` instead.
 */
function ProseBlock({ content, spec, compact }) {
  return (
    <div className={cx('grid', compact ? 'grid-cols-1 gap-4' : 'grid-cols-12 gap-8')}>
      <div className={compact ? '' : 'col-span-3'}>
        <SectionHeading compact={compact}>{content.title}</SectionHeading>
      </div>

      <div className={compact ? '' : 'col-span-9'}>
        <p className="text-lead text-ink-muted">{content.body}</p>

        {spec.list && content[spec.list] && (
          <ul className="mt-7 flex flex-col">
            {content[spec.list].map((item) => (
              <li
                key={item}
                className="border-t border-line py-3 text-body text-ink last:border-b"
              >
                {item}
              </li>
            ))}
          </ul>
        )}

        {content.cta && spec.cta === 'inline' && (
          <p className="mt-6">
            <span className="text-body text-ink underline underline-offset-4">
              {content.cta}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}

/* ── Banner hero (modern grid) ───────────────────────────────────────────── */

/**
 * The hero as a single contained card, so the page opens in the same visual
 * language it continues in. Not a split — the copy sits above its image rather
 * than beside it, which keeps every card in the theme the same shape.
 */
function BannerHero({ content, compact }) {
  return (
    <div className={cx('rounded-nested border border-line', compact ? 'p-5' : 'p-8')}>
      <p className="mb-3 text-micro uppercase tracking-[0.16em] text-ink-subtle">
        {content.eyebrow}
      </p>
      <h1
        className={cx(
          'font-serif tracking-tight text-ink',
          compact ? 'text-xl-serif' : 'text-xl-serif-big'
        )}
      >
        {content.title}
      </h1>
      <p className="mt-4 max-w-prose text-body text-ink-muted">{content.body}</p>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Cta>{content.cta}</Cta>
        <span className="text-caption text-ink-muted">{content.secondaryCta}</span>
      </div>
      <Figure ratio={compact ? '3/2' : '21/9'} image={content.image} className="mt-8" />
    </div>
  );
}

/* ── Card grid (modern grid) ─────────────────────────────────────────────── */

/**
 * The theme's workhorse. Takes either a list of strings (`source` names a field
 * on the slot, e.g. the offering's bullets) or a list of `{name, meta}` items,
 * and renders both as the same card — which is what lets modern-grid use one
 * renderer for value props and products alike.
 */
function CardGrid({ content, spec, compact }) {
  const raw = spec.source ? content[spec.source] : content;
  const cards = (raw || []).map((entry) =>
    typeof entry === 'string' ? { name: entry } : entry
  );
  const columns = compact ? 1 : spec.columns || 2;

  return (
    <div>
      {spec.source && content.title && (
        <SectionHeading compact={compact}>{content.title}</SectionHeading>
      )}

      <div
        className={cx('grid gap-4', spec.source && content.title && 'mt-6')}
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {cards.map((card, index) => (
          <div key={card.name} className="rounded-nested border border-line p-5">
            {card.meta === undefined ? (
              <span className="text-micro text-ink-subtle">
                {String(index + 1).padStart(2, '0')}
              </span>
            ) : (
              <Figure ratio="4/3" image={card.image} className="mb-4" />
            )}
            <p className="mt-2 text-body font-medium text-ink">{card.name}</p>
            {card.meta && <p className="mt-1 text-micro text-ink-subtle">{card.meta}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Site footer ─────────────────────────────────────────────────────────── */

function SiteFooter({ draft }) {
  return (
    <div className="border-t border-line pt-5">
      <p className="text-micro text-ink-subtle">{draft.footer}</p>
    </div>
  );
}

/**
 * type → { Component, blockName }
 *
 * `blockName` is what the Gutenberg-style hover label shows, so the preview
 * reads as editable WordPress rather than a screenshot.
 */
export const SECTION_RENDERERS = {
  'site-header': { Component: SiteHeader, blockName: 'Site header' },
  'grid-header': { Component: GridHeader, blockName: 'Site header' },
  'lab-nav': { Component: LabNav, blockName: 'Site header' },
  'split-hero': { Component: SplitHero, blockName: 'Cover' },
  'lab-hero': { Component: LabHero, blockName: 'Cover' },
  'grid-hero': { Component: GridHero, blockName: 'Cover' },
  'image-band': { Component: ImageBand, blockName: 'Image' },
  'media-text': { Component: MediaText, blockName: 'Media & text' },
  'quote-band': { Component: QuoteBand, blockName: 'Pullquote' },
  'item-grid': { Component: ItemGrid, blockName: 'Grid' },
  'photo-grid': { Component: PhotoGrid, blockName: 'Gallery' },
  'prose-block': { Component: ProseBlock, blockName: 'Group' },
  'banner-hero': { Component: BannerHero, blockName: 'Cover' },
  'card-grid': { Component: CardGrid, blockName: 'Columns' },
  'site-footer': { Component: SiteFooter, blockName: 'Site footer' },
  'statement-split': { Component: StatementSplit, blockName: 'Group' },
  'entry-list': { Component: EntryList, blockName: 'List' },
  'team-grid': { Component: TeamGrid, blockName: 'Team' },
  'newsletter-footer': { Component: NewsletterFooter, blockName: 'Newsletter' },
};

export default SECTION_RENDERERS;
