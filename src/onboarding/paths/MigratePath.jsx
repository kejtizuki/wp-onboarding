import { useEffect, useRef } from 'react';
import { Step } from '../session/phases';
import { timeline } from '../../design/motion';
import { buildDraft } from './mock/draft';

/**
 * PATH 2 — "I have a site already."
 * URL -> scan -> before/after -> approve -> same builder as Path 1.
 *
 * The scan is narrated by the assistant's own messages; the "after" is the
 * shared ResultCanvas. Only the comparison view is new.
 */

/** How long the scan reads as taking. Path 2 has no render to key off — its
  * work happens on a notional remote site, so this beat stays timed. */
const SCAN_SECONDS = 4.4;

/**
 * Turn whatever they typed into something that reads like a business name.
 *
 * The input is no longer guaranteed to *be* a URL — this path is now reached by
 * inference, so it may arrive as prose ("move my site from Squarespace") with a
 * URL somewhere inside it, or none at all. Pull out a host if there is one and
 * fall back gracefully if there isn't.
 */
const HOST_RE =
  /(?:https?:\/\/)?(?:www\.)?([a-z0-9][\w-]*)\.(?:com|net|org|io|co|dev|app|me|shop|store|blog|design|studio|uk|de|fr|es|pt|nl|se|it|ca|au)\b/i;

export function nameFromUrl(input) {
  const match = (input || '').match(HOST_RE);
  if (!match) return 'Your site';

  return match[1]
    .replace(/[-_]+/g, ' ')
    .replace(/\b[a-z]/g, (c) => c.toUpperCase());
}

function MigrateFlow({ session }) {
  const { intake, setStep, setDraft, addMessage } = session;
  const started = useRef(false);

  useEffect(() => {
    // See PromptPath: one-shot bits guarded, timer re-armed on every pass so
    // StrictMode's cleanup doesn't strand the scan.
    if (!started.current) {
      started.current = true;
      setStep(Step.SCANNING);
      addMessage('assistant', `Scanning ${nameFromUrl(intake)} now — this takes a moment.`);
    }

    const timer = setTimeout(() => {
      setDraft(buildDraft(nameFromUrl(intake), { origin: 'migrate' }));
      setStep(Step.COMPARE);
      addMessage(
        'assistant',
        'Found 6 pages and rebuilt your homepage in WordPress blocks. Compare it against your current site — nothing changes until you pick one.'
      );
    }, (timeline.builderAt + SCAN_SECONDS) * 1000);

    return () => clearTimeout(timer);
    // Mount-only: the flow runs once per submit.
  }, []); // eslint-disable-line

  return null;
}

const migratePath = {
  id: 'migrate',
  chipLabel: 'I have a site already',

  entry: {
    title: 'Where does it live now?',
    subtitle:
      "Paste your current address. We'll read what's there and rebuild it — you'll see both before anything changes.",
    placeholder: 'yoursite.com',
    submitLabel: 'Scan my site',
    inputType: 'url',
  },

  Flow: MigrateFlow,

  /** Called by the comparison view's "Use this version". */
  onAccept(session) {
    session.setStep(Step.RESULT);
    session.addMessage(
      'assistant',
      "Here's your upgraded homepage. Tell me what to change."
    );
  },

  getChrome(session) {
    const name = session.intake ? nameFromUrl(session.intake) : 'Your site';
    return {
      pageLabel: 'Home',
      siteLabel: `${name} · Homepage`,
    };
  },
};

export default migratePath;
