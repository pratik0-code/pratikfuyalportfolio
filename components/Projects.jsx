import Tilt from '@/components/Tilt';
import { PROJECTS } from '@/lib/config';

export default function Projects() {
  return (
    <section id="projects" className="section container">
      <div className="section-heading reveal">
        <span className="section-number">03</span>
        <h2>Selected Projects</h2>
      </div>
      <div className="projects">
        {PROJECTS.map((project, index) => (
          <Tilt as="article" key={project.title} className="project reveal">
            <div className="project-index">{String(index + 1).padStart(2, '0')}</div>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <div className="project-footer">
              <ul className="tags">
                {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
              </ul>
              {project.link ? (
                <a className="project-link" href={project.link} target="_blank" rel="noopener noreferrer">
                  View project →
                </a>
              ) : (
                <span className="project-link" aria-disabled="true">Coming soon</span>
              )}
            </div>
          </Tilt>
        ))}
      </div>
    </section>
  );
}
