import { deriveBrand } from './deriveBrand';
import { matchTheme } from '../../themes/matchTheme';
import mug1 from '../../../images/mug1.webp';
import mug2 from '../../../images/mug2.webp';
import mug3 from '../../../images/mug3.webp';
import mug4 from '../../../images/mug4.webp';
import mug5 from '../../../images/mug5.webp';

/**
 * Mock site generation. Stands in for the model — same output shape, no network.
 *
 * The draft is a CONTENT MODEL, not a page. It holds named slots (`hero`,
 * `offering`, `story`, `testimonial`, `items`) and says nothing about order,
 * columns, or composition — that's the theme's job. Any draft can render in any
 * theme, which is what makes theme selection meaningful rather than cosmetic.
 */

const NAV_BY_TYPE = {
  Restaurant: ['Menu', 'Book a table', 'About', 'Find us'],
  Café: ['Menu', 'Our beans', 'Visit', 'Contact'],
  'Coffee shop': ['Menu', 'Our beans', 'Visit', 'Contact'],
  Bakery: ['Today’s bakes', 'Order', 'About', 'Visit'],
  'Ceramics studio': ['Shop', 'Workshops', 'About', 'Visit'],
  Studio: ['Work', 'Services', 'About', 'Contact'],
  Photography: ['Portfolio', 'Services', 'About', 'Enquire'],
  Portfolio: ['Work', 'About', 'Contact'],
  Shop: ['Shop', 'New in', 'About', 'Contact'],
  Store: ['Shop', 'New in', 'About', 'Contact'],
  Gym: ['Classes', 'Membership', 'Trainers', 'Contact'],
  'Yoga studio': ['Classes', 'Timetable', 'Teachers', 'Contact'],
  Salon: ['Services', 'Book', 'Team', 'Contact'],
  Consultancy: ['Services', 'Case studies', 'About', 'Get in touch'],
  Agency: ['Work', 'Services', 'About', 'Contact'],
};

const DEFAULT_NAV = ['Home', 'Services', 'About', 'Contact'];

/** Categories with something physical to put in a grid. */
const SELLS_GOODS = new Set([
  'Ceramics studio',
  'Bakery',
  'Shop',
  'Store',
  'Boutique',
  'Florist',
  'Brewery',
  'Café',
  'Coffee shop',
]);

/**
 * Two copy voices. The content model has to work for every category, not just
 * the one the first theme was designed around — without this a running journal
 * gets described as "made slowly, in small batches, by hand".
 *
 * This is a content concern, deliberately separate from themes: any voice can
 * render in any theme.
 */
/**
 * Some category labels aren't countable nouns, so the copy reads badly dropped
 * straight into a sentence — "A photography.", "A portfolio.". These give those
 * types a phrase that works in running text.
 */
const SUBJECT_NOUNS = {
  Photography: 'photography studio',
  Portfolio: 'portfolio site',
  Catering: 'catering business',
  Plumbing: 'plumbing business',
  'Electrical services': 'electrical business',
  Tutoring: 'tutoring practice',
  'Pet care': 'pet care business',
};

/** Publishing types get their own voice — they have readers, not customers. */
const PUBLISHING_TYPES = new Set(['Blog', 'Newsletter', 'Portfolio']);

const MAKER_TYPES = new Set([
  ...['Ceramics studio', 'Bakery', 'Shop', 'Store', 'Boutique', 'Florist', 'Brewery'],
  ...['Café', 'Coffee shop', 'Studio', 'Photography'],
]);

const VOICES = {
  maker: (brand, where, lower, article) => ({
    heroBody: `${article} ${lower}${where}. Made slowly, in small batches, by hand.`,
    heroCta: 'See the collection',
    heroSecondary: 'Book a workshop',
    offeringTitle: 'What we make',
    offeringBody: `Everything that leaves ${brand.name} is made on site — thrown, trimmed, glazed and fired within a few metres of where you're standing.`,
    bullets: [
      'Made by hand, start to finish',
      'Small batches, never mass-produced',
      'Built for daily use, not display',
      'Repairs and replacements, always',
    ],
    offeringCta: 'Browse the shop',
    storyTitle: 'How we got here',
    storyBody: `${brand.name} started with one wheel and a borrowed kiln. It has grown, but not much — enough to open the doors to a few people each weekend, and no further.`,
    quote:
      'I came for a single mug and left having booked the workshop. Everything here is made like it is meant to last a lifetime.',
  }),

  publishing: (brand, where, lower, article) => ({
    heroBody: `${article} ${lower}${where}. New posts as they're written, and everything older kept online.`,
    heroCta: 'Read the latest',
    heroSecondary: 'Browse the archive',
    offeringTitle: "What you'll find here",
    offeringBody: `${brand.name} collects the writing and pictures worth keeping — published in full, with nothing held back for a signup.`,
    bullets: [
      'Long posts, not fragments',
      'Every year of the archive still online',
      'No signup to read anything',
      'Written and edited by one person',
    ],
    offeringCta: 'Start with the archive',
    storyTitle: 'Why this exists',
    storyBody: `${brand.name} began as somewhere to put things that were too long for anywhere else, and has stayed that way since.`,
    quote:
      'One of the few sites I still read start to finish. No tricks, no interruptions — just the writing.',
  }),

  service: (brand, where, lower, article) => ({
    heroBody: `${article} ${lower}${where}. Here's what we do, who it's for, and how to start.`,
    heroCta: 'Get in touch',
    heroSecondary: 'See our work',
    offeringTitle: 'What we do',
    offeringBody: `${brand.name} works with a small number of clients at a time, which means the person you meet first is the person who does the work.`,
    bullets: [
      'A single point of contact throughout',
      'Fixed scope, agreed before we start',
      'Progress you can see, not just report on',
      'No lock-in, ever',
    ],
    offeringCta: 'See how we work',
    storyTitle: 'How we got here',
    storyBody: `${brand.name} began as a favour for one client and turned into the whole thing. We have stayed deliberately small since.`,
    quote:
      'They understood the problem faster than we could explain it, and the work landed early. We have not looked elsewhere since.',
  }),
};

const ITEMS_BY_TYPE = {
  // Real photos, not the generic grey placeholder — the one category with
  // its own product shots on hand. Every other type still renders `Figure`'s
  // plain box, same as before.
  'Ceramics studio': [
    ['Painted mug', 'Stoneware · 300ml', mug1],
    ['Speckled mug', 'Stoneware · 300ml', mug2],
    ['Ridged mug', 'Stoneware · 280ml', mug3],
    ['Glazed mug', 'Stoneware · 320ml', mug4],
    ['Studio mug', 'Stoneware · 300ml', mug5],
  ],
  Bakery: [
    ['Sourdough loaf', 'Baked daily'],
    ['Cardamom bun', 'Weekends only'],
    ['Rye tin', '48-hour ferment'],
    ['Baking class', 'Monthly · 4 hours'],
  ],
};

const DEFAULT_ITEMS = [
  ['Signature piece', 'Made to order'],
  ['Everyday range', 'In stock'],
  ['Seasonal edit', 'Limited run'],
  ['Gift card', 'Any amount'],
];

export function buildDraft(intake, options = {}) {
  const { origin = 'prompt' } = options;
  const brand = deriveBrand(intake);
  const where = brand.place ? ` in ${brand.place}` : '';
  const lower = (SUBJECT_NOUNS[brand.type] || brand.type).toLowerCase();

  const items = (ITEMS_BY_TYPE[brand.type] || DEFAULT_ITEMS).map(([name, meta, image]) => ({
    name,
    meta,
    image,
  }));

  const article = /^[aeiou]/i.test(lower) ? 'An' : 'A';
  const voiceName = PUBLISHING_TYPES.has(brand.type)
    ? 'publishing'
    : MAKER_TYPES.has(brand.type)
      ? 'maker'
      : 'service';
  const voice = VOICES[voiceName](brand, where, lower, article);

  return {
    origin, // 'prompt' | 'migrate' | 'explore'

    /** Which layout structure this content is laid out in. */
    themeId: options.themeId || matchTheme(intake, brand.type),

    siteName: brand.name,
    type: brand.type,
    place: brand.place,
    sellsGoods: SELLS_GOODS.has(brand.type),
    nav: NAV_BY_TYPE[brand.type] || DEFAULT_NAV,

    hero: {
      eyebrow: brand.place ? `${brand.type} · ${brand.place}` : brand.type,
      title: brand.name,
      body: voice.heroBody,
      cta: voice.heroCta,
      secondaryCta: voice.heroSecondary,
      // Set only when the prompt came from something that names its own
      // photos for this slot — a showcase tile or a chip (see EntryScreen's
      // forced-image plumbing). Everything else renders the theme's plain
      // placeholder.
      image: options.images?.hero,
    },

    offering: {
      title: voice.offeringTitle,
      body: voice.offeringBody,
      bullets: voice.bullets,
      cta: voice.offeringCta,
      image: options.images?.offering,
    },

    story: {
      title: voice.storyTitle,
      body: voice.storyBody,
      cta: 'Read our story',
      image: options.images?.story,
    },

    testimonial: {
      quote: voice.quote,
      attribution: brand.place ? `A regular, ${brand.place}` : 'A regular',
    },

    items,

    // Page-level, not one section's content — only set when the prompt named
    // its own set of photos (see EntryScreen's forced-image plumbing). No
    // theme composes a gallery section unconditionally, so this is `undefined`
    // for everyone else.
    gallery: options.images?.gallery,

    footer: `© ${new Date().getFullYear()} ${brand.name}`,
  };
}

export default buildDraft;
