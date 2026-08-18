import React from 'react';
import cx from '../../../lib/cx';

/**
 * What a section looks like while it is being generated.
 *
 * Shapes are keyed to the section type so the placeholder occupies roughly the
 * silhouette of what is about to replace it — the page doesn't lurch when the
 * real content lands, and you can tell a hero is coming from a grid.
 */

const Bar = ({ className, style, rounded = true }) => (
  <div className={cx('shimmer', rounded && 'rounded-nested', className)} style={style} />
);

function HeroSkeleton({ compact }) {
  return (
    <div className={cx('grid items-center gap-8', compact ? 'grid-cols-1' : 'grid-cols-5')}>
      <div className={cx('flex flex-col gap-3', compact ? '' : 'col-span-2')}>
        <Bar className="h-2.5 w-24" />
        <Bar className="h-9 w-full" />
        <Bar className="h-9 w-3/4" />
        <Bar className="mt-2 h-3 w-full" />
        <Bar className="h-9 w-36 rounded-control" />
      </div>
      <div className={compact ? '' : 'col-span-3'}>
        <Bar className="w-full" style={{ aspectRatio: '5/4' }} />
      </div>
    </div>
  );
}

/* ── Editorial shapes ────────────────────────────────────────────────────── */

/** Wordmark alone in the narrow column, nav clustered-then-pushed-right in
    the wide one — mirrors `GridHeader` exactly. */
function GridHeaderSkeleton({ compact }) {
  return (
    <div className={cx('grid items-center', compact ? 'grid-cols-1 gap-3' : 'grid-cols-12 gap-8')}>
      <Bar className={cx('h-5 w-32', !compact && 'col-span-3')} />
      {!compact && (
        <div className="col-span-9 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Bar className="h-3 w-14" />
            <Bar className="h-3 w-12" />
            <Bar className="h-3 w-16" />
          </div>
          <Bar className="h-3 w-20" />
        </div>
      )}
    </div>
  );
}

/** Eyebrow alone in the narrow column, the highlighted statement (three
    lines, roughly) in the wide one — mirrors `GridHero`. No image here
    anymore; that moved to its own full-width band, see `ImageBandSkeleton`. */
function GridHeroSkeleton({ compact }) {
  return (
    <div className={cx('grid', compact ? 'grid-cols-1 gap-4' : 'grid-cols-12 gap-8')}>
      <div className={compact ? '' : 'col-span-3'}>
        <Bar className="h-2.5 w-24" />
      </div>
      <div className={cx('flex flex-col gap-3', compact ? '' : 'col-span-9')}>
        <Bar className="h-9 w-full" />
        <Bar className="h-9 w-full" />
        <Bar className="h-9 w-2/3" />
        <div className="mt-3 flex gap-4">
          <Bar className="h-3 w-24" />
          <Bar className="h-3 w-32" />
        </div>
      </div>
    </div>
  );
}

/** The wide image plus its two bottom-corner captions — the shape a real
    photo needs to land into without a jump, see PromptPath.jsx's photography
    and ceramics chips. */
function ImageBandSkeleton({ compact }) {
  return (
    <div>
      <Bar className="w-full" style={{ aspectRatio: compact ? '4/3' : '21/9' }} />
      <div className="mt-3 flex items-center justify-between">
        <Bar className="h-2.5 w-20" />
        <Bar className="h-2.5 w-24" />
      </div>
    </div>
  );
}

/** Label in the narrow column, running text in the wide one — mirrors the
    editorial-only `ProseBlock`. Distinct from `MediaTextSkeleton`, which is
    artisanal's media-plus-copy shape and has an image bar this doesn't. */
function GridProseSkeleton({ compact }) {
  return (
    <div className={cx('grid', compact ? 'grid-cols-1 gap-4' : 'grid-cols-12 gap-8')}>
      <div className={compact ? '' : 'col-span-3'}>
        <Bar className="h-6 w-2/3" />
      </div>
      <div className={cx('flex flex-col gap-3', compact ? '' : 'col-span-9')}>
        <Bar className="h-3 w-full" />
        <Bar className="h-3 w-5/6" />
        <Bar className="h-3 w-4/5" />
      </div>
    </div>
  );
}

/**
 * The same 12-column span/ratio pattern as the real `PhotoGrid`, so the
 * skeleton occupies exactly the tiles the photos are about to land in rather
 * than a generic shape. Kept in sync by hand — see PhotoGrid's own copy for
 * why these can't be generated from one shared array of Tailwind classes.
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

function PhotoGridSkeleton() {
  return (
    <div className="grid grid-cols-12 gap-6">
      {TILE_PATTERN.map(({ span, ratio }, index) => (
        <Bar
          key={index}
          className="w-full"
          rounded={false}
          style={{ gridColumn: `span ${span} / span ${span}`, aspectRatio: ratio }}
        />
      ))}
    </div>
  );
}

function GridSkeleton({ compact }) {
  const columns = compact ? 2 : 4;
  return (
    <div
      className="grid gap-5"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: columns }).map((_, index) => (
        <div key={index} className="flex flex-col gap-2">
          <Bar className="aspect-square w-full" />
          <Bar className="mt-1 h-3 w-3/4" />
          <Bar className="h-2.5 w-1/2" />
        </div>
      ))}
    </div>
  );
}

function MediaTextSkeleton({ compact }) {
  return (
    <div className={cx('grid items-center gap-8', compact ? 'grid-cols-1' : 'grid-cols-2')}>
      <Bar className="aspect-square w-full" />
      <div className="flex flex-col gap-3">
        <Bar className="h-6 w-2/3" />
        <Bar className="h-3 w-full" />
        <Bar className="h-3 w-5/6" />
        <Bar className="mt-3 h-3 w-full" />
        <Bar className="h-3 w-4/5" />
      </div>
    </div>
  );
}

function BandSkeleton() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-nested px-12 py-16">
      <Bar className="h-5 w-3/4" />
      <Bar className="h-5 w-2/3" />
      <Bar className="mt-3 h-2.5 w-32" />
    </div>
  );
}

function LineSkeleton() {
  return (
    <div className="flex items-center justify-between gap-6">
      <Bar className="h-3 w-40" />
      <Bar className="h-3 w-56" />
    </div>
  );
}

/* ── NotesLab shapes ─────────────────────────────────────────────────────── */

function NavSkeleton() {
  return (
    <div className="flex items-center justify-between gap-4 rounded-pill border border-line px-4 py-2.5">
      <Bar className="h-4 w-4 rounded-pill" />
      <div className="flex flex-1 gap-5">
        <Bar className="h-3 w-14" />
        <Bar className="h-3 w-12" />
        <Bar className="h-3 w-20" />
      </div>
      <Bar className="h-8 w-24 rounded-pill" />
    </div>
  );
}

/** Headline + stats stacked, then the wide cover band — the shape that was
    missing before, which is what let the real image pop in with nothing to
    anticipate it. */
function LabHeroSkeleton({ compact }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Bar className="h-9 w-1/2" />
        <Bar className="h-9 w-full" />
        <Bar className="h-9 w-4/5" />
      </div>
      <div className={cx('flex gap-8', compact ? 'flex-col' : 'flex-row items-end justify-between')}>
        <Bar className="h-3 w-64" />
        <div className="flex shrink-0 gap-8">
          <Bar className="h-9 w-16" />
          <Bar className="h-9 w-16" />
        </div>
      </div>
      <Bar className="w-full" style={{ aspectRatio: compact ? '16/9' : '21/9' }} />
    </div>
  );
}

function StatementSkeleton({ compact }) {
  return (
    <div className={cx('flex gap-8', compact ? 'flex-col' : 'flex-row')}>
      <div className={cx('flex flex-col gap-3', compact ? '' : 'w-3/5 shrink-0')}>
        <Bar className="h-7 w-full" />
        <Bar className="h-7 w-5/6" />
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <Bar className="h-3 w-full" />
        <Bar className="h-3 w-4/5" />
      </div>
    </div>
  );
}

/** One row per entry, whatever `entry-list` variant is about to land — the
    difference between a note's teaser and a project's tag isn't worth telling
    apart at the skeleton stage. */
function EntryListSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between border-b border-line pb-3">
        <Bar className="h-2.5 w-28" />
        <Bar className="h-2.5 w-20" />
      </div>
      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className="flex items-start gap-4 border-b border-line pb-5">
          <Bar className="h-3 w-16 shrink-0" />
          <div className="flex flex-1 flex-col gap-2">
            <Bar className="h-4 w-2/3" />
            <Bar className="h-3 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

function TeamGridSkeleton({ compact }) {
  const columns = compact ? 1 : 2;
  return (
    <div className="flex flex-col gap-8">
      <Bar className="h-7 w-48" />
      <div
        className="grid gap-8"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: columns * 2 }).map((_, index) => (
          <div key={index} className="flex flex-col gap-3">
            <Bar className="w-full" style={{ aspectRatio: '4/3' }} />
            <Bar className="h-3 w-2/3" />
            <Bar className="h-2.5 w-1/3" />
          </div>
        ))}
      </div>
    </div>
  );
}

function NewsletterSkeleton({ compact }) {
  return (
    <div className={cx('grid gap-8', compact ? 'grid-cols-1' : 'grid-cols-2')}>
      <div className="flex flex-col gap-3">
        <Bar className="h-2.5 w-20" />
        <Bar className="h-8 w-full" />
        <Bar className="h-8 w-4/5" />
        <Bar className="mt-2 h-3 w-full" />
      </div>
      <div className="flex flex-col gap-3">
        <Bar className="h-10 w-full rounded-control" />
        <Bar className="h-10 w-full rounded-control" />
        <Bar className="mt-2 h-10 w-full rounded-control" />
      </div>
    </div>
  );
}

const BY_TYPE = {
  'split-hero': HeroSkeleton,
  'grid-header': GridHeaderSkeleton,
  'grid-hero': GridHeroSkeleton,
  'image-band': ImageBandSkeleton,
  'photo-grid': PhotoGridSkeleton,
  'banner-hero': HeroSkeleton,
  'media-text': MediaTextSkeleton,
  'prose-block': GridProseSkeleton,
  'item-grid': GridSkeleton,
  'card-grid': GridSkeleton,
  'quote-band': BandSkeleton,
  'site-header': LineSkeleton,
  'site-footer': LineSkeleton,
  'lab-nav': NavSkeleton,
  'lab-hero': LabHeroSkeleton,
  'statement-split': StatementSkeleton,
  'entry-list': EntryListSkeleton,
  'team-grid': TeamGridSkeleton,
  'newsletter-footer': NewsletterSkeleton,
};

export default function SectionSkeleton({ type, compact }) {
  const Shape = BY_TYPE[type] || LineSkeleton;
  return <Shape compact={compact} />;
}
