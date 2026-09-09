import { MARQUEE_ITEMS } from '@/lib/config';

export default function Marquee() {
  // Render the list twice so the -50% translate loops seamlessly.
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {items.map((item, i) => (
          <span key={`${item}-${i}`} className="marquee-item">
            {item}
            <span className="star" style={{ marginLeft: '2.5rem' }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
