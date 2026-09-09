'use client';

import { useEffect, useState } from 'react';

export default function Preloader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      setDone(true);
      document.body.classList.add('is-loaded');
    };

    const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
    Promise.all([fontsReady, new Promise((r) => setTimeout(r, 700))]).then(finish);
    const safety = setTimeout(finish, 2500);

    return () => clearTimeout(safety);
  }, []);

  return (
    <div className={`preloader${done ? ' done' : ''}`} aria-hidden="true">
      <span>
        P<i>.</i>F
      </span>
    </div>
  );
}
