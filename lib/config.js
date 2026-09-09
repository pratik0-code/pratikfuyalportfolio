/* ==========================================================================
   Site content. Edit this file to personalise the portfolio.
   ========================================================================== */

/** Email shown in the Contact section and used to deliver contact-form messages. */
export const CONTACT_EMAIL = 'official.pratikfuyalb@gmail.com';

/** Social links shown as buttons in the Contact section. Leave a value empty ('') to hide it. */
export const LINKS = {
  github: '',                                 // e.g. 'https://github.com/username'
  linkedin: '',                               // e.g. 'https://www.linkedin.com/in/username'
  twitter: '',                                // e.g. 'https://x.com/username'
  website: 'https://fuyalpratik.com.np/',
};

export const LINK_LABELS = {
  github: 'GitHub',
  linkedin: 'LinkedIn',
  twitter: 'X / Twitter',
  website: 'Website',
};

/** Roles cycled by the hero typewriter. */
export const ROLES = ['AI/ML Enthusiast', 'Web Developer', 'Cybersecurity Learner'];

/** Items in the scrolling marquee below the hero. */
export const MARQUEE_ITEMS = [
  'Python', 'TensorFlow', 'PyTorch', 'scikit-learn', 'JavaScript', 'React',
  'Next.js', 'Node.js', 'Linux', 'Networking', 'OWASP', 'Nmap', 'Git',
];

/** Quick facts card in the About section. */
export const FACTS = [
  { label: 'Focus', value: 'AI / Machine Learning' },
  { label: 'Craft', value: 'Web Development' },
  { label: 'Learning', value: 'Cybersecurity' },
  { label: 'Based in', value: 'Nepal' },
];

/** Skill cards. `icon` must be one of: brain, code, shield. */
export const SKILLS = [
  {
    icon: 'brain',
    title: 'AI & Machine Learning',
    description:
      'Building and evaluating models, from classical ML to neural networks, with an emphasis on clean data pipelines.',
    tags: ['Python', 'NumPy', 'Pandas', 'scikit-learn', 'TensorFlow', 'PyTorch'],
  },
  {
    icon: 'code',
    title: 'Web Development',
    description: 'Responsive, accessible, performant interfaces backed by well-structured APIs.',
    tags: ['HTML', 'CSS', 'JavaScript', 'React', 'Next.js', 'Node.js'],
  },
  {
    icon: 'shield',
    title: 'Cybersecurity',
    description:
      'Currently learning offensive and defensive fundamentals to build software that is secure by design.',
    tags: ['Linux', 'Networking', 'OWASP Top 10', 'Burp Suite', 'Nmap', 'CTFs'],
  },
];

/** Projects shown in the "Selected Projects" section. */
export const PROJECTS = [
  {
    title: 'Creaneers',
    description:
      'Website for Creaneers, an architectural firm based in Nepal. A clean, responsive showcase of the studio, its services and its project portfolio, designed to reflect the precision and aesthetics of architectural work.',
    tags: ['Web Development', 'Responsive Design', 'UI/UX', 'Client Work'],
    link: 'https://creaneers.com.np/',
  },
  {
    title: 'Sentiment Analysis Web App',
    description:
      'A full-stack app that classifies text sentiment using a fine-tuned transformer model, served through a lightweight REST API and a responsive React front end.',
    tags: ['Python', 'PyTorch', 'FastAPI', 'React'],
    link: '',
  },
  {
    title: 'Image Classifier Playground',
    description:
      'An interactive notebook-turned-web-demo for training and comparing CNN architectures on custom image datasets, with live accuracy and confusion-matrix visualisations.',
    tags: ['TensorFlow', 'Keras', 'Matplotlib'],
    link: '',
  },
  {
    title: 'Network Recon Toolkit',
    description:
      'A command-line toolkit built while learning cybersecurity: host discovery, port scanning, and basic service fingerprinting with clear, exportable reports.',
    tags: ['Python', 'Nmap', 'Linux', 'Networking'],
    link: '',
  },
];
