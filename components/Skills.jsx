import Tilt from '@/components/Tilt';
import { SKILLS } from '@/lib/config';

const ICON_PROPS = {
  viewBox: '0 0 24 24',
  width: 26,
  height: 26,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

const ICONS = {
  brain: (
    <svg {...ICON_PROPS}>
      <path d="M12 2a4 4 0 0 0-4 4v1a4 4 0 0 0-3 3.87A4 4 0 0 0 6 18a4 4 0 0 0 6 3.46A4 4 0 0 0 18 18a4 4 0 0 0 1-7.13V10a4 4 0 0 0-3-3V6a4 4 0 0 0-4-4z" />
      <path d="M12 2v20M8 10h8M9 14h6" />
    </svg>
  ),
  code: (
    <svg {...ICON_PROPS}>
      <path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 4l-4 16" />
    </svg>
  ),
  shield: (
    <svg {...ICON_PROPS}>
      <path d="M12 2 4 5v6c0 5.25 3.4 10.15 8 11.5 4.6-1.35 8-6.25 8-11.5V5z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
};

export default function Skills() {
  return (
    <section id="skills" className="section container">
      <div className="section-heading reveal">
        <span className="section-number">02</span>
        <h2>Skills</h2>
      </div>
      <div className="cards">
        {SKILLS.map((skill) => (
          <Tilt as="article" key={skill.title} className="card reveal">
            <div className="card-icon" aria-hidden="true">{ICONS[skill.icon]}</div>
            <h3>{skill.title}</h3>
            <p>{skill.description}</p>
            <ul className="tags">
              {skill.tags.map((tag) => <li key={tag}>{tag}</li>)}
            </ul>
          </Tilt>
        ))}
      </div>
    </section>
  );
}
