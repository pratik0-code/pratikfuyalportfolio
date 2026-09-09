import Tilt from '@/components/Tilt';
import { FACTS } from '@/lib/config';

export default function About() {
  return (
    <section id="about" className="section container">
      <div className="section-heading reveal">
        <span className="section-number">01</span>
        <h2>About</h2>
      </div>
      <div className="about-grid">
        <div className="about-text reveal">
          <p>
            I am a developer driven by curiosity. My journey started with the web, building
            interfaces that feel effortless to use, and grew into a fascination with artificial
            intelligence and machine learning, where data becomes insight and insight becomes product.
          </p>
          <p>
            Lately I have been studying cybersecurity, learning how systems are attacked so that I
            can design and build ones that hold up. I believe the best engineers understand the whole
            picture: the model, the interface, and the threat surface in between.
          </p>
          <p>
            When I am not coding, I am reading research papers, tinkering with side projects, or
            practising on capture-the-flag challenges.
          </p>
        </div>
        <Tilt as="aside" className="about-facts reveal">
          <dl>
            {FACTS.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </Tilt>
      </div>
    </section>
  );
}
