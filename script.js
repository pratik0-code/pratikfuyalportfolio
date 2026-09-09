/* ==========================================================================
   Pratik Fuyal — Portfolio
   Edit the two config blocks below (LINKS and PROJECTS) with your details.
   ========================================================================== */

/** Contact / social links. Leave a value empty ("") to hide it. */
const LINKS = {
  email: "",                                  // e.g. "mailto:you@example.com"
  github: "",                                 // e.g. "https://github.com/username"
  linkedin: "",                               // e.g. "https://www.linkedin.com/in/username"
  twitter: "",                                // e.g. "https://x.com/username"
  website: "https://fuyalpratik.com.np/",
};

/** Projects shown in the "Selected Projects" section. */
const PROJECTS = [
  {
    title: "Sentiment Analysis Web App",
    description:
      "A full-stack app that classifies text sentiment using a fine-tuned transformer model, served through a lightweight REST API and a responsive React front end.",
    tags: ["Python", "PyTorch", "FastAPI", "React"],
    link: "",
  },
  {
    title: "Image Classifier Playground",
    description:
      "An interactive notebook-turned-web-demo for training and comparing CNN architectures on custom image datasets, with live accuracy and confusion-matrix visualisations.",
    tags: ["TensorFlow", "Keras", "Matplotlib"],
    link: "",
  },
  {
    title: "Network Recon Toolkit",
    description:
      "A command-line toolkit built while learning cybersecurity: host discovery, port scanning, and basic service fingerprinting with clear, exportable reports.",
    tags: ["Python", "Nmap", "Linux", "Networking"],
    link: "",
  },
];

/* --------------------------------------------------------------------------
   Theme toggle (persisted, respects system preference on first visit)
   -------------------------------------------------------------------------- */
(function initTheme() {
  const root = document.documentElement;
  const toggle = document.getElementById("theme-toggle");
  const stored = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  root.setAttribute("data-theme", stored || (prefersDark ? "dark" : "light"));

  toggle.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  });
})();

/* --------------------------------------------------------------------------
   Mobile navigation
   -------------------------------------------------------------------------- */
(function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.getElementById("nav-menu");

  toggle.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  menu.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => {
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );
})();

/* --------------------------------------------------------------------------
   Active nav link on scroll
   -------------------------------------------------------------------------- */
(function initActiveLinks() {
  const links = Array.from(document.querySelectorAll(".nav-menu a[href^='#']"));
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) =>
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`)
        );
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );

  sections.forEach((section) => observer.observe(section));
})();

/* --------------------------------------------------------------------------
   Render projects
   -------------------------------------------------------------------------- */
(function renderProjects() {
  const grid = document.getElementById("projects-grid");

  PROJECTS.forEach((project, index) => {
    const article = document.createElement("article");
    article.className = "project reveal";

    const tags = project.tags.map((tag) => `<li>${tag}</li>`).join("");
    const link = project.link
      ? `<a class="project-link" href="${project.link}" target="_blank" rel="noopener noreferrer">View project →</a>`
      : `<span class="project-link" aria-disabled="true">Coming soon</span>`;

    article.innerHTML = `
      <div class="project-index">${String(index + 1).padStart(2, "0")}</div>
      <h3>${project.title}</h3>
      <p>${project.description}</p>
      <div class="project-footer">
        <ul class="tags">${tags}</ul>
        ${link}
      </div>
    `;

    grid.appendChild(article);
  });
})();

/* --------------------------------------------------------------------------
   Render contact links
   -------------------------------------------------------------------------- */
(function renderContactLinks() {
  const container = document.getElementById("contact-links");
  const labels = {
    email: "Email",
    github: "GitHub",
    linkedin: "LinkedIn",
    twitter: "X / Twitter",
    website: "Website",
  };

  Object.entries(LINKS).forEach(([key, href]) => {
    if (!href) return;
    const a = document.createElement("a");
    a.className = key === "email" ? "btn btn-primary" : "btn btn-ghost";
    a.href = href;
    a.textContent = labels[key] || key;
    if (!href.startsWith("mailto:")) {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    }
    container.appendChild(a);
  });
})();

/* --------------------------------------------------------------------------
   Scroll reveal
   -------------------------------------------------------------------------- */
(function initReveal() {
  const items = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry, i) => {
        if (!entry.isIntersecting) return;
        entry.target.style.transitionDelay = `${Math.min(i * 80, 320)}ms`;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );
  items.forEach((item) => observer.observe(item));
})();

/* --------------------------------------------------------------------------
   Footer year
   -------------------------------------------------------------------------- */
document.getElementById("year").textContent = new Date().getFullYear();
