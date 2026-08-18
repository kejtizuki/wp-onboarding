import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { STAR_PATH } from './Icons';
import { useMediaQuery } from '../lib/useMediaQuery';

/**
 * STAR LOADER
 *
 * A cycling sequence of star shapes rather than a rotating ring. It reads as
 * something thinking rather than something buffering, which is the right note
 * while the system is making choices on the user's behalf.
 *
 * Frame one is the real brand mark; the rest are generated variants at the same
 * optical weight, so the sequence stays on-brand instead of orbiting a
 * lookalike. All shapes share a 32×32 box and a common outer radius so nothing
 * jumps in size as the sequence advances.
 */

const BOX = 32;
const C = BOX / 2;
const OUTER = 15;

const fmt = (n) => n.toFixed(2);
const at = (angle, radius) => `${fmt(C + radius * Math.cos(angle))} ${fmt(C + radius * Math.sin(angle))}`;

/** Straight-edged star polygon: alternating outer points and inner valleys. */
function polygon(points, outer, inner, rotation = -Math.PI / 2) {
  const step = Math.PI / points;
  let d = '';
  for (let i = 0; i < points * 2; i += 1) {
    const radius = i % 2 === 0 ? outer : inner;
    d += `${i === 0 ? 'M' : 'L'}${at(rotation + i * step, radius)}`;
  }
  return `${d}Z`;
}

/**
 * An outlined star — the shape minus a smaller copy of itself. Two subpaths
 * with `fill-rule: evenodd` punch the hole, which keeps it a single fillable
 * path rather than a stroke that would scale unevenly.
 */
function outlined(points, outer, inner, holeScale = 0.5, rotation = -Math.PI / 2) {
  return (
    polygon(points, outer, inner, rotation) +
    polygon(points, outer * holeScale, inner * holeScale, rotation)
  );
}

const SHAPES = [
  // The real mark: a soft four-point sparkle with concave sides.
  { d: STAR_PATH, fillRule: 'nonzero' },
  // Five-point, classic.
  { d: outlined(5, OUTER, 6.4, 0.48), fillRule: 'evenodd' },
  // Four-point, sharp — deep valleys make it read as a different silhouette
  // from frame one despite the matching point count.
  { d: outlined(4, OUTER, 4.2, 0.46), fillRule: 'evenodd' },
  // Six-point.
  { d: outlined(6, OUTER, 5.8, 0.5), fillRule: 'evenodd' },
];

/** How long each shape holds. Fast enough to feel alive, slow enough to read. */
const FRAME_MS = 420;

export default function StarLoader({ size = 16, className }) {
  const [frame, setFrame] = useState(0);
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  useEffect(() => {
    if (reducedMotion) return undefined;
    const timer = setInterval(() => setFrame((f) => (f + 1) % SHAPES.length), FRAME_MS);
    return () => clearInterval(timer);
  }, [reducedMotion]);

  // Reduced motion still gets the mark, just holding still.
  const shape = reducedMotion ? SHAPES[0] : SHAPES[frame];

  const svg = (key, animated) => (
    <motion.svg
      key={key}
      viewBox={`0 0 ${BOX} ${BOX}`}
      fill="currentColor"
      aria-hidden
      focusable="false"
      className="absolute inset-0 h-full w-full"
      initial={animated ? { opacity: 0, scale: 0.55, rotate: -50 } : false}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      exit={{ opacity: 0, scale: 0.55, rotate: 50 }}
      transition={{ duration: (FRAME_MS * 1.6) / 1000, ease: [0.22, 1, 0.36, 1] }}
    >
      <path d={shape.d} fillRule={shape.fillRule} />
    </motion.svg>
  );

  return (
    <span
      role="status"
      aria-label="Working"
      className={className}
      style={{ position: 'relative', display: 'inline-block', width: size, height: size }}
    >
      {reducedMotion ? (
        svg('static', false)
      ) : (
        // Frames overlap rather than swapping, so one shape is always present —
        // `mode="wait"` would blink to empty between every frame.
        <AnimatePresence initial={false}>{svg(frame, true)}</AnimatePresence>
      )}
    </span>
  );
}
