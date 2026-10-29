export {};

type MotionCleanup = () => void;

let pageGeneration = 0;
let smoothScrollCleanup: MotionCleanup | undefined;
let methodStackCleanup: MotionCleanup | undefined;
let methodObserver: IntersectionObserver | undefined;

function clearPageMotion() {
  pageGeneration += 1;
  methodObserver?.disconnect();
  methodObserver = undefined;
  methodStackCleanup?.();
  methodStackCleanup = undefined;
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

  const methodStack = document.querySelector<HTMLElement>('[data-method-stack]');
  if (!methodStack || reducedMotion) return;

  const loadMethodStack = async () => {
    methodObserver?.disconnect();
    methodObserver = undefined;
    const { setupMethodStack } = await import('./method-stack');
    if (generation !== pageGeneration || !methodStack.isConnected) return;
    methodStackCleanup = setupMethodStack(methodStack);
  };

  if (!('IntersectionObserver' in window)) {
    void loadMethodStack();
    return;
  }

  methodObserver = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) void loadMethodStack();
    },
    { rootMargin: '100% 0px' },
  );
  methodObserver.observe(methodStack);
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
