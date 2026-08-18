import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import EntryHero from './chat/EntryHero';
import PromptChips from './chat/PromptChips';
import ThemeShowcase from './showcase/ThemeShowcase';
import Composer from './composer/Composer';
import { entryEnter, entryExit } from '../design/motion';

/** ~25–30ms per character, with a touch of jitter so it doesn't read as metronomic. */
const CHAR_DELAY_MIN = 25;
const CHAR_DELAY_MAX = 30;
const charDelay = () => CHAR_DELAY_MIN + Math.random() * (CHAR_DELAY_MAX - CHAR_DELAY_MIN);

/**
 * ENTRY SCREEN — stage 1 of the transition.
 *
 * Dissolves in place on exit: opacity and a slight scale-down, no movement
 * toward anything. Its input has no relationship to the builder's docked input;
 * they are two separate elements that never meet.
 */
export default function EntryScreen({
  entry,
  onSubmit,
  extra,
  /** Set by Shell for stage 1. Dissolve in place — no exit variant, so the
      animation can't be stranded by a re-render mid-transition. */
  exiting = false,
}) {
  const [value, setValue] = useState('');
  const [lastInputType, setLastInputType] = useState(entry.inputType);

  // Keyed on the input *type*, not the path: switching between paths that both
  // take prose should keep what you typed, while switching to the URL field
  // shouldn't inherit a business description that fails its validation.
  //
  // Reset during render, not in an effect. An effect runs after paint, so for
  // one frame the URL validation would see the old path's prose and flash
  // "that doesn't look like a web address" on arrival.
  if (lastInputType !== entry.inputType) {
    setLastInputType(entry.inputType);
    setValue('');
  }

  /* ── Example typewriter ───────────────────────────────────────────────
   * An "example" — a prompt chip or a showcase tile — can be picked in three
   * different situations, and each behaves differently:
   *
   *  · field empty, or already showing a previous example's sentence → type
   *    it out character by character, from scratch
   *  · field holds something the user actually wrote themselves → drop the
   *    animation and swap the text in immediately, so a hand-written prompt
   *    is never overwritten letter by letter in front of the person who
   *    wrote it
   *
   * `chipOriginRef` is what tells those two cases apart: true whenever the
   * field's current contents came from an example (typed or instantly
   * inserted), false the moment a real keystroke touches it. Both PromptChips
   * and the showcase carousel feed the same handler below — an example is
   * just a `{title, prompt}` pair regardless of where it was tapped.
   *
   * A showcase tile can also name its own theme (`example.themeId` — see
   * showcaseThemes.js), and a chip or tile can separately name real photos
   * for one or more content slots (`example.images` — e.g. `{hero, story}`,
   * see PromptPath.jsx's ceramics and photography chips). Both refs ride
   * alongside `chipOriginRef` with the same lifetime: set the moment that
   * example's text lands in the field, cleared the moment a real keystroke
   * makes the text theirs again — so submitting a hand-edited version of a
   * forced prompt no longer forces its theme or photos.
   */
  const timerRef = useRef(null);
  const chipOriginRef = useRef(false);
  const forcedThemeIdRef = useRef(null);
  const forcedImagesRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const [activeExampleTitle, setActiveExampleTitle] = useState(null);

  const stopTypewriter = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsTyping(false);
  }, []);

  // Never leave a timer running past the component's lifetime.
  useEffect(() => stopTypewriter, [stopTypewriter]);

  const typeSentence = useCallback(
    (title, sentence, themeId, images) => {
      stopTypewriter();
      chipOriginRef.current = true;
      forcedThemeIdRef.current = themeId || null;
      forcedImagesRef.current = images || null;
      setActiveExampleTitle(title);
      setIsTyping(true);
      setValue('');

      let index = 0;
      const step = () => {
        index += 1;
        setValue(sentence.slice(0, index));
        if (index >= sentence.length) {
          timerRef.current = null;
          setIsTyping(false);
          return;
        }
        timerRef.current = setTimeout(step, charDelay());
      };
      timerRef.current = setTimeout(step, charDelay());
    },
    [stopTypewriter]
  );

  const handleExamplePick = useCallback(
    (example) => {
      const isHandWritten = value.trim().length > 0 && !chipOriginRef.current;

      if (isHandWritten) {
        // Respect what they wrote — swap it in whole, no letter-by-letter
        // overwrite of their own words.
        stopTypewriter();
        chipOriginRef.current = true;
        forcedThemeIdRef.current = example.themeId || null;
        forcedImagesRef.current = example.images || null;
        setActiveExampleTitle(example.title);
        setValue(example.prompt);
        return;
      }

      // Empty, or already showing an example's sentence (this one or
      // another) — clear and (re)play the animation from scratch.
      typeSentence(example.title, example.prompt, example.themeId, example.images);
    },
    [value, stopTypewriter, typeSentence]
  );

  const handleManualChange = useCallback(
    (next) => {
      // A real keystroke — even mid-animation this can't fire, since the field
      // is `locked` (readOnly) for the duration. Kept as a guard, not load-bearing.
      stopTypewriter();
      chipOriginRef.current = false;
      forcedThemeIdRef.current = null;
      forcedImagesRef.current = null;
      setActiveExampleTitle(null);
      setValue(next);
    },
    [stopTypewriter]
  );

  const handleSubmit = useCallback(
    (text) =>
      onSubmit(text, {
        themeId: forcedThemeIdRef.current,
        images: forcedImagesRef.current,
      }),
    [onSubmit]
  );

  /**
   * The showcase is a wall of finished templates, so tapping one is a pick,
   * not a prompt suggestion: it submits on the spot and lands on the built
   * site with no generation theatre in between. The chips above still type
   * their sentence into the field and wait to be sent — those are examples
   * of what to write, which is a different thing.
   */
  const handleShowcasePick = useCallback(
    (theme) => {
      stopTypewriter();
      onSubmit(theme.prompt, {
        themeId: theme.themeId || null,
        images: theme.images || null,
        instant: true,
      });
    },
    [onSubmit, stopTypewriter]
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.99 }}
      animate={exiting ? { opacity: 0, scale: 0.98 } : { opacity: 1, scale: 1 }}
      transition={exiting ? entryExit : entryEnter}
      className="relative flex min-h-0 flex-1 flex-col items-center justify-center overflow-hidden p-3 stage:p-4"
    >
      <div className="w-full max-w-entry">
        <EntryHero title={entry.title} subtitle={entry.subtitle} />

        {extra}

        {entry.inputType && (
          <Composer
            value={value}
            onChange={handleManualChange}
            onSubmit={handleSubmit}
            autoFocus
            locked={isTyping}
            inputType={entry.inputType}
            placeholder={entry.placeholder}
            hint={entry.hint}
            submitLabel={entry.submitLabel}
          />
        )}

        <PromptChips
          examples={entry.examples}
          onPick={handleExamplePick}
          activeTitle={activeExampleTitle}
        />
      </div>

      {/* Wider than the input column on purpose — a single strip of other
          people's sites, drifting sideways. Tapping one opens that template
          directly, rather than filling the composer the way the chips above
          do. Hidden below xl, where it would compete with the input for the
          only space there is. */}
      <ThemeShowcase
        onPick={handleShowcasePick}
        className="hidden w-full max-w-showcase pt-8 xl:block stage:pt-10"
      />
    </motion.div>
  );
}
