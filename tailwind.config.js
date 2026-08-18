/**
 * Every visual decision is a token that resolves to a CSS variable defined in
 * `src/styles/tokens.css`. Components only ever reference token names
 * (`bg-surface`, `rounded-control`, `text-ink-muted`), never raw values — so the
 * real design system can be dropped in by editing tokens.css alone.
 */
module.exports = {
  content: ['./src/**/*.{js,jsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        // Surfaces
        canvas: 'rgb(var(--color-canvas) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        'surface-sunken': 'rgb(var(--color-surface-sunken) / <alpha-value>)',
        'surface-raised': 'rgb(var(--color-surface-raised) / <alpha-value>)',
        // Lines
        line: 'rgb(var(--color-line) / <alpha-value>)',
        'line-strong': 'rgb(var(--color-line-strong) / <alpha-value>)',
        // Text
        ink: 'rgb(var(--color-ink) / <alpha-value>)',
        'ink-muted': 'rgb(var(--color-ink-muted) / <alpha-value>)',
        'ink-subtle': 'rgb(var(--color-ink-subtle) / <alpha-value>)',
        'ink-inverse': 'rgb(var(--color-ink-inverse) / <alpha-value>)',
        // Actions
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        'accent-hover': 'rgb(var(--color-accent-hover) / <alpha-value>)',
        'accent-ink': 'rgb(var(--color-accent-ink) / <alpha-value>)',
        'accent-soft': 'rgb(var(--color-accent-soft) / <alpha-value>)',
        // Focus / selection
        focus: 'rgb(var(--color-focus) / <alpha-value>)',
      },
      fontFamily: {
        sans: 'var(--font-sans)',
        serif: 'var(--font-serif)',
        mono: 'var(--font-mono)',
      },
      fontSize: {
        // The scale as specified. Reach for these when matching the spec sheet.
        'xl-serif-big': ['var(--text-xl-serif-big)', { lineHeight: 'var(--leading-xl-serif-big)' }],
        'xl-serif': ['var(--text-xl-serif)', { lineHeight: 'var(--leading-xl-serif)' }],
        'lg-28': ['var(--text-lg-28)', { lineHeight: 'var(--leading-lg-28)' }],
        'lg-20': ['var(--text-lg-20)', { lineHeight: 'var(--leading-lg-20)' }],
        'lg-18': ['var(--text-lg-18)', { lineHeight: 'var(--leading-lg-18)' }],
        md: ['var(--text-md)', { lineHeight: 'var(--leading-md)' }],
        base: ['var(--text-base)', { lineHeight: 'var(--leading-base)' }],
        sm: ['var(--text-sm)', { lineHeight: 'var(--leading-sm)' }],

        // Semantic aliases — what components use, so the mapping stays in
        // tokens.css rather than scattered across the UI.
        micro: ['var(--text-micro)', { lineHeight: 'var(--leading-micro)' }],
        caption: ['var(--text-caption)', { lineHeight: 'var(--leading-caption)' }],
        body: ['var(--text-body)', { lineHeight: 'var(--leading-body)' }],
        lead: ['var(--text-lead)', { lineHeight: 'var(--leading-lead)' }],
        title: ['var(--text-title)', { lineHeight: 'var(--leading-title)' }],
        display: ['var(--text-display)', { lineHeight: 'var(--leading-display)' }],
      },
      borderRadius: {
        control: 'var(--radius-control)',
        nested: 'var(--radius-nested)',
        panel: 'var(--radius-panel)',
        surface: 'var(--radius-surface)',
        pill: 'var(--radius-pill)',
      },
      boxShadow: {
        panel: 'var(--shadow-panel)',
        raised: 'var(--shadow-raised)',
        composer: 'var(--shadow-composer)',
      },
      spacing: {
        // Layout dimensions only — everything else uses default Tailwind spacing.
        chat: 'var(--size-chat-column)',
        entry: 'var(--size-entry-column)',
        toolbar: 'var(--size-toolbar-height)',
        appbar: 'var(--size-appbar-height)',
        gutter: 'var(--size-gutter)',
      },
      maxWidth: {
        entry: 'var(--size-entry-column)',
        prose: 'var(--size-prose)',
        showcase: 'var(--size-showcase)',
      },
      transitionTimingFunction: {
        standard: 'var(--ease-standard)',
        exit: 'var(--ease-exit)',
      },
      transitionDuration: {
        fast: 'var(--duration-fast)',
        base: 'var(--duration-base)',
      },
      screens: {
        // `stage` is the breakpoint where the two-column stage becomes viable.
        stage: '900px',
      },
    },
  },
  plugins: [],
};
