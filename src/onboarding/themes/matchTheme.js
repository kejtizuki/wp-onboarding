import { DEFAULT_THEME_ID } from './registry';

/**
 * THEME MATCHER
 *
 * Picks a layout structure the way WordPress.com suggests themes by business
 * category — a category signal, nudged by anything the person said about how
 * they want it to feel.
 *
 * Deliberately dumb and readable: this is a stand-in for a model call, and
 * keeping it legible makes it obvious *why* a given site came out the way it
 * did. Signals are ranked — an explicit stylistic preference beats a category
 * guess, because the person said it out loud.
 */

/** Business categories (from deriveBrand's `type`) → the structure that suits them. */
const CATEGORY_THEME = {
  'Ceramics studio': 'artisanal',
  Studio: 'artisanal',
  Bakery: 'artisanal',
  Florist: 'artisanal',
  Boutique: 'artisanal',
  Café: 'artisanal',
  'Coffee shop': 'artisanal',
  Restaurant: 'artisanal',
  Brewery: 'artisanal',
  Photography: 'artisanal',

  Blog: 'editorial',
  Newsletter: 'editorial',
  Portfolio: 'editorial',
  'Law practice': 'editorial',
  Consultancy: 'editorial',

  Agency: 'modern-grid',
  Shop: 'modern-grid',
  Store: 'modern-grid',
  Gym: 'modern-grid',
  'Yoga studio': 'modern-grid',
  Salon: 'modern-grid',
  Clinic: 'modern-grid',
  'Dental practice': 'modern-grid',
};

/** Words that describe a *feel* — these outrank the category guess. */
const KEYWORD_THEME = [
  [/\b(handmade|handcrafted|artisan(al)?|craft|small[- ]batch|studio|workshop)\b/i, 'artisanal'],
  [/\b(minimal|editorial|writing|essays?|magazine|journal|type[- ]led)\b/i, 'editorial'],
  [/\b(modern|clean|sleek|grid|catalogue|catalog|marketplace|directory)\b/i, 'modern-grid'],
];

/**
 * @param {string} userInput  what they typed at the door
 * @param {string} businessCategory  `type` from the content classifier (deriveBrand)
 * @returns {string} themeId
 */
export function matchTheme(userInput, businessCategory) {
  const text = userInput || '';

  const keywordHit = KEYWORD_THEME.find(([pattern]) => pattern.test(text));
  if (keywordHit) {
    console.info(
      `[matchTheme] "${keywordHit[1]}" — stated preference in the input (${keywordHit[0]})`
    );
    return keywordHit[1];
  }

  const byCategory = CATEGORY_THEME[businessCategory];
  if (byCategory) {
    console.info(`[matchTheme] "${byCategory}" — category "${businessCategory}"`);
    return byCategory;
  }

  console.info(`[matchTheme] "${DEFAULT_THEME_ID}" — no strong signal, using the default`);
  return DEFAULT_THEME_ID;
}

export default matchTheme;
