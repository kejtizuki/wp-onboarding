import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PreviewStageState } from '../../onboarding/session/phases';
import ResultCanvas from './states/ResultCanvas';
import BeforeAfter from './states/BeforeAfter';
import { fade } from '../../design/motion';

/**
 * The body of the preview panel, and the only place that decides what's in it.
 *
 * There is deliberately no loading state here. While a path is deciding what to
 * build, this surface stays empty — the work is narrated in the chat's activity
 * log instead, and the panel's only job is to show the site arriving.
 */
export default function PreviewStage({
  state,
  draft,
  url,
  onAccept,
  compact = false,
  paletteId,
  fontPairingId,
  instant = false,
  sectionRotation = 0,
  reorderNonce = 0,
  uploads = null,
  onSectionsResolved,
  onSectionBuilt,
  onSectionWritten,
}) {
  return (
    <div className="relative min-h-0 flex-1 overflow-hidden">
      {/* Crossfade, not `mode="wait"`. The states are absolutely positioned so
          overlapping is fine — and waiting would gate mounting the result on the
          previous state's exit animation completing, which strands the panel if
          that animation ever stalls. */}
      <AnimatePresence initial={false}>
        <motion.div
          key={state}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={fade}
          className="absolute inset-0"
        >
          {state === PreviewStageState.COMPARE && (
            <BeforeAfter draft={draft} url={url} onAccept={onAccept} />
          )}
          {state === PreviewStageState.RESULT && (
            <ResultCanvas
              draft={draft}
              compact={compact}
              paletteId={paletteId}
              fontPairingId={fontPairingId}
              instant={instant}
              sectionRotation={sectionRotation}
              reorderNonce={reorderNonce}
              uploads={uploads}
              onSectionsResolved={onSectionsResolved}
              onSectionBuilt={onSectionBuilt}
              onSectionWritten={onSectionWritten}
            />
          )}
          {/* IDLE and GENERATING render nothing — an empty page, filling in. */}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
