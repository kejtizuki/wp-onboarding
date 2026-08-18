import { useEffect, useRef } from 'react';
import { Step } from '../session/phases';
import { deriveBrand } from './mock/deriveBrand';
import { buildDraft } from './mock/draft';
import { getRenderableTheme } from '../themes/registry';
import photography1 from '../../images/photography1.jpg';
import clay from '../../images/clay.png';
import coworking from '../../images/coworking.jpg';
import cph from '../../images/cph.webp';
import mugs from '../../images/mugs.webp';
import galleryShelves from '../../images/kyle-ryan-nTifHA326v4-unsplash.jpg';
import gallery4 from '../../images/krisjanis-kazaks-MkAo2NmyZvI-unsplash.jpg';
import gallery5 from '../../images/annie-spratt-WlAXIKTIDN8-unsplash.jpg';
import gallery6 from '../../images/chandra-oh-uQtRtfFF4Qk-unsplash.jpg';
import gallery7 from '../../images/tanya-prodaan-g5J1wBzLbXw-unsplash.jpg';

/**
 * PATH 1 — "I know what I want."
 * Describe the business -> draft.
 */

/**
 * Steps 1 and 2 describe decisions taken before anything can be drawn, so they
 * are the only timed part of generation — deliberately brief. Everything after
 * this is driven by the preview panel's actual render cycle.
 */
const READING_MS = 550;
const CHOOSING_MS = 550;

/**
 * Runs the path's opening beats, then gets out of the way: once the theme is
 * matched it flips the panel to RESULT and the canvas takes over reporting
 * progress section by section.
 */
function PromptFlow({ session }) {
  const {
    intake,
    forcedThemeId,
    forcedImages,
    instant,
    setStep,
    setDraft,
    startGeneration,
    noteThemeChosen,
    beginRendering,
  } = session;
  const started = useRef(false);

  useEffect(() => {
    /**
     * A template picked from the showcase is already decided — there is no
     * description to read and no layout to choose, so narrating either would
     * be theatre over a foregone conclusion. Draft it and show it.
     */
    if (instant) {
      if (started.current) return undefined;
      started.current = true;
      setDraft(
        buildDraft(intake, {
          origin: 'prompt',
          themeId: forcedThemeId || undefined,
          images: forcedImages || undefined,
        })
      );
      setStep(Step.RESULT);
      return undefined;
    }

    // StrictMode double-invokes mount effects. One-shot state changes are
    // guarded; the timers sit OUTSIDE the guard because the first pass's
    // cleanup clears them and the second pass has to re-arm them.
    if (!started.current) {
      started.current = true;
      startGeneration();
      setStep(Step.GENERATING);
    }

    // Step 1 → 2: the description has been read, a layout is being picked.
    const toChoosing = setTimeout(() => {
      // A showcase-tile prompt names its own theme, and a chip or tile can
      // separately name real photos for one or more slots — see EntryScreen's
      // forced-theme and forced-image plumbing. Everything else still goes
      // through matchTheme and each slot's plain placeholder.
      const draft = buildDraft(intake, {
        origin: 'prompt',
        themeId: forcedThemeId || undefined,
        images: forcedImages || undefined,
      });
      setDraft(draft);
      noteThemeChosen(getRenderableTheme(draft.themeId).label);
    }, READING_MS);

    // Step 2 → 3: hand off to the canvas. From here the log is render-driven.
    const toRendering = setTimeout(() => {
      beginRendering();
      setStep(Step.RESULT);
    }, READING_MS + CHOOSING_MS);

    return () => {
      clearTimeout(toChoosing);
      clearTimeout(toRendering);
    };
    // Mount-only: the flow runs once per submit.
  }, []); // eslint-disable-line

  return null;
}

const promptPath = {
  id: 'prompt',
  chipLabel: 'I know what I want',

  entry: {
    title: 'What are you building?',
    // Mentions pasting an address because that's now the only signpost to the
    // migrate path — there are no longer chips to advertise it.
    subtitle:
      "One sentence about your business — or paste the address of a site you already have. You'll have something real to look at before you create an account.",
    placeholder: 'A ceramics studio in Porto that runs weekend workshops',
    submitLabel: 'Draft my site',
    inputType: 'text',

    /**
     * Chips that type their sentence into the field rather than submitting it
     * — the user still has to send it themselves. Chosen so the three land on
     * three different themes — artisanal, editorial, modern grid — which makes
     * the theme matcher visible without anyone having to guess a phrasing that
     * triggers it.
     */
    examples: [
      {
        title: 'Ceramics studio',
        prompt:
          'An earthy landing page for my ceramics studio, with a gallery and a way to buy my mugs',
        // Real photos for every image slot the theme has — the product grid
        // already gets real mugs too (see draft.js's `ITEMS_BY_TYPE`), so
        // this chip is the one that's real, start to finish.
        images: { hero: clay, offering: mugs, story: cph },
      },
      {
        title: 'Blog about photography',
        prompt:
          'A personal photography blog, with galleries from each trip and some writing about the process',
        // A real hero photo plus a full set for the photo wall — everything
        // else renders each theme's plain placeholder. See draft.js's
        // `images` option.
        images: {
          hero: photography1,
          gallery: [galleryShelves, gallery4, gallery5, gallery6, gallery7],
        },
      },
      {
        title: 'Design agency in London',
        prompt:
          'A clean site for my design agency, with our work, services, and a way to get in touch',
        // The studio itself, in the cover — an agency's own room is the one
        // photograph it always has. Everything else stays a placeholder.
        images: { hero: coworking },
      },
    ],
  },

  Flow: PromptFlow,

  getChrome(session) {
    const brand = session.intake ? deriveBrand(session.intake) : null;
    return {
      pageLabel: 'Home',
      siteLabel: brand ? `${brand.name} · Homepage` : 'Homepage',
    };
  },
};

export default promptPath;
