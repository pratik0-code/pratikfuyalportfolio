import SplitText from '@/components/SplitText';
import Typewriter from '@/components/Typewriter';
import Magnetic from '@/components/Magnetic';
import { ROLES } from '@/lib/config';

export default function Hero() {
  return (
    <section id="top" className="hero container">
      <p className="eyebrow reveal">Hello, I am</p>
      <h1 className="hero-title">
        <SplitText text="Pratik " />
        <em>
          <SplitText text="Fuyal" offset={7} />
        </em>
      </h1>
      <p className="hero-roles reveal">
        <span className="roles-prefix">I am a</span>
        <Typewriter words={ROLES} />
      </p>
      <p className="hero-lead reveal">
        I build intelligent, well-crafted software: from machine learning experiments
        to clean, fast web experiences, with a growing focus on keeping systems secure.
      </p>
      <div className="hero-actions reveal">
        <Magnetic href="#projects" className="btn btn-primary">View my work</Magnetic>
        <Magnetic href="#contact" className="btn btn-ghost">Get in touch</Magnetic>
      </div>
      <a href="#about" className="scroll-cue" aria-label="Scroll to about section">
        <span>Scroll</span>
        <i />
      </a>
    </section>
  );
}
