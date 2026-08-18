/**
 * Mock "understanding" of the intake string. Stands in for the model's
 * structured extraction — same output shape, no network.
 */

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'i', 'im', "i'm", 'we', 'my', 'our', 'this', 'is', 'for',
  'that', 'of', 'and', 'to', 'in', 'on', 'at', 'with', 'need', 'want', 'make',
  'build', 'create', 'site', 'website', 'page', 'new', 'small', 'local',
]);

const KNOWN_TYPES = [
  ['restaurant', 'Restaurant'], ['cafe', 'Café'], ['coffee', 'Coffee shop'],
  ['bakery', 'Bakery'], ['bar', 'Bar'], ['studio', 'Studio'],
  ['salon', 'Salon'], ['barber', 'Barbershop'], ['gym', 'Gym'],
  ['yoga', 'Yoga studio'], ['photograph', 'Photography'], ['portfolio', 'Portfolio'],
  ['shop', 'Shop'], ['store', 'Store'], ['boutique', 'Boutique'],
  ['consult', 'Consultancy'], ['agency', 'Agency'], ['law', 'Law practice'],
  ['clinic', 'Clinic'], ['dental', 'Dental practice'], ['plumb', 'Plumbing'],
  ['electric', 'Electrical services'], ['bookshop', 'Bookshop'],
  ['florist', 'Florist'], ['blog', 'Blog'], ['journal', 'Blog'], ['magazine', 'Blog'], ['newsletter', 'Newsletter'],
  ['ceramic', 'Ceramics studio'], ['bike', 'Bike shop'], ['pet', 'Pet care'],
  ['tutor', 'Tutoring'], ['catering', 'Catering'], ['brewery', 'Brewery'],
];

/**
 * Types that describe the kind of *site* rather than the kind of business.
 * When one of these is named explicitly it outranks any business noun in the
 * same sentence — see the note in deriveBrand.
 */
const PUBLISHING_TYPES = new Set(['Blog', 'Newsletter', 'Portfolio']);

const titleCase = (value) =>
  value.replace(/\b[a-z]/g, (char) => char.toUpperCase());

/**
 * @returns {{ name: string, type: string, place: string|null, source: string }}
 */
export function deriveBrand(intake) {
  const source = (intake || '').trim();
  const lower = source.toLowerCase();

  // Take the MOST SPECIFIC match, not the first one in the list. "a ceramics
  // studio" contains both "ceramic" and "studio"; picking by array position
  // made it a generic Studio, which then lost it the goods grid downstream.
  // Longest label wins: Ceramics studio > Studio, Bookshop > Shop, Barbershop > Bar.
  const matches = KNOWN_TYPES.filter(([needle]) => lower.includes(needle));

  // ...except when they name the *kind of site*. "a photography blog" is a
  // blog that happens to be about photography, not a photography business, and
  // longest-label alone would call it Photography.
  const publishing = matches.find(([, label]) => PUBLISHING_TYPES.has(label));

  const typeMatch = publishing || matches.sort((a, b) => b[1].length - a[1].length)[0];
  const type = typeMatch ? typeMatch[1] : 'Business';

  // "... in Lisbon", "... in the Mission" → a place we can name in the copy.
  const placeMatch = source.match(/\bin ([A-Z][\w'-]+(?: [A-Z][\w'-]+)?)/);
  const place = placeMatch ? placeMatch[1] : null;

  const words = source
    .replace(/[^\w\s'-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .filter((word) => !STOP_WORDS.has(word.toLowerCase()));

  const name = words.length ? titleCase(words.slice(0, 3).join(' ')) : 'Your site';

  return { name, type, place, source };
}

export default deriveBrand;
