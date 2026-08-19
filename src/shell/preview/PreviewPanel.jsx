import React from 'react';
import { motion } from 'framer-motion';
import cx from '../../lib/cx';
import PreviewStage from './PreviewStage';
import { PreviewStageState } from '../../onboarding/session/phases';
import { settle } from '../../design/motion';

/**
 * PREVIEW PANEL — the dominant surface once the layout has reflowed.
 * Carries no chrome of its own — the app bar owns the viewport switcher, the
 * page name, and the session actions now (see `shell/AppBar.jsx`), so this
 * panel is just the site content sitting inside its shadowed surface.
 */
export default function PreviewPanel({
  state = PreviewStageState.IDLE,
  draft,
  url,
  onAccept,
  paletteId,
  fontPairingId,
  instant = false,
  sectionRotation = 0,
  reorderNonce = 0,
  uploads = null,
  onSectionsResolved,
  onSectionBuilt,
  onSectionWritten,
  viewport = 'desktop',
}) {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-panel border-4 border-white bg-surface shadow-panel">
      {/* Sunken only behind a full-width page, where it reads as the canvas
          the site sits on. In mobile the phone frame is the object of
          attention and the surround is just margin — white, so the frame
          isn't a lighter card floating on a grey field. */}
      <div
        className={cx(
          'flex min-h-0 flex-1 justify-center',
          viewport === 'mobile' ? 'bg-surface' : 'bg-surface-sunken'
        )}
      >
        <motion.div
          layout
          transition={settle}
          className={cx(
            'flex min-h-0 w-full flex-col bg-surface',
            viewport === 'mobile'
              ? 'my-3 max-w-[24rem] overflow-hidden rounded-nested border border-line shadow-composer'
              : 'max-w-none'
          )}
        >
          <PreviewStage
            state={state}
            draft={draft}
            url={url}
            onAccept={onAccept}
            paletteId={paletteId}
            fontPairingId={fontPairingId}
            instant={instant}
            sectionRotation={sectionRotation}
            reorderNonce={reorderNonce}
            uploads={uploads}
            onSectionsResolved={onSectionsResolved}
            onSectionBuilt={onSectionBuilt}
            onSectionWritten={onSectionWritten}
            /* The mobile toggle narrows a container, not the viewport, so
               responsive utilities can't see it — sections need telling. */
            compact={viewport === 'mobile'}
          />
        </motion.div>
      </div>
    </div>
  );
}
