/** Splits a string into per-character spans for the staggered hero animation. */
export default function SplitText({ text, offset = 0 }) {
  return Array.from(text).map((ch, i) => (
    <span key={`${offset}-${i}`} className="char" style={{ '--i': offset + i }}>
      {ch === ' ' ? '\u00a0' : ch}
    </span>
  ));
}
