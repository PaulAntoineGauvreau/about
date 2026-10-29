import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

export function setupSmoothScroll() {
  const lenis = new Lenis({
    anchors: true,
    autoRaf: true,
    respectReducedMotion: true,
    stopInertiaOnNavigate: true,
  });

  const announceScroll = () => window.dispatchEvent(new Event('pag:lenis-scroll'));
  lenis.on('scroll', announceScroll);

  return () => {
    lenis.off('scroll', announceScroll);
    lenis.destroy();
  };
}
