const REM_BASE = 10;
const GRID_STEP = 4;
function createFluidText(token, tracking, fontWeight) {
  return [
    `var(--pag-text-${token}-size)`,
    {
      lineHeight: `var(--pag-text-${token}-line)`,
      letterSpacing: tracking ? `var(--pag-tracking-${tracking})` : '0',
      fontWeight: `var(--pag-font-weight-${fontWeight})`,
    },
  ];
}

function createRemScale(max) {
  return Object.fromEntries(
    Array.from({ length: max + 1 }, (_, unit) => [
      unit,
      `${Number(((unit * GRID_STEP) / REM_BASE).toFixed(1))}rem`,
    ]),
  );
}

function createRatioScale(min, max) {
  const count = Math.floor((max - min) / GRID_STEP) + 1;
  return Object.fromEntries(
    Array.from({ length: count }, (_, index) => {
      const ratio = min + index * GRID_STEP;
      return [ratio, String(ratio / 100)];
    }),
  );
}

function createTrackingScale(max) {
  const count = Math.floor(max / GRID_STEP) + 1;
  return Object.fromEntries(
    Array.from({ length: count }, (_, index) => {
      const unit = index * GRID_STEP;
      return [unit, `${unit / 100}em`];
    }),
  );
}

const spacing = {
  ...createRemScale(400),
  gutter: 'var(--pag-layout-gutter)',
  section: 'var(--pag-layout-section-space)',
  'header-offset': 'var(--pag-layout-header-offset)',
  'brand-slot': 'var(--pag-layout-brand-width)',
  'music-card': 'var(--pag-layout-music-card-width)',
  'stack-card': 'var(--pag-layout-stack-card-height)',
  'stack-exit': 'var(--pag-layout-stack-exit-height)',
  'static-card': 'var(--pag-layout-static-card-height)',
  'reduced-card': 'var(--pag-layout-reduced-card-height)',
  'project-image': 'var(--pag-layout-project-image-height)',
};
const fluidTypography = {
  'fluid-overline': createFluidText('overline', 'overline', 'bold'),
  'fluid-caption': createFluidText('caption', 'caption', 'regular'),
  'fluid-body-small': createFluidText('body-small', undefined, 'regular'),
  'fluid-body': createFluidText('body', undefined, 'regular'),
  'fluid-body-large': createFluidText('body-large', 'body-large', 'regular'),
  'fluid-lead': createFluidText('lead', 'lead', 'bold'),
  'fluid-title-small': createFluidText('title-small', 'title-small', 'bold'),
  'fluid-title-medium': createFluidText('title-medium', 'title-medium', 'bold'),
  'fluid-title-large': createFluidText('title-large', 'title-large', 'extra-bold'),
  'fluid-heading-small': createFluidText('heading-small', 'heading-small', 'extra-bold'),
  'fluid-heading-medium': createFluidText('heading-medium', 'heading-medium', 'extra-bold'),
  'fluid-heading-large': createFluidText('heading-large', 'heading-large', 'black'),
  'fluid-display': createFluidText('display', 'display', 'black'),
};

/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    screens: {
      bp: '1024px',
    },
    spacing,
    width: spacing,
    minWidth: spacing,
    maxWidth: spacing,
    height: spacing,
    minHeight: spacing,
    maxHeight: spacing,
    fontSize: {
      ...createRemScale(64),
      ...fluidTypography,
    },
    lineHeight: createRatioScale(60, 200),
    letterSpacing: createTrackingScale(12),
    borderRadius: {
      '1': '1px',
      ...createRemScale(12),
      shell: 'var(--pag-radius-shell)',
      card: 'var(--pag-layout-card-radius)',
      full: '9999px',
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: 'var(--pag-color-white)',
      primary: 'var(--color-primary)',
      foreground: 'var(--color-foreground)',
      background: 'var(--color-background)',
      surface: 'var(--color-surface)',
      accent: 'var(--pag-color-brand)',
      border: 'var(--pag-color-border)',
      'border-inverse': 'var(--pag-color-border-inverse)',
      'muted-inverse': 'var(--pag-color-text-muted-inverse)',
      'music-overlay': 'var(--pag-color-music-overlay)',
    },
    fontFamily: {
      sans: ['var(--pag-font-family-sans)'],
      mono: ['var(--pag-font-family-mono)'],
    },
    extend: {
      maxWidth: {
        copy: 'var(--pag-content-copy)',
        'method-copy': 'var(--pag-content-method-copy)',
        heading: 'var(--pag-content-heading)',
        'heading-wide': 'var(--pag-content-heading-wide)',
      },
      minHeight: { 'music-card': 'var(--pag-layout-music-card-height)' },
      transitionProperty: {
        'project-image': 'filter',
      },
      transitionDuration: {
        fast: 'var(--pag-motion-duration-fast)',
        medium: 'var(--pag-motion-duration-medium)',
        project: 'var(--pag-motion-duration-project)',
      },
      transitionTimingFunction: {
        standard: 'var(--pag-motion-ease-standard)',
        'expo-out': 'var(--pag-motion-ease-expo-out)',
      },
      animation: {
        marquee: 'music-marquee var(--pag-motion-duration-marquee) linear infinite',
        roulette: 'passion-roulette 8s linear infinite',
      },
      keyframes: {
        'music-marquee': { to: { transform: 'translateX(-50%)' } },
        'passion-roulette': {
          '0%': { transform: 'translateY(0)', animationTimingFunction: 'var(--pag-motion-ease-expo-out)' },
          '7%, 25%': { transform: 'translateY(calc(var(--pag-roulette-line-height) * -1))' },
          '25%': { animationTimingFunction: 'var(--pag-motion-ease-expo-out)' },
          '32%, 50%': { transform: 'translateY(calc(var(--pag-roulette-line-height) * -2))' },
          '50%': { animationTimingFunction: 'var(--pag-motion-ease-expo-out)' },
          '57%, 75%': { transform: 'translateY(calc(var(--pag-roulette-line-height) * -3))' },
          '75%': { animationTimingFunction: 'var(--pag-motion-ease-expo-out)' },
          '82%, 100%': { transform: 'translateY(calc(var(--pag-roulette-line-height) * -4))' },
        },
      },
    },
  },
};
