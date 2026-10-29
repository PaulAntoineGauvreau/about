import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

gsap.registerPlugin(ScrollTrigger, CustomEase);
CustomEase.create('pag-stack', '0.22,1,0.36,1');

let animationContext: ReturnType<typeof gsap.context> | undefined;
let lenis: Lenis | undefined;

const updateLenis = (time: number) => {
  lenis?.raf(time * 1000);
};

function clearSmoothScroll() {
  gsap.ticker.remove(updateLenis);
  lenis?.destroy();
  lenis = undefined;
}

function setupSmoothScroll() {
  clearSmoothScroll();

  lenis = new Lenis({
    anchors: true,
    autoRaf: false,
    respectReducedMotion: true,
    stopInertiaOnNavigate: true,
  });
  lenis.on('scroll', () => ScrollTrigger.update());
  gsap.ticker.add(updateLenis);
  gsap.ticker.lagSmoothing(0);
}

function clearAnimations() {
  animationContext?.revert();
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  document.querySelectorAll<HTMLElement>('[data-method-stack]').forEach((stack) => {
    delete stack.dataset.enhanced;
  });
  animationContext = undefined;
}

function readMotionTokens() {
  const rootStyles = getComputedStyle(document.documentElement);
  const rootSize = Number.parseFloat(rootStyles.fontSize);
  const offsetRem = Number.parseFloat(rootStyles.getPropertyValue('--pag-motion-offset-card'));
  const safeAreaRem = Number.parseFloat(rootStyles.getPropertyValue('--pag-motion-stack-safe-area'));
  const cardGapRem = Number.parseFloat(rootStyles.getPropertyValue('--pag-motion-stack-card-gap'));

  return {
    offset: offsetRem * rootSize,
    safeArea: safeAreaRem * rootSize,
    cardGap: cardGapRem * rootSize,
    scale: Number.parseFloat(rootStyles.getPropertyValue('--pag-motion-scale-card')),
    enterScale: Number.parseFloat(rootStyles.getPropertyValue('--pag-motion-scale-card-enter')),
    enterRotation: Number.parseFloat(rootStyles.getPropertyValue('--pag-motion-rotation-enter')),
    exitRotation: Number.parseFloat(rootStyles.getPropertyValue('--pag-motion-rotation-exit')),
    scrub: Number.parseFloat(rootStyles.getPropertyValue('--pag-motion-stack-scrub')),
  };
}

function setupAnimations() {
  clearAnimations();

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  animationContext = gsap.context(() => {
    const methodStack = document.querySelector<HTMLElement>('[data-method-stack]');
    const methodStage = methodStack?.querySelector<HTMLElement>('[data-method-stage]');
    const methodCards = methodStack
      ? gsap.utils.toArray<HTMLElement>('[data-method-card]', methodStack)
      : [];

    if (methodStack && methodStage && methodCards.length > 1) {
      methodStack.dataset.enhanced = '';
      const tokens = readMotionTokens();

      gsap.set(methodStage, { position: 'relative', overflow: 'hidden' });

      gsap.set(methodCards, {
        position: 'absolute',
        height: 'var(--pag-layout-stack-card-height)',
        minHeight: 'var(--pag-layout-stack-card-height)',
        top: tokens.safeArea,
        right: 0,
        bottom: 'auto',
        left: 0,
        zIndex: (index) => index + 1,
        opacity: 1,
        force3D: true,
      });

      gsap.set(methodCards[0], { y: 0, rotation: 0, scale: 1 });
      gsap.set(methodCards.slice(1), {
        y: (index) => methodStage.clientHeight + tokens.offset + index * tokens.cardGap,
        rotation: tokens.enterRotation,
        scale: tokens.enterScale,
      });

      const stackTimeline = gsap.timeline({
        defaults: { ease: 'pag-stack', force3D: true },
        scrollTrigger: {
          trigger: methodStage,
          start: 'top 10%',
          end: () => {
            const ratio = window.matchMedia('(min-width: 1024px)').matches ? 0.82 : 0.72;
            return `+=${Math.round(window.innerHeight * ratio * (methodCards.length - 1))}`;
          },
          pin: true,
          pinSpacing: true,
          scrub: tokens.scrub,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      methodCards.slice(1).forEach((card, index) => {
        const previousCard = methodCards[index];
        stackTimeline
          .to(previousCard, {
            y: 0,
            rotation: tokens.exitRotation,
            scale: tokens.scale,
            opacity: 0.28,
            duration: 0.82,
          }, index)
          .to(card, {
            y: 0,
            rotation: 0,
            scale: 1,
            opacity: 1,
            duration: 1,
          }, index);

        stackTimeline.to(previousCard, {
          opacity: 0,
          duration: 0.18,
          ease: 'none',
        }, index + 0.82);
      });
    }
  });

  ScrollTrigger.refresh();
}

function clearPageMotion() {
  clearAnimations();
  clearSmoothScroll();
}

function setupPageMotion() {
  setupSmoothScroll();
  setupAnimations();
}

document.addEventListener('astro:before-swap', clearPageMotion);
document.addEventListener('astro:page-load', setupPageMotion);
if (document.readyState === 'complete') setupPageMotion();
document.addEventListener('astro:after-swap', () => {
  window.requestAnimationFrame(() => {
    const heading = document.querySelector<HTMLElement>('main h1');
    if (!heading) return;
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
  });
});
