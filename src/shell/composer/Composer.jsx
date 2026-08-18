import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import cx from '../../lib/cx';
import { ArrowUp } from '../../ui/Icons';
import { fade, snap } from '../../design/motion';
import { enabledModes, InputMode } from './inputModes';

/**
 * COMPOSER
 *
 * One component, two independent instances: the entry state (large, centered)
 * and the docked state (compact, pinned to the bottom of the sidebar). They are
 * never the same element — see the note above the return.
 *
 * Layout is a single permanent row — text on the left, send button bottom-right
 * — at every line count. This on purpose: an earlier version switched to a
 * stacked layout once text wrapped, which meant animating a `flex-direction`
 * flip. CSS can't tween that property at all, and Framer's `layout` FLIP either
 * snapped or visibly warped the button trying to fake it. Never having a second
 * layout to switch to removes the whole problem — the button anchors to the
 * bottom of the row via `items-end`, and rides down smoothly for free as the
 * textarea's own height transition (below) grows the row underneath it. No
 * button-specific animation code exists because none is needed.
 *
 * Extra input types register in `inputModes.js` and render into the accessory
 * slots; the composer itself does not need to change.
 */
export default function Composer({
  compact = false,
  value,
  onChange,
  onSubmit,
  placeholder,
  hint,
  submitLabel = 'Send',
  disabled = false,
  /**
   * Distinct from `disabled`: the field stays focusable and visually normal,
   * it just can't be hand-edited or submitted for a moment. The typewriter
   * effect on the entry examples uses this — a fully `disabled` textarea
   * blurs itself, which would drop the caret mid-animation.
   */
  locked = false,
  autoFocus = false,
  /** 'text' | 'url' — same component, different validation. */
  inputType = 'text',
  modes = [InputMode.FREEFORM],
}) {
  const textareaRef = useRef(null);
  const [focused, setFocused] = useState(false);
  const accessories = enabledModes(modes).filter((mode) => mode.Accessory);

  const maxHeight = compact ? 132 : 176;

  /**
   * The docked composer holds two rows even when it's empty — it's the one
   * way to steer the build, and at a single line it read as a footnote under
   * the conversation rather than the thing you're meant to reach for. Two
   * rows of `text-body` (24px each) plus the field's own 4px padding.
   */
  const minHeight = compact ? 56 : 0;

  // Autosize only — the row layout never changes, so there's no second mode
  // whose width would invalidate this measurement later.
  const resize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(Math.max(el.scrollHeight, minHeight), maxHeight)}px`;
  }, [maxHeight, minHeight]);

  useLayoutEffect(resize, [resize, value, compact]);

  // The first measurement can land before webfonts/stylesheets have applied,
  // which produces a wrong height that then sticks. Re-measure once painted,
  // and again whenever the column changes width.
  useEffect(() => {
    const frame = requestAnimationFrame(resize);
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, [resize]);

  useEffect(() => {
    if (autoFocus) textareaRef.current?.focus();
  }, [autoFocus]);

  // While locked, `value` changes programmatically (the typewriter effect) —
  // a controlled textarea doesn't move the caret on its own when that happens,
  // so without this the cursor sits wherever it last was (often position 0)
  // while text fills in ahead of it. Snapping to the end keeps it looking like
  // something is actually being typed.
  useEffect(() => {
    if (locked) textareaRef.current?.setSelectionRange(value.length, value.length);
  }, [value, locked]);

  // Loose on purpose — "yoursite.com" should pass without a scheme.
  const looksLikeUrl = (text) => /^(https?:\/\/)?[\w-]+(\.[\w-]+)+(\/\S*)?$/i.test(text.trim());

  const filled = value.trim().length > 0;
  const valid = inputType === 'url' ? looksLikeUrl(value) : filled;
  const canSubmit = !disabled && !locked && valid;
  const showUrlNudge = inputType === 'url' && filled && !valid;
  const footnote = showUrlNudge ? "That doesn't look like a web address yet" : hint;

  const submit = useCallback(() => {
    if (!canSubmit) return;
    onSubmit(value);
  }, [canSubmit, onSubmit, value]);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  // Deliberately not a shared/layout-animated element. The entry composer and
  // the docked composer are two separate inputs that never morph into one
  // another — the transition between them is a crossfade owned by Shell.
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
      className={cx(
        'w-full origin-bottom border bg-surface',
        'transition-all duration-fast ease-standard',
        // The whole surface is the field. Focus darkens its edge and deepens
        // its shadow rather than drawing a second box around the text.
        focused
          ? 'border-line-strong shadow-raised'
          : 'border-line shadow-composer hover:border-line-strong',
        // Docked, it sits 12px inside the sidebar, so it takes the nested
        // radius. On the entry screen it sits on open canvas and gets the full
        // 24px — nothing to be concentric with.
        compact ? 'rounded-nested p-2' : 'rounded-surface p-3'
      )}
    >
      {accessories.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {accessories.map(({ id, Accessory }) => (
            <Accessory key={id} onPick={onChange} compact={compact} />
          ))}
        </div>
      )}

      <label className="sr-only" htmlFor="composer-input">
        {placeholder}
      </label>

      <div className="flex items-end gap-2">
        <textarea
          id="composer-input"
          ref={textareaRef}
          rows={1}
          value={value}
          disabled={disabled}
          readOnly={locked}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          // Grammarly and friends inject their own outline + badge into text
          // fields, which is what draws the stray rectangle inside the composer.
          // These opt it out so the field stays ours.
          data-gramm="false"
          data-gramm_editor="false"
          data-enable-grammarly="false"
          className={cx(
            'block w-full min-w-0 overflow-y-auto bg-transparent text-body text-ink',
            'placeholder:text-ink-subtle',
            'border-0 outline-none focus:ring-0',
            'flex-1',
            // `resize()` sets height imperatively via `el.style.height`, with
            // no transition of its own — without this, crossing the wrap
            // threshold snaps the box a full line taller in a single frame.
            // A plain CSS transition animates any height change regardless of
            // how it was set, inline style included.
            'transition-[height] duration-base ease-standard',
            compact ? 'px-1 py-1' : 'px-2 py-1.5'
          )}
          style={{ maxHeight }}
        />

        {/* Bottom-anchored by the row's own `items-end` — no separate
            animation. It rides down as the row grows purely because the
            textarea's height transition (above) is smoothly resizing the row
            it's sitting in; nothing here needs to know that's happening. */}
        <div className="flex shrink-0">
          <motion.button
            type="submit"
            disabled={!canSubmit}
            aria-label={submitLabel}
            title={submitLabel}
            whileHover={canSubmit ? { y: -1 } : undefined}
            whileTap={canSubmit ? { scale: 0.94 } : undefined}
            transition={snap}
            className={cx(
              'flex items-center justify-center rounded-pill',
              'bg-accent text-accent-ink transition-all duration-fast ease-standard',
              // Neutral when there's nothing to send, so the accent means "ready".
              'disabled:bg-line disabled:text-ink-subtle',
              compact ? 'h-7 w-7' : 'h-9 w-9'
            )}
          >
            <ArrowUp width={compact ? 14 : 16} height={compact ? 14 : 16} strokeWidth={1.75} />
          </motion.button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {footnote && !compact && (
          <motion.p
            key={footnote}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={fade}
            className="mt-2 px-2 text-micro text-ink-subtle"
          >
            {footnote}
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}
