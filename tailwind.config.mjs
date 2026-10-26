const REM_BASE = 10;
const GRID_STEP = 4;
const FLUID_MIN_WIDTH = 320;
const FLUID_MAX_WIDTH = 1440;

function formatNumber(value) {
  return Number(value.toFixed(4));
}

function pixelsToRem(value) {
  return `${formatNumber(value / REM_BASE)}rem`;
}

function createFluidClamp(min, max) {
  const slope = ((max - min) / (FLUID_MAX_WIDTH - FLUID_MIN_WIDTH)) * 100;
  const intercept = min - (slope * FLUID_MIN_WIDTH) / 100;

  return `clamp(${pixelsToRem(min)}, calc(${pixelsToRem(intercept)} + ${formatNumber(slope)}vw), ${pixelsToRem(max)})`;
}

function createFluidText(minSize, maxSize, minLineHeight, maxLineHeight, letterSpacing, fontWeight) {
  return [
    createFluidClamp(minSize, maxSize),
    {
      lineHeight: createFluidClamp(minLineHeight, maxLineHeight),
      letterSpacing,
      fontWeight: String(fontWeight),
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

const spacing = createRemScale(400);
const fluidTypography = {
  'fluid-overline': createFluidText(12, 16, 16, 20, '0.08rem', 700),
  'fluid-caption': createFluidText(12, 16, 16, 20, '0.04rem', 400),
  'fluid-body-small': createFluidText(12, 16, 20, 24, '0rem', 400),
  'fluid-body': createFluidText(16, 20, 24, 28, '0rem', 400),
  'fluid-body-large': createFluidText(16, 24, 24, 32, '-0.04rem', 400),
  'fluid-lead': createFluidText(24, 48, 28, 52, '-0.08rem', 700),
  'fluid-title-small': createFluidText(20, 32, 24, 36, '-0.02em', 700),
  'fluid-title-medium': createFluidText(24, 40, 28, 44, '-0.03em', 700),
  'fluid-title-large': createFluidText(28, 60, 32, 56, '-0.04em', 800),
  'fluid-heading-small': createFluidText(40, 100, 40, 96, '-0.04em', 800),
  'fluid-heading-medium': createFluidText(40, 116, 36, 108, '-0.05em', 800),
  'fluid-heading-large': createFluidText(68, 208, 56, 184, '-0.055em', 900),
  'fluid-display': createFluidText(56, 208, 48, 184, '-0.07em', 900),
};

/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    screens: {
      bp: '102.4rem',
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
      ...createRemScale(12),
      full: '9999px',
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#ffffff',
      primary: 'var(--color-primary)',
      foreground: 'var(--color-foreground)',
      background: 'var(--color-background)',
      surface: 'var(--color-surface)',
      accent: 'var(--color-accent)',
    },
    fontFamily: {
      sans: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      mono: ['Courier New', 'Courier', 'Nimbus Mono PS', 'monospace'],
    },
  },
};
