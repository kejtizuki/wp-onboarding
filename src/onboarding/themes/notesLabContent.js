import noteslabBand from '../../images/noteslab-band.webp';
import member1 from '../../images/noteslab1.png';
import member2 from '../../images/noteslab3.png';
import member3 from '../../images/noteslab2.png';
import member4 from '../../images/noteslab4.png';

/**
 * NOTES LAB — fixed content.
 *
 * Every other theme lays out whatever the draft generated from what someone
 * typed. This theme doesn't: it exists to answer one question — "if I click
 * this tile, do I get *this*?" — so its sections carry their own content
 * instead of reading a slot off the draft. See ResultCanvas's `spec.content`
 * fallback and sections/index.jsx's new renderers.
 *
 * Copy here is written fresh, not transcribed from the reference screenshot —
 * same spirit (a research lab publishing notes, papers and open projects),
 * different sentences throughout. `bandImage` is the one exception: the
 * reference's actual distorted cover, dropped in once the file existed —
 * see Figure's `image` prop, which is what renders it.
 */

export const LAB_NAV = {
  items: ['The lab', 'Notes', 'Publications'],
  cta: 'Resources',
};

export const LAB_HERO = {
  brand: 'NotesLab®',
  headline: 'A lab hub for discoveries, publications, and resources.',
  body: 'An open research group publishing as it works, not just when a paper lands.',
  linkLabel: 'Read more',
  stats: [
    { value: '142', label: 'Published papers' },
    { value: '14', label: 'Research fellows' },
  ],
  bandImage: noteslabBand,
};

export const MISSION = {
  eyebrow: 'Mission',
  statement: 'We publish findings, field notes, and reusable data to support open research.',
  description:
    'An independent research group studying how environmental change shows up in daily life, and how communities respond to it in practice.',
};

export const LATEST_NOTES = {
  eyebrow: 'Latest notes',
  archiveLabel: 'View archive',
  posts: [
    {
      date: 'Feb 22, 2026',
      title: 'From field notes to reusable data',
      teaser:
        'A lightweight workflow for cleaning, labelling and versioning documentation so it holds up months later.',
      author: 'J. Alaoui',
      readTime: '5 min',
    },
    {
      date: 'Feb 21, 2026',
      title: 'How we label field observations',
      teaser:
        'The small naming decisions — site IDs, event logs, timestamps — that make a dataset usable by someone else.',
      author: 'J. Alaoui',
      readTime: '3 min',
    },
  ],
};

export const CURRENT_PROJECTS = {
  eyebrow: 'Current projects',
  archiveLabel: 'View projects',
  projects: [
    { date: 'Jan 12, 2026', title: 'Field Notes Index (pilot)', tag: 'Writing' },
    { date: 'Dec 16, 2025', title: 'Water Access Field Logs', tag: 'Urban heat' },
    { date: 'Oct 6, 2025', title: 'Low-Connectivity Survey Toolkit', tag: 'Methods' },
  ],
};

export const TEAM = {
  eyebrow: 'Meet the lab',
  heading: 'Meet the people behind NotesLab',
  /* The reference's own plates — one halftone per fellow, each in the hue the
     flat tint here used to stand in for, so the four still read apart at a
     glance the way they did before. */
  members: [
    {
      name: 'Dr. Samira Reyes',
      role: 'Principal investigator',
      tags: 'Field methods, open data',
      image: member1,
    },
    {
      name: 'Niamh Doran',
      role: 'PhD researcher',
      tags: 'Water access, mapping',
      image: member2,
    },
    {
      name: 'Ciarán Boyle',
      role: 'Research assistant',
      tags: 'Sensors, data cleaning',
      image: member3,
    },
    {
      name: 'Amina Yusuf',
      role: 'Postdoctoral fellow',
      tags: 'Coastal change, risk',
      image: member4,
    },
  ],
  collaborate: {
    eyebrow: 'Work with us',
    body: 'Open to researchers, community groups and public agencies who want to use or contribute data.',
  },
  acknowledgements: {
    eyebrow: 'Acknowledgements',
    body: 'Supported by a mix of institutional and project-based funding, listed on each project page.',
  },
};

export const NEWSLETTER = {
  eyebrow: 'Newsletter',
  headline: 'Stay updated on our research.',
  body: 'Occasional notes on published papers, open datasets, and what the lab is working on.',
  disclaimer: 'By subscribing you agree to receive email updates. Unsubscribe any time.',
  submitLabel: 'Subscribe',
  socialLinks: ['GitHub', 'Mastodon', 'Twitter / X'],
  credit: 'Designed with WordPress.',
};
