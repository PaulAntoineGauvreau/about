const REM_BASE = 10;
const GRID_STEP = 4;

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

/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    spacing,
    width: spacing,
    minWidth: spacing,
    maxWidth: spacing,
    height: spacing,
    minHeight: spacing,
    maxHeight: spacing,
    fontSize: createRemScale(64),
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
    },
  },
};
