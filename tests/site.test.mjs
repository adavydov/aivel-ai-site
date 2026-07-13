import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import { test } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");

const questionSlugs = [
  "pochemu-pribyl-est-a-deneg-net",
  "hvatit-li-deneg-na-nalogi-i-zarplatu",
  "skolko-deneg-mozhno-vyvesti",
  "kakie-klienty-i-proekty-pribylny",
  "gde-vyrosli-rashody",
  "mozhno-li-nanyat-sotrudnika",
  "na-skolko-mesyatsev-hvatit-deneg",
  "kto-zaderzhivaet-oplatu",
  "kakie-obyazatelstva-vperedi",
  "chto-izmenilos-za-mesyats"
];

const routes = [
  "",
  "vazhnoe",
  "resheniya/dengi-i-obyazatelstva",
  "resheniya/pribyl-i-rentabelnost",
  "resheniya/rost-naim-i-zapas-deneg",
  "buhgalterskoe-soprovozhdenie",
  "kak-rabotaet",
  "avtomatizatsiya-ucheta",
  "avtomatizatsiya-ucheta/pervichnye-dokumenty",
  "avtomatizatsiya-ucheta/bankovskie-operatsii",
  "avtomatizatsiya-ucheta/kommunikatsii-s-klientami",
  "avtomatizatsiya-ucheta/sverki-s-kontragentami",
  "avtomatizatsiya-ucheta/zakrytie-perioda",
  "avtomatizatsiya-ucheta/zarplata-i-kadry",
  "avtomatizatsiya-ucheta/kontrol-kachestva",
  "kak-formiruetsya-otvet",
  "dannye-i-istochniki",
  "1s-i-integratsii",
  "zashchita-dannyh",
  "ogranicheniya",
  "buhgalterskim-kompaniyam",
  "krupnym-kompaniyam",
  "o-kompanii",
  "dlya-ii-agentov",
  "kontakty"
];

const routeFile = (route) => path.join(dist, route, "index.html");
const count = (text, pattern) => (text.match(pattern) ?? []).length;

const listHtmlFiles = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? listHtmlFiles(file) : entry.name.endsWith(".html") ? [file] : [];
  }));
  return nested.flat();
};

test("site has been built", async () => {
  await access(path.join(dist, "index.html"));
});

test("homepage explains the product in three clear screens", async () => {
  const html = await readFile(path.join(dist, "index.html"), "utf8");
  assert.match(html, /Вовремя узнавайте о важном в бизнесе\./);
  assert.match(html, /Сигнал для руководителя/);
  assert.match(html, /Можно получать и в Telegram/);
  assert.match(html, /Почему важно/);
  assert.match(html, /Что сделать сейчас/);
  assert.match(html, /Основание/);
  assert.match(html, /Не просто находит отклонение — понимает его смысл/);
  assert.match(html, /Проверенный слой учёта/);
  assert.match(html, /Знания о компании и связях/);
  assert.match(html, /Контекст бизнеса/);
  assert.match(html, /ИИ-агент Aivel/);
  assert.match(html, /Можно уточнить/);
  assert.match(html, /За каждым сигналом — понятный путь к данным/);
  assert.match(html, /Правило и граница/);
  assert.match(html, /Расчёт показателя/);
  assert.match(html, /Операции и источники/);
  assert.match(html, /Нужна проверка/);
  assert.match(html, /Опыт команды/);
  assert.match(html, /Знаем учётные процессы изнутри/);
  assert.match(html, /Гольфстрим/);
  assert.match(html, /Записаться на демо/);
  assert.equal(count(html, /class="signal-slide"/g), 4);
  assert.doesNotMatch(html, /Что вы боитесь узнать|Посмотреть примеры сообщений|Разобрать ситуацию/);
  assert.doesNotMatch(html, /Не отчёт ради отчёта|Четыре ИИ-помощника поддерживают данные в порядке/);
  assert.doesNotMatch(html, /data-signal-carousel-prev|data-signal-carousel-next|message-detail-link/);
  assert.doesNotMatch(html, /Цифровые сотрудники для вашего бизнеса/);
  assert.doesNotMatch(html, /ничего важного не пропустим|всегда вовремя|в реальном времени/i);
});

test("accounting page leads from a reliable foundation to agents, 1C and an audit", async () => {
  const html = await readFile(routeFile("buhgalterskoe-soprovozhdenie"), "utf8");
  assert.match(html, /Чтобы увидеть важное, сначала нужен точный учёт/);
  assert.match(html, /От исходных данных — до сигнала руководителю/);
  assert.match(html, /ЭДО и почта/);
  assert.match(html, /iiko и другие рабочие системы/);
  assert.match(html, /Выполняем и проверяем/);
  assert.match(html, /Человек — на исключениях/);
  assert.match(html, /Формируем проверенную базу/);
  assert.match(html, /Aivel замечает важное/);
  assert.match(html, /Быстро обрабатывают поток. Точно ведут учёт. Не теряют исключения/);
  assert.match(html, /Почти сразу/);
  assert.match(html, /По единым правилам/);
  assert.match(html, /Ничего не теряется/);
  assert.equal(count(html, /class="agent-card"/g), 6);
  assert.equal(count(html, /id="rezultaty-vnedreniy"/g), 1);
  assert.match(html, /80% документов/);
  assert.match(html, /98% — точность сопоставления/);
  assert.match(html, /До 95% сверок/);
  assert.match(html, /Каждая стандартная проверка получает статус/);
  assert.match(html, /Расчёт и кадровые события проходят единый перечень проверок/);
  assert.match(html, /href="\/avtomatizatsiya-ucheta\/pervichnye-dokumenty\//);
  assert.match(html, /href="\/avtomatizatsiya-ucheta\/bankovskie-operatsii\//);
  assert.match(html, /href="\/avtomatizatsiya-ucheta\/kommunikatsii-s-klientami\//);
  assert.match(html, /href="\/avtomatizatsiya-ucheta\/sverki-s-kontragentami\//);
  assert.match(html, /href="\/avtomatizatsiya-ucheta\/zakrytie-perioda\//);
  assert.match(html, /href="\/avtomatizatsiya-ucheta\/zarplata-i-kadry\//);
  assert.match(html, /1С на обслуживании/);
  assert.match(html, /Лицензии и запуск/);
  assert.match(html, /Облако или контур компании/);
  assert.match(html, /href="\/1s-i-integratsii\//);
  assert.match(html, /Экспресс-аудит покажет, с какого участка начать/);
  assert.match(html, /Запросить экспресс-аудит/);
  assert.ok(html.indexOf("От исходных данных — до сигнала руководителю") < html.indexOf("Быстро обрабатывают поток"));
  assert.ok(html.indexOf("Быстро обрабатывают поток") < html.indexOf("1С на обслуживании"));
  assert.ok(html.indexOf("1С на обслуживании") < html.indexOf("Экспресс-аудит покажет"));
  assert.doesNotMatch(html, /class="helper-tab"|Следующий контур|Что входит в основу|Доказательство по процессам/);
});

test("1C page sells the complete service and connects it to accounting agents", async () => {
  const html = await readFile(routeFile("1s-i-integratsii"), "utf8");
  assert.match(html, /Лицензии, размещение и поддержка 1С — в одной команде с учётом/);
  assert.match(html, /Лицензии и запуск/);
  assert.match(html, /Облако или контур компании/);
  assert.match(html, /Техническое обслуживание/);
  assert.match(html, /Доработки и обмены/);
  assert.match(html, /Каждое изменение — по понятному маршруту/);
  assert.match(html, /От документа — до результата в 1С без разрыва процесса/);
  assert.match(html, /href="\/buhgalterskoe-soprovozhdenie\/#ii-pomoshchniki"/);
  assert.match(html, /Запросить экспресс-аудит/);
  assert.doesNotMatch(html, /on-prem|end-to-end/i);
});

test("legacy results route redirects to the accounting evidence", async () => {
  const html = await readFile(routeFile("rezultaty"), "utf8");
  assert.match(html, /http-equiv="refresh"/i);
  assert.match(html, /\/buhgalterskoe-soprovozhdenie\//);
  assert.match(html, /noindex/i);
  assert.doesNotMatch(html, /Увидеть изменение\. Понять причину\. Успеть действовать/);
});

test("mechanics page starts with a real operation and distinguishes Aivel from recognition", async () => {
  const html = await readFile(routeFile("kak-rabotaet"), "utf8");
  assert.match(html, /ИИ выполняет типовую операцию\. Человек решает исключение/);
  assert.match(html, /Учебный мини-кейс/);
  assert.match(html, /Расхождение \+20 тыс\. ₽/);
  assert.match(html, /изолированном российском контуре или внутри контура компании/);
  assert.match(html, /Аудиторский след/);
  assert.match(html, /Обычное распознавание закрывает фрагмент\. Aivel — процесс целиком/);
  assert.match(html, /От источника — до результата в 1С/);
  assert.ok(html.indexOf("Учебный мини-кейс") < html.indexOf("Почему можно доверять"));
  assert.ok(html.indexOf("Почему можно доверять") < html.indexOf("Не только распознавание"));
  assert.doesNotMatch(html, /Покажем один процесс от начала до результата/);
});

test("partner page tells one clear story from value to the next step", async () => {
  const html = await readFile(routeFile("buhgalterskim-kompaniyam"), "utf8");
  assert.match(html, /Расти без найма/);
  assert.match(html, /Стать финансовым партнёром для клиента/);
  assert.match(html, /В чём суть партнёрства/);
  assert.match(html, /Что получает собственник/);
  assert.match(html, /Почему сейчас/);
  assert.match(html, /Частые вопросы/);
  assert.match(html, /Следующий шаг/);
  assert.equal(count(html, /class="partner-faq-item"/g), 6);
  assert.match(html, /Не потеряю ли я контроль и не отстраните ли меня после сделки/);
  assert.match(html, /корпоративный договор/);
  assert.match(html, /Партнёр отвечает за рост, новую выручку, развитие существующей базы и клиентский сервис/);
  assert.match(html, /Aivel отвечает за технологии, организацию производственного процесса, его эффективность и целевую рентабельность/);
  assert.match(html, /Как убедиться, что технология действительно работает/);
  assert.match(html, /в бухгалтерских компаниях и у крупных корпоративных клиентов/);
  assert.match(html, /по согласованию с действующим клиентом и с соблюдением конфиденциальности/);
  assert.match(html, /сама сделка не включает гарантированный поток новых клиентов/);
  assert.match(html, /Как проходит покупка доли и сама сделка/);
  assert.match(html, /Обычно это занимает три–четыре недели/);
  assert.match(html, /Можно ли продать меньше 51% или провести сделку поэтапно/);
  assert.match(html, /Продажа 100% и согласованный выход собственника/);
  assert.match(html, /От чего зависит оценка компании/);
  assert.match(html, /концентрация выручки на отдельных клиентах/);
  assert.match(html, /400\+ млн ₽/);
  assert.match(html, /1 000\+/);
  assert.match(html, /3 страны/);
  assert.match(html, /Новые регионы/);
  assert.match(html, /Новые отрасли/);
  assert.match(html, /Новые специализации/);
  assert.match(html, /Расскажите о компании — найдём точку совпадения/);
  assert.ok(count(html, /51%/g) >= 2);
  assert.ok(html.indexOf("В чём ценность") < html.indexOf("В чём суть партнёрства"));
  assert.ok(html.indexOf("В чём суть партнёрства") < html.indexOf("Что получает собственник"));
  assert.ok(html.indexOf("Что получает собственник") < html.indexOf("Почему сейчас"));
  assert.ok(html.indexOf("Почему сейчас") < html.indexOf("Частые вопросы"));
  assert.ok(html.indexOf("Частые вопросы") < html.indexOf("Следующий шаг"));
  assert.doesNotMatch(html, /Расти без новой рутины|Пять вопросов, которые действительно важно прояснить|Следующие контуры|До обсуждения условий/);
  const footer = html.split("<footer")[1]?.split("</footer>")[0] ?? "";
  const header = html.split('<header class="site-header"')[1]?.split("</header>")[0] ?? "";
  for (const label of ["Увидеть важное", "Наладить учёт", "Понять, как это работает", "Стать партнёром"]) {
    assert.match(header, new RegExp(label));
    assert.match(footer, new RegExp(label));
  }
  assert.doesNotMatch(header, />Учёт как база<|>Как работает<|>Партнёрам</);
  assert.doesNotMatch(footer, /Обсудить партнёрство/);
  assert.match(footer, /Основное/);
  assert.match(footer, /Учёт и ИИ/);
  assert.match(footer, /Доверие и связь/);
  assert.doesNotMatch(footer, /Деньги и обязательства|Прибыль и расходы|Рост, найм и запас денег/);
});

test("assistant pages explain one complete process in four screens", async () => {
  const assistantSlugs = [
    "pervichnye-dokumenty",
    "bankovskie-operatsii",
    "kommunikatsii-s-klientami",
    "sverki-s-kontragentami",
    "zakrytie-perioda",
    "zarplata-i-kadry",
    "kontrol-kachestva"
  ];

  for (const slug of assistantSlugs) {
    const html = await readFile(routeFile(`avtomatizatsiya-ucheta/${slug}`), "utf8");
    assert.equal(count(html, /<section\b/g), 3, `${slug} must have one hero and three sections`);
    assert.match(html, /Операция целиком/);
    assert.match(html, /От входящих данных — до результата и исключения человеку/);
    assert.match(html, /Результат процесса/);
    assert.match(html, /Отличие Aivel/);
    assert.match(html, /Точечное решение/);
    assert.match(html, /Запросить демонстрацию/);
    assert.match(html, /drive\.google\.com\/file\/d\//);
  }
});

test("new accounting assistants describe the process without invented results", async () => {
  const closing = await readFile(routeFile("avtomatizatsiya-ucheta/zakrytie-perioda"), "utf8");
  const payroll = await readFile(routeFile("avtomatizatsiya-ucheta/zarplata-i-kadry"), "utf8");
  assert.match(closing, /Стандартные проверки периода — по одному регламенту и без пропусков/);
  assert.match(closing, /не объявляет период закрытым самостоятельно/i);
  assert.match(payroll, /Расчёт зарплаты и кадровый учёт/);
  assert.match(payroll, /итоговая выплата и отчётность остаются под контролем уполномоченного специалиста/i);
  assert.match(closing, /Первый запуск/);
  assert.match(payroll, /Первый запуск/);
  assert.doesNotMatch(`${closing}${payroll}`, />Пилот</);
});

test("important-change page presents proactive messages instead of a question interface", async () => {
  const html = await readFile(routeFile("vazhnoe"), "utf8");
  assert.match(html, /Telegram/);
  assert.match(html, /Сигнал для руководителя/);
  assert.match(html, /Почему важно/);
  assert.match(html, /Что сделать сейчас/);
  assert.match(html, /Основание/);
  assert.match(html, /не гарантирует обнаружение любого события/i);
  assert.equal(count(html, /class="signal-slide"/g), 4);
  assert.doesNotMatch(html, /Вы спрашиваете сами|Задать свой вопрос|Спросить можно о чём угодно/);
});

test("all primary routes render semantic pages", async () => {
  for (const route of routes) {
    const html = await readFile(routeFile(route), "utf8");
    assert.equal(count(html, /<h1[\s>]/g), 1, `${route || "/"} must have exactly one h1`);
    assert.equal(count(html, /<title>/g), 1, `${route || "/"} must have one title`);
    assert.match(html, /<meta name="description"/);
    assert.match(html, /<link rel="canonical"/);
    assert.match(html, /href="\/"/);
    assert.match(html, /href="\/kak-rabotaet\/"/);
  }
});

test("all ten situation pages exist and include signal provenance", async () => {
  for (const slug of questionSlugs) {
    const html = await readFile(routeFile(`voprosy/${slug}`), "utf8");
    assert.match(html, /Короткий ответ/);
    assert.match(html, /Источники сигнала и расчёта/);
    assert.match(html, /Что нельзя заключить автоматически/);
    assert.match(html, /Роль специалиста/);
  }
});

test("machine-readable discovery files include question pages", async () => {
  const sitemap = await readFile(path.join(dist, "sitemap.xml"), "utf8");
  const robots = await readFile(path.join(dist, "robots.txt"), "utf8");
  const llms = await readFile(path.join(dist, "llms.txt"), "utf8");
  for (const slug of questionSlugs) assert.match(sitemap, new RegExp(`/voprosy/${slug}/`));
  assert.match(sitemap, /\/vazhnoe\//);
  assert.doesNotMatch(sitemap, /\/rezultaty\//);
  assert.match(sitemap, /\/avtomatizatsiya-ucheta\/pervichnye-dokumenty\//);
  assert.match(sitemap, /\/avtomatizatsiya-ucheta\/zakrytie-perioda\//);
  assert.match(sitemap, /\/avtomatizatsiya-ucheta\/zarplata-i-kadry\//);
  assert.doesNotMatch(sitemap, /<loc>[^<]+\/voprosy\/<\/loc>/);
  assert.doesNotMatch(sitemap, /<loc>[^<]+\/istorii\/<\/loc>/);
  assert.match(robots, /OAI-SearchBot/);
  assert.match(llms, /Публичные примеры используют обезличенные учебные данные/);
  assert.match(llms, /\/avtomatizatsiya-ucheta\/zakrytie-perioda\//);
  assert.match(llms, /\/avtomatizatsiya-ucheta\/zarplata-i-kadry\//);
  assert.match(llms, /не гарантирует обнаружение любого события/i);
  assert.doesNotMatch(llms, /\/rezultaty\//);
});

test("legacy hubs redirect without hiding question and solution pages", async () => {
  const redirects = await readFile(path.join(dist, "_redirects"), "utf8");
  assert.match(redirects, /^\/voprosy \/vazhnoe\/#voprosy 301$/m);
  assert.match(redirects, /^\/resheniya \/vazhnoe\/ 301$/m);
  assert.match(redirects, /^\/istorii \/ 301$/m);
  assert.match(redirects, /^\/rezultaty \/buhgalterskoe-soprovozhdenie\/ 301$/m);
  assert.doesNotMatch(redirects, /\/voprosy\/\*/);
  assert.doesNotMatch(redirects, /\/resheniya\/\*/);
});

test("real product demonstrations are attached to the relevant pages", async () => {
  const how = await readFile(routeFile("kak-rabotaet"), "utf8");
  const primary = await readFile(routeFile("avtomatizatsiya-ucheta/pervichnye-dokumenty"), "utf8");
  const bank = await readFile(routeFile("avtomatizatsiya-ucheta/bankovskie-operatsii"), "utf8");
  const reconciliation = await readFile(routeFile("avtomatizatsiya-ucheta/sverki-s-kontragentami"), "utf8");
  assert.match(how, /drive\.google\.com\/file\/d\/1mjxxrczIp2mPWiIwWw1o2AerElWcS0vB\/preview/);
  assert.match(primary, /drive\.google\.com\/file\/d\/1mjxxrczIp2mPWiIwWw1o2AerElWcS0vB\/preview/);
  assert.match(bank, /drive\.google\.com\/file\/d\/1Brk_NX4ubphUg5mkhmDCxTWnTxE_De5A\/preview/);
  assert.match(bank, /общий обзор совместной работы нескольких помощников/i);
  assert.match(reconciliation, /drive\.google\.com\/file\/d\/13UrEvxoF5-LAdpLStHbuPHffqebFK139\/preview/);
});

test("all internal links resolve inside the static build", async () => {
  const pages = await listHtmlFiles(dist);
  const broken = [];

  for (const page of pages) {
    const html = await readFile(page, "utf8");
    const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((match) => match[1]);

    for (const href of hrefs) {
      if (!href.startsWith("/") || href.startsWith("//")) continue;
      const pathname = new URL(href, "http://localhost").pathname;
      const target = pathname.endsWith("/")
        ? path.join(dist, pathname, "index.html")
        : path.join(dist, pathname);
      try {
        await access(target);
      } catch {
        broken.push(`${path.relative(dist, page)} → ${href}`);
      }
    }
  }

  assert.deepEqual(broken, []);
});
