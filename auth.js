async function digestPassword(password) {
  const bytes = new TextEncoder().encode(password);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(hash)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function setAuthMessage(text, tone = "ok") {
  const message = document.querySelector("#authMessage");
  message.textContent = text;
  message.dataset.tone = tone;
}

function switchAuthTab(target) {
  document.querySelectorAll("[data-auth-tab]").forEach((button) => {
    button.classList.toggle("active", button.dataset.authTab === target);
  });
  document.querySelector("#loginForm").classList.toggle("hidden", target !== "login");
  document.querySelector("#registerForm").classList.toggle("hidden", target !== "register");
  setAuthMessage("");
}

document.querySelectorAll("[data-auth-tab]").forEach((button) => {
  button.addEventListener("click", () => switchAuthTab(button.dataset.authTab));
});

document.querySelector("#registerForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const email = String(form.get("email")).trim().toLowerCase();
  const name = String(form.get("name")).trim();
  const password = String(form.get("password"));
  const genre = String(form.get("genre"));
  const users = getStoredUsers();

  if (users[email]) {
    switchAuthTab("login");
    setAuthMessage("这个邮箱已经注册，可以直接登录。", "warn");
    return;
  }

  users[email] = {
    email,
    name,
    genre,
    createdAt: new Date().toISOString(),
    passwordHash: await digestPassword(password),
  };
  localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
  localStorage.setItem(AUTH_SESSION_KEY, email);
  setAuthMessage("注册成功，正在进入你的 EchoRate。");
  window.setTimeout(() => (location.href = "index.html"), 650);
});

document.querySelector("#loginForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const email = String(form.get("email")).trim().toLowerCase();
  const password = String(form.get("password"));
  const users = getStoredUsers();
  const user = users[email];

  if (!user || user.passwordHash !== (await digestPassword(password))) {
    setAuthMessage("邮箱或密码不正确。", "warn");
    return;
  }

  localStorage.setItem(AUTH_SESSION_KEY, email);
  setAuthMessage("登录成功，欢迎回来。");
  window.setTimeout(() => (location.href = "index.html"), 500);
});
