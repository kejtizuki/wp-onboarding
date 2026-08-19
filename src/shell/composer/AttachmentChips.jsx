import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import cx from '../../lib/cx';
import { Close } from '../../ui/Icons';
import { snap } from '../../design/motion';

/**
 * The attached photos, sitting above the field they were attached to.
 *
 * A thumbnail rather than a file glyph: these are being attached *because* of
 * what they look like, so the picture is the identifying detail and the name
 * is the footnote. Names truncate, which is why the extension is lifted out
 * onto its own line — it's the part that would otherwise be first to go.
 */
export default function AttachmentChips({ attachments, onRemove, compact = false }) {
  if (attachments.length === 0) return null;

  return (
    <div className={cx('flex flex-wrap gap-2', compact ? 'mb-2' : 'mb-3')}>
      <AnimatePresence initial={false}>
        {attachments.map((attachment) => (
          <motion.div
            key={attachment.id}
            layout
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={snap}
            className={cx(
              'group relative flex max-w-[12rem] items-center gap-2',
              'rounded-nested bg-surface-sunken p-1.5 pr-2.5'
            )}
          >
            <img
              src={attachment.url}
              alt=""
              aria-hidden
              className="h-10 w-10 shrink-0 rounded-control object-cover"
            />
            <div className="min-w-0">
              <p className="truncate text-caption font-medium text-ink">{attachment.name}</p>
              <p className="text-micro text-ink-subtle">{attachment.kind}</p>
            </div>

            {/* Only on hover or keyboard focus — at rest the chip is about the
                photo, not about getting rid of it. Always reachable by tab. */}
            <button
              type="button"
              onClick={() => onRemove(attachment.id)}
              aria-label={`Remove ${attachment.name}`}
              className={cx(
                'absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-pill',
                'bg-ink text-surface opacity-0 transition-opacity duration-fast ease-standard',
                'group-hover:opacity-100 focus-visible:opacity-100'
              )}
            >
              <Close width={10} height={10} strokeWidth={2} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
