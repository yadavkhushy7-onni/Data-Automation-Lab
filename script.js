const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");
const navLinks = document.querySelectorAll(".nav a");
const pageSections = document.querySelectorAll("main section[id]");
const revealItems = document.querySelectorAll(".reveal");
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const setActiveNavLink = (sectionId) => {
  navLinks.forEach((link) => {
    const isMatch = link.getAttribute("href") === `#${sectionId}`;
    link.classList.toggle("is-active", isMatch);
  });
};

if ("IntersectionObserver" in window && pageSections.length > 0) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visibleEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];

      if (visibleEntry?.target?.id) {
        setActiveNavLink(visibleEntry.target.id);
      }
    },
    {
      rootMargin: "-30% 0px -45% 0px",
      threshold: [0.2, 0.35, 0.5, 0.7],
    }
  );

  pageSections.forEach((section) => sectionObserver.observe(section));
} else if (pageSections.length > 0) {
  setActiveNavLink(pageSections[0].id);
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
    }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = formData.get("name");
    const projectType = formData.get("project-type");
    const selectedService = projectType
      ? String(projectType).replace(/-/g, " ")
      : "your project";

    formStatus.textContent = `Thanks${name ? `, ${name}` : ""}. Your ${selectedService} inquiry is ready to be connected to email, Formspree, or an n8n webhook.`;
    contactForm.reset();
  });
}
