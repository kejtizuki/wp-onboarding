import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import cx from '../../../lib/cx';
import { settle, timeline } from '../../../design/motion';
import { getRenderableTheme } from '../../../onboarding/themes/registry';
import { getPalette } from '../../../onboarding/generation/palettes';
import { getFontPairing } from '../../../onboarding/generation/fontPairings';
import { sectionLabel } from '../../../onboarding/generation/summary';
import { contentWithUploads } from '../../../onboarding/generation/imageOverrides';
import { SECTION_RENDERERS } from '../sections';
import SectionSkeleton from '../sections/SectionSkeleton';

/**
 * RESULT CANVAS — the mock WordPress site.
 *
 * It renders no layout of its own. It walks the matched theme's section list,
 * hands each spec its content slot, and lets the registered renderer draw it.
 *
 * It is also the source of truth for generation progress. Each section reports
 * twice — once when it mounts ("built") and once when its entrance finishes
 * ("written") — which is what lets the activity log in the chat tick over at
 * the exact moment a section appears here. No timers are involved: if a section
 * is slow, the counter is slow.
 */

/**
 * One section, with its own two-beat life: it lands as a shimmering placeholder
 * (this is the section being worked on), then its real content replaces it.
 * `onWritten` fires on the content's entrance, not the skeleton's — the chat
 * counter should track finished work, not started work.
 */
function Block({ name, type, compact, children, autoScroll, onBuilt, onWritten, instant = false }) {
  // A template picked whole skips the two-beat life: there is no build to
  // watch, so the content is simply already there.
  const [ready, setReady] = useState(instant);
  const ref = useRef(null);

  useEffect(() => {
    onBuilt();
    if (instant) {
      onWritten();
      return undefined;
    }

    // Follow the build: bring the section that's being generated to the top of
    // the panel, with a little headroom.
    //
    // Explicit positioning rather than scrollIntoView({block:'nearest'}) —
    // 'nearest' declines to scroll while a section is even partially visible,
    // which would leave the one currently generating clipped at the bottom edge.
    // The point is to show exactly what's being worked on.
    if (autoScroll && ref.current) {
      const scroller = ref.current.closest('[data-canvas-scroll]');
      if (scroller) {
        const offset =
          ref.current.getBoundingClientRect().top -
          scroller.getBoundingClientRect().top +
          scroller.scrollTop;
        scroller.scrollTo({ top: Math.max(0, offset - 72), behavior: 'smooth' });
      }
    }

    const toContent = setTimeout(() => setReady(true), timeline.skeletonHold * 1000);
    // Safety net: if the entrance animation never resolves — reduced motion, a
    // backgrounded tab, a dropped frame — the section still reports, so the
    // chain can't stall halfway and the summary always arrives.
    const fallback = setTimeout(onWritten, (timeline.skeletonHold + 1.5) * 1000);

    return () => {
      clearTimeout(toContent);
      clearTimeout(fallback);
    };
    // eslint-disable-next-line
  }, []);

  return (
    <section
      ref={ref}
      className={cx(
        'group relative cursor-default outline-offset-[-1px]',
        ready && 'hover:outline hover:outline-1 hover:outline-line-strong'
      )}
    >
      <span className="pointer-events-none absolute left-0 top-0 z-10 -translate-y-full rounded-t-[3px] bg-ink px-1.5 py-0.5 text-micro text-ink-inverse opacity-0 transition-opacity duration-fast group-hover:opacity-100">
        {name}
      </span>

      {/* A hard swap, deliberately not AnimatePresence: `mode="wait"` would gate
          mounting the content on the skeleton's exit animation completing, and
          a stalled exit leaves the section shimmering forever. The content's own
          fade covers the cut. */}
      {ready ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={settle}
          onAnimationComplete={onWritten}
        >
          {children}
        </motion.div>
      ) : (
        <div aria-hidden>
          <SectionSkeleton type={type} compact={compact} />
        </div>
      )}
    </section>
  );
}

/**
 * Head and foot pinned, body rotated — each turn shifts the body down one and
 * brings its last section round to the top. Under four sections there's no
 * body worth rotating.
 */
function rotateBody(sections, turns) {
  if (!turns || sections.length < 4) return sections;
  let out = sections;
  for (let turn = 0; turn < turns; turn += 1) {
    const middle = out.slice(1, -1);
    out = [out[0], middle[middle.length - 1], ...middle.slice(0, -1), out[out.length - 1]];
  }
  return out;
}

export default function ResultCanvas({
  draft,
  compact = false,
  /** A user pick from the completion picker — see palettes.js. `null` keeps
      the theme's own default colours. */
  paletteId = null,
  /** Same idea, for the heading face — see fontPairings.js. `null` keeps the
      theme's own default. */
  fontPairingId = null,
  /**
   * A template picked whole from the showcase, rather than generated from a
   * description: every section is drawn at once, with no skeletons and no
   * chained reveal. See PromptPath's instant branch.
   */
  instant = false,
  /**
   * How many times the body has been rotated — see the REORDER_SECTIONS
   * reducer. Turned into an order here because this is the only place that
   * knows which sections actually survived the theme's own filtering.
   */
  sectionRotation = 0,
  /** Bumped on every reorder; each bump replays the skeletons once. */
  reorderNonce = 0,
  /**
   * Photos attached in the chat, filling the template's own picture slots in
   * page order — see imageOverrides.js.
   */
  uploads = null,
  /** Omit all three and the canvas renders silently — see BeforeAfter. */
  onSectionsResolved,
  onSectionBuilt,
  onSectionWritten,
}) {
  // Each section reports at most once, whatever React does with mounts —
  // StrictMode double-invokes effects, and the animation callback can fire
  // again on re-entry.
  const reported = useRef({ total: false, built: new Set(), written: new Set(), timers: [] });

  const scrollerRef = useRef(null);

  /**
   * The build follows itself down the page, section by section. The moment the
   * last one's copy lands that stops being useful: there's nothing left to
   * watch, and what the page needs to do now is present itself whole. So the
   * canvas returns to the top exactly once, and that scroll is the handoff out
   * of watching and into reviewing.
   *
   * Latched, because everything after it belongs to the user. Recolouring,
   * changing the type, anything asked for later — those apply wherever they're
   * standing. Moving the viewport under someone who is reading is the app
   * taking the page back off them.
   */
  const handedOff = useRef(false);

  const handOffToReview = () => {
    if (handedOff.current) return;
    handedOff.current = true;

    // A beat, so the section that just landed is seen landing rather than
    // being whipped away by its own completion.
    const timer = setTimeout(() => {
      scrollerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }, 420);
    reported.current.timers.push(timer);
  };

  // Chained reveals are scheduled with timeouts; clear any in flight if the
  // canvas goes away mid-build.
  useEffect(
    () => () => reported.current.timers.forEach(clearTimeout),
    []
  );

  /**
   * How many sections have been mounted so far.
   *
   * Sections are revealed one at a time, each mounting only once the previous
   * one's entrance has finished. Pre-scheduled stagger delays would not do:
   * React mounts every section in a single pass, so a "built" counter keyed to
   * mounting would jump straight to the total instead of climbing. This makes
   * the chain genuinely causal — if a section is slow to appear, the counter in
   * the chat is slow with it.
   */
  const [visibleCount, setVisibleCount] = useState(1);

  /**
   * A reorder isn't a rebuild — nothing is being written — but swapping the
   * page under someone with no beat in between reads as a glitch rather than
   * a change. Every section drops to its skeleton for a moment, which is the
   * same language the first build already speaks.
   */
  const [swapping, setSwapping] = useState(false);

  useEffect(() => {
    if (!reorderNonce) return undefined;
    setSwapping(true);
    const settleAt = setTimeout(() => setSwapping(false), timeline.skeletonHold * 1000);
    return () => clearTimeout(settleAt);
  }, [reorderNonce]);

  const theme = draft ? getRenderableTheme(draft.themeId) : null;
  const palette = getPalette(paletteId);
  const fontPairing = getFontPairing(fontPairingId);

  const sections = theme
    ? theme.sections
        // A section can opt out of its own existence — the goods grid only
        // makes sense for a business that sells something.
        .filter((spec) => (spec.when ? spec.when(draft) : true))
        .filter((spec) => {
          if (SECTION_RENDERERS[spec.type]) return true;
          console.warn(`[ResultCanvas] no renderer for section type "${spec.type}" — skipping`);
          return false;
        })
    : [];

  const total = sections.length;

  const ordered = rotateBody(sections, sectionRotation);

  // Once a reorder has happened the build is long over, so sections shouldn't
  // crawl back in one at a time — the swap's own skeleton beat covers it.
  const immediate = instant || reorderNonce > 0;

  useEffect(() => {
    if (!total || reported.current.total) return;
    reported.current.total = true;
    onSectionsResolved?.(total);
  }, [total, onSectionsResolved]);

  if (!draft) return null;

  // Resolved for the whole page up front, not per section, because attached
  // photos fill picture slots in page order and so need one queue draining
  // across all of them. A section can carry its own fixed content instead of
  // reading a draft slot — see notesLab.js, whose sections mostly aren't
  // driven by the generic business-description model at all.
  const contents = contentWithUploads(
    ordered,
    (spec) => spec.content ?? (spec.slot ? draft[spec.slot] : draft),
    (spec) => SECTION_RENDERERS[spec.type]?.images,
    uploads
  );

  return (
    <div
      ref={scrollerRef}
      data-canvas-scroll
      className="h-full w-full overflow-y-auto scroll-slim bg-surface"
      // A theme can carry its own palette/type — see notesLab.js. Scoped to
      // this wrapper only, as a CSS custom-property override: every Tailwind
      // utility inside (bg-surface, text-ink, font-serif...) already resolves
      // through these same variables, so the whole canvas re-skins with no
      // per-section change. Themes that don't set `tokens` render exactly as
      // they did before this existed. A picked palette (see palettes.js)
      // layers on top, last, so it always wins over the theme's own colours
      // without touching radius, font, or anything structural. A picked font
      // pairing layers on top of that in turn, touching only --font-serif.
      style={{ ...theme?.tokens, ...palette?.tokens, ...fontPairing?.tokens }}
    >
      <div className={cx('flex w-full flex-col', compact ? 'gap-10 py-5' : 'gap-16 py-8')}>
        {(immediate ? ordered : ordered.slice(0, visibleCount)).map((spec, index) => {
          const { Component, blockName } = SECTION_RENDERERS[spec.type];
          const content = contents[index];
          const key = `${spec.type}-${spec.slot || index}`;
          const label = sectionLabel(spec, draft, blockName);

          const built = () => {
            if (reported.current.built.has(key)) return;
            reported.current.built.add(key);
            // Named on the way in, not just on the way out — the chat's
            // progress list shows the section being written by name.
            onSectionBuilt?.(label);
          };

          const written = () => {
            if (reported.current.written.has(key)) return;
            reported.current.written.add(key);
            onSectionWritten?.(label);

            // Every section has now reported its copy — the build is over.
            if (total > 0 && reported.current.written.size >= total) {
              handOffToReview();
              return;
            }

            // This section is done, so the next one may now mount — after a
            // beat, so the build reads as deliberate rather than a cascade.
            // `Math.max` keeps it idempotent whatever order callbacks land in.
            const timer = setTimeout(
              () => setVisibleCount((current) => Math.max(current, index + 2)),
              timeline.revealGap * 1000
            );
            reported.current.timers.push(timer);
          };

          // A section can ask to fill the panel instead of sitting in the
          // shared 52rem column — either on its own (`spec.wide`, e.g. modern
          // grid's Cover and Pullquote) or because its whole theme does
          // (`theme.wide` — NotesLab's reference runs everything full-width).
          // Kept as a wrapper around `Block`, not inside it, so the hover
          // outline still hugs exactly the width that's actually showing.
          const wide = spec.wide || theme?.wide;
          const widthClass = wide
            ? compact
              ? 'px-5'
              : 'px-8'
            : compact
              ? 'mx-auto w-full max-w-[30rem] px-5'
              : 'mx-auto w-full max-w-[52rem] px-8';

          // Mid-swap every section is a placeholder, in its new position —
          // the page rearranges first and fills back in after, rather than
          // the content appearing to teleport between slots.
          if (swapping) {
            return (
              <div key={key} className={widthClass} aria-hidden>
                <SectionSkeleton type={spec.type} compact={compact} />
              </div>
            );
          }

          return (
            <div key={key} className={widthClass}>
              <Block
                name={blockName}
                type={spec.type}
                compact={compact}
                // Don't scroll for the first section — it's already in view, and
                // scrolling on mount would jerk the panel as it appears. A
                // whole template arriving at once shouldn't scroll at all, and
                // neither should anything that remounts after the handoff.
                autoScroll={!immediate && index > 0 && !handedOff.current}
                instant={immediate}
                onBuilt={built}
                onWritten={written}
              >
                <Component spec={spec} content={content} draft={draft} compact={compact} />
              </Block>
            </div>
          );
        })}
      </div>
    </div>
  );
}
