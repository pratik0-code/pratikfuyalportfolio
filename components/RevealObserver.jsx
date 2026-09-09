'use client';

import { useEffect } from 'react';

/** Adds `.is-visible` to every `.reveal` element as it scrolls into view. */
export default function RevealObserver() {
  useEffect(() => {
    const items = document.querySelectorAll('.reveal');
    const timers = [];

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry, i) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          el.style.transitionDelay = `${Math.min(i * 90, 360)}ms`;
          el.classList.add('is-visible');
          timers.push(setTimeout(() => { el.style.transitionDelay = ''; }, 1400));
          obs.unobserve(el);
        });
      },
      { threshold: 0.12 }
    );

    items.forEach((item) => observer.observe(item));

    return () => {
      observer.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);

  return null;
}
