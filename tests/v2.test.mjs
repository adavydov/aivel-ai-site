import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { test } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const routeFile = (route) => path.join(dist, route, "index.html");
const count = (text, pattern) => (text.match(pattern) ?? []).length;

const v2Routes = ["v2", "v2/primer", "v2/uchet", "v2/ii-agenty", "v2/partneram"];

test("version 2 routes and machine-readable map are built", async () => {
  for (const route of v2Routes) await access(routeFile(route));
  await access(path.join(dist, "v2", "llms.txt"));
});

test("every version 2 page has independent metadata and no legacy shell", async () => {
  for (const route of v2Routes) {
    const html = await readFile(routeFile(route), "utf8");
    assert.equal(count(html, /<h1(?:\s|>)/g), 1, `${route} must have exactly one h1`);
    assert.equal(count(html, /<meta name="description"/g), 1, `${route} must have one description`);
    assert.equal(count(html, /<link rel="canonical"/g), 1, `${route} must have one canonical`);
    assert.match(html, /<meta name="robots" content="noindex, follow">/);
    assert.match(html, /href="\/v2\//);
    assert.doesNotMatch(html, /class="site-header"|class="site-footer"|contact-dialog|src="\/site\.js"/);
  }
});

test("homepage delivers one promise in four screens", async () => {
  const html = await readFile(routeFile("v2"), "utf8");
  assert.equal(count(html, /data-v2-screen=/g), 4);
  assert.match(html, /Вовремя увидеть важное\./);
  assert.match(html, /Система сообщила сама/);
  assert.match(html, /Важное редко выглядит важным сразу/);
  assert.match(html, /Сначала сообщает\. Потом отвечает\./);
  assert.match(html, /Опыт команды/);
  assert.match(html, /Компании, с которыми работала команда Aivel/);
  assert.match(html, /href="\/v2\/primer\//);
  assert.ok(html.indexOf("Вовремя увидеть важное") < html.indexOf("Важное редко выглядит важным сразу"));
  assert.ok(html.indexOf("Важное редко выглядит важным сразу") < html.indexOf("Сначала сообщает. Потом отвечает"));
  assert.ok(html.indexOf("Сначала сообщает. Потом отвечает") < html.indexOf("Опыт команды"));
  assert.doesNotMatch(html, /кадровый учёт|51%|400\+ млн/);
});

test("demo creates the aha before asking for contact data", async () => {
  const html = await readFile(routeFile("v2/primer"), "utf8");
  assert.match(html, /Учебная компания «Север»/);
  assert.match(html, /Все данные и названия вымышлены/);
  assert.match(html, /Через 12 дней может не хватить 2,4 млн ₽/);
  assert.match(html, /Что изменилось/);
  assert.match(html, /Почему это важно/);
  assert.match(html, /Показать основание|Скрыть основание/);
  assert.match(html, /Правило важности/);
  assert.match(html, /aria-live="polite"/);
  assert.match(html, /maxlength="180"/);
  assert.match(html, /Следующий день/);
  assert.ok(html.indexOf("Через 12 дней может не хватить") < html.indexOf("Хотите увидеть это на своих данных"));
  assert.doesNotMatch(html, /type="tel"|name="email"|name="phone"/);
});

test("accounting page connects the foundation, agents, people and 1C", async () => {
  const html = await readFile(routeFile("v2/uchet"), "utf8");
  assert.equal(count(html, /data-v2-screen=/g), 4);
  assert.match(html, /Точный вывод начинается с точного учёта/);
  assert.match(html, /ИИ ведёт поток\. Человек разбирает исключения/);
  assert.equal(count(html, /class="v2-agent-card"/g), 6);
  assert.match(html, /80% общего потока/);
  assert.match(html, /98% точности сопоставления/);
  assert.match(html, /До 95% сверок/);
  assert.match(html, /1С остаётся основой учёта/);
  assert.match(html, /облаке или внутри контура компании/);
  assert.match(html, /Проверить готовность учёта/);
  assert.ok(html.indexOf("Точный вывод начинается") < html.indexOf("ИИ ведёт поток"));
  assert.ok(html.indexOf("ИИ ведёт поток") < html.indexOf("1С остаётся основой"));
});

test("implementations page keeps every number next to its process", async () => {
  const html = await readFile(routeFile("v2/ii-agenty"), "utf8");
  assert.equal(count(html, /data-v2-screen=/g), 4);
  assert.match(html, /Не отдельная функция\. Выполненный процесс/);
  assert.match(html, /Распознать документ — только начало/);
  assert.equal(count(html, /class="v2-case"/g), 5);
  assert.match(html, /Первичный документ → поступление в 1С/);
  assert.match(html, /Выписка → разнесённая операция/);
  assert.match(html, /Документы сторон → сверка/);
  assert.match(html, /Период → готовность к закрытию/);
  assert.match(html, /Кадровое событие → расчёт/);
  assert.match(html, /Компании, с которыми работала команда Aivel/);
});

test("partner page states the deal clearly and answers six owner questions", async () => {
  const html = await readFile(routeFile("v2/partneram"), "utf8");
  assert.equal(count(html, /data-v2-screen=/g), 4);
  assert.match(html, /Расти без найма\. Стать финансовым партнёром/);
  assert.match(html, /Вы отвечаете за рост\. Мы — за производительность/);
  assert.match(html, /приобретаем от 51%/);
  assert.match(html, /корпоративным договором/);
  assert.match(html, /Основа уже создана\. Место для лидеров ещё есть/);
  assert.equal(count(html, /<details>/g), 6);
  assert.match(html, /три–четыре недели/);
  assert.match(html, /не включает гарантированный поток новых клиентов/);
  assert.match(html, /Заполнить анкету партнёра/);
});

test("version 2 machine-readable map is explicit about scope and evidence", async () => {
  const text = await readFile(path.join(dist, "v2", "llms.txt"), "utf8");
  assert.match(text, /финансовый помощник, который сам замечает/);
  assert.match(text, /\/v2\/primer\//);
  assert.match(text, /80% общего входящего потока/);
  assert.match(text, /98% точности/);
  assert.match(text, /до 95% сверок/);
  assert.match(text, /не должны складываться/);
  assert.match(text, /info@aivel\.ru/);
});
