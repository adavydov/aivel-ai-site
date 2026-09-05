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

  const loadEnvelope = async (name) => {
    const response = await fetch(`./${name}?v=${Date.now()}`, {
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

  const loadPresentationStylesheet = async (stylesheet) => {
    if (
      typeof stylesheet !== "string" ||
      !/^\.\/v2-presentation\.css\?v=[0-9a-f]{12}$/.test(stylesheet)
    ) {
      throw new Error("presentation_unavailable");
    }
    const url = new URL(stylesheet, window.location.href);
    if (url.origin !== window.location.origin) {
      throw new Error("presentation_unavailable");
    }
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url.href;
    await new Promise((resolve, reject) => {
      link.onload = resolve;
      link.onerror = () => {
        link.remove();
        reject(new Error("presentation_unavailable"));
      };
      document.head.append(link);
    });
    document.querySelectorAll('link[rel="stylesheet"]').forEach((previous) => {
      if (previous !== link) previous.disabled = true;
    });
  };

  const render = async (payload, version) => {
    if (
      typeof payload?.title !== "string" ||
      typeof payload?.body !== "string"
    ) {
      throw new Error("payload_invalid");
    }
    if (version === "v2" && payload.stylesheet !== undefined) {
      await loadPresentationStylesheet(payload.stylesheet);
    }
    document.title = payload.title;
    document.body.className = "";
    document.body.innerHTML = payload.body;
    document.documentElement.lang = "ru";
    window.scrollTo({ top: 0, behavior: "auto" });
    document.getElementById("lock-page")?.addEventListener("click", () => {
      window.location.reload();
    });
    window.dispatchEvent(new CustomEvent("aivel:unlocked", { detail: { version } }));
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
      const candidates = [["payload-v2.json", "v2"], ["payload-v1.json", "v1"]];
      let unlocked = null;
      for (const [name, version] of candidates) {
        try {
          const envelope = await loadEnvelope(name);
          unlocked = { payload: await decrypt(envelope, password), version };
          break;
        } catch (candidateError) {
          if (candidateError?.message === "payload_unavailable") throw candidateError;
        }
      }
      if (!unlocked) throw new Error("password_invalid");
      await render(unlocked.payload, unlocked.version);
    } catch (unlockError) {
      const networkFailure = ["payload_unavailable", "presentation_unavailable"].includes(unlockError?.message);
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
