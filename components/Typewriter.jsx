'use client';

import { useEffect, useState } from 'react';

export default function Typewriter({ words, className = '' }) {
  const [text, setText] = useState(words[0] || '');
  const [staticMode, setStaticMode] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStaticMode(true);
      setText(words.join(' \u00b7 '));
      return undefined;
    }

    let role = 0;
    let chars = words[0].length;
    let deleting = true;
    let timer = 0;

    const tick = () => {
      const word = words[role];
      setText(word.slice(0, chars));
      let delay = deleting ? 40 : 85;

      if (!deleting && chars === word.length) {
        deleting = true;
        delay = 1700;
      } else if (deleting && chars === 0) {
        deleting = false;
        role = (role + 1) % words.length;
        delay = 350;
      } else {
        chars += deleting ? -1 : 1;
      }
      timer = setTimeout(tick, delay);
    };

    timer = setTimeout(tick, 2200);
    return () => clearTimeout(timer);
  }, [words]);

  return (
    <>
      <span className={`typed ${className}`.trim()}>{text}</span>
      {!staticMode && <span className="caret" aria-hidden="true" />}
    </>
  );
}
