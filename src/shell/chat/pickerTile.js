import cx from '../../lib/cx';

/**
 * The palette picker and the font picker ask the same shape of question, so
 * they answer it with the same tile — one definition, imported by both, rather
 * than two that merely started out matching.
 *
 * Selection is a 2px ink border. The border is always there and only its
 * colour changes, so switching it on can't nudge the swatches or the
 * letterforms by a pixel — the thing being chosen has to hold still while
 * you compare it against the others.
 */
export const pickerTile = (active) =>
  cx(
    'rounded-[8px] border-2 bg-[#F6F7F7] p-2 transition-colors duration-fast ease-standard',
    active ? 'border-[#1F1F1F]' : 'border-transparent hover:border-line-strong'
  );

export default pickerTile;
