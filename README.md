# AI-first WordPress onboarding — prototype

Demo/pitch prototype. No backend, no AI calls; generation is mocked.

```bash
npm start
```

Then open http://localhost:3000

**Review the transition in slow motion:** http://localhost:3000/?slow=8 — stretches the
whole reflow choreography 8x without changing its proportions. Any factor from 1–20.

---

## What's built

- **Entry screen** — single column, centered, chat-only.
- **The reflow** — single column to two columns, sequenced into beats (below).
- **Preview panel** — WP-style toolbar, static placeholder body.

Not built yet, by design: the loading choreography, the result canvas, the paywall.
Each has a marked seam waiting for it.

## The reflow, in beats

The transition is choreographed, not simultaneous. Animating the input's position, the
input's shape, the sidebar surface and the preview panel on one curve reads as a cut,
because there's no order to follow.

| Beat | At | What moves |
|---|---|---|
| `HOLD` | 0 | The headline fades out. **Nothing has moved yet.** |
| `DOCK` | 170ms | The input — and only the input — travels to its docked slot. |
| `SIDEBAR` | 520ms | The sidebar surface fades in around it; the conversation appears. |
| `REVEAL` | 820ms | The preview panel arrives in the space that opened up. |
| `SETTLED` | 1260ms | Layout final; the phase machine advances. |

Two things make this hold together:

1. **The column doesn't animate.** It jumps to its final geometry the instant `DOCK`
   starts — but at that moment it's invisible (no surface, no border, nothing inside it
   but the input), so the only motion the eye can follow is the input travelling. The
   travel animation lives on the composer itself, which carries `layout`.
2. **The preview panel's space is reserved from `DOCK`**, mounted but at opacity 0. So
   the input docks to its *true* final position and nothing shifts when the panel later
   appears.

All timings live in `src/design/motion.js` (`timeline`). Retiming the sequence is one
file, no component changes.

## Structure

```
src/
  design/motion.js          all motion tokens + the reflow timeline
  styles/tokens.css         all color/type/shape/layout tokens
  onboarding/
    OnboardingRouter.jsx    the switch: one session, one shell, path swapped underneath
    session/
      phases.js             phase machine + beats + layout predicates
      useOnboardingSession.js
    paths/
      intent.js             intake string -> intent (mock classifier)
      registry.js           intent -> path
      PromptPath.jsx        the one built path
  shell/                    reusable across every path
    Shell.jsx               viewport + stage + overlay layer
    StageLayout.jsx         the reflow
    chat/                   conversation column, composer slot, hero, messages
    composer/               composer + input-mode registry
    preview/                panel, toolbar, and the state switch
```

**Shell owns** layout, the reflow, the phase machine, the chrome.
**A path owns** what the assistant says, what the chrome is labelled, and what renders
inside the preview panel. Adding a path is a new descriptor plus one line in
`registry.js` — nothing above that line changes.

## Seams left open

| Seam | Where | How to turn it on |
|---|---|---|
| Loading choreography | `shell/preview/states/GeneratingSlot.jsx` | Flip `GENERATION_ENABLED` in `session/phases.js`; call `session.completeGeneration(draft)` when done. The layout transition is untouched. |
| Result canvas | `paths/PromptPath.jsx` → `Result` | Set it to a component. `PreviewStage` falls back to the placeholder while it's `null`. |
| Paywall | `OnboardingRouter.jsx` → `overlay` | `session.upgradeOpen` / `openUpgrade` / `closeUpgrade` already exist. |
| More entry inputs (URL paste, quick-start chips) | `shell/composer/inputModes.js` | Write the accessory, flip `enabled`. |
| More paths (import, explore) | `paths/registry.js` | Register a descriptor against an intent. `intent.js` already classifies both. |

## Design tokens

Styling is deliberately neutral placeholder — black/white/gray, system font, default
Tailwind spacing. Every visual value is a CSS variable in `src/styles/tokens.css`, mapped
to token names in `tailwind.config.js`. Components only reference token names
(`bg-surface`, `rounded-panel`, `text-ink-muted`), never raw values, so the real design
system swaps in by editing that one file.
