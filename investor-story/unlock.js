(() => {
  const form = document.getElementById("unlock-form");
  const passwordInput = document.getElementById("unlock-password");
  const error = document.getElementById("unlock-error");
  const button = form?.querySelector("button");

  if (!form || !passwordInput || !error || !button) return;

  const fromBase64 = (value) => {
    const binary = atob(value);
    return Uint8Array.from(binary, (character) => character.charCodeAt(0));
  };

  const runScript = (source) => {
    const script = document.createElement("script");
    script.textContent = source;
    document.body.append(script);
    script.remove();
  };

  const decrypt = async (password) => {
    const response = await fetch(`./protected-payload.json?v=${Date.now()}`, {
      cache: "no-store",
      credentials: "omit",
    });
    if (!response.ok) throw new Error("payload_unavailable");

    const envelope = await response.json();
    if (
      envelope.version !== 1 ||
      envelope.cipher !== "AES-GCM-256" ||
      envelope.kdf !== "PBKDF2-SHA-256"
    ) {
      throw new Error("payload_invalid");
    }

    const passwordKey = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(password),
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
      passwordKey,
      { name: "AES-GCM", length: 256 },
      false,
      ["decrypt"],
    );
    const plaintext = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: fromBase64(envelope.iv) },
      key,
      fromBase64(envelope.ciphertext),
    );
    return JSON.parse(new TextDecoder().decode(plaintext));
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    error.textContent = "";
    button.disabled = true;
    button.textContent = "Проверяю…";

    try {
      const payload = await decrypt(passwordInput.value);
      passwordInput.value = "";
      document.title = payload.title;
      document.body.className = "";
      document.body.innerHTML = payload.body;
      runScript(payload.platformScript);
      runScript(payload.storylineScript);
      window.scrollTo({ top: 0, behavior: "auto" });
    } catch (unlockError) {
      const networkFailure = ["payload_unavailable", "payload_invalid"].includes(
        unlockError?.message,
      );
      error.textContent = networkFailure
        ? "Не удалось загрузить зашифрованные данные. Обновите страницу."
        : "Неверный пароль.";
      passwordInput.value = "";
      passwordInput.focus();
      button.disabled = false;
      button.textContent = "Открыть";
    }
  });
})();
