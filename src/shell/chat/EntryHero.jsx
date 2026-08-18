import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Star } from '../../ui/Icons';
import { fade } from '../../design/motion';

/**
 * The door. Copy comes from the active path, so switching paths at entry
 * crossfades the question rather than the whole screen.
 */
export default function EntryHero({ title, subtitle }) {
  return (
    <div className="px-1 pb-6 text-center stage:pb-8">
      <div className="mb-5 flex justify-center text-accent">
        <Star />
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={title}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={fade}
        >
          {/* The spec's two largest steps are serif — XL Serif on small
              screens, XL Serif Big once there's room. */}
          <h1 className="font-serif text-xl-serif tracking-tight text-ink stage:text-xl-serif-big">
            {title}
          </h1>
          <p className="mx-auto mt-3 max-w-prose text-body text-ink-muted stage:text-lead">
            {subtitle}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
