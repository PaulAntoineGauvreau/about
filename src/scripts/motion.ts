import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let animationContext: ReturnType<typeof gsap.context> | undefined;

function clearAnimations() {
  animationContext?.revert();
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  animationContext = undefined;
}

function setupAnimations() {
  clearAnimations();

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  animationContext = gsap.context(() => {
    const heroLines = gsap.utils.toArray<HTMLElement>('[data-hero-line]');
    if (heroLines.length) {
      gsap.from(heroLines, {
        yPercent: 110,
        opacity: 0,
        duration: 0.85,
        stagger: 0.09,
        ease: 'power3.out',
      });
    }

    const projectCards = gsap.utils.toArray<HTMLElement>('[data-project-card]');
    projectCards.forEach((card) => {
      gsap.from(card, {
        y: 64,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
          once: true,
        },
      });
    });
  });

  ScrollTrigger.refresh();
}

document.addEventListener('astro:before-swap', clearAnimations);
document.addEventListener('astro:page-load', setupAnimations);
document.addEventListener('astro:after-swap', () => {
  window.requestAnimationFrame(() => {
    const heading = document.querySelector<HTMLElement>('main h1');
    if (!heading) return;
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
  });
});
