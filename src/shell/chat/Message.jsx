import React from 'react';
import { motion } from 'framer-motion';
import cx from '../../lib/cx';
import { messageVariants } from '../../design/motion';

/**
 * User turns are bubbles, assistant turns are plain text. The asymmetry keeps
 * the assistant reading as the product speaking rather than a second person in
 * the room.
 *
 * `layout="position"` keeps bubbles from jumping as later ones arrive: text
 * re-wraps at its new width immediately and only position animates.
 */
export default function Message({ message }) {
  const isUser = message.author === 'user';

  return (
    <motion.div
      layout="position"
      variants={messageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={cx('flex w-full', isUser ? 'justify-end' : 'justify-start')}
    >
      <div
        className={cx(
          'text-[14px] text-[#1F1F1F]',
          isUser
            ? 'max-w-[85%] rounded-nested bg-surface-sunken px-3 py-2'
            // Assistant turns can carry lists (the completion summary), so
            // newlines have to survive.
            : 'w-full whitespace-pre-line'
        )}
      >
        {/* Photos sent with the turn, as thumbnails rather than filenames —
            the same reason the composer's chips lead with the picture. A
            turn can be photos alone, in which case this is the whole
            bubble. */}
        {message.attachments && (
          <div
            className={cx(
              'flex flex-wrap gap-1.5',
              message.body && 'mb-2'
            )}
          >
            {message.attachments.map((attachment) => (
              <img
                key={attachment.id}
                src={attachment.url}
                alt={attachment.name}
                className="h-14 w-14 rounded-control object-cover"
              />
            ))}
          </div>
        )}
        {message.body}
      </div>
    </motion.div>
  );
}
