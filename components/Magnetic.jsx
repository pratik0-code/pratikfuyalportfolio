'use client';

import { useRef } from 'react';

/** Element that gently pulls toward the pointer. Renders `as` (default: <a>). */
export default function Magnetic({ as: Tag = 'a', strength = 0.28, children, ...props }) {
  const ref = useRef(null);

  const onPointerMove = (e) => {
    const el = ref.current;
    if (!el || e.pointerType !== 'mouse') return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };

  const onPointerLeave = () => {
    if (ref.current) ref.current.style.transform = '';
  };

  return (
    <Tag ref={ref} onPointerMove={onPointerMove} onPointerLeave={onPointerLeave} {...props}>
      {children}
    </Tag>
  );
}
