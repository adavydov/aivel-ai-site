(() => {
  const platformScreen = [...document.querySelectorAll(".ai-screen")].find(
    (screen) => screen.querySelector(".kicker")?.textContent.trim() === "Платформа",
  );

  if (!platformScreen) return;

  const step = ({ number, title, text, automation, position }) => `
    <article class="cycle-step cycle-step--${position}" role="listitem">
      <div class="cycle-step__topline">
        <span>${number}</span>
        <div
          class="cycle-step__gauge"
          style="--automation:${automation}"
          role="img"
          aria-label="${automation}% шага выполняется автоматически"
        >
          <strong>${automation}%</strong>
        </div>
      </div>
      <h4>${title}</h4>
      <p>${text}</p>
    </article>
  `;

  platformScreen.classList.add("platform-cycle");
  platformScreen.innerHTML = `
    <div class="platform-cycle__heading">
      <div>
        <p class="kicker">Платформа</p>
        <h3 id="platform-cycle-title">Замкнутый цикл улучшений</h3>
        <p class="body-copy">
          Каждое ручное исключение становится данными для следующего релиза.
          Платформа измеряет хвост, находит повторяемые классы и после проверки
          возвращает автоматизацию в тот же производственный поток.
        </p>
      </div>
      <div class="cycle-legend" aria-label="Легенда">
        <span><i></i> автоматически</span>
        <span><i></i> с участием человека</span>
      </div>
    </div>

    <div
      class="cycle-loop"
      aria-label="Замкнутый цикл из шести шагов: собрать, классифицировать, выбрать, доработать, проверить и развернуть. После нового замера цикл повторяется."
    >
      <div class="cycle-orbit" role="list">
        <div class="cycle-orbit__ring" aria-hidden="true"></div>

        ${step({
          number: "01",
          title: "Собрать",
          text: "Записать все исключения и контекст операции.",
          automation: 100,
          position: "top",
        })}
        ${step({
          number: "02",
          title: "Классифицировать",
          text: "Объединить повторяемые причины ручного хвоста.",
          automation: 80,
          position: "upper-right",
        })}
        ${step({
          number: "03",
          title: "Выбрать",
          text: "Оценить частоту, деньги и риск каждого класса.",
          automation: 50,
          position: "lower-right",
        })}
        ${step({
          number: "04",
          title: "Доработать",
          text: "Подготовить правило, промпт или изменение процесса.",
          automation: 75,
          position: "bottom",
        })}
        ${step({
          number: "05",
          title: "Проверить",
          text: "Сравнить touchless rate, SLA и ошибки.",
          automation: 90,
          position: "lower-left",
        })}
        ${step({
          number: "06",
          title: "Развернуть",
          text: "Утвердить релиз и измерить новый результат.",
          automation: 50,
          position: "upper-left",
        })}

        <span class="orbit-arrow orbit-arrow--1" aria-hidden="true">→</span>
        <span class="orbit-arrow orbit-arrow--2" aria-hidden="true">→</span>
        <span class="orbit-arrow orbit-arrow--3" aria-hidden="true">→</span>
        <span class="orbit-arrow orbit-arrow--4" aria-hidden="true">→</span>
        <span class="orbit-arrow orbit-arrow--5" aria-hidden="true">→</span>
        <span class="orbit-arrow orbit-arrow--6" aria-hidden="true">→</span>

        <div class="cycle-hub">
          <span>Known class</span>
          <strong>→ touchless</strong>
          <p>Новый замер возвращается в цикл</p>
        </div>
      </div>
    </div>

    <section class="touchless-forecast" aria-labelledby="touchless-forecast-title">
      <div class="touchless-forecast__intro">
        <p class="kicker">Прогноз на 6 месяцев</p>
        <h4 id="touchless-forecast-title">
          Средний touchless rate
          <span>60%</span><b aria-hidden="true">→</b><span>74%</span>
        </h4>
        <p>
          Сценарий предполагает, что за полгода мы переведём в touchless
          половину уже известных классов ручного хвоста.
        </p>
      </div>

      <div class="forecast-scale" role="img" aria-label="Средний touchless rate: 60% сейчас, 74% через 6 месяцев, технический потолок известных классов 87%">
        <div class="forecast-scale__track">
          <i class="forecast-scale__current"></i>
          <i class="forecast-scale__uplift"></i>
          <span class="forecast-scale__target" aria-hidden="true"></span>
          <span class="forecast-scale__ceiling" aria-hidden="true"></span>
        </div>
        <div class="forecast-scale__labels">
          <span style="left:60%"><b>60%</b> сейчас</span>
          <span style="left:74%"><b>74%</b> 6 месяцев</span>
          <span style="left:87%"><b>87%</b> потолок</span>
        </div>
      </div>

      <div class="known-class-insight">
        <strong>69%</strong>
        <div>
          <span>ручного хвоста уже относится к known classes</span>
          <p>
            Это не гипотетические новые кейсы: причины повторяются и уже
            классифицированы. Главный рычаг роста — превращать известные классы
            в новые touchless-сценарии.
          </p>
        </div>
      </div>

      <div class="forecast-agent-grid" aria-label="Прогноз touchless rate по агентам">
        <article>
          <span>Первичка</span>
          <strong>82% → 89%</strong>
          <small>known-class rate 78%</small>
        </article>
        <article>
          <span>Банк-клиент</span>
          <strong>76% → 86%</strong>
          <small>known-class rate 83%</small>
        </article>
        <article>
          <span>Коммуникации</span>
          <strong>21% → 46%</strong>
          <small>known-class rate 62%</small>
        </article>
      </div>

      <p class="forecast-note">
        Модель: текущий touchless rate + 50% известной части ручного хвоста.
        Полная автоматизация известных классов дала бы средний технический
        потолок ≈87%; это ориентир, а не обещание.
      </p>
    </section>
  `;
})();
