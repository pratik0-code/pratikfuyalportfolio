'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

const HEADER_OFFSET = -72;

export default function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let lenis = null;
    let frame = 0;

    if (!reduce) {
      lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9, smoothWheel: true });
      const raf = (time) => {
        lenis.raf(time);
        frame = requestAnimationFrame(raf);
      };
      frame = requestAnimationFrame(raf);
    }

    const onClick = (event) => {
      const link = event.target.closest('a[href^="#"]');
      if (!link) return;
      const href = link.getAttribute('href');
      if (!href || href.length < 2) return;
      const target = document.getElementById(href.slice(1));
      if (!target) return;

      event.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: HEADER_OFFSET, duration: 1.4 });
      else target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });

      try {
        history.replaceState(null, '', href);
      } catch (_) {
        // file:// origins refuse replaceState; scrolling still works.
      }
    };
    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('click', onClick);
      cancelAnimationFrame(frame);
      lenis?.destroy();
    };
  }, []);

  return null;
}
