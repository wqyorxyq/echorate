const AUTH_USERS_KEY = "echorateUsers";
const AUTH_SESSION_KEY = "echorateCurrentUser";
const SIMPLE_USERNAME_KEY = "echorateSimpleUsername";
const VISIT_COUNT_KEY = "echorateVisitCount";

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

function getDisplayName() {
  return localStorage.getItem(SIMPLE_USERNAME_KEY) || getCurrentUser()?.name || "";
}

function initAuthHeader() {
  const link = document.querySelector("[data-auth-link]");
  if (!link) return;
  const displayName = getDisplayName();
  if (!displayName) {
    link.textContent = "登录 / 注册";
    link.href = "auth.html";
    return;
  }
  link.textContent = `${displayName} · 退出`;
  link.href = "#logout";
  link.addEventListener("click", (event) => {
    event.preventDefault();
    localStorage.removeItem(AUTH_SESSION_KEY);
    localStorage.removeItem(SIMPLE_USERNAME_KEY);
    location.href = "auth.html";
  });
}

function initLearningWidgets() {
  const usernameNode = document.querySelector("#currentUsername");
  const visitNode = document.querySelector("#visitCount");
  const timeNode = document.querySelector("#systemDateTime");
  if (!usernameNode && !visitNode && !timeNode) return;

  if (usernameNode) usernameNode.textContent = getDisplayName() || "未登录";

  if (visitNode) {
    const nextCount = Number(localStorage.getItem(VISIT_COUNT_KEY) || "0") + 1;
    localStorage.setItem(VISIT_COUNT_KEY, String(nextCount));
    visitNode.textContent = String(nextCount);
  }

  function renderTime() {
    if (!timeNode) return;
    const now = new Date();
    timeNode.textContent = new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(now);
  }

  renderTime();
  window.setInterval(renderTime, 1000);
}

function initAdCarousel() {
  const image = document.querySelector("#adImage");
  if (!image) return;
  const title = document.querySelector("#adTitle");
  const text = document.querySelector("#adText");
  const prev = document.querySelector("#prevAd");
  const next = document.querySelector("#nextAd");
  const ads = [
    {
      title: "Folklore",
      text: "雾面叙事，适合夜里慢慢展开。",
      src: "https://coverartarchive.org/release/0ca6db69-0719-4a00-99be-f87ef1cff6cb/front-500",
    },
    {
      title: "After Hours",
      text: "霓虹、速度、午夜城市。",
      src: "https://coverartarchive.org/release/6e355f73-3b40-46d6-a28e-11a39105568f/front-500",
    },
    {
      title: "Cowboy Carter",
      text: "辽阔、复古、强烈的身份表达。",
      src: "https://coverartarchive.org/release/08f116e1-e793-4a80-ab19-da9346f71f9d/front-500",
    },
    {
      title: "BRAT",
      text: "高亮绿色的俱乐部能量。",
      src: "https://coverartarchive.org/release/0aa87f3e-a91a-4355-ad9e-6d60be378841/front-500",
    },
  ];
  let index = 0;

  function renderAd(direction = 1) {
    const ad = ads[index];
    image.classList.remove("ad-swap-forward", "ad-swap-back");
    void image.offsetWidth;
    image.classList.add(direction > 0 ? "ad-swap-forward" : "ad-swap-back");
    image.src = ad.src;
    image.alt = `${ad.title} 广告图`;
    if (title) title.textContent = ad.title;
    if (text) text.textContent = ad.text;
  }

  function move(step) {
    index = (index + step + ads.length) % ads.length;
    renderAd(step);
  }

  prev?.addEventListener("click", () => move(-1));
  next?.addEventListener("click", () => move(1));
  window.setInterval(() => move(1), 5200);
  renderAd();
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
initLearningWidgets();
initAdCarousel();
initScrollNeon();
initSiteKineticText();
