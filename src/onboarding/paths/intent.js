/**
 * LOCAL INTENT DETECTION
 *
 * A synchronous first pass over what the user typed, run before the model
 * classifier. Two reasons it exists rather than deferring everything to the API:
 *
 *  1. A pasted URL is unambiguous. Spending a round trip — and the risk of it
 *     failing open to "draft" — on something a regex answers exactly is worse
 *     for the user than just routing them.
 *  2. It works with no API key, which is the state this prototype ships in.
 *
 * Only high-confidence signals belong here. Anything requiring judgement is the
 * model's job — see classifyIntent.js.
 */

/** A URL, with or without a scheme. Requires a real dot-TLD so prose can't trip it. */
const URL_RE =
  /(https?:\/\/\S+|www\.[\w-]+\.\w+|\b[a-z0-9][\w-]*\.(com|net|org|io|co|dev|app|me|shop|store|blog|design|studio|uk|de|fr|es|pt|nl|se|it|ca|au)\b(\/\S*)?)/i;

/** Saying, in so many words, that a site already exists. */
const MIGRATE_RE =
  /\b(migrat\w+|(move|transfer|import|port)\s+(my|our|the)\s+(site|website|blog)|(existing|current|old)\s+(site|website)|already\s+have\s+(a|my|our)\s+(site|website)|redesign\w*\s+(my|our|the)\s+(site|website)|switch\w*\s+from\s+(squarespace|wix|shopify|webflow|godaddy|weebly))\b/i;

/**
 * @param {string} text
 * @returns {{ path: string, confidence: string, reason: string, source: string } | null}
 *   `null` means "no strong local signal" — hand it to the model.
 */
export function detectIntent(text) {
  const value = (text || '').trim();
  if (!value) return null;

  const url = value.match(URL_RE);
  if (url) {
    return {
      path: 'migrate',
      confidence: 'high',
      reason: `contains a URL (${url[0]})`,
      source: 'local',
    };
  }

  if (MIGRATE_RE.test(value)) {
    return {
      path: 'migrate',
      confidence: 'high',
      reason: 'refers to a site they already have',
      source: 'local',
    };
  }

  return null;
}

/** Exported for the URL field's own validation and for tests. */
export const looksLikeUrl = (text) => URL_RE.test((text || '').trim());

export default detectIntent;
