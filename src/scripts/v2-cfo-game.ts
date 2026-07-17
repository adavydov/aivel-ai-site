type QuestionKey = "payer" | "consequence" | "move";

type SourceItem = {
  label: string;
  value: string;
  source: string;
  updated: string;
};

type Signal = {
  date: string;
  dateTime: string;
  title: string;
  summary: string;
  changed: string;
  why: string;
  horizon: string;
  action: string;
  sources: SourceItem[];
  calculation: string;
  rule: string;
  answers: Record<QuestionKey, string>;
};

const signals: Signal[] = [
  {
    date: "12 августа",
    dateTime: "2026-08-12",
    title: "Через 12 дней может не хватить 2,4 млн ₽ на зарплату и налоги.",
    summary:
      "Оплата от «Горизонта» сдвинулась на две недели, а обязательные выплаты остались на прежней дате.",
    changed: "Ожидаемые 5,8 млн ₽ придут не 12, а 26 августа.",
    why: "До даты зарплаты и налогов других подтверждённых поступлений недостаточно.",
    horizon: "Риск возникнет 24 августа — через 12 дней.",
    action: "Сегодня подтвердить новую дату оплаты и подготовить источник ещё 2,4 млн ₽.",
    sources: [
      {
        label: "Деньги на счетах",
        value: "3,1 млн ₽",
        source: "выписки двух банков",
        updated: "сегодня, 10:15",
      },
      {
        label: "Зарплата и налоги",
        value: "5,5 млн ₽",
        source: "расчёт зарплаты и календарь платежей",
        updated: "сегодня, 10:06",
      },
      {
        label: "Оплата «Горизонта»",
        value: "5,8 млн ₽, новая дата — 26 августа",
        source: "письмо клиента и реестр ожидаемых оплат",
        updated: "сегодня, 09:42",
      },
    ],
    calculation: "3,1 млн ₽ на счетах − 5,5 млн ₽ обязательных выплат = −2,4 млн ₽.",
    rule:
      "Ситуация важна, если прогнозный остаток становится отрицательным до обязательной выплаты зарплаты или налогов.",
    answers: {
      payer:
        "Оплату задерживает «Горизонт». В письме от 09:42 клиент перенёс платёж на 26 августа — на 14 дней позже плана.",
      consequence:
        "Без действий 24 августа прогнозный остаток составит −2,4 млн ₽. После оплаты 26 августа разрыв закроется, но зарплата и налоги уже будут просрочены.",
      move:
        "Можно перенести платёж за оборудование на 1,1 млн ₽. Это уменьшит разрыв, но останется ещё 1,3 млн ₽ — понадобится второе решение.",
    },
  },
  {
    date: "13 августа",
    dateTime: "2026-08-13",
    title: "Доходность направления «Доставка» за две недели снизилась с 24% до 16%.",
    summary:
      "Расход на одну доставку вырос на 18%, а цены для клиентов не изменились.",
    changed: "Средняя стоимость доставки выросла с 640 до 755 ₽ за заказ.",
    why: "При текущем объёме направление недополучит около 1,2 млн ₽ валовой прибыли за месяц.",
    horizon: "Эффект станет существенным к концу текущего месяца.",
    action: "Проверить три убыточных маршрута и новый тариф перевозчика до следующей отгрузки.",
    sources: [
      {
        label: "Выручка направления",
        value: "8,6 млн ₽ за 14 дней",
        source: "система заказов",
        updated: "сегодня, 08:30",
      },
      {
        label: "Расходы на доставку",
        value: "3,2 млн ₽ за 14 дней",
        source: "акты перевозчика и первичные документы",
        updated: "вчера, 19:10",
      },
      {
        label: "Объём",
        value: "4 238 заказов",
        source: "система заказов",
        updated: "сегодня, 08:30",
      },
    ],
    calculation:
      "Доходность направления рассчитана по выручке, прямой себестоимости и расходам на доставку: 24% в прошлые две недели, 16% — сейчас.",
    rule:
      "Ситуация важна, если доходность направления падает больше чем на 5 процентных пунктов и эффект превышает 500 тыс. ₽ в месяц.",
    answers: {
      payer:
        "Главное изменение связано не с клиентом, а с перевозчиком «Экспресс-Логистика»: его тариф вырос на 17% с 1 августа.",
      consequence:
        "Если условия не изменить, валовая прибыль направления за месяц будет примерно на 1,2 млн ₽ ниже обычной.",
      move:
        "Сначала пересмотреть три маршрута с отрицательной доходностью. На них приходится 62% ухудшения, поэтому это даст самый быстрый эффект.",
    },
  },
  {
    date: "14 августа",
    dateTime: "2026-08-14",
    title: "47% просроченной задолженности теперь приходится на одного клиента.",
    summary:
      "Компания «Альта» пропустила вторую согласованную дату оплаты; сумма выросла до 4,6 млн ₽.",
    changed: "Доля одного клиента в просроченной задолженности выросла с 29% до 47%.",
    why: "Один платёж начал определять запас денег всей компании.",
    horizon: "Если оплаты не будет до 31 августа, запас денег опустится ниже внутреннего минимума.",
    action: "Согласовать с «Альтой» график погашения и временно остановить новый необеспеченный объём.",
    sources: [
      {
        label: "Долг «Альты»",
        value: "4,6 млн ₽",
        source: "сверка с клиентом и учётная система",
        updated: "сегодня, 11:20",
      },
      {
        label: "Вся просроченная задолженность",
        value: "9,8 млн ₽",
        source: "оборотная ведомость",
        updated: "сегодня, 07:45",
      },
      {
        label: "Следующая обещанная дата",
        value: "не подтверждена",
        source: "переписка ответственного менеджера",
        updated: "сегодня, 11:03",
      },
    ],
    calculation: "4,6 млн ₽ ÷ 9,8 млн ₽ просроченной задолженности = 47%.",
    rule:
      "Ситуация важна, если на одного клиента приходится больше 35% просроченного долга или его задержка нарушает минимальный запас денег.",
    answers: {
      payer:
        "Оплату задерживает «Альта». Это вторая пропущенная дата; новой подтверждённой даты в переписке пока нет.",
      consequence:
        "Если 4,6 млн ₽ не поступят до конца месяца, запас денег станет на 1,6 млн ₽ ниже установленного минимума.",
      move:
        "Можно остановить новый необеспеченный объём для «Альты» и согласовать два частичных платежа. Это снизит дальнейший рост риска.",
    },
  },
  {
    date: "15 августа",
    dateTime: "2026-08-15",
    title: "До закрытия периода два дня, но 19 операций на 3,8 млн ₽ ещё не подтверждены.",
    summary:
      "По операциям нет документов или согласованной статьи учёта, поэтому отчётность может быть искажена.",
    changed: "За день число незавершённых операций снизилось только с 23 до 19.",
    why: "Без разбора исключений закрытие задержится минимум на два рабочих дня.",
    horizon: "Плановая дата закрытия — 17 августа.",
    action: "Назначить владельцев пяти крупнейших исключений: на них приходится 82% суммы.",
    sources: [
      {
        label: "Незавершённые операции",
        value: "19 на 3,8 млн ₽",
        source: "журнал закрытия периода",
        updated: "сегодня, 12:00",
      },
      {
        label: "Без первичных документов",
        value: "11 операций",
        source: "реестр первичных документов",
        updated: "сегодня, 11:55",
      },
      {
        label: "Без статьи учёта",
        value: "8 операций",
        source: "очередь исключений",
        updated: "сегодня, 11:58",
      },
    ],
    calculation:
      "Пять крупнейших исключений составляют 3,1 млн ₽ из 3,8 млн ₽, то есть 82% неподтверждённой суммы.",
    rule:
      "Ситуация важна, если до закрытия меньше трёх дней, а незавершённые операции могут изменить отчётность больше чем на 1 млн ₽.",
    answers: {
      payer:
        "Здесь нет одного плательщика. Пять крупнейших исключений закреплены за закупками, складом и руководителем направления «Доставка».",
      consequence:
        "Без разбора исключений отчётность выйдет минимум на два рабочих дня позже, а доходность направлений останется предварительной.",
      move:
        "Сначала разобрать пять операций на 3,1 млн ₽. Остальные 14 операций меньше по сумме и не блокируют предварительный отчёт.",
    },
  },
];

const questionLabels: Record<QuestionKey, string> = {
  payer: "Кто задержал оплату?",
  consequence: "Что будет, если ничего не делать?",
  move: "Что можно перенести?",
};

const normalizeQuestion = (value: string) =>
  value
    .toLocaleLowerCase("ru-RU")
    .replace(/ё/g, "е")
    .replace(/[^а-яa-z0-9\s-]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

const matchQuestion = (value: string): QuestionKey | null => {
  const question = normalizeQuestion(value);

  if (/кто|плат|дебитор|долж|задерж/.test(question)) return "payer";
  if (/ничего|будет|последств|риск|случит/.test(question)) return "consequence";
  if (/перен|сделат|действ|решен|снизит|исправ/.test(question)) return "move";

  return null;
};

document.querySelectorAll<HTMLElement>("[data-v2-cfo-game]").forEach((root) => {
  if (root.dataset.initialized === "true") return;
  root.dataset.initialized = "true";

  const date = root.querySelector<HTMLTimeElement>("[data-game-date]");
  const progress = root.querySelector<HTMLElement>("[data-game-progress]");
  const kicker = root.querySelector<HTMLElement>("[data-signal-kicker]");
  const title = root.querySelector<HTMLElement>("[data-signal-title]");
  const summary = root.querySelector<HTMLElement>("[data-signal-summary]");
  const detail = root.querySelector<HTMLElement>("[data-signal-detail]");
  const changed = root.querySelector<HTMLElement>("[data-signal-changed]");
  const why = root.querySelector<HTMLElement>("[data-signal-why]");
  const horizon = root.querySelector<HTMLElement>("[data-signal-horizon]");
  const action = root.querySelector<HTMLElement>("[data-signal-action]");
  const basisButton = root.querySelector<HTMLButtonElement>("[data-basis-button]");
  const basis = root.querySelector<HTMLElement>("[data-basis]");
  const sources = root.querySelector<HTMLElement>("[data-source-list]");
  const calculation = root.querySelector<HTMLElement>("[data-calculation]");
  const rule = root.querySelector<HTMLElement>("[data-rule]");
  const dialog = root.querySelector<HTMLElement>("[data-dialog]");
  const answer = root.querySelector<HTMLElement>("[data-answer]");
  const form = root.querySelector<HTMLFormElement>("[data-question-form]");
  const input = root.querySelector<HTMLInputElement>("[data-question-input]");
  const nextButton = root.querySelector<HTMLButtonElement>("[data-next-day]");
  const history = root.querySelector<HTMLOListElement>("[data-history]");
  const liveStatus = root.querySelector<HTMLElement>("[data-live-status]");
  const presetButtons = root.querySelectorAll<HTMLButtonElement>("[data-question-key]");

  if (
    !date ||
    !progress ||
    !kicker ||
    !title ||
    !summary ||
    !detail ||
    !changed ||
    !why ||
    !horizon ||
    !action ||
    !basisButton ||
    !basis ||
    !sources ||
    !calculation ||
    !rule ||
    !dialog ||
    !answer ||
    !form ||
    !input ||
    !nextButton ||
    !history ||
    !liveStatus
  ) {
    return;
  }

  let currentIndex = -1;

  const setBasisOpen = (open: boolean) => {
    basis.hidden = !open;
    basisButton.setAttribute("aria-expanded", String(open));
    basisButton.textContent = open ? "Скрыть основание" : "Показать основание";
  };

  const resetAnswer = () => {
    answer.textContent = "Выберите готовое уточнение или задайте короткий вопрос.";
    answer.dataset.state = "empty";
    input.value = "";
  };

  const renderHistory = () => {
    history.replaceChildren();

    const calmItem = document.createElement("li");
    calmItem.textContent = "11 августа — всё спокойно";
    if (currentIndex === -1) calmItem.setAttribute("aria-current", "step");
    history.append(calmItem);

    signals.slice(0, currentIndex + 1).forEach((signal, index) => {
      const item = document.createElement("li");
      item.textContent = `${signal.date} — ${signal.title}`;
      if (index === currentIndex) item.setAttribute("aria-current", "step");
      history.append(item);
    });
  };

  const renderSources = (items: SourceItem[]) => {
    sources.replaceChildren();

    items.forEach((item) => {
      const row = document.createElement("div");
      row.className = "v2-game__source";

      const term = document.createElement("dt");
      term.textContent = `${item.label}: ${item.value}`;

      const description = document.createElement("dd");
      description.textContent = `${item.source}; обновлено ${item.updated}`;

      row.append(term, description);
      sources.append(row);
    });
  };

  const renderCalm = (announce = false) => {
    root.dataset.state = "calm";
    date.dateTime = "2026-08-11";
    date.textContent = "11 августа";
    progress.textContent = "День 1 из 5";
    kicker.textContent = "Финансовый помощник наблюдает за изменениями";
    title.textContent = "Пока всё спокойно.";
    summary.textContent = "Новых ситуаций, требующих решения руководителя, нет.";
    detail.hidden = true;
    dialog.hidden = true;
    setBasisOpen(false);
    nextButton.textContent = "Следующий день";
    nextButton.setAttribute("aria-label", "Перейти к следующему учебному дню");
    renderHistory();
    resetAnswer();

    if (announce) {
      liveStatus.textContent = "Сценарий начат заново. 11 августа, всё спокойно.";
    }
  };

  const renderSignal = (index: number) => {
    const signal = signals[index];
    root.dataset.state = "signal";
    date.dateTime = signal.dateTime;
    date.textContent = signal.date;
    progress.textContent = `День ${index + 2} из 5`;
    kicker.textContent = "Финансовый помощник заметил важное";
    title.textContent = signal.title;
    summary.textContent = signal.summary;
    changed.textContent = signal.changed;
    why.textContent = signal.why;
    horizon.textContent = signal.horizon;
    action.textContent = signal.action;
    calculation.textContent = signal.calculation;
    rule.textContent = signal.rule;
    renderSources(signal.sources);
    detail.hidden = false;
    dialog.hidden = false;
    setBasisOpen(false);
    resetAnswer();
    renderHistory();

    const isLast = index === signals.length - 1;
    nextButton.textContent = isLast ? "Начать заново" : "Следующий день";
    nextButton.setAttribute(
      "aria-label",
      isLast ? "Начать учебный сценарий заново" : "Перейти к следующему учебному дню",
    );
    liveStatus.textContent = `${signal.date}. Новый сигнал: ${signal.title}`;
  };

  const answerQuestion = (key: QuestionKey) => {
    if (currentIndex < 0) return;

    answer.textContent = signals[currentIndex].answers[key];
    answer.dataset.state = "answered";
    liveStatus.textContent = `Ответ на вопрос «${questionLabels[key]}» показан.`;
  };

  basisButton.addEventListener("click", () => {
    const willOpen = basisButton.getAttribute("aria-expanded") !== "true";
    setBasisOpen(willOpen);
    liveStatus.textContent = willOpen
      ? "Показано основание сигнала: источники, расчёт и правило важности."
      : "Основание сигнала скрыто.";
  });

  presetButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.questionKey as QuestionKey | undefined;
      if (key && key in questionLabels) answerQuestion(key);
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (currentIndex < 0) return;

    const value = input.value.slice(0, 180).trim();
    if (!value) {
      answer.textContent = "Напишите вопрос или выберите одно из трёх готовых уточнений.";
      answer.dataset.state = "empty";
      return;
    }

    const key = matchQuestion(value);
    if (key) {
      answerQuestion(key);
      return;
    }

    answer.textContent =
      "В этой учебной версии я умею ответить только на три уточнения выше. Выберите ближайшее — я не буду придумывать ответ.";
    answer.dataset.state = "limited";
    liveStatus.textContent = "Вопрос не распознан. Показано ограничение учебной версии.";
  });

  nextButton.addEventListener("click", () => {
    if (currentIndex === signals.length - 1) {
      currentIndex = -1;
      renderCalm(true);
      return;
    }

    currentIndex += 1;
    renderSignal(currentIndex);
  });

  renderCalm();
});
