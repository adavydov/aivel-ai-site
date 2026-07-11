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
  "voprosy",
  "resheniya",
  "resheniya/dengi-i-obyazatelstva",
  "resheniya/pribyl-i-rentabelnost",
  "resheniya/rost-naim-i-zapas-deneg",
  "buhgalterskoe-soprovozhdenie",
  "kak-rabotaet",
  "kak-formiruetsya-otvet",
  "dannye-i-istochniki",
  "1s-i-integratsii",
  "zashchita-dannyh",
  "ogranicheniya",
  "istorii",
  "buhgalterskim-kompaniyam",
  "krupnym-kompaniyam",
  "o-kompanii",
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

test("homepage carries the proactive positioning and safe boundary", async () => {
  const html = await readFile(path.join(dist, "index.html"), "utf8");
  assert.match(html, /Вовремя узнавайте о важном в бизнесе/);
  assert.match(html, /Aivel видит только подключённые источники/);
  assert.match(html, /Учебный пример на обезличенных данных/);
  assert.match(html, /После сигнала/);
  assert.doesNotMatch(html, /Цифровые сотрудники для вашего бизнеса/);
  assert.doesNotMatch(html, /ничего важного не пропустим|всегда вовремя|в реальном времени/i);
});

test("important-change page shows a complete, bounded signal", async () => {
  const html = await readFile(routeFile("vazhnoe"), "utf8");
  assert.match(html, /Почему это важно/);
  assert.match(html, /Что сделать сейчас/);
  assert.match(html, /Источники/);
  assert.match(html, /Граница вывода/);
  assert.match(html, /не гарантирует обнаружение любого события/i);
});

test("all primary routes render semantic pages", async () => {
  for (const route of routes) {
    const html = await readFile(routeFile(route), "utf8");
    assert.equal(count(html, /<h1[\s>]/g), 1, `${route || "/"} must have exactly one h1`);
    assert.equal(count(html, /<title>/g), 1, `${route || "/"} must have one title`);
    assert.match(html, /<meta name="description"/);
    assert.match(html, /<link rel="canonical"/);
    assert.match(html, /href="\/voprosy\/"/);
  }
});

test("all ten question pages exist and include answer provenance", async () => {
  for (const slug of questionSlugs) {
    const html = await readFile(routeFile(`voprosy/${slug}`), "utf8");
    assert.match(html, /Короткий ответ/);
    assert.match(html, /Источники ответа/);
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
  assert.match(robots, /OAI-SearchBot/);
  assert.match(llms, /Публичные примеры используют обезличенные учебные данные/);
  assert.match(llms, /не гарантирует обнаружение любого события/i);
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
