(() => {
  if (window.top !== window.self) {
    document.documentElement.textContent = "";
    return;
  }

  const form = document.getElementById("unlock-form");
  const passwordInput = document.getElementById("unlock-password");
  const visibilityButton = document.getElementById("password-visibility");
  const error = document.getElementById("unlock-error");
  const submitButton = form?.querySelector('button[type="submit"]');

  if (!form || !passwordInput || !visibilityButton || !error || !submitButton) {
    return;
  }

  const fromBase64 = (value) => {
    const binary = atob(value);
    return Uint8Array.from(binary, (character) => character.charCodeAt(0));
  };

  const isValidEnvelope = (envelope) =>
    envelope?.version === 1 &&
    envelope?.cipher === "AES-GCM-256" &&
    envelope?.kdf === "PBKDF2-SHA-256" &&
    Number.isSafeInteger(envelope?.iterations) &&
    envelope.iterations >= 600000 &&
    typeof envelope?.salt === "string" &&
    typeof envelope?.iv === "string" &&
    typeof envelope?.aad === "string" &&
    typeof envelope?.ciphertext === "string";

  const loadEnvelope = async () => {
    const response = await fetch(`./payload.json?v=${Date.now()}`, {
      cache: "no-store",
      credentials: "omit",
      referrerPolicy: "no-referrer",
    });
    if (!response.ok) throw new Error("payload_unavailable");
    const envelope = await response.json();
    if (!isValidEnvelope(envelope)) throw new Error("payload_unavailable");
    return envelope;
  };

  const decrypt = async (envelope, password) => {
    const encoder = new TextEncoder();
    const material = await crypto.subtle.importKey(
      "raw",
      encoder.encode(password),
      "PBKDF2",
      false,
      ["deriveKey"],
    );
    const key = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        hash: "SHA-256",
        salt: fromBase64(envelope.salt),
        iterations: envelope.iterations,
      },
      material,
      { name: "AES-GCM", length: 256 },
      false,
      ["decrypt"],
    );
    const plaintext = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: fromBase64(envelope.iv),
        tagLength: 128,
        additionalData: encoder.encode(envelope.aad),
      },
      key,
      fromBase64(envelope.ciphertext),
    );
    return JSON.parse(new TextDecoder().decode(plaintext));
  };

  const render = (payload) => {
    if (
      typeof payload?.title !== "string" ||
      typeof payload?.body !== "string"
    ) {
      throw new Error("payload_invalid");
    }
    document.title = payload.title;
    document.body.className = "";
    document.body.innerHTML = payload.body;
    window.scrollTo({ top: 0, behavior: "auto" });
    document.getElementById("lock-page")?.addEventListener("click", () => {
      window.location.reload();
    });
  };

  visibilityButton.addEventListener("click", () => {
    const reveal = passwordInput.type === "password";
    passwordInput.type = reveal ? "text" : "password";
    visibilityButton.setAttribute("aria-pressed", String(reveal));
    visibilityButton.textContent = reveal ? "Скрыть пароль" : "Показать пароль";
    passwordInput.focus();
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    error.textContent = "";
    submitButton.disabled = true;
    visibilityButton.disabled = true;
    submitButton.textContent = "Расшифровываю…";
    form.setAttribute("aria-busy", "true");

    const password = passwordInput.value;
    passwordInput.value = "";

    try {
      const envelope = await loadEnvelope();
      const payload = await decrypt(envelope, password);
      render(payload);
    } catch (unlockError) {
      const networkFailure = unlockError?.message === "payload_unavailable";
      error.textContent = networkFailure
        ? "Не удалось загрузить зашифрованные данные. Обновите страницу."
        : "Не удалось открыть страницу. Проверьте пароль.";
      passwordInput.type = "password";
      visibilityButton.setAttribute("aria-pressed", "false");
      visibilityButton.textContent = "Показать пароль";
      submitButton.disabled = false;
      visibilityButton.disabled = false;
      submitButton.textContent = "Открыть";
      form.removeAttribute("aria-busy");
      passwordInput.focus();
    }
  });
})();
