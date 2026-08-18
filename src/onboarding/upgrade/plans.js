/**
 * THE PLANS SCREEN'S DATA
 *
 * Transcribed from WordPress.com's own onboarding plans step, prices included
 * — this is a prototype of that screen, so the copy is the product's rather
 * than something invented to stand in for it. Złoty because that's the
 * currency the reference was captured in; a real build would take this from
 * the pricing API along with the locale.
 *
 * `highlight` fills the CTA and is what "Most popular"/"Best value" sit above.
 * A `tag` on a feature is the little pill to its right.
 */

export const CURRENCY = 'zł';

export const PLANS = [
  {
    id: 'free',
    name: 'Free',
    tagline: 'For exploring WordPress.',
    price: '0',
    priceNote: 'No expiration date',
    cta: 'Start with Free',
    storage: '1 GB storage',
    features: [{ label: 'Unlimited pages, posts, users, and visitors' }],
  },
  {
    id: 'personal',
    name: 'Personal',
    tagline: 'For making a personal site or blog truly yours.',
    specialOffer: true,
    price: '12',
    wasPrice: '14',
    priceNote: 'per month, zł 144 for your first year, then zł 168 billed annually, excl. taxes',
    cta: 'Get Personal',
    storage: '6 GB storage',
    features: [
      { label: 'Unlimited pages, posts, users, and visitors' },
      { label: 'Free domain for one year', tag: 'Free' },
      { label: 'No ads for visitors' },
      { label: 'Guided website builder (usage limits apply)' },
      { label: 'Dozens of premium themes' },
      { label: 'Free support' },
      { label: 'Extend your site with WordPress plugins' },
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    tagline: 'For creators and professionals building a credible presence.',
    badge: 'Most popular',
    highlight: true,
    specialOffer: true,
    price: '23',
    wasPrice: '33.25',
    priceNote: 'per month, zł 276 for your first year, then zł 399 billed annually, excl. taxes',
    cta: 'Get Premium',
    storage: '13 GB storage',
    features: [
      { label: 'Unlimited pages, posts, users, and visitors' },
      { label: 'Free domain for one year' },
      { label: 'No ads for visitors' },
      { label: 'Create your site with a guided website builder' },
      { label: 'All premium themes' },
      { label: 'Free support' },
      { label: 'Extend your site with WordPress plugins' },
      { label: 'Premium stats and analytics' },
      { label: 'Add payment buttons', tag: 'New' },
      { label: 'Upload videos' },
    ],
  },
  {
    id: 'business',
    name: 'Business',
    tagline: 'For businesses and developers who need powerful tools and priority support.',
    badge: 'Best value',
    badgeTone: 'dark',
    highlight: true,
    specialOffer: true,
    price: '72',
    wasPrice: '95.75',
    priceNote: 'per month, zł 864 for your first year, then zł 1,149 billed annually, excl. taxes',
    cta: 'Get Business',
    storage: '50 GB storage',
    storageAction: 'Add more',
    features: [
      { label: 'Unlimited pages, posts, users, and visitors' },
      { label: 'Free domain for one year' },
      { label: 'No ads for visitors' },
      { label: 'Create your site with a guided website builder' },
      { label: 'All premium themes' },
      { label: 'Free 24/7 priority expert support' },
      { label: 'Extend your site with WordPress plugins' },
      { label: 'Premium stats and analytics' },
      { label: 'Add payment buttons' },
      { label: 'Use VideoPress with 250GB dedicated storage' },
      { label: 'Built-in WordPress Agent' },
      { label: 'Free business email account for one year', tag: 'Email' },
      { label: 'Email marketing', tag: 'New' },
      { label: 'Free advertising credits worth $200' },
      { label: 'Real-time backups and one-click restores' },
      { label: 'SFTP/SSH, WP-CLI, Git commands, and GitHub Deployments' },
    ],
  },
  {
    id: 'commerce',
    name: 'Commerce',
    tagline: 'For merchants growing an online store.',
    specialOffer: true,
    price: '130',
    wasPrice: '172',
    priceNote: 'per month, zł 1,560 for your first year, then zł 2,064 billed annually, excl. taxes',
    cta: 'Get Commerce',
    storage: '50 GB storage',
    storageAction: 'Add more',
    features: [
      { label: 'Unlimited pages, posts, users, and visitors' },
      { label: 'Free domain for one year' },
      { label: 'No ads for visitors' },
      { label: 'Create your site with a guided website builder' },
      { label: 'Premium store themes' },
      { label: 'Free 24/7 priority expert support' },
      { label: 'Extend your site with WordPress plugins' },
      { label: 'Premium stats and analytics' },
      { label: 'Add payment buttons' },
      { label: 'Use VideoPress with 250GB dedicated storage' },
      { label: 'Built-in WordPress Agent' },
      { label: 'Free business email account for one year' },
      { label: 'Email marketing' },
      { label: 'Free advertising credits worth $200' },
      { label: 'Real-time backups and one-click restores' },
      { label: 'SFTP/SSH, WP-CLI, Git commands, and GitHub Deployments' },
      { label: 'Ecommerce tools and WooCommerce experience' },
      { label: 'Sell in 60+ countries' },
    ],
  },
];

/** The band under the grid — set as wordmarks, see PlansScreen. */
export const ENTERPRISE_LOGOS = [
  'slack',
  'USA TODAY CO.',
  'salesforce',
  'Meta',
  'INTUIT',
  'Capgemini',
  'News Corp',
  'SAMSUNG',
  'NASA',
];
