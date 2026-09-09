'use client';

import { useEffect, useState } from 'react';
import Magnetic from '@/components/Magnetic';

const NAV = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#contact', label: 'Contact' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');

  // Highlight the nav link of the section currently in view.
  useEffect(() => {
    const sections = NAV.map((n) => document.getElementById(n.href.slice(1))).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try {
      localStorage.setItem('theme', next);
    } catch (_) {
      /* storage unavailable */
    }
  };

  return (
    <header className="site-header">
      <nav className="nav container" aria-label="Primary">
        <a href="#top" className="brand">
          P<span className="brand-dot">.</span>F
        </a>

        <button
          className="nav-toggle"
          aria-label="Toggle navigation"
          aria-expanded={open}
          aria-controls="nav-menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span /><span /><span />
        </button>

        <ul id="nav-menu" className={`nav-menu${open ? ' open' : ''}`}>
          {NAV.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className={active === item.href ? 'active' : undefined}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            </li>
          ))}
          <li>
            <Magnetic
              as="button"
              type="button"
              className="theme-toggle"
              aria-label="Toggle dark mode"
              title="Toggle theme"
              onClick={toggleTheme}
            >
              <svg className="icon-sun" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
              </svg>
              <svg className="icon-moon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            </Magnetic>
          </li>
        </ul>
      </nav>
    </header>
  );
}
