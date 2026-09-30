/* =========================================================
   Abrish Fatima — Portfolio scripts
   ========================================================= */

// Set your contact email here — it updates the contact link and the form.
const CONTACT_EMAIL = "abrishfatima111225@gmail.com";

document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Footer year & email ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
  const emailLink = document.getElementById("emailLink");
  const emailText = document.getElementById("emailText");
  if (emailLink) emailLink.href = `mailto:${CONTACT_EMAIL}`;
  if (emailText) emailText.textContent = CONTACT_EMAIL;

  /* ---------- Nav: scrolled state + progress bar ---------- */
  const nav = document.getElementById("nav");
  const progress = document.querySelector(".scroll-progress");

  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle("scrolled", y > 20);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = max > 0 ? `${(y / max) * 100}%` : "0";
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");

  const setMenu = (open) => {
    toggle.classList.toggle("open", open);
    links.classList.toggle("open", open);
    nav.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };

  toggle.addEventListener("click", () => setMenu(!links.classList.contains("open")));
  links.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
  window.addEventListener("resize", () => { if (window.innerWidth > 820) setMenu(false); });

  /* ---------- Active nav link on scroll ---------- */
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("main section[id]");

  const setActive = (id) => {
    navLinks.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${id}`));
  };

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) setActive(entry.target.id); });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => sectionObserver.observe(s));

  /* ---------- Reveal on scroll (with stagger) ---------- */
  const reveals = document.querySelectorAll(".reveal");

  // Stagger siblings that share a parent
  const groups = new Map();
  reveals.forEach((el) => {
    const parent = el.parentElement;
    const i = groups.get(parent) || 0;
    el.style.transitionDelay = `${Math.min(i * 90, 450)}ms`;
    groups.set(parent, i + 1);
  });

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => revealObserver.observe(el));
  }

  /* ---------- Typing effect ---------- */
  const typed = document.getElementById("typed");
  const phrases = [
    "AI Automation & Workflow Builder",
    "Building workflows with n8n",
    "Integrating Claude into processes",
    "Connecting APIs with FastAPI",
  ];

  if (typed && !prefersReducedMotion) {
    let phraseIndex = 0;
    let charIndex = phrases[0].length;
    let deleting = true;

    const tick = () => {
      const current = phrases[phraseIndex];
      if (deleting) {
        charIndex--;
        typed.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          return setTimeout(tick, 350);
        }
        return setTimeout(tick, 32);
      }
      const next = phrases[phraseIndex];
      charIndex++;
      typed.textContent = next.slice(0, charIndex);
      if (charIndex === next.length) {
        deleting = true;
        return setTimeout(tick, 2200);
      }
      return setTimeout(tick, 60);
    };
    setTimeout(tick, 2600);
  }

  /* ---------- Hero workflow animation ---------- */
  const steps = [
    { node: ".n1", log: "[ok] trigger received" },
    { node: ".n2", log: "[ok] data fetched via API" },
    { node: ".n3", log: "[ok] AI step: summarised & classified" },
    { node: ".n4", log: "[ok] routed by condition" },
    { node: ".n5", log: "[ok] output delivered" },
  ];
  const flowLog = document.getElementById("flowLog");
  let stepIndex = 0;

  const runStep = () => {
    document.querySelectorAll(".node").forEach((n) => n.classList.remove("active"));
    const step = steps[stepIndex];
    const node = document.querySelector(step.node);
    if (node) node.classList.add("active");
    if (flowLog) flowLog.innerHTML = `<span class="log-line">${step.log}</span>`;
    stepIndex = (stepIndex + 1) % steps.length;
  };

  if (!prefersReducedMotion) {
    runStep();
    setInterval(runStep, 1600);
  } else {
    document.querySelector(".n3")?.classList.add("active");
  }

  /* ---------- Skill card cursor glow ---------- */
  document.querySelectorAll(".skill-card").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      card.style.setProperty("--my", `${e.clientY - rect.top}px`);
    });
  });

  /* ---------- Contact form (sends straight to your inbox via FormSubmit) ---------- */
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  const submitBtn = form.querySelector('button[type="submit"]');

  const setStatus = (msg, type = "") => {
    status.textContent = msg;
    status.className = `form-status ${type}`;
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Spam trap: real people never fill this hidden field
    if (form._honey && form._honey.value) return;

    const fields = { name: form.name, email: form.email, message: form.message };
    let valid = true;

    Object.values(fields).forEach((input) => {
      const ok = input.value.trim() !== "" && (input.type !== "email" || /^\S+@\S+\.\S+$/.test(input.value.trim()));
      input.closest(".field").classList.toggle("invalid", !ok);
      if (!ok) valid = false;
    });

    if (!valid) {
      setStatus("Please fill in all fields with a valid email address.", "error");
      return;
    }

    const name = fields.name.value.trim();
    const email = fields.email.value.trim();
    const message = fields.message.value.trim();

    submitBtn.disabled = true;
    const originalLabel = submitBtn.innerHTML;
    submitBtn.innerHTML = "Sending…";
    setStatus("");

    try {
      const res = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
          _subject: `New portfolio message from ${name}`,
          _replyto: email,
          _template: "table",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === false || data.success === "false") {
        throw new Error(data.message || "Request failed");
      }
      setStatus("Thanks! Your message has been sent — I'll get back to you soon.", "success");
      form.reset();
    } catch (err) {
      setStatus(`Sorry, the message couldn't be sent. Please email me directly at ${CONTACT_EMAIL}.`, "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalLabel;
    }
  });

  form.querySelectorAll("input, textarea").forEach((input) =>
    input.addEventListener("input", () => input.closest(".field").classList.remove("invalid"))
  );
});

/* ---------- Theme picker ---------- */
(() => {
  const THEMES = ["dark", "graphite", "ocean", "emerald", "sunset", "light", "sky", "mint", "rose", "sand", "auto"];
  const root = document.documentElement;
  const btn = document.getElementById("themeBtn");
  const menu = document.getElementById("themeMenu");
  if (!btn || !menu) return;
  const options = menu.querySelectorAll("[data-theme-value]");
  const lightQuery = window.matchMedia("(prefers-color-scheme: light)");
  let current = "dark";

  const resolve = (theme) => (theme === "auto" ? (lightQuery.matches ? "light" : "dark") : theme);

  const applyTheme = (theme, save = true) => {
    if (!THEMES.includes(theme)) theme = "dark";
    current = theme;
    const actual = resolve(theme);
    if (actual === "dark") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", actual);
    options.forEach((o) => o.setAttribute("aria-checked", String(o.dataset.themeValue === theme)));
    if (save) { try { localStorage.setItem("theme", theme); } catch (e) {} }
  };

  const setOpen = (open) => {
    menu.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", String(open));
  };

  let saved = "dark";
  try { saved = localStorage.getItem("theme") || "dark"; } catch (e) {}
  applyTheme(saved, false);

  // Follow the device setting live when "Match my device" is chosen
  lightQuery.addEventListener?.("change", () => { if (current === "auto") applyTheme("auto", false); });

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    setOpen(!menu.classList.contains("open"));
  });

  options.forEach((o) =>
    o.addEventListener("click", () => {
      applyTheme(o.dataset.themeValue);
      setOpen(false);
      btn.focus();
    })
  );

  document.addEventListener("click", (e) => {
    if (!menu.contains(e.target) && e.target !== btn && !btn.contains(e.target)) setOpen(false);
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
})();
