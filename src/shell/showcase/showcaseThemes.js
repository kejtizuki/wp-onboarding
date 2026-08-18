import hvacoolScreenshot from '../../images/image1.png';
import parrScreenshot from '../../images/image2.png';
import golazoScreenshot from '../../images/golazo.png';
import lenteScreenshot from '../../images/lente.png';
import noteslabScreenshot from '../../images/noteslab.png';
import primariumScreenshot from '../../images/primarium.png';
import sankofaScreenshot from '../../images/sankofa.png';
import stijlScreenshot from '../../images/stijl.png';
import moireScreenshot from '../../images/moire.png';
import patisserieScreenshot from '../../images/patisserie.png';
import aurielScreenshot from '../../images/auriel.png';
import clairevoyantScreenshot from '../../images/claire.png';
import nouvelleScreenshot from '../../images/nouvelle.png';
import retrospectScreenshot from '../../images/retrospecs.png';
import bysshePoetryScreenshot from '../../images/bysshe.png';

/**
 * SHOWCASE THUMBNAILS
 *
 * Mock theme previews for the entry screen's side columns. Each is a recipe —
 * a `kind` the renderer knows how to draw, plus its own palette — OR a real
 * screenshot via `image`. A theme with `image` skips the drawn composition
 * entirely; `kind` (when present alongside an image) is inert, kept only so the
 * CSS version is one edit away if the file ever goes missing. `bg` is never
 * inert — it's the wrapper's own background, so it still shows for a moment
 * while the image loads.
 *
 * `image` takes a bundler-resolved import (above), not a string path. Webpack
 * rewrites that import to a hashed URL under /static/media/ at build time; a
 * plain string path would point at dev-server-relative `/src/images/...`,
 * which 404s once the app is built.
 *
 * ⚠️ The drawn compositions' colours are deliberately NOT design tokens, and
 * that's the one place in the app where that's true. They depict *other
 * people's* designs — the point is that they look nothing like each other and
 * nothing like our UI. A token here would flatten exactly the variety that
 * makes the wall work.
 *
 * Status: all 15 tiles are real screenshots. `kind` is now purely a fallback
 * (a couple of entries keep one so the CSS version is one edit away if a file
 * ever goes missing) — no entry currently renders its drawn composition.
 *
 * `prompt` is what a click on the tile fills into the composer: a one-sentence
 * brief in the same voice as the example chips, written to evoke that tile's
 * visual style rather than to describe the screenshot itself — clicking Parr
 * doesn't ask for "Parr", it asks for the kind of site Parr's look suggests.
 *
 * `themeId`, when present, forces that structural theme instead of leaving it
 * to `matchTheme`'s guess — see EntryScreen's forced-theme plumbing and
 * themes/notesLab.js, currently the only entry that sets it.
 */
export const SHOWCASE_THEMES = [
  {
    // Was a drawn placeholder called Eventure — replaced by the real site,
    // which is a wedding page, not an events banner. Renamed rather than
    // stuffed behind a mismatched label.
    name: 'Auriel',
    image: aurielScreenshot,
    bg: '#4a5a4d',
    prompt: 'A romantic wedding site for our big day, with a full-bleed photo and simple RSVP details',
  },
  {
    name: 'Patisserie',
    image: patisserieScreenshot,
    kind: 'serif-name',
    bg: '#4b46d4',
    accent: '#ffffff',
    ink: '#ffffff',
    prompt: 'A charming site for my patisserie, with warm pastry photography and our opening hours',
  },
  {
    name: 'Parr',
    image: parrScreenshot,
    kind: 'split-photo',
    bg: '#e9542a',
    accent: '#2f6ea8',
    ink: '#111111',
    prompt: 'A bold editorial site for my documentary photography, with a striking color-block sidebar',
  },
  {
    name: 'NotesLab',
    image: noteslabScreenshot,
    kind: 'type-lab',
    bg: '#f2f0ea',
    accent: '#6b5a2a',
    ink: '#2a1a2e',
    prompt: 'A clean hub for my research lab, with published papers and a distorted cover image',
    // The one tile wired to a real structural theme (see themes/notesLab.js)
    // rather than a guess from matchTheme — the generated preview actually
    // looks like this screenshot instead of falling back to a generic layout.
    themeId: 'notes-lab',
  },
  {
    // Was Substrata (drawn 'archive' composition) — replaced by the real
    // Clairevoyant site, an aura-study essay grid.
    name: 'Clairevoyant',
    image: clairevoyantScreenshot,
    bg: '#eeeae2',
    prompt: 'A dreamy essay blog on healing and energy, with soft gradient auras throughout',
  },
  {
    // Was Maizymas (drawn 'folk' composition) — replaced by the real
    // Nouvelle site, an art nouveau archive.
    name: 'Nouvelle',
    image: nouvelleScreenshot,
    bg: '#2f2a1a',
    prompt: 'An ornate archive for my illustrated stories, with an art nouveau, storybook feel',
  },
  {
    // Was Beep (drawn 'terminal' composition) — replaced by the real
    // Retrospect site, a casual-photography blog.
    name: 'Retrospect',
    image: retrospectScreenshot,
    bg: '#f7f5f2',
    prompt: 'A casual photo journal for everyday beauty, with big images and a simple sidebar',
  },
  {
    // Was Punk (drawn 'halftone' composition, no screenshot ever supplied) —
    // swapped out for Bysshe, a minimal poetry site.
    name: 'Bysshe',
    image: bysshePoetryScreenshot,
    bg: '#fdfcfa',
    prompt: 'A quiet home for my poetry, with a single tall photo and nothing else to distract',
  },
  {
    name: 'Moire',
    image: moireScreenshot,
    kind: 'bold-type',
    bg: '#ffffff',
    accent: '#1fb6c9',
    ink: '#000000',
    prompt: 'A minimal portfolio for my fashion work, with oversized type and one striking portrait',
  },
  {
    name: 'HVACool',
    image: hvacoolScreenshot,
    kind: 'service-cta',
    bg: '#e6fa5a',
    accent: '#141a12',
    ink: '#141a12',
    prompt: 'A punchy site for my HVAC business, with bold color and clear ways to book a call',
  },
  {
    name: 'Stijl',
    image: stijlScreenshot,
    kind: 'mondrian',
    bg: '#f7f4ec',
    accent: '#e02020',
    ink: '#111111',
    prompt: 'A geometric design blog, with primary colors and a strict modernist grid',
  },
  {
    name: 'Golazo',
    image: golazoScreenshot,
    kind: 'pitch',
    bg: '#1fa84a',
    accent: '#ffffff',
    ink: '#0b3d1c',
    prompt: 'A bold blog about football culture, with striped textures and a confident wordmark',
  },
  {
    name: 'Lente',
    image: lenteScreenshot,
    // No drawn fallback — this one only ever appears as the photograph.
    bg: '#0d1b2a',
    prompt: 'A blurred, cinematic photo magazine, with a long contributor list and moody type',
  },
  {
    name: 'Primarium',
    image: primariumScreenshot,
    bg: '#eef1fa',
    prompt: 'A handwritten-feeling personal blog, with small observations recorded slowly',
  },
  {
    name: 'Sankofa',
    image: sankofaScreenshot,
    bg: '#e9cf58',
    prompt: 'A vivid archive of afrofuturist art, with a bold color grid and striking covers',
  },
];
