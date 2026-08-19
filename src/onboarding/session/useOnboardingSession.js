import { useCallback, useMemo, useReducer } from 'react';
import { Phase, Step } from './phases';
import { DEFAULT_PATH_ID, getPathById, pathIdForIntent } from '../paths/registry';
import { classifyIntent } from '../paths/classifyIntent';
import { detectIntent } from '../paths/intent';
import { initialGeneration, Phase as GenPhase, isGenerationComplete } from '../generation/activity';

let messageId = 0;
const nextId = () => `m${++messageId}`;

const createMessage = (author, body) => ({ id: nextId(), author, body });

const initialState = {
  phase: Phase.ENTRY,
  /** Which path is active. */
  pathId: DEFAULT_PATH_ID,
  /**
   * False while the classifier is still deciding. The builder waits on this,
   * so it never reveals content belonging to the wrong path.
   */
  pathResolved: true,
  /** What the classifier said, for debugging and for the chrome to read. */
  classification: null,
  /** Where the user is inside the active path. */
  step: Step.ENTRY,
  /** Whatever they gave us at the door — a description, or a URL. */
  intake: '',
  /**
   * Set only when the submitted text came from something that names its own
   * theme — right now, a tap on a showcase tile (see EntryScreen). `null` for
   * anything hand-typed or filled from a plain prompt chip, which fall back to
   * `matchTheme`'s own guess.
   */
  forcedThemeId: null,
  /**
   * Same idea as `forcedThemeId`, but for real photos instead of a whole
   * theme — a `{hero, story, ...}` map set when a chip or tile names its own
   * images for one or more slots (see EntryScreen and draft.js's `images`
   * option). `null` — or a slot missing from the map — renders that slot's
   * plain placeholder.
   */
  forcedImages: null,
  /**
   * The site is already settled, so the canvas draws it in one pass with no
   * skeletons and nothing to narrate. Two ways to get here: tapping a
   * finished template in the showcase, and approving a rebuilt site on the
   * migrate path — where the page has already been on screen in the
   * comparison view, and redrawing it section by section would look like it
   * was being made a second time.
   */
  instant: false,
  /**
   * A user pick from the completion picker (see palettes.js), independent of
   * the theme's own default colours. `null` renders whatever the theme's
   * `tokens` already set — picking a palette only overrides accent/surface,
   * never the theme's structure.
   */
  paletteId: null,
  /**
   * Same idea as `paletteId`, offered once the palette picker is skipped
   * (see fontPairings.js). `null` renders the theme's own `--font-serif`.
   */
  fontPairingId: null,
  /** Bumped by RESET_TEMPLATE; the pickers key off it so they remount. */
  templateVersion: 0,
  /**
   * Set once the template has been reset. The activity log narrates a build,
   * and after a reset there is no build left to narrate — the site is back to
   * how it started and the conversation begins again at the first question.
   */
  logHidden: false,
  /**
   * How many times the page has been rotated. The canvas turns this into an
   * order itself rather than being handed a list of indices, because it's the
   * only thing that knows how many sections there are — a template opened
   * straight from the showcase never reports them (see `instant`), so a
   * permutation built out here would be empty for exactly those pages.
   */
  sectionRotation: 0,
  /**
   * Bumped whenever the page should drop to skeletons and come back. Separate
   * from the rotation because resetting is also a change worth showing, and
   * that moves the rotation *back* to zero rather than forward.
   */
  reorderNonce: 0,
  messages: [],
  /** Mock generated site. Shape in paths/mock/draft.js */
  draft: null,
  /**
   * Shared generation state. The preview panel writes to it as sections render;
   * the chat panel's activity log reads from it. That one-way flow is what makes
   * the counter tick at the same moment the section appears.
   */
  generation: initialGeneration,
  upgradeOpen: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SUBMIT':
      return {
        ...state,
        phase: Phase.ACTIVE,
        pathId: action.pathId,
        pathResolved: action.resolved,
        classification: action.classification || null,
        intake: action.intake,
        forcedThemeId: action.themeId || null,
        forcedImages: action.images || null,
        instant: Boolean(action.instant),
        // A fresh submit is a fresh build, and a build gets narrated.
        logHidden: false,
        // A fresh submit starts from the theme's own colours and fonts again.
        paletteId: null,
        fontPairingId: null,
        messages: action.intake ? [createMessage('user', action.intake)] : [],
      };

    case 'RESOLVE_PATH':
      // Ignore a late classification if the session already moved on.
      if (state.phase !== Phase.ACTIVE || state.pathResolved) return state;
      return {
        ...state,
        pathId: action.pathId,
        pathResolved: true,
        classification: action.classification,
      };

    case 'SET_STEP':
      return { ...state, step: action.step };

    /**
     * "Use this version" on the migrate path. The rebuilt page has already
     * been on screen in the comparison view, so it moves to the result
     * without being drawn again — `instant` is what tells the canvas to skip
     * the skeletons, and it also puts the chat into the same after-the-build
     * state a picked template lands in: no log to show, and the palette and
     * type offered straight away.
     */
    case 'ACCEPT_RESULT':
      return { ...state, step: Step.RESULT, instant: true };

    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, createMessage(action.author, action.body)] };

    case 'SET_DRAFT':
      return { ...state, draft: action.draft };

    /* ── Generation progress ──────────────────────────────────────────────
     * The last four actions are driven by the preview panel's actual render
     * cycle, not by a clock.
     */

    case 'GENERATION_START':
      return { ...state, generation: { ...initialGeneration, active: true } };

    case 'GENERATION_THEME':
      return {
        ...state,
        generation: {
          ...state.generation,
          themeLabel: action.themeLabel,
          phase: GenPhase.CHOOSING,
        },
      };

    case 'GENERATION_RENDER_BEGIN':
      return { ...state, generation: { ...state.generation, phase: GenPhase.RENDERING } };

    case 'SECTIONS_RESOLVED':
      return { ...state, generation: { ...state.generation, total: action.total } };

    /**
     * A section has mounted, so it joins the list straight away — named, and
     * not yet done. That's what lets the list say which one is being written
     * rather than only counting the ones that finished.
     */
    case 'SECTION_BUILT':
      return {
        ...state,
        generation: {
          ...state.generation,
          built: state.generation.built + 1,
          sections: [...state.generation.sections, { label: action.label, done: false }],
        },
      };

    case 'SECTION_WRITTEN': {
      // Sections are revealed strictly one at a time (see ResultCanvas), so
      // the one finishing is always the earliest still open. Matching on that
      // rather than on the label keeps two identically-named sections from
      // ticking each other off.
      let closed = false;
      const sections = state.generation.sections.map((section) => {
        if (closed || section.done) return section;
        closed = true;
        return { ...section, done: true };
      });

      const generation = {
        ...state.generation,
        written: state.generation.written + 1,
        sections,
      };

      // No message is appended on completion. The summary renders from this
      // state instead, so each line can land with its section rather than the
      // whole thing arriving at the end.
      return {
        ...state,
        generation: { ...generation, active: !isGenerationComplete(generation) },
      };
    }

    case 'SET_PALETTE':
      return { ...state, paletteId: action.paletteId };

    case 'SET_FONT_PAIRING':
      return { ...state, fontPairingId: action.fontPairingId };

    case 'SET_UPGRADE_OPEN':
      return { ...state, upgradeOpen: action.open };

    /**
     * Puts the generated site back to how it was built — drops the palette
     * and font-pairing picks, and clearing the conversation back to the first
     * question. The draft and the step stay — the site is still there, it's
     * just back to how it was built. Distinct from RESET, which throws the
     * whole session away and returns to the entry screen.
     *
     * The conversation rewinds to its opening turn — what was asked for is
     * still true, so it stays; everything said after it was about choices
     * that have just been undone, so it goes. The build narration goes with
     * it (`logHidden`): it's a record of something that already happened and
     * isn't going to happen again this session. What's left is the original
     * prompt, and the first question put again underneath it.
     *
     * `templateVersion` is what the pickers key off, so they remount and
     * offer themselves fresh rather than staying on a stale selection.
     */
    case 'RESET_TEMPLATE':
      return {
        ...state,
        paletteId: null,
        fontPairingId: null,
        sectionRotation: 0,
        reorderNonce: state.reorderNonce + 1,
        templateVersion: state.templateVersion + 1,
        messages: state.messages.slice(0, 1),
        logHidden: true,
      };

    /**
     * Rotates the body of the page: the header stays first and the footer
     * stays last — moving either is a different request than "change order" —
     * and everything between shifts down by one, with the last of them coming
     * round to the top. Repeating the command keeps walking through
     * arrangements rather than flipping between two.
     */
    case 'REORDER_SECTIONS':
      return {
        ...state,
        sectionRotation: state.sectionRotation + 1,
        reorderNonce: state.reorderNonce + 1,
      };

    case 'RESET':
      return { ...initialState };

    default:
      return state;
  }
}

/**
 * The whole session: active path, step within it, conversation, draft.
 * Paths read from it and push into it; the shell only reads.
 */
export function useOnboardingSession() {
  const [state, dispatch] = useReducer(reducer, initialState);

  /**
   * Leaves the entry screen. There is one door and one input — where you end up
   * is inferred from what you wrote.
   *
   * Two stages. An unambiguous local signal (a pasted URL, "move my site")
   * routes immediately, with no round trip and nothing to wait for. Everything
   * else goes to the model classifier, which runs *in parallel with the exit
   * animation* — the transition starts the instant you hit enter, and the answer
   * only has to arrive before the builder reveals, ~930ms later.
   */
  const submit = useCallback((intake, options = {}) => {
    const text = (intake || '').trim();
    const { themeId = null, images = null, instant = false } = options;

    // A showcase pick names its own template, so there is nothing to infer —
    // it goes straight down the prompt path without waiting on the
    // classifier, which would only ever agree.
    if (instant) {
      dispatch({
        type: 'SUBMIT',
        intake: text,
        pathId: DEFAULT_PATH_ID,
        resolved: true,
        themeId,
        images,
        instant: true,
      });
      return;
    }

    const local = detectIntent(text);
    if (local) {
      console.info(`[intent] "${local.path}" — ${local.reason}`);
      dispatch({
        type: 'SUBMIT',
        intake: text,
        pathId: pathIdForIntent(local.path),
        resolved: true,
        classification: local,
        themeId,
        images,
      });
      return;
    }

    // Provisional path so the shell has something coherent to render while the
    // classifier is in flight. `resolved: false` holds the builder back.
    dispatch({
      type: 'SUBMIT',
      intake: text,
      pathId: DEFAULT_PATH_ID,
      resolved: false,
      themeId,
      images,
    });

    classifyIntent(text).then((classification) => {
      dispatch({
        type: 'RESOLVE_PATH',
        pathId: pathIdForIntent(classification.path),
        classification,
      });
    });
  }, []);

  const setStep = useCallback((step) => dispatch({ type: 'SET_STEP', step }), []);
  const acceptResult = useCallback(() => dispatch({ type: 'ACCEPT_RESULT' }), []);
  const addMessage = useCallback(
    (author, body) => dispatch({ type: 'ADD_MESSAGE', author, body }),
    []
  );

  /**
   * A turn typed into the docked composer. It's posted either way; what
   * follows depends on whether it asks for something this prototype can
   * actually do. Only one such request exists so far — reordering — so the
   * matching is deliberately literal rather than a parser pretending to be
   * more general than it is.
   */
  const sendMessage = useCallback((body) => {
    const text = (body || '').trim();
    if (!text) return;

    dispatch({ type: 'ADD_MESSAGE', author: 'user', body: text });

    if (/\b(change|swap|reorder|switch)\b[\s\S]*\border\b/i.test(text)) {
      dispatch({ type: 'REORDER_SECTIONS' });
      dispatch({
        type: 'ADD_MESSAGE',
        author: 'assistant',
        body: 'Reordering the sections — the header and footer stay where they are.',
      });
    }
  }, []);
  const setDraft = useCallback((draft) => dispatch({ type: 'SET_DRAFT', draft }), []);

  const startGeneration = useCallback(() => dispatch({ type: 'GENERATION_START' }), []);
  const noteThemeChosen = useCallback(
    (themeLabel) => dispatch({ type: 'GENERATION_THEME', themeLabel }),
    []
  );
  const beginRendering = useCallback(() => dispatch({ type: 'GENERATION_RENDER_BEGIN' }), []);
  const noteSectionsResolved = useCallback(
    (total) => dispatch({ type: 'SECTIONS_RESOLVED', total }),
    []
  );
  const noteSectionBuilt = useCallback(
    (label) => dispatch({ type: 'SECTION_BUILT', label }),
    []
  );
  const noteSectionWritten = useCallback(
    (label) => dispatch({ type: 'SECTION_WRITTEN', label }),
    []
  );
  const setPalette = useCallback(
    (paletteId) => dispatch({ type: 'SET_PALETTE', paletteId }),
    []
  );
  const setFontPairing = useCallback(
    (fontPairingId) => dispatch({ type: 'SET_FONT_PAIRING', fontPairingId }),
    []
  );
  const resetTemplate = useCallback(() => dispatch({ type: 'RESET_TEMPLATE' }), []);
  const openUpgrade = useCallback(() => dispatch({ type: 'SET_UPGRADE_OPEN', open: true }), []);
  const closeUpgrade = useCallback(() => dispatch({ type: 'SET_UPGRADE_OPEN', open: false }), []);
  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);

  const path = getPathById(state.pathId);

  return useMemo(
    () => ({
      ...state,
      path,
      submit,
      setStep,
      acceptResult,
      addMessage,
      sendMessage,
      setDraft,
      startGeneration,
      noteThemeChosen,
      beginRendering,
      noteSectionsResolved,
      noteSectionBuilt,
      noteSectionWritten,
      setPalette,
      setFontPairing,
      resetTemplate,
      openUpgrade,
      closeUpgrade,
      reset,
    }),
    // eslint-disable-next-line
    [state, path]
  );
}
