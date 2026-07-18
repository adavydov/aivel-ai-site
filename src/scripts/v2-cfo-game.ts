type QuestionKey = "cause" | "impact" | "action";

const normalizeQuestion = (value: string) =>
  value
    .toLocaleLowerCase("ru-RU")
    .replace(/ё/g, "е")
    .replace(/[^а-яa-z0-9\s-]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

const matchQuestion = (value: string): QuestionKey | null => {
  const question = normalizeQuestion(value);

  if (/перен|сниз|нач|сдел|действ|исправ|разобр|останов/.test(question)) return "action";
  if (/кто|почему|причин|из-за|задерж|блок|вырос/.test(question)) return "cause";
  if (/что будет|эффект|последств|если|риск|месяц|не усп/.test(question)) return "impact";

  return null;
};

document.querySelectorAll<HTMLElement>("[data-v2-cfo-game]").forEach((root) => {
  if (root.dataset.initialized === "true") return;
  root.dataset.initialized = "true";

  const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>("[data-scenario-select]"));
  const panels = Array.from(root.querySelectorAll<HTMLElement>("[data-scenario-panel]"));
  const liveStatus = root.querySelector<HTMLElement>("[data-live-status]");

  if (tabs.length === 0 || panels.length === 0 || !liveStatus) return;

  const textFrom = (panel: HTMLElement, selector: string, fallback: string) =>
    panel.querySelector<HTMLElement>(selector)?.textContent?.trim() || fallback;

  const setBasisOpen = (panel: HTMLElement, open: boolean) => {
    const button = panel.querySelector<HTMLButtonElement>("[data-basis-button]");
    const basis = panel.querySelector<HTMLElement>("[data-basis]");
    const closedLabel = panel.querySelector<HTMLElement>("[data-basis-closed]");
    const openLabel = panel.querySelector<HTMLElement>("[data-basis-open]");

    if (!button || !basis || !closedLabel || !openLabel) return;
    basis.hidden = !open;
    button.setAttribute("aria-expanded", String(open));
    closedLabel.hidden = open;
    openLabel.hidden = !open;
  };

  const resetAnswer = (panel: HTMLElement) => {
    const answer = panel.querySelector<HTMLElement>("[data-answer]");
    const input = panel.querySelector<HTMLInputElement>("[data-question-input]");
    if (!answer || !input) return;

    answer.textContent = textFrom(
      panel,
      "[data-answer-default]",
      "Выберите готовое уточнение или задайте короткий вопрос.",
    );
    answer.dataset.state = "empty";
    input.value = "";
  };

  const resetPanel = (panel: HTMLElement) => {
    const calm = panel.querySelector<HTMLElement>("[data-calm-state]");
    const signal = panel.querySelector<HTMLElement>("[data-signal-state]");
    if (!calm || !signal) return;

    calm.hidden = false;
    signal.hidden = true;
    setBasisOpen(panel, false);
    resetAnswer(panel);
  };

  const activateTab = (tab: HTMLButtonElement, moveFocus = false, announce = true) => {
    tabs.forEach((item) => {
      const selected = item === tab;
      item.setAttribute("aria-selected", String(selected));
      item.tabIndex = selected ? 0 : -1;
    });

    panels.forEach((panel) => {
      const selected = panel.dataset.scenarioPanel === tab.dataset.scenarioSelect;
      panel.hidden = !selected;
      resetPanel(panel);
    });

    if (moveFocus) tab.focus();
    if (announce) liveStatus.textContent = `Выбран сценарий «${tab.textContent?.trim()}». Пока всё спокойно.`;
  };

  const showAnswer = (panel: HTMLElement, key: QuestionKey, question: string) => {
    const answer = panel.querySelector<HTMLElement>("[data-answer]");
    const copy = panel.querySelector<HTMLElement>(`[data-answer-copy="${key}"]`);
    if (!answer || !copy) return;

    answer.textContent = copy.textContent?.trim() || "";
    answer.dataset.state = "answered";
    liveStatus.textContent = `Показан ответ на вопрос «${question}».`;
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activateTab(tab));
    tab.addEventListener("keydown", (event) => {
      let nextIndex: number | null = null;

      if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = tabs.length - 1;
      if (nextIndex === null) return;

      event.preventDefault();
      activateTab(tabs[nextIndex], true);
    });
  });

  panels.forEach((panel) => {
    const nextButton = panel.querySelector<HTMLButtonElement>("[data-next-day]");
    const calm = panel.querySelector<HTMLElement>("[data-calm-state]");
    const signal = panel.querySelector<HTMLElement>("[data-signal-state]");
    const signalTitle = panel.querySelector<HTMLElement>("[data-signal-state] h2");
    const basisButton = panel.querySelector<HTMLButtonElement>("[data-basis-button]");
    const presetButtons = panel.querySelectorAll<HTMLButtonElement>("[data-question-key]");
    const form = panel.querySelector<HTMLFormElement>("[data-question-form]");
    const input = panel.querySelector<HTMLInputElement>("[data-question-input]");
    const answer = panel.querySelector<HTMLElement>("[data-answer]");

    nextButton?.addEventListener("click", () => {
      if (!calm || !signal) return;
      calm.hidden = true;
      signal.hidden = false;
      setBasisOpen(panel, false);
      resetAnswer(panel);
      liveStatus.textContent = `Новый сигнал: ${signalTitle?.textContent?.trim() || "Aivel заметил важное"}`;
      signalTitle?.focus({ preventScroll: true });
    });

    basisButton?.addEventListener("click", () => {
      const willOpen = basisButton.getAttribute("aria-expanded") !== "true";
      setBasisOpen(panel, willOpen);
      liveStatus.textContent = willOpen
        ? "Показаны источники, расчёт и правило важности."
        : "Основание сигнала скрыто.";
    });

    presetButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const key = button.dataset.questionKey as QuestionKey | undefined;
        if (key) showAnswer(panel, key, button.textContent?.trim() || "готовое уточнение");
      });
    });

    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!input || !answer) return;

      const question = input.value.slice(0, 180).trim();
      if (!question) {
        answer.textContent = textFrom(
          panel,
          "[data-answer-empty]",
          "Напишите вопрос или выберите одно из трёх готовых уточнений.",
        );
        answer.dataset.state = "empty";
        liveStatus.textContent = "Вопрос пока не введён.";
        return;
      }

      const key = matchQuestion(question);
      if (key) {
        showAnswer(panel, key, question);
        return;
      }

      answer.textContent = textFrom(
        panel,
        "[data-answer-limit]",
        "В учебной версии доступно только три уточнения выше.",
      );
      answer.dataset.state = "limited";
      liveStatus.textContent = "Вопрос не распознан. Aivel показал ограничение учебной версии.";
    });
  });

  panels.forEach(resetPanel);
  const initiallySelected = tabs.find((tab) => tab.getAttribute("aria-selected") === "true") || tabs[0];
  activateTab(initiallySelected, false, false);
});
