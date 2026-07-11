(() => {
  const root = document.documentElement;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const header = document.querySelector("[data-site-header]");
  const updateHeader = () => header?.classList.toggle("is-scrolled", window.scrollY > 12);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const menuButton = document.querySelector("[data-mobile-menu-button]");
  const menu = document.querySelector("[data-mobile-menu]");
  const setMenu = (open) => {
    if (!(menuButton instanceof HTMLButtonElement) || !(menu instanceof HTMLElement)) return;
    menu.hidden = !open;
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
    document.body.classList.toggle("menu-open", open);
  };

  menuButton?.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") !== "true";
    setMenu(open);
  });
  menu?.querySelectorAll("a, button").forEach((item) => item.addEventListener("click", () => setMenu(false)));

  const dialog = document.querySelector("[data-contact-dialog]");
  let dialogTrigger = null;
  const openDialog = (trigger) => {
    if (!(dialog instanceof HTMLDialogElement)) return;
    dialogTrigger = trigger instanceof HTMLElement ? trigger : null;
    const topic = trigger?.getAttribute?.("data-contact-topic");
    if (topic) {
      const topicSelect = dialog.querySelector("[name='topic']");
      if (topicSelect instanceof HTMLSelectElement) topicSelect.value = topic;
    }
    dialog.showModal();
    window.setTimeout(() => dialog.querySelector("input")?.focus(), 20);
  };
  const closeDialog = () => {
    if (!(dialog instanceof HTMLDialogElement)) return;
    dialog.close();
    dialogTrigger?.focus?.();
  };

  document.querySelectorAll("[data-open-contact]").forEach((trigger) => {
    trigger.addEventListener("click", () => openDialog(trigger));
  });
  dialog?.querySelector("[data-close-contact]")?.addEventListener("click", closeDialog);
  dialog?.addEventListener("click", (event) => {
    if (event.target === dialog) closeDialog();
  });
  dialog?.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeDialog();
  });

  document.querySelectorAll("[data-answer-demo]").forEach((demo) => {
    const tabs = Array.from(demo.querySelectorAll("[data-demo-tab]"));
    const panels = Array.from(demo.querySelectorAll("[data-demo-panel]"));

    const activate = (tab) => {
      const id = tab.getAttribute("data-demo-tab");
      tabs.forEach((item) => {
        const active = item === tab;
        item.setAttribute("aria-selected", String(active));
        item.setAttribute("tabindex", active ? "0" : "-1");
      });
      panels.forEach((panel) => {
        panel.hidden = panel.getAttribute("data-demo-panel") !== id;
      });
    };

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => activate(tab));
      tab.addEventListener("keydown", (event) => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        let nextIndex = index;
        if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
        if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
        if (event.key === "Home") nextIndex = 0;
        if (event.key === "End") nextIndex = tabs.length - 1;
        const next = tabs[nextIndex];
        activate(next);
        next.focus();
      });
    });
  });

  document.querySelectorAll("[data-local-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const status = form.querySelector("[data-form-status]");
      const submit = form.querySelector("[data-submit-button]");
      const required = Array.from(form.querySelectorAll("[required]"));
      let firstInvalid = null;

      required.forEach((field) => {
        const valid = field.checkValidity();
        field.setAttribute("aria-invalid", String(!valid));
        if (!valid && !firstInvalid) firstInvalid = field;
        if (field.id) {
          const error = form.querySelector(`[data-error-for='${field.id}']`);
          if (error) error.textContent = valid ? "" : "Заполните это поле.";
        }
      });

      if (firstInvalid) {
        if (status) {
          status.className = "form-status is-error";
          status.textContent = "Проверьте обязательные поля и согласие.";
        }
        firstInvalid.focus();
        return;
      }

      if (submit instanceof HTMLButtonElement) {
        submit.disabled = true;
        submit.classList.add("is-loading");
      }
      if (status) {
        status.className = "form-status";
        status.textContent = "Готовим письмо…";
      }

      const labels = {
        name: "Имя",
        channel: "Телефон или почта",
        role: "Роль",
        topic: "Тема",
        question: "Вопрос",
        size: "Сложность бизнеса",
        accounting: "Как ведётся учёт",
        clients: "Клиентов в компании",
        goal: "Будущая роль владельца",
        system: "Учётная система",
        situation: "Ситуация"
      };
      const lines = [];
      Array.from(form.elements).forEach((field) => {
        if (!(field instanceof HTMLInputElement || field instanceof HTMLSelectElement || field instanceof HTMLTextAreaElement)) return;
        if (!field.name || field.name === "consent" || !field.value.trim()) return;
        const value = field instanceof HTMLSelectElement
          ? field.selectedOptions[0]?.textContent?.trim() || field.value
          : field.value.trim();
        lines.push(`${labels[field.name] || field.name}: ${value}`);
      });

      const mode = form.getAttribute("data-form-mode");
      const subjectByMode = {
        partner: "Партнёрство с бухгалтерской компанией",
        enterprise: "Решение для крупной компании",
        client: "Бухгалтерское сопровождение и важные сигналы"
      };
      const subject = `Обращение с сайта Aivel — ${subjectByMode[mode] || "первый разговор"}`;
      const body = [
        "Здравствуйте!",
        "",
        "Хочу обсудить работу с Aivel.",
        "",
        ...lines,
        "",
        `Страница: ${window.location.href}`
      ].join("\n");
      const mailto = `mailto:info@aivel.ru?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      window.setTimeout(() => {
        window.location.href = mailto;
        if (submit instanceof HTMLButtonElement) {
          submit.disabled = false;
          submit.classList.remove("is-loading");
        }
        if (status) {
          status.className = "form-status is-success";
          status.textContent = "Письмо подготовлено. Проверьте почтовую программу и нажмите «Отправить». Если она не открылась, напишите на info@aivel.ru.";
        }
        required.forEach((field) => field.removeAttribute("aria-invalid"));
      }, prefersReducedMotion ? 20 : 220);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuButton?.getAttribute("aria-expanded") === "true") setMenu(false);
  });

  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    root.classList.add("motion-ready");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px" }
    );
    document.querySelectorAll("[data-reveal]").forEach((item) => observer.observe(item));
  }
})();
