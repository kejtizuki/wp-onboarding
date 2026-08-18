import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import cx from '../../lib/cx';
import { Check, Cloud, WordPressMark } from '../../ui/Icons';
import { fade } from '../../design/motion';
import { PLANS, CURRENCY, ENTERPRISE_LOGOS } from '../../onboarding/upgrade/plans';

/**
 * THE PLANS SCREEN — WordPress.com's onboarding plans step.
 *
 * A full-bleed screen rather than a modal: it's a step in the flow, not an
 * interruption of one, and it has its own chrome (the mark, Back, Need help?)
 * because the builder's chrome doesn't apply while you're choosing a plan.
 *
 * The prices and copy come from `plans.js` verbatim — this screen's job is to
 * look like the real one, so nothing here is paraphrased.
 *
 * Everything is deliberately outside the app's own design tokens. Those
 * describe the builder; this is WordPress.com's marketing surface, and
 * borrowing the builder's palette for it would make it look like the
 * prototype rather than like the page it's standing in for.
 */

const BLUE = '#3858E9';

function Badge({ children, tone }) {
  return (
    <span
      className={cx(
        'absolute -top-3 left-6 rounded-[4px] px-2 py-1 text-[12px] font-medium leading-none',
        tone === 'dark' ? 'bg-[#101517] text-white' : 'border border-[#DCDCDE] bg-white text-[#1E1E1E]'
      )}
    >
      {children}
    </span>
  );
}

/** The little green pill beside a feature, and the "Special Offer" flag. */
function Pill({ children }) {
  return (
    <span className="ml-2 shrink-0 rounded-[4px] bg-[#D8F5E4] px-1.5 py-0.5 text-[12px] font-medium leading-none text-[#00450C]">
      {children}
    </span>
  );
}

function Price({ plan }) {
  return (
    <div className="flex items-start gap-2">
      <span className="flex items-start">
        <span className="mt-1 text-[16px] text-[#1E1E1E]">{CURRENCY}</span>
        <span className="text-[42px] font-normal leading-none tracking-tight text-[#1E1E1E]">
          {plan.price}
        </span>
      </span>
      {plan.wasPrice && (
        <span className="mt-3 text-[16px] text-[#787C82] line-through">
          {CURRENCY}
          {plan.wasPrice}
        </span>
      )}
    </div>
  );
}

function PlanCta({ plan, withPrice = false }) {
  return (
    <button
      type="button"
      className={cx(
        'flex w-full flex-col items-center justify-center gap-0.5 rounded-[4px] border px-4 py-2.5',
        'text-[14px] font-medium leading-tight transition-colors duration-fast',
        plan.highlight
          ? 'border-transparent text-white hover:brightness-95'
          : 'bg-white hover:bg-[#F6F7F7]'
      )}
      style={plan.highlight ? { backgroundColor: BLUE } : { borderColor: BLUE, color: BLUE }}
    >
      <span>{plan.cta}</span>
      {/* Stuck to the top, the headline price has scrolled away — so the
          button carries it. */}
      {withPrice && (
        <span className="font-normal">
          {CURRENCY} {plan.price}
        </span>
      )}
    </button>
  );
}

export default function PlansScreen({ onBack }) {
  const scrollerRef = useRef(null);
  /**
   * The reference sticks the row of buttons to the top once the cards' own
   * ones have scrolled away, so the choice is always one click off wherever
   * you are in the feature lists. It carries the price too, since the
   * headline number has gone by that point.
   */
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return undefined;
    const onScroll = () => setStuck(el.scrollTop > 620);
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={fade}
      className="absolute inset-0 z-50 bg-white"
    >
      <div ref={scrollerRef} className="h-full w-full overflow-y-auto">
        {/* Chrome */}
        <header className="flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 text-[#101517]">
              <WordPressMark width={22} height={22} />
              <span className="text-[16px] font-medium tracking-tight">WordPress.com</span>
            </span>
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1.5 text-[14px] text-[#1E1E1E] underline underline-offset-2 hover:opacity-70"
            >
              <span aria-hidden>‹</span>
              Back
            </button>
          </div>
          <button
            type="button"
            className="text-[14px] text-[#1E1E1E] underline underline-offset-2 hover:opacity-70"
          >
            Need help?
          </button>
        </header>

        <div className="mx-auto w-full max-w-[1400px] px-6 pb-16">
          <div className="pb-10 pt-8 text-center">
            <h1 className="font-serif text-[52px] leading-tight tracking-tight text-[#1E1E1E]">
              There&rsquo;s a plan for you
            </h1>
            <p className="mt-3 text-[16px] text-[#3C434A]">
              Whatever site you&rsquo;re building, there&rsquo;s a plan to make it happen sooner.
            </p>
          </div>

          {/* The sticky CTA row. Mirrors the grid's columns exactly so each
              button stays over its own plan. */}
          <div
            className={cx(
              'sticky top-0 z-20 -mx-1 grid grid-cols-5 gap-0 border-b border-[#DCDCDE] bg-white px-1 transition-opacity duration-base',
              stuck ? 'opacity-100' : 'pointer-events-none opacity-0'
            )}
          >
            {PLANS.map((plan) => (
              <div key={plan.id} className="px-5 py-3">
                <PlanCta plan={plan} withPrice />
              </div>
            ))}
          </div>

          {/* The grid. One bordered box, columns divided by hairlines — the
              cards don't float, they're panes of the same table. */}
          <div className="relative mt-6 grid grid-cols-5 rounded-[4px] border border-[#DCDCDE]">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className="relative border-r border-[#DCDCDE] px-5 pb-8 pt-8 last:border-r-0"
              >
                {plan.badge && <Badge tone={plan.badgeTone}>{plan.badge}</Badge>}

                <h2 className="text-[28px] font-normal leading-tight tracking-tight text-[#1E1E1E]">
                  {plan.name}
                </h2>
                <p className="mt-2 min-h-[66px] text-[14px] leading-snug text-[#3C434A]">
                  {plan.tagline}
                </p>

                <div className="min-h-[34px]">
                  {plan.specialOffer && (
                    <span className="inline-block rounded-[4px] bg-[#D8F5E4] px-2 py-1 text-[13px] font-medium leading-none text-[#00450C]">
                      Special Offer
                    </span>
                  )}
                </div>

                <div className="mt-3">
                  <Price plan={plan} />
                </div>

                <p className="mt-3 min-h-[60px] text-[14px] leading-snug text-[#3C434A]">
                  {plan.priceNote}
                </p>

                <PlanCta plan={plan} />

                <p className="mt-5 flex items-center gap-2 text-[14px] text-[#1E1E1E]">
                  <Cloud width={16} height={16} className="shrink-0 text-[#3C434A]" />
                  {plan.storage}
                  {plan.storageAction && (
                    <button
                      type="button"
                      className="underline underline-offset-2 hover:opacity-70"
                    >
                      {plan.storageAction}
                    </button>
                  )}
                </p>

                <ul className="mt-4 flex flex-col gap-3">
                  {plan.features.map((feature) => (
                    <li key={feature.label} className="flex items-start gap-2">
                      <Check
                        width={16}
                        height={16}
                        strokeWidth={2}
                        className="mt-0.5 shrink-0 text-[#008A20]"
                      />
                      <span className="text-[14px] leading-snug text-[#1E1E1E]">
                        {feature.label}
                      </span>
                      {feature.tag && <Pill>{feature.tag}</Pill>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Enterprise sits inside the same box, under all five columns. */}
            <div className="col-span-5 flex flex-wrap items-center justify-between gap-8 border-t border-[#DCDCDE] px-8 py-10">
              <div>
                <h3 className="text-[28px] font-normal leading-tight tracking-tight text-[#1E1E1E]">
                  Enterprise
                </h3>
                <p className="mt-2 text-[14px] text-[#3C434A]">
                  Publish securely at enterprise scale.
                </p>
                <button
                  type="button"
                  className="mt-4 rounded-[4px] border px-4 py-2 text-[14px] font-medium"
                  style={{ borderColor: BLUE, color: BLUE }}
                >
                  Learn more
                </button>
              </div>

              {/* Set as wordmarks rather than the real marks — the brand
                  assets aren't ours to ship. */}
              <div className="grid max-w-[720px] flex-1 grid-cols-5 items-center justify-items-center gap-x-8 gap-y-6 opacity-60">
                {ENTERPRISE_LOGOS.map((logo) => (
                  <span
                    key={logo}
                    className="whitespace-nowrap text-[15px] font-semibold tracking-tight text-[#3C434A]"
                  >
                    {logo}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 flex justify-center">
            <button
              type="button"
              className="rounded-[4px] border border-[#DCDCDE] bg-white px-5 py-2.5 text-[14px] text-[#1E1E1E] hover:bg-[#F6F7F7]"
            >
              Compare plans
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
