const OHO_CONFIG = {
  SHEETS_WEB_APP_URL:
    "https://script.google.com/macros/s/AKfycbzz0La4TZqH6qE7Q_THD9e3m_0I6DmcXuBxSandNLjo4RCmg_iNTRJeSc71HRm4ZzeJ/exec",
  CONTACT_EMAIL: "hello.runoho@gmail.com",
  WHATSAPP_NUMBER: "918076831603",
};

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [
  ...scope.querySelectorAll(selector),
];
const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

const year = $("#year");
if (year) year.textContent = new Date().getFullYear();

const menu = $(".hamb");
const links = $(".links");
menu?.addEventListener("click", () => {
  const isOpen = links?.classList.toggle("open");
  menu.setAttribute("aria-expanded", String(Boolean(isOpen)));
  menu.innerHTML = isOpen
    ? '<i data-lucide="x"></i>'
    : '<i data-lucide="menu"></i>';
  window.lucide?.createIcons();
});
links?.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    links.classList.remove("open");
    menu?.setAttribute("aria-expanded", "false");
  }),
);

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -35px" },
  );
  $$(".reveal").forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
    observer.observe(element);
  });
} else {
  $$(".reveal").forEach((element) => element.classList.add("visible"));
}

const formatINR = (value) => `₹${Math.round(value).toLocaleString("en-IN")}`;
const easeOutQuart = (progress) => 1 - Math.pow(1 - progress, 4);

function animatePrice(element) {
  if (element.dataset.animated) return;
  element.dataset.animated = "true";

  const start = Number(element.dataset.start);
  const target = Number(element.dataset.target);
  if (!Number.isFinite(start) || !Number.isFinite(target)) return;

  if (reducedMotion) {
    element.textContent = formatINR(target);
    return;
  }

  const startedAt = performance.now();
  const duration = 7800;
  element.classList.add("is-running");

  function tick(now) {
    const progress = Math.min(1, (now - startedAt) / duration);
    const current = start - (start - target) * easeOutQuart(progress);
    element.textContent = formatINR(current);

    if (progress < 1) {
      requestAnimationFrame(tick);
      return;
    }

    element.textContent = formatINR(target);
    element.classList.remove("is-running");
    element.classList.add("is-done");
  }

  requestAnimationFrame(tick);
}

const animatedPrices = $$(".fall-price");
if ("IntersectionObserver" in window) {
  const priceObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animatePrice(entry.target);
        priceObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.3 },
  );
  animatedPrices.forEach((element) => priceObserver.observe(element));
} else {
  animatedPrices.forEach(animatePrice);
}

const nav = $("[data-nav]");
const progress = $(".page-progress span");
const updateScrollUI = () => {
  nav?.classList.toggle("scrolled", window.scrollY > 20);
  if (progress) {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
  }
};
window.addEventListener("scroll", updateScrollUI, { passive: true });
updateScrollUI();

const glow = $(".cursor-glow");
if (glow && !reducedMotion) {
  window.addEventListener(
    "pointermove",
    (event) => {
      glow.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
    },
    { passive: true },
  );
}

if (!reducedMotion) {
  $$(".magnetic").forEach((button) => {
    button.addEventListener("pointermove", (event) => {
      const bounds = button.getBoundingClientRect();
      button.style.transform = `translate(${(event.clientX - bounds.left - bounds.width / 2) * 0.08}px, ${(event.clientY - bounds.top - bounds.height / 2) * 0.08}px)`;
    });
    button.addEventListener("pointerleave", () => {
      button.style.transform = "";
    });
  });
}

const modal = $("#leadModal");
const modalCard = $(".modal-card", modal || document);
let lastFocused = null;
let autoModalTimer = null;

function openLeadModal(service = "") {
  if (!modal) return;
  lastFocused = document.activeElement;
  const select = $("#popupService");
  if (service && select) {
    const serviceMap = {
      Launch: "Website / landing page",
      Automate: "Business automation",
      Custom: "Custom software",
    };
    select.value = serviceMap[service] || service;
  }
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("body-modal-open");
  window.clearTimeout(autoModalTimer);
  window.setTimeout(() => $('input[name="name"]', modal)?.focus(), 250);
}

function closeLeadModal() {
  if (!modal) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("body-modal-open");
  sessionStorage.setItem("ohoLeadPromptSeen", "1");
  lastFocused?.focus?.();
}

$$(".js-open-lead").forEach((button) =>
  button.addEventListener("click", () =>
    openLeadModal(button.dataset.service || ""),
  ),
);
$$("[data-close-modal]").forEach((button) =>
  button.addEventListener("click", closeLeadModal),
);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal?.classList.contains("open"))
    closeLeadModal();
  if (event.key !== "Tab" || !modal?.classList.contains("open")) return;
  const focusable = $$(
    "button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href]",
    modalCard,
  );
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  }
  if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

if (modal && !sessionStorage.getItem("ohoLeadPromptSeen")) {
  autoModalTimer = window.setTimeout(() => openLeadModal(), 10000);
}

const serviceQuery = new URLSearchParams(location.search).get("service");
if (serviceQuery) {
  const select = $("#serviceSelect");
  if (select) {
    const match = [...select.options].find(
      (option) => option.value.toLowerCase() === serviceQuery.toLowerCase(),
    );
    if (match) select.value = match.value;
  }
}

async function submitLeadForm(form) {
  if (!form.reportValidity()) return;
  const status = $(".form-status", form) || $("#formStatus");
  const button = $('[type="submit"]', form);
  const data = Object.fromEntries(new FormData(form).entries());
  const payload = {
    ...data,
    source: location.href,
    submitted_at: new Date().toISOString(),
    website: "runoho.com",
    honeypot: form.querySelector('[name="company_website"]')?.value || "",
  };
  if (
    !OHO_CONFIG.SHEETS_WEB_APP_URL.startsWith(
      "https://script.google.com/macros/s/",
    )
  ) {
    if (status)
      status.textContent = `Form setup is pending. Please email ${OHO_CONFIG.CONTACT_EMAIL}.`;
    return;
  }
  button.disabled = true;
  if (status) status.textContent = "Sending your enquiry…";
  try {
    await fetch(OHO_CONFIG.SHEETS_WEB_APP_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });
    if (status)
      status.textContent =
        "Thank you — your enquiry has been sent for processing. We’ll be in touch shortly.";
    form.reset();
    sessionStorage.setItem("ohoLeadPromptSeen", "1");
  } catch (error) {
    if (status)
      status.textContent = `We couldn’t send that. Please email ${OHO_CONFIG.CONTACT_EMAIL}.`;
  } finally {
    button.disabled = false;
  }
}

$$("#contactForm, #leadPopupForm").forEach((form) =>
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    submitLeadForm(form);
  }),
);

if (!$(".whatsapp-float")) {
  const whatsapp = document.createElement("a");
  whatsapp.className = "whatsapp-float";
  whatsapp.href = `https://wa.me/${OHO_CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi OHO! I would like to discuss a project.")}`;
  whatsapp.target = "_blank";
  whatsapp.rel = "noopener";
  whatsapp.setAttribute("aria-label", "Chat with OHO on WhatsApp");
  whatsapp.innerHTML =
    '<i data-lucide="message-circle"></i><span>WhatsApp us</span>';
  document.body.appendChild(whatsapp);
}

window.addEventListener("load", () => window.lucide?.createIcons());
