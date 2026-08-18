/**
 * INTENT CLASSIFICATION
 *
 * The premise of this onboarding: one low-friction input at the door, and what
 * the user typed decides which experience they get. This is the real inference —
 * a single Claude call, no SDK, no backend.
 *
 * Everything about it is designed to fail open. A classifier that blocks the
 * demo is worse than one that guesses "draft", so every failure path — network,
 * HTTP error, malformed JSON, unknown label, timeout — resolves to `draft`
 * rather than surfacing an error. Nothing here can stop the flow.
 */

const ENDPOINT = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-6';
const MAX_TOKENS = 200;

/**
 * Read at build time by Create React App, which inlines any `REACT_APP_*` var
 * into the bundle. Put it in `.env.local` (gitignored) and restart the dev
 * server — see README, "Enabling intent classification".
 *
 * ⚠️ Inlined means *public*. This is fine on localhost and NOT fine in a build
 * you deploy: anyone can read the key out of the served JavaScript. Before
 * deploying, either leave this unset (the classifier fails open to "draft") or
 * point ENDPOINT at a proxy that holds the key server-side.
 */
const API_KEY = process.env.REACT_APP_ANTHROPIC_API_KEY;

/**
 * Hard ceiling on the call. The entry→builder transition takes ~930ms, and the
 * builder holds for the result, so anything slower than this is a visible stall.
 * Better to draft than to make someone watch a spinner.
 */
const TIMEOUT_MS = 4000;

export const PATHS = ['draft', 'migrate', 'explore'];

export const FALLBACK = Object.freeze({
  path: 'draft',
  confidence: 'low',
  reason: 'classifier unavailable',
  fellBack: true,
});

const INSTRUCTIONS = `You classify a person's first message to a website builder, so the product can route them to the right onboarding flow.

Classify into exactly one path:

- "migrate" — the input contains a URL, or clearly references a site or business they already have online. Examples: "bellaroma.com", "I already have a site at example.org", "redoing my current website", "we're on Squarespace and want to move".
- "explore" — the input is vague, uncertain, or exploratory in tone, or is very short and low-detail. Examples: "not sure yet", "just looking around", "something creative maybe", "hi", "a website".
- "draft" — a clear, specific description of a business or project, with no existing site mentioned. This is the default and the most common case. Examples: "a ceramics studio in Porto that runs weekend workshops", "law firm specialising in immigration".

When torn between "draft" and "explore", prefer "draft" if there is any concrete detail about what the thing actually is.

Respond with ONLY a JSON object, no preamble and no markdown fences, in exactly this shape:
{"path": "draft" | "migrate" | "explore", "confidence": "high" | "medium" | "low", "reason": "short phrase"}`;

/** Models sometimes wrap JSON in prose or fences despite instructions. */
function extractJson(text) {
  const unfenced = text.replace(/```(?:json)?/gi, '').trim();
  const start = unfenced.indexOf('{');
  const end = unfenced.lastIndexOf('}');
  if (start === -1 || end === -1 || end < start) throw new Error('no JSON object in response');
  return JSON.parse(unfenced.slice(start, end + 1));
}

/**
 * @param {string} userInput
 * @returns {Promise<{path: string, confidence: string, reason: string, fellBack: boolean}>}
 */
export async function classifyIntent(userInput) {
  // No key, no call. Skipping the round trip avoids a guaranteed 401 and a
  // red console error on every submit — the flow is identical either way.
  if (!API_KEY) {
    console.info(
      '[classifyIntent] no REACT_APP_ANTHROPIC_API_KEY — skipping classification, routing to "draft"'
    );
    return { ...FALLBACK, reason: 'no API key configured' };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  const startedAt = Date.now();

  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'content-type': 'application/json',
        'anthropic-version': '2023-06-01',
        'x-api-key': API_KEY,
        // Required for calls made straight from a browser — without it the
        // request is blocked by CORS before it ever leaves the page.
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        // Classification needs speed, not deliberation — and thinking tokens
        // would eat into the 200-token budget.
        thinking: { type: 'disabled' },
        output_config: { effort: 'low' },
        messages: [
          {
            role: 'user',
            content: `${INSTRUCTIONS}\n\nMessage to classify:\n"""\n${userInput}\n"""`,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${await response.text().catch(() => '')}`.trim());
    }

    const data = await response.json();
    const text = (data.content || [])
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('')
      .trim();

    const parsed = extractJson(text);

    if (!PATHS.includes(parsed.path)) {
      throw new Error(`unknown path "${parsed.path}"`);
    }

    const result = {
      path: parsed.path,
      confidence: parsed.confidence || 'medium',
      reason: parsed.reason || '',
      fellBack: false,
    };

    // Kept deliberately: this is how you sanity-check the classifier across a
    // range of inputs before trusting it in a demo.
    console.info(
      `[classifyIntent] ${Date.now() - startedAt}ms →`,
      `${result.path} (${result.confidence}) — ${result.reason}`
    );

    return result;
  } catch (error) {
    const reason = error.name === 'AbortError' ? `timed out after ${TIMEOUT_MS}ms` : error.message;
    console.warn(`[classifyIntent] falling back to "draft": ${reason}`);
    return { ...FALLBACK };
  } finally {
    clearTimeout(timer);
  }
}

export default classifyIntent;
