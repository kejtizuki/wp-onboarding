import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import cx from '../lib/cx';
import { snap } from '../design/motion';

const VARIANTS = {
  primary: 'bg-accent text-accent-ink hover:bg-accent-hover',
  secondary: 'bg-surface text-ink border border-line hover:border-line-strong',
  ghost: 'text-ink-muted hover:text-ink hover:bg-accent-soft',
  // A persistent light fill rather than ghost's hover-only one — for actions
  // that read as gently locked/inactive rather than merely low-emphasis.
  muted: 'bg-surface-sunken text-ink-muted hover:text-ink',
};

const SIZES = {
  sm: 'h-8 px-3 text-caption gap-1.5',
  md: 'h-10 px-4 text-body gap-2',
  lg: 'h-11 px-5 text-body gap-2',
  // The app bar's own scale — 42px, sitting inside a 60px bar.
  bar: 'h-[42px] px-4 text-caption gap-2',
};

const RADII = {
  control: 'rounded-control',
  nested: 'rounded-nested',
  pill: 'rounded-pill',
  bar: 'rounded-[8px]',
};

const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', radius = 'control', className, children, ...props },
  ref
) {
  return (
    <motion.button
      ref={ref}
      type="button"
      whileHover={props.disabled ? undefined : { y: -1 }}
      whileTap={props.disabled ? undefined : { y: 0, scale: 0.985 }}
      transition={snap}
      className={cx(
        'inline-flex items-center justify-center whitespace-nowrap font-medium',
        RADII[radius],
        'transition-colors duration-fast ease-standard',
        'disabled:opacity-40 disabled:pointer-events-none',
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
});

export default Button;
