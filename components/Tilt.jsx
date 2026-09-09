'use client';

import { useRef } from 'react';

/** Card that tilts in 3D toward the pointer with a light glare. Renders `as` (default: <div>). */
export default function Tilt({ as: Tag = 'div', className = '', children, ...props }) {
  const ref = useRef(null);

  const onPointerMove = (e) => {
    const el = ref.current;
    if (!el || e.pointerType !== 'mouse') return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty('--mx', `${px * 100}%`);
    el.style.setProperty('--my', `${py * 100}%`);
    el.style.transform =
      `perspective(900px) rotateX(${(0.5 - py) * 10}deg) rotateY(${(px - 0.5) * 12}deg) translateY(-6px)`;
  };

  const onPointerLeave = () => {
    if (ref.current) ref.current.style.transform = '';
  };

  return (
    <Tag
      ref={ref}
      className={`tilt ${className}`.trim()}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      {...props}
    >
      {children}
    </Tag>
  );
}
