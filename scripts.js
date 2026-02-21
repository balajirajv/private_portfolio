const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector("[data-nav]");
const themeToggle = document.querySelector(".theme-toggle");
const modal = document.querySelector(".modal");
const modalBody = document.querySelector(".modal-body");
const modalClose = document.querySelector(".modal-close");

const setTheme = (mode) => {
  document.body.setAttribute("data-theme", mode);
  themeToggle.textContent = mode === "dark" ? "Light Mode" : "Dark Mode";
  themeToggle.setAttribute("aria-pressed", mode === "dark");
  localStorage.setItem("theme", mode);
};

const initTheme = () => {
  const saved = localStorage.getItem("theme");
  if (saved) {
    setTheme(saved);
  } else {
    setTheme("light");
  }
};

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", isOpen);
});

themeToggle.addEventListener("click", () => {
  const current = document.body.getAttribute("data-theme") === "dark" ? "dark" : "light";
  setTheme(current === "dark" ? "light" : "dark");
});

document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

const revealItems = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const sections = document.querySelectorAll("main section");
const navMap = new Map();

document.querySelectorAll(".nav-link").forEach((link) => {
  const target = document.querySelector(link.getAttribute("href"));
  if (target) {
    navMap.set(target.id, link);
  }
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navMap.forEach((link) => link.classList.remove("active"));
        const activeLink = navMap.get(entry.target.id);
        if (activeLink) {
          activeLink.classList.add("active");
        }
      }
    });
  },
  { threshold: 0.5 }
);

sections.forEach((section) => sectionObserver.observe(section));

const filterChips = document.querySelectorAll(".filter-chip");
const projectCards = document.querySelectorAll(".project-card");

filterChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    filterChips.forEach((btn) => btn.classList.remove("active"));
    chip.classList.add("active");
    const filter = chip.dataset.filter;
    projectCards.forEach((card) => {
      if (filter === "all") {
        card.style.display = "flex";
        return;
      }
      const tags = card.dataset.tags || "";
      card.style.display = tags.includes(filter) ? "flex" : "none";
    });
  });
});

const openModal = (templateId) => {
  const template = document.getElementById(templateId);
  if (!template) return;
  modalBody.innerHTML = "";
  modalBody.appendChild(template.content.cloneNode(true));
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
};

document.querySelectorAll("[data-open]").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    openModal(button.dataset.open);
  });
});

const closeModal = () => {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
};

modalClose.addEventListener("click", closeModal);
modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});

initTheme();
