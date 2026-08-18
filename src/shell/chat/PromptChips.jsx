import React from 'react';
import { motion } from 'framer-motion';
import cx from '../../lib/cx';
import { settle, snap } from '../../design/motion';

/**
 * PROMPT CHIPS
 *
 * Short labels under the input, one tap from a worked example — but unlike a
 * quick-submit shortcut, a tap only *fills the field*. It types the example's
 * full sentence into the input as if the user had written it themselves; they
 * still have to hit send. That keeps the input honest: whatever gets
 * submitted is always what's visibly sitting in the box, never something a
 * click skipped past.
 *
 * The typewriter mechanics live in EntryScreen, which owns the field's value.
 * This component only renders the chips and reports which one was tapped.
 */
export default function PromptChips({ examples, onPick, activeTitle }) {
  if (!examples || examples.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...settle, delay: 0.14 }}
      className="mt-5 flex flex-wrap justify-center gap-2"
    >
      {examples.map((example) => {
        const active = example.title === activeTitle;
        return (
          <motion.button
            key={example.title}
            type="button"
            onClick={() => onPick(example)}
            whileTap={{ scale: 0.96 }}
            transition={snap}
            aria-pressed={active}
            className={cx(
              'rounded-pill border px-3.5 py-1.5 text-caption transition-colors duration-fast',
              active
                ? 'border-ink bg-accent text-accent-ink'
                : 'border-line bg-surface text-ink-muted hover:border-line-strong hover:text-ink'
            )}
          >
            {example.title}
          </motion.button>
        );
      })}
    </motion.div>
  );
}
