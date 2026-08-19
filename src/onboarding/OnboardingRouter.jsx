import React, { useState } from 'react';
import Shell from '../shell/Shell';
import EntryScreen from '../shell/EntryScreen';
import BuilderStage from '../shell/BuilderStage';
import ChatColumn from '../shell/chat/ChatColumn';
import ActivityLog from '../shell/chat/ActivityLog';
import ColorPalettePicker from '../shell/chat/ColorPalettePicker';
import PreviewPanel from '../shell/preview/PreviewPanel';
import PlansScreen from '../shell/upgrade/PlansScreen';
import { useOnboardingSession } from './session/useOnboardingSession';
import { previewStateForStep, Step, Phase } from './session/phases';
import { isGenerationComplete } from './generation/activity';
import { getRenderableTheme } from './themes/registry';
import { themeDefaultPalette, palettesForTheme } from './generation/palettes';
import { themeDefaultFontPairing } from './generation/fontPairings';

/**
 * THE SWITCH — one session, two screens, the active path swapped underneath.
 *
 * Which path is active is inferred entirely from what the user typed — a local
 * check for unambiguous signals like a pasted URL, then the model classifier
 * for everything else. Either way it's settled before the builder mounts, so
 * nothing downstream ever sees a provisional answer.
 */
export default function OnboardingRouter() {
  const session = useOnboardingSession();
  const path = session.path;
  const chrome = path.getChrome(session);
  const Flow = path.Flow;

  // Lives here, not in the preview panel — the app bar's icon cluster is the
  // one place that renders the switcher now, and the preview panel needs the
  // same value to know whether to frame itself as a phone.
  const [viewport, setViewport] = useState('desktop');

  // The flow fires the path's opening message and starts its generation timer,
  // so it must not mount until the path is final — otherwise a misrouted
  // session would greet you twice, in two different voices.
  const flowReady = session.phase !== Phase.ENTRY && session.pathResolved;

  // The picker's first tile is always whichever theme actually matched, read
  // fresh each render — never a fixed fifth palette.
  const theme = session.draft ? getRenderableTheme(session.draft.themeId) : null;
  const defaultPalette = themeDefaultPalette(theme);
  // Which alternates are worth offering depends on what kind of site it is.
  const paletteAlternates = palettesForTheme(theme);
  const defaultFontPairing = themeDefaultFontPairing(theme);

  /**
   * Whether this session had a build worth narrating. A site that arrived
   * whole — a showcase template, a migration the user approved, a template
   * reset back to its default — has no section-by-section story to tell.
   */
  const narrated =
    !session.instant &&
    !session.logHidden &&
    (session.generation.total > 0 || session.generation.active);

  /** There's a finished site on screen, so it can be recoloured and restyled. */
  const siteReady = narrated
    ? isGenerationComplete(session.generation)
    : session.instant || session.logHidden;

  // Same offer either way — only *when* it appears differs between a
  // generated site and one that arrived whole.
  const picker = (
    <ColorPalettePicker
      /* Remounts on a template reset, so the pickers offer themselves fresh
         instead of sitting on a selection that no longer applies. */
      key={session.templateVersion}
      selectedId={session.paletteId}
      onSelect={session.setPalette}
      defaultPalette={defaultPalette}
      alternates={paletteAlternates}
      fontPairingId={session.fontPairingId}
      onSelectFontPairing={session.setFontPairing}
      defaultFontPairing={defaultFontPairing}
    />
  );

  return (
    <>
      {flowReady && Flow && <Flow key={path.id} session={session} />}

      <Shell
        phase={session.phase}
        ready={session.pathResolved}
        entry={
          <EntryScreen
            key="entry"
            entry={path.entry}
            /* One door, one input. Where you land is inferred from what you
               typed — see session.submit and paths/intent.js. */
            onSubmit={session.submit}
            extra={path.EntryExtra ? <path.EntryExtra session={session} /> : null}
          />
        }
        builder={
          <BuilderStage
            key="builder"
            title={chrome.siteLabel || chrome.pageLabel}
            onLaunch={session.openUpgrade}
            /* The mark is the way out of the session entirely. */
            onHome={session.reset}
            actionsEnabled={session.step === Step.RESULT}
            viewport={viewport}
            onViewportChange={setViewport}
            chat={
              <ChatColumn
                messages={session.messages}
                onSubmit={session.sendMessage}
                onReset={session.resetTemplate}
                /* The log narrates the opening prompt, so it sits under it.
                   Skipped entirely when there was no build to narrate: a
                   template picked whole from the showcase, a rebuilt site
                   approved on the migrate path, or a template just reset
                   back to how it started. */
                activity={
                  !narrated ? null : (
                    <ActivityLog generation={session.generation} />
                  )
                }
                /* The pickers are the next thing being asked of the user, so
                   they belong after the conversation rather than pinned under
                   its first turn — which on the migrate path would bury them
                   above the scan's own messages. */
                trailing={siteReady ? picker : null}
              />
            }
            preview={
              <PreviewPanel
                state={previewStateForStep(session.step)}
                draft={session.draft}
                url={session.intake}
                paletteId={session.paletteId}
                fontPairingId={session.fontPairingId}
                instant={session.instant}
                sectionRotation={session.sectionRotation}
                reorderNonce={session.reorderNonce}
                /* Nothing is counting in instant mode, and reporting would
                   put the activity log back on screen by setting a total. */
                onSectionsResolved={session.instant ? undefined : session.noteSectionsResolved}
                onSectionBuilt={session.instant ? undefined : session.noteSectionBuilt}
                onSectionWritten={session.instant ? undefined : session.noteSectionWritten}
                onAccept={() => path.onAccept?.(session)}
                viewport={viewport}
              />
            }
          />
        }
        overlay={
          session.upgradeOpen ? (
            <PlansScreen key="plans" onBack={session.closeUpgrade} />
          ) : null
        }
      />
    </>
  );
}
