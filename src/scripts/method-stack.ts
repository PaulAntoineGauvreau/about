import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, CustomEase);
CustomEase.create('pag-stack', '0.22,1,0.36,1');

function readMotionTokens() {
  const rootStyles = getComputedStyle(document.documentElement);
  const rootSize = Number.parseFloat(rootStyles.fontSize);

  return {
    offset: Number.parseFloat(rootStyles.getPropertyValue('--pag-motion-offset-card')) * rootSize,
    safeArea: Number.parseFloat(rootStyles.getPropertyValue('--pag-motion-stack-safe-area')) * rootSize,
    cardGap: Number.parseFloat(rootStyles.getPropertyValue('--pag-motion-stack-card-gap')) * rootSize,
    scale: Number.parseFloat(rootStyles.getPropertyValue('--pag-motion-scale-card')),
    enterScale: Number.parseFloat(rootStyles.getPropertyValue('--pag-motion-scale-card-enter')),
    enterRotation: Number.parseFloat(rootStyles.getPropertyValue('--pag-motion-rotation-enter')),
    exitRotation: Number.parseFloat(rootStyles.getPropertyValue('--pag-motion-rotation-exit')),
    scrub: Number.parseFloat(rootStyles.getPropertyValue('--pag-motion-stack-scrub')),
  };
}

export function setupMethodStack(methodStack: HTMLElement) {
  const methodStage = methodStack.querySelector<HTMLElement>('[data-method-stage]');
  const methodCards = gsap.utils.toArray<HTMLElement>('[data-method-card]', methodStack);
  if (!methodStage || methodCards.length <= 1) return () => {};

  // Batch layout reads before GSAP changes positioning or transforms.
  const tokens = readMotionTokens();
  const stageHeight = methodStage.getBoundingClientRect().height;
  const viewportHeight = window.innerHeight;
  const scrollRatio = window.matchMedia('(min-width: 1024px)').matches ? 0.82 : 0.72;
  const scrollDistance = Math.round(viewportHeight * scrollRatio * (methodCards.length - 1));

  methodStack.dataset.enhanced = '';
  const stylesContext = gsap.context(() => {
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
      y: (index) => stageHeight + tokens.offset + index * tokens.cardGap,
      rotation: tokens.enterRotation,
      scale: tokens.enterScale,
    });
  }, methodStack);

  let timelineContext: gsap.Context | undefined;
  const setupFrame = window.requestAnimationFrame(() => {
    if (!methodStack.isConnected) return;

    timelineContext = gsap.context(() => {
      const stackTimeline = gsap.timeline({
        defaults: { ease: 'pag-stack', force3D: true },
        scrollTrigger: {
          trigger: methodStage,
          start: 'top 10%',
          end: `+=${scrollDistance}`,
          pin: true,
          pinSpacing: true,
          scrub: tokens.scrub,
          anticipatePin: 1,
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
          }, index)
          .to(previousCard, {
            opacity: 0,
            duration: 0.18,
            ease: 'none',
          }, index + 0.82);
      });
    }, methodStack);
  });

  const updateScrollTrigger = () => ScrollTrigger.update();
  window.addEventListener('pag:lenis-scroll', updateScrollTrigger);

  return () => {
    window.cancelAnimationFrame(setupFrame);
    window.removeEventListener('pag:lenis-scroll', updateScrollTrigger);
    timelineContext?.revert();
    stylesContext.revert();
    delete methodStack.dataset.enhanced;
  };
}
