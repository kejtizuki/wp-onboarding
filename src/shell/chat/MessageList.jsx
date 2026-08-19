import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Message from './Message';

/**
 * Two slots, because two different things want two different places.
 *
 * `afterFirst` goes directly below the opening user turn: the activity log
 * belongs between what was asked and everything that followed from it.
 *
 * `pinned` is the pickers, and it goes at the turn where they were offered —
 * `{ index, node }`, drawn after the message at `index - 1`. They used to be
 * appended after the whole conversation instead, which meant every later turn
 * pushed them down again: answer something else in the meantime, like dropping
 * photos in, and the palette question reappeared *below* the answer, reading as
 * though it had been asked a second time. Staying put is what makes it one
 * question that's still open rather than one being repeated.
 */
export default function MessageList({ messages, className, afterFirst = null, pinned = null }) {
  const endRef = useRef(null);
  // A callback ref, not a plain useRef: the list renders nothing at all until
  // the first message exists (see the early return below), so a mount-time
  // effect would find no node to observe yet. This re-fires whenever the
  // content div itself actually mounts.
  const [contentNode, setContentNode] = useState(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages.length]);

  // Where the pinned block sits, clamped in case it was anchored against a
  // longer transcript than the one we have now (a template reset rewinds the
  // messages). -1 means "nothing pinned".
  const pinnedAt = pinned ? Math.min(pinned.index, messages.length) : -1;

  // Anything below the pinned block means the user has moved on past it, so
  // its own growth must not drag the view to the bottom of the conversation.
  const pinnedIsLast = pinnedAt === messages.length;

  // The activity log and the pickers grow in place as the build progresses,
  // without ever changing `messages.length`. A resize observer catches that
  // growth (a tick in the log, a palette pick revealing the font picker
  // underneath it) the same way a new message would, so the latest step is
  // always what's in view — but only while that growth *is* the end of the
  // conversation. Once there are turns below it, picking a palette should
  // apply where you're already looking, not scroll you somewhere else.
  useEffect(() => {
    if (!contentNode || !pinnedIsLast) return undefined;
    const observer = new ResizeObserver(() => {
      endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    });
    observer.observe(contentNode);
    return () => observer.disconnect();
  }, [contentNode, pinnedIsLast]);

  // `afterFirst` normally slots in under the opening turn, but it can outlive
  // it: resetting the template clears the transcript and leaves the pickers
  // standing on their own. With nothing at all to show, render nothing.
  if (messages.length === 0 && !afterFirst && !pinned) return null;

  return (
    <div className={className}>
      {/* 24px between everything in the conversation — messages, the activity
          log, the pickers — and the same 24px separates the two questions
          inside the picker block. One rhythm, so nothing reads as more or
          less related than it is.

          The 8px tail sits on the content rather than the scroller: the
          sentinel below is aligned to the scrollport's bottom edge, so any
          padding on the scroller itself gets dragged out of view. Here it
          stays, and keeps the composer's fade off the last line. */}
      <div ref={setContentNode} className="flex flex-col gap-6 pb-2">
        {pinnedAt === 0 && pinned.node}
        <AnimatePresence initial={false}>
          {messages.map((message, index) => (
            <React.Fragment key={message.id}>
              <Message message={message} />
              {index === 0 && afterFirst}
              {pinnedAt === index + 1 && pinned.node}
            </React.Fragment>
          ))}
        </AnimatePresence>
        {messages.length === 0 && afterFirst}
      </div>
      <div ref={endRef} />
    </div>
  );
}
