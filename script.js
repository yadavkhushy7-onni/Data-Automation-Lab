const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");
const navLinks = document.querySelectorAll(".nav a");
const pageSections = document.querySelectorAll("main section[id]");
const revealItems = document.querySelectorAll(".reveal");
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");
const topbar = document.querySelector(".topbar");

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

const updateActiveSection = () => {
  if (pageSections.length === 0) {
    return;
  }

  const topbarHeight = topbar ? topbar.offsetHeight : 0;
  const scrollMarker = topbarHeight + 140;

  let activeSection = pageSections[0];

  pageSections.forEach((section) => {
    const sectionTop = section.offsetTop;

    if (window.scrollY + scrollMarker >= sectionTop) {
      activeSection = section;
    }
  });

  setActiveNavLink(activeSection.id);
};

if (pageSections.length > 0) {
  updateActiveSection();
  window.addEventListener("scroll", updateActiveSection, { passive: true });
  window.addEventListener("resize", updateActiveSection);
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
