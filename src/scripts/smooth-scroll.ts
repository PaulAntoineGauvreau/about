import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

export function setupSmoothScroll() {
  const lenis = new Lenis({
    anchors: true,
    autoRaf: true,
    respectReducedMotion: true,
    stopInertiaOnNavigate: true,
  });

  return () => lenis.destroy();
}
