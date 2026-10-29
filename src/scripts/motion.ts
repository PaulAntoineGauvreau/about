export {};

type MotionCleanup = () => void;

let pageGeneration = 0;
let smoothScrollCleanup: MotionCleanup | undefined;

function clearPageMotion() {
  pageGeneration += 1;
  smoothScrollCleanup?.();
  smoothScrollCleanup = undefined;
}

async function setupPageMotion() {
  clearPageMotion();
  const generation = pageGeneration;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reducedMotion) {
    const { setupSmoothScroll } = await import('./smooth-scroll');
    if (generation !== pageGeneration) return;
    smoothScrollCleanup = setupSmoothScroll();
  }

}

document.addEventListener('astro:before-swap', clearPageMotion);
document.addEventListener('astro:page-load', () => void setupPageMotion());
if (document.readyState === 'complete') void setupPageMotion();
document.addEventListener('astro:after-swap', () => {
  window.requestAnimationFrame(() => {
    const heading = document.querySelector<HTMLElement>('main h1');
    if (!heading) return;
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
  });
});
