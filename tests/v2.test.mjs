import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { test } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const routeFile = (route) => path.join(dist, route, "index.html");
const count = (text, pattern) => (text.match(pattern) ?? []).length;

const v2Routes = [
  "v2",
  "v2/primer",
  "v2/uchet",
  "v2/avtomatizatsiya-bek-ofisa",
  "v2/partneram"
];

test("version 2 routes and machine-readable map are built", async () => {
  for (const route of [...v2Routes, "v2/ii-agenty"]) await access(routeFile(route));
  await access(path.join(dist, "v2", "llms.txt"));
});

test("every primary version 2 page has its own metadata and four-job navigation", async () => {
  for (const route of v2Routes) {
    const html = await readFile(routeFile(route), "utf8");
    assert.equal(count(html, /<h1(?:\s|>)/g), 1, `${route} must have exactly one h1`);
    assert.equal(count(html, /<meta name="description"/g), 1, `${route} must have one description`);
    assert.equal(count(html, /<link rel="canonical"/g), 1, `${route} must have one canonical`);
    assert.match(html, /<meta name="robots" content="noindex, follow">/);
    assert.equal(count(html, /class="v2-side-link"/g), 4, `${route} must have four primary destinations`);
    assert.match(html, /Увидеть важное/);
    assert.match(html, /Наладить учёт/);
    assert.match(html, /Автоматизировать операции/);
    assert.match(html, /Стать партнёром/);
    assert.doesNotMatch(html, />Кейсы</);
    assert.doesNotMatch(html, /class="v2-header"|class="site-header"|class="site-footer"|contact-dialog|src="\/site\.js"/);
  }
});

test("homepage communicates one promise in four canonical screens", async () => {
  const html = await readFile(routeFile("v2"), "utf8");
  assert.equal(count(html, /data-v2-screen=/g), 4);
  assert.match(html, /Aivel сам сообщает, что стало <span class="v2-accent-word">важным\.<\/span>/);
  assert.match(html, /Пока ещё можно повлиять/);
  assert.equal(count(html, /Посмотреть сигнал/g), 1);
  assert.match(html, /Сигнал для руководителя/);
  assert.match(html, /Через 12 дней может не хватить 2,4 млн ₽/);
  assert.match(html, /Почему важно/);
  assert.match(html, /Что сделать сейчас/);
  assert.match(html, /Основание/);
  assert.match(html, /80%/);
  assert.match(html, /98%/);
  assert.match(html, /до 95%/);
  assert.match(html, /Обычно это узнают слишком поздно/);
  assert.match(html, /Сигнал появляется не из воздуха/);
  assert.match(html, /Каждый сигнал можно открыть до источника/);
  assert.match(html, /Источники/);
  assert.match(html, /Надёжный учёт/);
  assert.match(html, /Знания о компании/);
  assert.match(html, /Контекст бизнеса/);
  assert.match(html, /Чем Aivel отличается от отчёта или дашборда/);
  assert.match(html, /Обычно:<\/strong> Показывает прошлый период/);
  assert.match(html, /Aivel:<\/strong> Сам сообщает/);
  assert.equal(count(html, /role="tab"/g), 4);
  assert.equal(count(html, /role="tabpanel"/g), 4);
  assert.equal(count(html, /class="v2-number"/g), 4);
  assert.equal(count(html, /class="v2-path-grid"/g), 1);
  assert.match(html, /Владельцу и CEO/);
  assert.match(html, /class="v2-audience-surface v2-team-surface"/);
  assert.doesNotMatch(html, /v2-team-mark|v2-team-grid|v2-trust-surface/);
  assert.ok(html.indexOf("Aivel сам сообщает") < html.indexOf("Обычно это узнают слишком поздно"));
  assert.ok(html.indexOf("Обычно это узнают слишком поздно") < html.indexOf("Сигнал появляется не из воздуха"));
  assert.ok(html.indexOf("Сигнал появляется не из воздуха") < html.indexOf("Каждый сигнал можно открыть до источника"));
});

test("sandbox creates the aha for four industries without a dashboard", async () => {
  const html = await readFile(routeFile("v2/primer"), "utf8");
  assert.match(html, /Посмотрите, что Aivel/);
  assert.match(html, /Данные учебные\. Вопросы остаются в вашем браузере/);
  assert.equal(count(html, /data-scenario-select=/g), 4);
  assert.equal(count(html, /data-scenario-panel=/g), 4);
  assert.match(html, /ИТ и услуги/);
  assert.match(html, /Торговля и доставка/);
  assert.match(html, /Проектный бизнес/);
  assert.match(html, /Сложный учёт/);
  assert.match(html, /Через 12 дней может не хватить 2,4 млн ₽/);
  assert.match(html, /снизилась с 24% до 16%/);
  assert.match(html, /47% просроченной задолженности/);
  assert.match(html, /19 операций на 3,8 млн ₽/);
  assert.match(html, /Показать основание/);
  assert.match(html, /Правило важности/);
  assert.match(html, /aria-live="polite"/);
  assert.match(html, /maxlength="180"/);
  assert.match(html, /Следующий день/);
  assert.match(html, /Записаться на показ на своих данных/);
  assert.match(html, /На ваших данных всё начинается с учёта/);
  assert.match(html, /Проверить готовность учёта/);
  assert.doesNotMatch(html, /data-history|v2-game__timeline|панел[ьи] показател/i);
  assert.doesNotMatch(html, /type="tel"|name="email"|name="phone"/);
});

test("accounting page makes service scope and price recognition explicit", async () => {
  const html = await readFile(routeFile("v2/uchet"), "utf8");
  assert.equal(count(html, /data-v2-screen=/g), 4);
  assert.match(html, /Точный вывод начинается с/);
  assert.match(html, /Данные должны сходиться до того, как появится сигнал/);
  assert.match(html, /ИТ и услуги/);
  assert.match(html, /Торговля и доставка/);
  assert.match(html, /Группа компаний/);
  assert.match(html, /Документы/);
  assert.match(html, /Деньги/);
  assert.match(html, /Операции/);
  assert.match(html, /Учётная база/);
  assert.match(html, /Типовой поток ведёт ИИ\. Исключения разбирает специалист/);
  assert.equal(count(html, /class="v2-agent-showcase"/g), 1);
  assert.match(html, /Первичные документы/);
  assert.match(html, /Банковские операции/);
  assert.match(html, /Сверки/);
  assert.match(html, /Закрытие периода/);
  assert.match(html, /Зарплата и кадры/);
  assert.match(html, /1С — рабочая база, которую мы берём на обслуживание/);
  assert.match(html, /Узнайте себя — и начните с экспресс-аудита/);
  assert.match(html, /ИТ-компания/);
  assert.match(html, /до 50 сотрудников/);
  assert.match(html, /Одна компания/);
  assert.match(html, /Группа компаний/);
  assert.equal(count(html, /class="v2-pricing-row/g), 4);
  assert.match(html, /Рассчитаем после короткого разбора/);
  assert.doesNotMatch(html, /Черновой ориентир|80[\s&nbsp;]*000 ₽ в месяц|120[\s&nbsp;]*000 ₽ в месяц|300[\s&nbsp;]*000 ₽ в месяц/);
  assert.doesNotMatch(html, /"priceCurrency"/);
  assert.match(html, /FAQPage/);
  assert.match(html, /Бизнес ДДХ вырос в два раза без найма новых бухгалтеров/);
  assert.match(html, /Начнём с экспресс-аудита/);
});

test("enterprise page sells six end-to-end AI processes and keeps evidence nearby", async () => {
  const html = await readFile(routeFile("v2/avtomatizatsiya-bek-ofisa"), "utf8");
  assert.equal(count(html, /data-v2-screen=/g), 4);
  assert.match(html, /Для крупных компаний/);
  assert.match(html, /Передать повторяющиеся операции ИИ/);
  assert.match(html, /Сохранить контроль/);
  assert.match(html, /Операция целиком/);
  assert.match(html, /готово поступление в 1С/);
  assert.equal(count(html, /class="v2-enterprise-agent-row"/g), 6);
  assert.match(html, /Первичные документы/);
  assert.match(html, /Банковские операции/);
  assert.match(html, /Закрытие периода/);
  assert.match(html, /Зарплата и кадры/);
  assert.match(html, /Запросы подразделений/);
  assert.match(html, /ИИ делает типовое\. Человек отвечает за исключения/);
  assert.match(html, /OCR заканчивается распознаванием/);
  assert.match(html, /Правила важности/);
  assert.match(html, /Сравнение с обычным ходом бизнеса/);
  assert.match(html, /внутреннего согласования/);
  assert.match(html, /FAQPage/);
  assert.match(html, /Нефтьмагистраль/);
  assert.match(html, /Братья Караваевы/);
  assert.equal(count(html, />70%<\/strong>/g), 2);
  assert.match(html, /80%/);
  assert.match(html, /98%/);
  assert.match(html, /До 95%/);
});

test("old cases address points to the new enterprise job", async () => {
  const html = await readFile(routeFile("v2/ii-agenty"), "utf8");
  assert.match(html, /http-equiv="refresh" content="0;url=\/v2\/avtomatizatsiya-bek-ofisa\/"/);
  assert.match(html, /rel="canonical" href="[^"]+\/v2\/avtomatizatsiya-bek-ofisa\/"/);
  assert.match(html, /noindex, follow/);
});

test("partner page states the model and answers six owner questions", async () => {
  const html = await readFile(routeFile("v2/partneram"), "utf8");
  assert.equal(count(html, /data-v2-screen=/g), 4);
  assert.match(html, /Расти без найма/);
  assert.match(html, /Стать финансовым партнёром/);
  assert.match(html, /Вы отвечаете за рост\. Мы — за производительность/);
  assert.match(html, /приобретает от 51%/);
  assert.match(html, /корпоративным договором/);
  assert.match(html, /Основа создана\. Окно для лидеров ещё открыто/);
  assert.match(html, /400\+ млн ₽/);
  assert.equal(count(html, /<details>/g), 6);
  assert.match(html, /три–четыре недели/);
  assert.match(html, /не включает гарантированный поток новых клиентов/);
  assert.match(html, /Заполнить анкету партнёра/);
});

test("machine-readable map mirrors the four jobs, price boundary and evidence", async () => {
  const text = await readFile(path.join(dist, "v2", "llms.txt"), "utf8");
  assert.match(text, /финансовый помощник, который сам замечает/);
  assert.match(text, /\/v2\/primer\//);
  assert.match(text, /\/v2\/uchet\//);
  assert.match(text, /\/v2\/avtomatizatsiya-bek-ofisa\//);
  assert.match(text, /Кейсы не образуют отдельного раздела/);
  assert.match(text, /Числовые цены Aivel пока не утверждены/);
  assert.match(text, /Отчёт|Дашборд/);
  assert.doesNotMatch(text, /80 000|120 000|300 000|priceCurrency/);
  assert.match(text, /80% общего входящего потока/);
  assert.match(text, /98% точности/);
  assert.match(text, /до 95% сверок/);
  assert.match(text, /не должны складываться/);
  assert.match(text, /info@aivel\.ru/);
});

test("version 2 implements the measured Next Move editorial canon", async () => {
  const css = await readFile(path.join(root, "src", "styles", "v2.css"), "utf8");
  const game = await readFile(path.join(root, "src", "components", "v2", "CfoGame.astro"), "utf8");
  assert.match(css, /--v2-bg: #fcfdff;/);
  assert.match(css, /--v2-sidebar: #f5f5f7;/);
  assert.match(css, /--v2-ink: #0f1722;/);
  assert.match(css, /--v2-rail-width: 100px;/);
  assert.match(css, /--v2-shell: 1120px;/);
  assert.match(css, /background: linear-gradient\(90deg, #0a4d8c, #2997ff\)/);
  assert.match(css, /\.v2-sidebar \{[\s\S]*position: sticky;/);
  assert.match(css, /\.v2-side-link\[aria-current="page"\][\s\S]*background: #fff;/);
  assert.match(css, /padding-top: 104px;/);
  assert.match(css, /\.v2-hero-grid \{[\s\S]*grid-template-columns: minmax\(0, 1\.02fr\) minmax\(360px, \.86fr\)/);
  assert.match(css, /\.v2-signal-card/);
  assert.match(css, /\.v2-proof-strip/);
  assert.match(css, /\.v2-workflow-surface/);
  assert.match(css, /\.v2-agent-showcase/);
  assert.match(css, /\.v2-recognition \{[\s\S]*grid-template-columns: 320px minmax\(0, 1fr\)/);
  assert.match(css, /\.v2-number[\s\S]*background: var\(--v2-button\)/);
  assert.match(css, /\.v2-audience-surface[\s\S]*padding: 40px;/);
  assert.match(css, /@media \(max-width: 767px\)[\s\S]*\.v2-sidebar \{[\s\S]*display: none;/);
  assert.doesNotMatch(css + game, /#a95f14|#7d430d|#132033|#0c1727|#376650/i);
});
