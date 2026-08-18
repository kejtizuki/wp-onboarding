import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import cx from '../../lib/cx';
import { Check, ChevronDown } from '../../ui/Icons';
import StarLoader from '../../ui/StarLoader';
import { settle } from '../../design/motion';
import { deriveSteps, isGenerationComplete } from '../../onboarding/generation/activity';

/**
 * ACTIVITY LOG — the agent showing its work, in the conversation.
 *
 * This is a permanent record, not a loading state: it stays put after
 * generation finishes so the conversation reads as a history of what was done.
 * Steps appear as they begin rather than being listed upfront, so the list
 * grows with the work.
 *
 * Three steps, each with its own marker: the two decisions taken before
 * anything can be drawn, then the drawing itself. That third one used to be
 * two rows standing in for the per-section work — "Building sections",
 * "Writing copy" — with the section names listed separately underneath,
 * which said the same thing twice. Now the section list sits under that one
 * row as its detail: names only, no markers of their own, since the row above
 * already carries the state for all of them. The one still being written is
 * marked by the travelling highlight instead.
 *
 * Finished, seven lines of detail is a receipt rather than progress, so it
 * folds away behind the row and opens again on click.
 *
 * Everything here reads the shared generation state the preview panel writes
 * to. Nothing is hardcoded, and nothing is on a timer.
 */

function Marker({ done }) {
  if (done) {
    return (
      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-pill bg-accent text-accent-ink">
        <Check width={10} height={10} strokeWidth={2.5} />
      </span>
    );
  }

  // The in-progress marker is the star sequence, not a spinner — the same mark
  // that opens the entry screen, now animating while work is happening.
  return <StarLoader size={16} className="shrink-0 text-accent" />;
}

/** One step of the log: a marker, then its line. */
function Row({ children }) {
  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={settle}
      className="flex items-center gap-2.5"
    >
      {children}
    </motion.div>
  );
}

export default function ActivityLog({ generation }) {
  const [open, setOpen] = useState(false);

  if (!generation) return null;

  const steps = deriveSteps(generation).filter((step) => step.state !== 'pending');
  const sections = generation.sections || [];
  const complete = isGenerationComplete(generation);

  if (steps.length === 0 && sections.length === 0) return null;

  // Done, the list is opt-in. Mid-build it's the whole point, so it's shown.
  const showList = sections.length > 0 && (!complete || open);

  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={settle}
      /* Held off the right edge by as much as a user bubble is held off the
         left — same `max-w-[85%]`, mirrored — so the two bubbles frame the
         column evenly instead of one spanning it end to end. */
      className="flex w-full max-w-[85%] flex-col gap-2.5 self-start rounded-nested bg-surface-sunken px-3 py-3"
    >
      <AnimatePresence initial={false}>
        {steps.map((step) => (
          <Row key={step.id}>
            <Marker done={step.state === 'done'} />
            <span
              className={cx(
                'text-[14px] text-[#1F1F1F]',
                step.state !== 'done' && 'font-medium'
              )}
            >
              {step.label}
            </span>
          </Row>
        ))}

        {sections.length > 0 && (
          <Row key="sections">
            <Marker done={complete} />
            {complete ? (
              <button
                type="button"
                onClick={() => setOpen((current) => !current)}
                aria-expanded={open}
                className="flex items-center gap-1.5 text-left text-[14px] text-[#1F1F1F]"
              >
                <span>
                  Built {sections.length} {sections.length === 1 ? 'section' : 'sections'}
                </span>
                <ChevronDown
                  width={14}
                  height={14}
                  className={cx(
                    'shrink-0 transition-transform duration-fast ease-standard',
                    open && 'rotate-180'
                  )}
                />
              </button>
            ) : (
              <span className="text-[14px] font-medium text-[#1F1F1F]">Building sections</span>
            )}
          </Row>
        )}
      </AnimatePresence>

      {/* Indented past the marker column, so the names line up with the step
          labels above rather than with their icons. */}
      <AnimatePresence initial={false}>
        {showList && (
          <motion.ol
            key="section-names"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={settle}
            className="flex flex-col gap-1 overflow-hidden pl-[26px] text-[14px] text-[#1F1F1F]"
          >
            {sections.map((section, index) => (
              <li
                key={`${index}-${section.label}`}
                className={cx(!section.done && 'text-sweep')}
              >
                {index + 1}. {section.label}
              </li>
            ))}
          </motion.ol>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
