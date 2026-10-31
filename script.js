
"use strict";

const translations = {
  en: {
    left: "INDEPENDENT WEB DEVELOPER",
    right: "PORTFOLIO — 2026",
    eyebrow: "MY DIGITAL UNIVERSE",
    title: 'Building ideas into<br><span>digital experiences.</span>',
    description: "I design and develop modern websites that combine creativity, technology and powerful user experiences.",
    discover: "DISCOVER MY WORK",
    bottomLeft: "DESIGN / DEVELOPMENT / CREATIVITY",
    bottomRight: "SCROLL TO EXPLORE ↓",
    sectionLabel: "01 — PORTFOLIO",
    sectionTitle: "Selected projects",
    count: "01 PROJECT",
    category: "WEB DEVELOPMENT",
    projectDescription: "A digital platform built to provide a clean and accessible online experience.",
    visit: "VISIT WEBSITE",
    moreTitle: "More projects coming soon",
    moreDescription: "New ideas, new experiences. Stay tuned.",
    footer: "Designed with passion. Built with purpose."
  },

  fr: {
    left: "DÉVELOPPEUR WEB INDÉPENDANT",
    right: "PORTFOLIO — 2026",
    eyebrow: "MON UNIVERS DIGITAL",
    title: 'Des idées transformées en<br><span>expériences digitales.</span>',
    description: "Je conçois et développe des sites web modernes qui allient créativité, technologie et expériences utilisateur remarquables.",
    discover: "DÉCOUVRIR MES PROJETS",
    bottomLeft: "DESIGN / DÉVELOPPEMENT / CRÉATIVITÉ",
    bottomRight: "DÉFILER POUR EXPLORER ↓",
    sectionLabel: "01 — PORTFOLIO",
    sectionTitle: "Projets sélectionnés",
    count: "01 PROJET",
    category: "DÉVELOPPEMENT WEB",
    projectDescription: "Une plateforme numérique conçue pour offrir une expérience en ligne claire et accessible.",
    visit: "VISITER LE SITE",
    moreTitle: "D'autres projets bientôt",
    moreDescription: "De nouvelles idées et expériences arrivent. Restez connectés.",
    footer: "Conçu avec passion. Développé avec intention."
  },

  ar: {
    left: "مطور مواقع مستقل",
    right: "معرض الأعمال — 2026",
    eyebrow: "عالمي الرقمي",
    title: 'أحول الأفكار إلى<br><span>تجارب رقمية مميزة.</span>',
    description: "أصمم وأطور مواقع عصرية تجمع بين الإبداع والتكنولوجيا وتجربة استخدام احترافية.",
    discover: "اكتشف أعمالي",
    bottomLeft: "التصميم / التطوير / الإبداع",
    bottomRight: "مرر لاكتشاف المزيد ↓",
    sectionLabel: "01 — معرض الأعمال",
    sectionTitle: "مشاريعي المختارة",
    count: "مشروع واحد",
    category: "تطوير المواقع",
    projectDescription: "منصة رقمية صممت لتقديم تجربة استخدام واضحة وسهلة الوصول.",
    visit: "اطلع على الموقع",
    moreTitle: "المزيد من المشاريع قريباً",
    moreDescription: "أفكار جديدة وتجارب رقمية قادمة. ترقبوا المزيد.",
    footer: "تصميم بشغف، وتطوير بهدف."
  }
};

const buttons = document.querySelectorAll("[data-lang]");

function changeLanguage(language) {
  const data = translations[language];

  if (!data) return;

  document.documentElement.lang = language;
  document.documentElement.dir = language === "ar" ? "rtl" : "ltr";

  document.querySelectorAll("[data-i18n]").forEach(element => {
    const key = element.dataset.i18n;

    if (data[key]) {
      element.textContent = data[key];
    }
  });

  document.querySelectorAll("[data-i18n-html]").forEach(element => {
    const key = element.dataset.i18nHtml;

    if (data[key]) {
      element.innerHTML = data[key];
    }
  });

  buttons.forEach(button => {
    const active = button.dataset.lang === language;

    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  try {
    localStorage.setItem("portfolio-language", language);
  } catch (error) {
    console.warn("Language preference could not be saved.");
  }
}

buttons.forEach(button => {
  button.addEventListener("click", () => {
    changeLanguage(button.dataset.lang);
  });
});

// Load saved language

let savedLanguage = "en";

try {
  const saved = localStorage.getItem("portfolio-language");

  if (translations[saved]) {
    savedLanguage = saved;
  }
} catch (error) {
  console.warn("Could not read saved language.");
}

changeLanguage(savedLanguage);

// Dynamic year

document.getElementById("year").textContent =
  new Date().getFullYear();

// Scroll reveal animation

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12
});

document.querySelectorAll(".reveal").forEach(element => {
  observer.observe(element);
});
