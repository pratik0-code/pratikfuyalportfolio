/* ==========================================================================
   Pratik Fuyal — Portfolio
   Edit the config blocks below (LINKS, PROJECTS, ROLES) with your details.
   ========================================================================== */

/** Email shown in the Contact section and used to deliver contact-form messages. */
const CONTACT_EMAIL = "official.pratikfuyalb@gmail.com";

/** Social links shown as buttons in the Contact section. Leave a value empty ("") to hide it. */
const LINKS = {
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

/** Roles cycled by the hero typewriter. */
const ROLES = ["AI/ML Enthusiast", "Web Developer", "Cybersecurity Learner"];

const REDUCE_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const FINE_POINTER = window.matchMedia("(pointer: fine)").matches;

/* --------------------------------------------------------------------------
   Preloader
   -------------------------------------------------------------------------- */
(function initPreloader() {
  const pre = document.getElementById("preloader");
  const finish = () => {
    pre.classList.add("done");
    document.body.classList.add("is-loaded");
  };
  const ready = document.fonts ? document.fonts.ready : Promise.resolve();
  Promise.all([ready, new Promise((r) => setTimeout(r, 700))]).then(finish);
  window.addEventListener("load", () => setTimeout(finish, 1500)); // safety net
})();

/* --------------------------------------------------------------------------
   Smooth scrolling (Lenis) + eased anchor navigation
   -------------------------------------------------------------------------- */
let lenis = null;
(function initSmoothScroll() {
  if (REDUCE_MOTION || typeof window.Lenis !== "function") return;
  lenis = new window.Lenis({ lerp: 0.085, wheelMultiplier: 0.9, smoothWheel: true });
  const raf = (time) => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);
})();

function scrollToElement(el) {
  if (lenis) lenis.scrollTo(el, { offset: -72, duration: 1.4 });
  else el.scrollIntoView({ behavior: REDUCE_MOTION ? "auto" : "smooth" });
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");
    if (href.length < 2) return;
    const target = document.querySelector(href);
    if (!target) return;
    event.preventDefault();
    scrollToElement(target);
    try {
      history.replaceState(null, "", href);
    } catch (_) {
      // file:// origins refuse replaceState; the scroll itself still works.
    }
  });
});

/* --------------------------------------------------------------------------
   Scroll progress bar
   -------------------------------------------------------------------------- */
(function initProgress() {
  const bar = document.getElementById("scroll-progress");
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
  };
  window.addEventListener("scroll", update, { passive: true });
  update();
})();

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
   Hero: letter-by-letter title split
   -------------------------------------------------------------------------- */
(function splitTitle() {
  const el = document.querySelector("[data-split]");
  if (!el) return;
  let index = 0;

  const process = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const frag = document.createDocumentFragment();
      for (const ch of node.textContent) {
        const span = document.createElement("span");
        span.className = "char";
        span.style.setProperty("--i", index++);
        span.textContent = ch === " " ? "\u00a0" : ch;
        frag.appendChild(span);
      }
      node.replaceWith(frag);
    } else {
      Array.from(node.childNodes).forEach(process);
    }
  };
  process(el);
})();

/* --------------------------------------------------------------------------
   Hero: typewriter roles
   -------------------------------------------------------------------------- */
(function initTypewriter() {
  const el = document.getElementById("typed");
  if (!el) return;
  if (REDUCE_MOTION) {
    el.textContent = ROLES.join(" \u00b7 ");
    return;
  }

  let role = 0;
  let chars = 0;
  let deleting = false;

  const tick = () => {
    const word = ROLES[role];
    el.textContent = word.slice(0, chars);
    let delay = deleting ? 40 : 85;

    if (!deleting && chars === word.length) {
      deleting = true;
      delay = 1700;
    } else if (deleting && chars === 0) {
      deleting = false;
      role = (role + 1) % ROLES.length;
      delay = 350;
    } else {
      chars += deleting ? -1 : 1;
    }
    setTimeout(tick, delay);
  };

  setTimeout(tick, 1400);
})();

/* --------------------------------------------------------------------------
   Marquee: duplicate track for a seamless loop
   -------------------------------------------------------------------------- */
(function initMarquee() {
  const track = document.getElementById("marquee-track");
  if (track) track.innerHTML += track.innerHTML;
})();

/* --------------------------------------------------------------------------
   Render projects
   -------------------------------------------------------------------------- */
(function renderProjects() {
  const grid = document.getElementById("projects-grid");

  PROJECTS.forEach((project, index) => {
    const article = document.createElement("article");
    article.className = "project reveal tilt";

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
    a.className = (key === "email" ? "btn btn-primary" : "btn btn-ghost") + " magnetic";
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
   Custom cursor (fine pointers only)
   -------------------------------------------------------------------------- */
(function initCursor() {
  if (!FINE_POINTER || REDUCE_MOTION) return;
  const dot = document.querySelector(".cursor-dot");
  const ring = document.querySelector(".cursor-ring");
  if (!dot || !ring) return;

  document.body.classList.add("has-cursor");

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;

  window.addEventListener("pointermove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
  });

  (function loop() {
    rx += (mx - rx) * 0.16;
    ry += (my - ry) * 0.16;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  })();

  const hoverables = "a, button, .tilt";
  document.addEventListener("pointerover", (e) => {
    if (e.target.closest(hoverables)) ring.classList.add("is-hover");
  });
  document.addEventListener("pointerout", (e) => {
    if (e.target.closest(hoverables)) ring.classList.remove("is-hover");
  });
  window.addEventListener("pointerdown", () => ring.classList.add("is-down"));
  window.addEventListener("pointerup", () => ring.classList.remove("is-down"));
  document.addEventListener("mouseleave", () => { ring.style.opacity = "0"; dot.style.opacity = "0"; });
  document.addEventListener("mouseenter", () => { ring.style.opacity = "1"; dot.style.opacity = "1"; });
})();

/* --------------------------------------------------------------------------
   Magnetic buttons
   -------------------------------------------------------------------------- */
(function initMagnetic() {
  if (!FINE_POINTER || REDUCE_MOTION) return;
  document.querySelectorAll(".magnetic, .theme-toggle").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      el.style.transform = `translate(${x * 0.28}px, ${y * 0.28}px)`;
    });
    el.addEventListener("pointerleave", () => {
      el.style.transform = "";
    });
  });
})();

/* --------------------------------------------------------------------------
   3D tilt cards with glare
   -------------------------------------------------------------------------- */
(function initTilt() {
  if (!FINE_POINTER || REDUCE_MOTION) return;
  document.querySelectorAll(".tilt").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      card.style.setProperty("--mx", `${px * 100}%`);
      card.style.setProperty("--my", `${py * 100}%`);
      card.style.transform =
        `perspective(900px) rotateX(${(0.5 - py) * 10}deg) rotateY(${(px - 0.5) * 12}deg) translateY(-6px)`;
    });
    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
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
        entry.target.style.transitionDelay = `${Math.min(i * 90, 360)}ms`;
        entry.target.classList.add("is-visible");
        // Clear the delay afterwards so hover/tilt transitions stay snappy.
        setTimeout(() => { entry.target.style.transitionDelay = ""; }, 1400);
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );
  items.forEach((item) => observer.observe(item));
})();

/* --------------------------------------------------------------------------
   Contact form (delivered to CONTACT_EMAIL via FormSubmit)
   -------------------------------------------------------------------------- */
(function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const status = form.querySelector(".form-status");
  const button = form.querySelector(".form-submit");
  const label = button.querySelector(".btn-label");
  const emailLink = document.querySelector(".contact-email");

  form.action = `https://formsubmit.co/${CONTACT_EMAIL}`;
  if (emailLink) {
    emailLink.href = `mailto:${CONTACT_EMAIL}`;
    emailLink.textContent = CONTACT_EMAIL;
  }

  const setStatus = (text, kind) => {
    status.textContent = text;
    status.className = `form-status${kind ? ` is-${kind}` : ""}`;
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const payload = Object.fromEntries(new FormData(form).entries());
    button.disabled = true;
    label.textContent = "Sending\u2026";
    setStatus("");

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || String(result.success) !== "true") {
        throw new Error(result.message || "Request failed");
      }

      form.reset();
      label.textContent = "Sent \u2713";
      setStatus("Thanks! Your message is on its way.", "success");
      setTimeout(() => {
        label.textContent = "Send message";
        button.disabled = false;
      }, 4000);
    } catch (error) {
      label.textContent = "Send message";
      button.disabled = false;
      setStatus(`Something went wrong. Please email me directly at ${CONTACT_EMAIL}.`, "error");
    }
  });
})();

/* --------------------------------------------------------------------------
   Footer year
   -------------------------------------------------------------------------- */
document.getElementById("year").textContent = new Date().getFullYear();
