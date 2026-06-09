(() => {
  const simpleUsernameKey = "echorateSimpleUsername";
  const form = document.querySelector("#simpleLoginForm");
  const input = document.querySelector("#simpleUsername");

  if (!form || !input) return;

  const savedName = localStorage.getItem(simpleUsernameKey);
  if (savedName) input.value = savedName;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const username = input.value.trim();
    if (!username) return;
    localStorage.setItem(simpleUsernameKey, username);
    window.location.href = "index.html";
  });
})();
