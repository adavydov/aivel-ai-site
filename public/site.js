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
    document.body.classList.add("dialog-open");
    window.setTimeout(() => dialog.querySelector("input")?.focus(), 20);
  };
  const closeDialog = () => {
    if (!(dialog instanceof HTMLDialogElement)) return;
    dialog.close();
    if (!document.querySelector("dialog[open]")) document.body.classList.remove("dialog-open");
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

  const productDemo = document.querySelector("[data-product-demo]");
  let productDemoTrigger = null;
  const demoScenarios = {
    cash: {
      kind: "Прогноз · требует внимания",
      signal: "18 июля запас денег может снизиться до 620 тыс. ₽ — ниже установленной границы.",
      why: "На эту дату приходятся налоги и зарплата. Без двух ожидаемых оплат потребуется перенести необязательную закупку.",
      metricLabel: "Ниже границы",
      metric: "−380 тыс. ₽",
      action: "До 14 июля подтвердить сроки двух оплат. Если дата не подтвердится — перенести закупку на 7–10 дней.",
      basis: "банк, налоговый календарь, расчёт зарплаты и выставленные счета.",
      limit: "прогноз учитывает только подключённые источники и подтверждённые даты."
    },
    payment: {
      kind: "Факт и возможное последствие",
      signal: "Оплата 1,6 млн ₽ задержана на 6 дней и уже влияет на запас денег к ближайшим обязательствам.",
      why: "Без поступления до 15 июля свободный резерв опустится ниже границы, согласованной владельцем.",
      metricLabel: "Задержка",
      metric: "6 дней",
      action: "Сегодня подтвердить новую дату оплаты и подготовить запасной порядок платежей на 18 июля.",
      basis: "выставленный счёт, банковская выписка, реестр продаж и платёжный календарь.",
      limit: "система видит задержку, но не знает намерение покупателя без подтверждения менеджера."
    },
    expense: {
      kind: "Необычное отклонение",
      signal: "Расходы на доставку выросли на 27% и снизили прибыльность направления на 4,8 процентного пункта.",
      why: "Рост расходов оказался быстрее роста выручки. Три подрядчика дали основную часть отклонения.",
      metricLabel: "Рост расходов",
      metric: "+27%",
      action: "Проверить три крупнейшие операции и отделить изменение тарифа от изменения объёма заказов.",
      basis: "бухгалтерские операции, продажи, договоры подрядчиков и управленческие разрезы.",
      limit: "отклонение ещё не доказывает перерасход: причина подтверждается по операциям."
    },
    hiring: {
      kind: "Сценарий решения",
      signal: "При текущем темпе поступлений новый найм сократит запас денег с 4,1 до 2,8 месяца.",
      why: "После налогов и обязательных платежей запас окажется ниже выбранной границы в три месяца.",
      metricLabel: "Запас после найма",
      metric: "2,8 мес.",
      action: "Перенести дату выхода на две недели или подтвердить дополнительный объём продаж до предложения кандидату.",
      basis: "банк, платёжный календарь, фонд оплаты труда и подтверждённый план поступлений.",
      limit: "это учебный сценарий, а не совет по найму; результат зависит от допущений о продажах."
    }
  };

  const setDemoScenario = (id) => {
    if (!(productDemo instanceof HTMLDialogElement)) return;
    const scenario = demoScenarios[id] || demoScenarios.cash;
    const values = {
      "[data-demo-kind]": scenario.kind,
      "[data-demo-signal]": scenario.signal,
      "[data-demo-why]": scenario.why,
      "[data-demo-metric-label]": scenario.metricLabel,
      "[data-demo-metric]": scenario.metric,
      "[data-demo-action]": scenario.action,
      "[data-demo-basis]": scenario.basis,
      "[data-demo-limit]": scenario.limit
    };
    Object.entries(values).forEach(([selector, value]) => {
      const target = productDemo.querySelector(selector);
      if (target) target.textContent = value;
    });
    productDemo.querySelectorAll("[data-scenario]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.getAttribute("data-scenario") === id));
    });
  };

  const openProductDemo = (trigger) => {
    if (!(productDemo instanceof HTMLDialogElement)) return;
    productDemoTrigger = trigger instanceof HTMLElement ? trigger : null;
    const prefilledScenario = trigger?.getAttribute?.("data-demo-scenario");
    const scenario = prefilledScenario || "cash";
    productDemo.classList.toggle("has-prefill", Boolean(prefilledScenario));
    setDemoScenario(scenario);
    productDemo.showModal();
    productDemo.scrollTop = 0;
    document.body.classList.add("dialog-open");
    window.setTimeout(() => {
      const focusTarget = prefilledScenario
        ? productDemo.querySelector("[data-close-demo]")
        : productDemo.querySelector("[aria-pressed='true']");
      focusTarget?.focus();
      productDemo.scrollTop = 0;
    }, 20);
  };

  const closeProductDemo = () => {
    if (!(productDemo instanceof HTMLDialogElement)) return;
    productDemo.close();
    productDemo.scrollTop = 0;
    productDemo.classList.remove("has-prefill");
    if (!document.querySelector("dialog[open]")) document.body.classList.remove("dialog-open");
    productDemoTrigger?.focus?.();
  };

  document.querySelectorAll("[data-open-demo]").forEach((trigger) => {
    trigger.addEventListener("click", () => openProductDemo(trigger));
  });
  productDemo?.querySelectorAll("[data-scenario]").forEach((button) => {
    button.addEventListener("click", () => setDemoScenario(button.getAttribute("data-scenario")));
  });
  productDemo?.querySelector("[data-close-demo]")?.addEventListener("click", closeProductDemo);
  productDemo?.addEventListener("click", (event) => {
    if (event.target === productDemo) closeProductDemo();
  });
  productDemo?.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeProductDemo();
  });
  productDemo?.querySelector("[data-demo-question-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = productDemo.querySelector("[name='demo-question']");
    const value = input instanceof HTMLInputElement ? input.value.toLowerCase() : "";
    let scenario = "cash";
    if (/клиент|оплат|дебитор|задерж/.test(value)) scenario = "payment";
    else if (/расход|затрат|прибыл|рентаб/.test(value)) scenario = "expense";
    else if (/найм|сотруд|зарплат|человек/.test(value)) scenario = "hiring";
    setDemoScenario(scenario);
  });
  productDemo?.querySelector("[data-demo-to-contact]")?.addEventListener("click", () => {
    closeProductDemo();
    openDialog(productDemoTrigger);
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
        client: "Учёт и своевременные сигналы"
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
