import React from 'react';

/**
 * One mock theme preview.
 *
 * Two ways a theme can supply its picture: a real screenshot (`image`), or a
 * `kind` naming one of the small CSS compositions below. Most entries use the
 * drawn version — it keeps the bundle free of a dozen screenshots, scales
 * cleanly at any size, and reads clearly at thumbnail scale, which a photo-
 * heavy screenshot often doesn't. Reach for `image` when a real one is on hand
 * and worth the extra weight.
 */

const bar = (w, h, color, extra = {}) => ({
  width: w,
  height: h,
  background: color,
  borderRadius: 1,
  ...extra,
});

function Composition({ kind, bg, accent, ink }) {
  switch (kind) {
    case 'serif-name':
      return (
        <div className="flex h-full flex-col items-center p-[8%]">
          <div
            className="w-full text-center font-serif leading-none"
            style={{ color: ink, fontSize: 'clamp(11px, 17%, 26px)' }}
          >
            Pâtisserie
          </div>
          <div className="mt-[5%] flex w-full justify-between px-[6%]">
            {[0, 1, 2].map((i) => (
              <div key={i} style={bar(18, 2, ink, { opacity: 0.7 })} />
            ))}
          </div>
          <div
            className="mt-[6%] w-full flex-1"
            style={{ background: 'rgba(255,255,255,0.9)', borderRadius: 2 }}
          />
        </div>
      );

    // Parr: a colour-block sidebar carrying the vertical wordmark, photography
    // filling the rest. The gradient stands in for the photo — sky through to
    // sand — with two lines suggesting a horizon a photo would actually have.
    case 'split-photo':
      return (
        <div className="flex h-full">
          <div className="flex w-[30%] shrink-0 items-center justify-center p-[4%]">
            <div
              className="font-black uppercase leading-[0.75]"
              style={{
                color: ink,
                fontSize: 'clamp(10px, 15%, 20px)',
                writingMode: 'vertical-rl',
                transform: 'rotate(180deg)',
              }}
            >
              Parr
            </div>
          </div>
          <div
            className="relative flex-1"
            style={{
              background: `linear-gradient(200deg, ${accent} 0%, #d8e3ea 45%, #c9a97e 100%)`,
            }}
          >
            <div className="absolute inset-x-0 top-[35%] h-[2px]" style={{ background: '#0b2f4a', opacity: 0.45 }} />
            <div className="absolute inset-x-0 top-[42%] h-[2px]" style={{ background: '#0b2f4a', opacity: 0.3 }} />
          </div>
        </div>
      );

    // NotesLab: a dark pill nav, an oversized uppercase two-line headline, two
    // stat readouts, and a warped gradient band standing in for its distorted
    // photo strip.
    case 'type-lab':
      return (
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-end gap-[4%] p-[6%] pb-0">
            <div style={bar('30%', 2, ink, { opacity: 0.45 })} />
            <div className="rounded-[1px] px-[10%] py-[6%]" style={{ background: ink }}>
              <div style={bar(12, 2, '#fff')} />
            </div>
          </div>
          <div className="px-[6%] pt-[6%]">
            <div
              className="font-semibold uppercase leading-[0.95] tracking-tight"
              style={{ color: ink, fontSize: 'clamp(9px, 13%, 17px)' }}
            >
              NotesLab
              <br />A lab hub
            </div>
          </div>
          <div className="mt-[7%] flex gap-[10%] px-[6%]">
            {[
              ['142', 30],
              ['14', 20],
            ].map(([n, w]) => (
              <div key={n}>
                <div style={bar(w, 2, ink, { opacity: 0.4 })} />
                <div className="mt-[3px] font-semibold" style={{ color: ink, fontSize: 'clamp(9px, 12%, 15px)' }}>
                  {n}
                </div>
              </div>
            ))}
          </div>
          <div
            className="mt-auto w-full"
            style={{
              height: '32%',
              background: `linear-gradient(120deg, ${accent} 0%, #2b3a63 45%, #b9c25a 100%)`,
            }}
          />
        </div>
      );

    // HVACool: a black icon chip and a black nav pill up top, a big black card
    // carrying the headline in the accent colour, two pill CTAs below.
    case 'service-cta':
      return (
        <div className="flex h-full flex-col p-[7%]">
          <div className="flex items-center gap-[4%]">
            <div
              className="flex shrink-0 items-center justify-center rounded-[2px]"
              style={{ width: '15%', aspectRatio: '1/1', background: accent }}
            >
              <div style={{ width: '32%', height: '32%', background: bg }} />
            </div>
            <div className="flex-1 rounded-[2px] px-[5%] py-[4%]" style={{ background: accent }}>
              <div style={bar('75%', 2, bg, { opacity: 0.85 })} />
            </div>
          </div>
          <div className="mt-[7%] flex-1 rounded-[3px] p-[7%]" style={{ background: accent }}>
            <div className="font-bold leading-tight" style={{ color: bg, fontSize: 'clamp(8px, 11%, 14px)' }}>
              We deliver reliable, energy-smart heating and cooling.
            </div>
          </div>
          <div className="mt-[5%] flex gap-[4%]">
            {[0, 1].map((i) => (
              <div key={i} className="flex-1 rounded-[2px] py-[5%]" style={{ background: accent }}>
                <div className="mx-auto" style={bar('55%', 2, bg, { opacity: 0.8 })} />
              </div>
            ))}
          </div>
        </div>
      );

    case 'bold-type':
      return (
        <div className="flex h-full flex-col p-[7%]">
          <div
            className="font-black uppercase leading-none"
            style={{ color: ink, fontSize: 'clamp(12px, 19%, 28px)', letterSpacing: '-0.03em' }}
          >
            Rhea Moire
          </div>
          <div className="mt-[3%]" style={bar('40%', 2, ink, { opacity: 0.5 })} />
          <div className="mt-[5%] w-full flex-1" style={{ background: accent, borderRadius: 2 }} />
        </div>
      );

    case 'mondrian':
      return (
        <div className="grid h-full grid-cols-3 grid-rows-3 gap-[3px] p-[6%]">
          <div className="col-span-2" style={{ background: '#f2c500' }} />
          <div style={{ background: accent }} />
          <div style={{ background: '#f7f4ec', border: '1px solid #111' }} />
          <div className="col-span-2 row-span-2" style={{ background: accent }} />
          <div style={{ background: '#2b45c4' }} />
        </div>
      );

    case 'pitch':
      return (
        <div className="relative h-full overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `repeating-linear-gradient(90deg, rgba(255,255,255,0.14) 0 12px, transparent 12px 24px)`,
            }}
          />
          <div className="relative flex h-full flex-col justify-between p-[8%]">
            <div
              className="font-black uppercase"
              style={{ color: ink, fontSize: 'clamp(9px, 13%, 18px)' }}
            >
              Golazo
            </div>
            <div
              className="self-center rounded-full border-2"
              style={{ borderColor: accent, width: '34%', aspectRatio: '1/1', opacity: 0.8 }}
            />
            <div style={bar('58%', 3, accent, { opacity: 0.9 })} />
          </div>
        </div>
      );

    default:
      return null;
  }
}

export default function ThemeThumb({ theme }) {
  return (
    <figure className="m-0">
      <div
        className="w-full overflow-hidden rounded-nested border border-line"
        style={{ aspectRatio: '4 / 3', background: theme.bg }}
      >
        {theme.image ? (
          <img
            src={theme.image}
            alt=""
            // Decorative — the caption below already names the theme, and
            // `aria-hidden` on the whole showcase (see ThemeShowcase) means
            // screen readers skip this figure entirely.
            aria-hidden="true"
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <Composition {...theme} />
        )}
      </div>
      <figcaption className="mt-2 text-micro text-ink-subtle">{theme.name}</figcaption>
    </figure>
  );
}
