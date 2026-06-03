const AUTH_USERS_KEY = "echorateUsers";
const AUTH_SESSION_KEY = "echorateCurrentUser";

function getStoredUsers() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_USERS_KEY) || "{}");
  } catch {
    return {};
  }
}

function getCurrentUser() {
  const email = localStorage.getItem(AUTH_SESSION_KEY);
  if (!email) return null;
  return getStoredUsers()[email] ?? null;
}

function initAuthHeader() {
  const link = document.querySelector("[data-auth-link]");
  if (!link) return;
  const user = getCurrentUser();
  if (!user) {
    link.textContent = "登录 / 注册";
    link.href = "auth.html";
    return;
  }
  link.textContent = `${user.name} · 退出`;
  link.href = "#logout";
  link.addEventListener("click", (event) => {
    event.preventDefault();
    localStorage.removeItem(AUTH_SESSION_KEY);
    location.href = "auth.html";
  });
}

function initScrollNeon() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  let lastY = scrollY;
  let lastBurst = 0;
  const glyphs = ["♪", "♫", "✦", "◆", "POP", "10", "ER"];

  function burst() {
    const now = performance.now();
    if (now - lastBurst < 220) return;
    lastBurst = now;
    const count = Math.min(7, 3 + Math.floor(Math.abs(scrollY - lastY) / 120));
    for (let i = 0; i < count; i += 1) {
      const node = document.createElement("span");
      node.className = "scroll-burst";
      node.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
      node.style.left = `${Math.random() * 100}vw`;
      node.style.top = `${20 + Math.random() * 65}vh`;
      node.style.setProperty("--burst-x", `${(Math.random() - 0.5) * 120}px`);
      node.style.setProperty("--burst-y", `${-80 - Math.random() * 140}px`);
      node.style.setProperty("--burst-hue", Math.random() > 0.5 ? "186" : "312");
      document.body.appendChild(node);
      window.setTimeout(() => node.remove(), 950);
    }
  }

  let frame = 0;
  window.addEventListener("scroll", () => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      const progress = scrollY / max;
      document.body.style.setProperty("--scroll-glow", progress.toFixed(3));
      if (Math.abs(scrollY - lastY) > 42) burst();
      lastY = scrollY;
      frame = 0;
    });
  });
}

function initSiteKineticText() {
  document.querySelectorAll(".kinetic-title, .kinetic-type").forEach((element) => {
    if (element.dataset.kineticReady === "true") return;
    element.dataset.kineticReady = "true";
    const text = element.dataset.text || element.textContent.trim();
    element.setAttribute("aria-label", text);
    element.innerHTML = Array.from(text)
      .map((char, index) => {
        const safeChar = char === " " ? "&nbsp;" : char;
        const className = char === " " ? "kinetic-char kinetic-space" : "kinetic-char";
        return `<span class="${className}" style="--char-index:${index}" aria-hidden="true">${safeChar}</span>`;
      })
      .join("");
  });
}

initAuthHeader();
initScrollNeon();
initSiteKineticText();
