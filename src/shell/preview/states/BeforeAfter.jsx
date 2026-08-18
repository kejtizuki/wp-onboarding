import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import cx from '../../../lib/cx';
import Button from '../../../ui/Button';
import ResultCanvas from './ResultCanvas';
import { fade, settle } from '../../../design/motion';

/**
 * BEFORE / AFTER — Path 2 only.
 *
 * A toggle rather than a split view: the panel is one column wide, and showing
 * both at half width would undersell the after. Toggling in place also makes the
 * comparison direct — same position, same size, only the site changes.
 *
 * "After" is the shared ResultCanvas, so the version they approve is literally
 * the one they land in.
 */

/** Rough mock of the site they already have. Deliberately unlovely. */
function BeforeSite({ url, draft }) {
  return (
    <div className="h-full w-full overflow-y-auto scroll-slim bg-surface">
      <div className="mx-auto w-full max-w-[46rem] p-6">
        <div className="mb-4 border-b border-line-strong pb-2">
          <p className="text-body font-bold text-ink">{draft.siteName}</p>
          <div className="mt-1 flex flex-wrap gap-2">
            {['Home', 'About Us', 'Services', 'Gallery', 'Contact Us', 'Blog'].map((item) => (
              <span key={item} className="text-micro text-ink-muted underline">
                {item}
              </span>
            ))}
          </div>
        </div>

        <p className="mb-1 text-caption font-bold text-ink">Welcome to our website!</p>
        <p className="mb-3 text-micro leading-5 text-ink-muted">
          {draft.siteName} has been serving customers for years. We pride ourselves on
          quality and service. Please browse our site to learn more about what we offer,
          and don't hesitate to contact us with any questions you may have.
        </p>

        <div className="mb-3 h-24 w-40 bg-surface-sunken" />

        <p className="mb-1 text-caption font-bold text-ink">Our Services</p>
        <ul className="mb-3 list-disc pl-5 text-micro leading-5 text-ink-muted">
          <li>Consultations available by appointment</li>
          <li>Competitive pricing on all work</li>
          <li>Fully insured and accredited</li>
        </ul>

        <p className="text-micro text-ink-subtle">
          Contact us: info@{url.replace(/^https?:\/\//, '').replace(/^www\./, '')} · Site last
          updated 2019
        </p>
      </div>
    </div>
  );
}

export default function BeforeAfter({ draft, url = 'yoursite.com', onAccept }) {
  const [view, setView] = useState('after');
  const isAfter = view === 'after';

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-line px-3 py-2">
        <div className="flex items-center gap-0.5 rounded-control bg-surface-sunken p-0.5">
          {[
            ['before', 'Before'],
            ['after', 'After'],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setView(value)}
              aria-pressed={view === value}
              className={cx(
                'rounded-[calc(var(--radius-control)-2px)] px-3 py-1 text-caption transition-colors duration-fast',
                view === value
                  ? 'bg-surface text-ink shadow-composer'
                  : 'text-ink-subtle hover:text-ink-muted'
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <p className="hidden truncate text-micro text-ink-subtle stage:block">
          {isAfter ? 'Rebuilt in WordPress blocks' : `Your current site · ${url}`}
        </p>
      </div>

      <div className="relative min-h-0 flex-1">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={view}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={fade}
            className="absolute inset-0"
          >
            {isAfter ? (
              <ResultCanvas draft={draft} />
            ) : (
              <BeforeSite url={url} draft={draft} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isAfter && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={settle}
            className="flex shrink-0 items-center justify-between gap-3 border-t border-line bg-surface px-3 py-2.5"
          >
            <p className="hidden text-caption text-ink-muted stage:block">
              Same content, rebuilt. Nothing is live until you say so.
            </p>
            <Button size="sm" onClick={onAccept} className="ml-auto">
              Use this version
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
