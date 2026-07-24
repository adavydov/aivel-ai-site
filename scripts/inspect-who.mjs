import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const playwrightPath = `${process.env.TEMP.replaceAll("\\", "/")}/aivel-clone-tools/node_modules/playwright-core/index.mjs`;
const { chromium } = await import(pathToFileURL(playwrightPath));
const outputDir = path.resolve("docs/research/local-qa");
fs.mkdirSync(outputDir, { recursive: true });

const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});

const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "laptop", width: 1366, height: 768 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 375, height: 812 },
];
const results = [];

for (const viewport of viewports) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    locale: "ru-RU",
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const response = await page.goto("http://127.0.0.1:4370/kto-my", {
    waitUntil: "networkidle",
    timeout: 60_000,
  });

  const inspection = await page.evaluate(() => {
    const clientWidth = document.documentElement.clientWidth;
    const bodyText = document.body.innerText;
    const hero = document.querySelector(".who-hero");
    const logos = [...document.querySelectorAll(".who-proof-logos img")];
    const actionTargets = [...document.querySelectorAll(".who-route-primary, .who-route-secondary, .who-inline-link")];

    return {
      title: document.title,
      clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      h1Count: document.querySelectorAll("h1").length,
      pageSectionHeadings: [...document.querySelectorAll("main .who-section h2")].map((heading) => heading.textContent?.trim()),
      heroBottom: hero ? Math.round(hero.getBoundingClientRect().bottom) : null,
      viewportHeight: window.innerHeight,
      proofCount: document.querySelectorAll(".who-proof-grid > article").length,
      routeCount: document.querySelectorAll(".who-route-grid > article").length,
      logosLoaded: logos.every((logo) => logo instanceof HTMLImageElement && logo.complete && logo.naturalWidth > 0),
      smallTargets: actionTargets
        .map((target) => ({
          text: (target.textContent || "").trim().replace(/\s+/g, " ").slice(0, 80),
          height: Math.round(target.getBoundingClientRect().height),
        }))
        .filter((target) => target.height < 44),
      forbiddenCopy: [
        "ИИ отвечает",
        "полностью автономно",
        "без контроля",
        "Неподтверждённые проценты",
        "команда профессионалов",
      ].filter((phrase) => bodyText.includes(phrase)),
      offenders: [...document.querySelectorAll("body *")]
        .filter((element) => !element.closest(".mobile-menu:not(.is-open)"))
        .map((element) => {
          const rect = element.getBoundingClientRect();
          return {
            tag: element.tagName.toLowerCase(),
            className: element.getAttribute("class") || "",
            left: Math.round(rect.left),
            right: Math.round(rect.right),
          };
        })
        .filter((item) => item.left < -1 || item.right > clientWidth + 1)
        .slice(0, 12),
    };
  });

  await page.screenshot({
    path: path.join(outputDir, `${viewport.name}-who-above-fold.png`),
    fullPage: false,
  });
  await page.screenshot({
    path: path.join(outputDir, `${viewport.name}-who-full.png`),
    fullPage: true,
  });

  results.push({ viewport: viewport.name, status: response?.status(), ...inspection });
  await context.close();
}

const noJsContext = await browser.newContext({
  javaScriptEnabled: false,
  viewport: { width: 390, height: 844 },
  locale: "ru-RU",
});
const noJsPage = await noJsContext.newPage();
await noJsPage.goto("http://127.0.0.1:4370/kto-my", {
  waitUntil: "domcontentloaded",
  timeout: 60_000,
});
const noJs = await noJsPage.evaluate(() => ({
  headlineVisible: document.body.innerText.includes("ИИ делает типовое. Люди отвечают за решения."),
  routeCount: document.querySelectorAll(".who-route-grid > article").length,
  roleCount: document.querySelectorAll(".who-team-role").length,
}));
await noJsContext.close();

await browser.close();

const expectedHeadings = [
  "Одна команда. Разные роли.",
  "Ответственность не исчезает — она заранее распределена.",
  "Работает не в презентации, а в реальном учёте.",
  "Познакомиться с Aivel в работе.",
];

const failures = results.filter((result) => {
  const heroMustFit = result.viewport === "laptop" ? result.heroBottom <= result.viewportHeight + 2 : true;
  return (
    result.status !== 200 ||
    result.scrollWidth > result.clientWidth ||
    result.h1Count !== 1 ||
    JSON.stringify(result.pageSectionHeadings) !== JSON.stringify(expectedHeadings) ||
    result.proofCount !== 3 ||
    result.routeCount !== 3 ||
    !result.logosLoaded ||
    result.smallTargets.length > 0 ||
    result.forbiddenCopy.length > 0 ||
    result.offenders.length > 0 ||
    !heroMustFit
  );
});

if (!noJs.headlineVisible || noJs.routeCount !== 3 || noJs.roleCount !== 3) {
  failures.push({ viewport: "no-js", ...noJs });
}

const report = { results, noJs, failures };
fs.writeFileSync(path.join(outputDir, "who-qa-results.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
if (failures.length > 0) process.exitCode = 1;
