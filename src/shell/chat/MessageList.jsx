import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Message from './Message';

/**
 * Two slots, because two different things want two different places.
 *
 * `afterFirst` goes directly below the opening user turn: the activity log
 * belongs between what was asked and everything that followed from it.
 * `trailing` goes after the whole conversation, which is where anything still
 * being asked of the user belongs — the pickers are the next thing to do, not
 * a note about the first turn. On the migrate path especially, where the scan
 * narrates itself over several messages, a picker pinned under message one
 * would be buried above all of them.
 */
export default function MessageList({ messages, className, afterFirst = null, trailing = null }) {
  const endRef = useRef(null);
  // A callback ref, not a plain useRef: the list renders nothing at all until
  // the first message exists (see the early return below), so a mount-time
  // effect would find no node to observe yet. This re-fires whenever the
  // content div itself actually mounts.
  const [contentNode, setContentNode] = useState(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages.length]);

  // `afterFirst` — the activity log, generation summary, palette and font
  // pickers — grows in place as the build progresses, without ever changing
  // `messages.length`. A resize observer catches that growth (a tick in the
  // log, a palette pick revealing the font picker underneath it) the same way
  // a new message would, so the latest step is always what's in view.
  useEffect(() => {
    if (!contentNode) return undefined;
    const observer = new ResizeObserver(() => {
      endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    });
    observer.observe(contentNode);
    return () => observer.disconnect();
  }, [contentNode]);

  // `afterFirst` normally slots in under the opening turn, but it can outlive
  // it: resetting the template clears the transcript and leaves the pickers
  // standing on their own. With nothing at all to show, render nothing.
  if (messages.length === 0 && !afterFirst && !trailing) return null;

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
        <AnimatePresence initial={false}>
          {messages.map((message, index) => (
            <React.Fragment key={message.id}>
              <Message message={message} />
              {index === 0 && afterFirst}
            </React.Fragment>
          ))}
        </AnimatePresence>
        {messages.length === 0 && afterFirst}
        {trailing}
      </div>
      <div ref={endRef} />
    </div>
  );
}
