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
  { name: "desktop", width: 1440, height: 1000 },
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
  const response = await page.goto("http://127.0.0.1:4370/partneram", {
    waitUntil: "networkidle",
    timeout: 60_000,
  });

  const inspection = await page.evaluate(() => {
    const bodyText = document.body.innerText;
    return {
      statusText: document.title,
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      h1Count: document.querySelectorAll("h1").length,
      h2Count: document.querySelectorAll("h2").length,
      faqCount: document.querySelectorAll(".partners-faq-list details").length,
      headerCta: document.querySelector(".header-cta-full")?.textContent?.trim() || "",
      hasThreshold: bodyText.includes("Контрольная доля от 51%"),
      hasUnapprovedDdx: bodyText.includes("ДДХ"),
      hasUnapprovedScale: bodyText.includes("400+ млн ₽") || bodyText.includes("1 000+ клиентов"),
      offenders: [...document.querySelectorAll("body *")]
        .map((element) => {
          const rect = element.getBoundingClientRect();
          return {
            tag: element.tagName.toLowerCase(),
            className: element.getAttribute("class") || "",
            right: Math.round(rect.right),
            text: (element.textContent || "").trim().replace(/\s+/g, " ").slice(0, 80),
          };
        })
        .filter((item) => item.right > document.documentElement.clientWidth + 1)
        .slice(0, 12),
    };
  });

  await page.screenshot({
    path: path.join(outputDir, `${viewport.name}-partners-above-fold.png`),
    fullPage: false,
  });
  await page.screenshot({
    path: path.join(outputDir, `${viewport.name}-partners-full.png`),
    fullPage: true,
  });

  await page.locator(".header-cta").click();
  await page.waitForTimeout(100);
  const focusedAfterAnchor = await page.evaluate(() => document.activeElement?.id || "");

  results.push({
    viewport: viewport.name,
    status: response?.status(),
    overflow: inspection.scrollWidth > inspection.clientWidth,
    focusedAfterAnchor,
    ...inspection,
  });
  await context.close();
}

const noJsContext = await browser.newContext({
  javaScriptEnabled: false,
  viewport: { width: 390, height: 844 },
  locale: "ru-RU",
});
const noJsPage = await noJsContext.newPage();
await noJsPage.goto("http://127.0.0.1:4370/partneram", {
  waitUntil: "domcontentloaded",
  timeout: 60_000,
});
const noJs = await noJsPage.evaluate(() => ({
  faqAnswers: document.querySelectorAll(".partners-faq-list details > p").length,
  formAction: document.querySelector(".partner-form")?.getAttribute("action") || "",
  thresholdVisible: document.body.innerText.includes("Контрольная доля от 51%"),
}));
await noJsContext.close();

const formContext = await browser.newContext({ viewport: { width: 1024, height: 900 }, locale: "ru-RU" });
const formPage = await formContext.newPage();
await formPage.goto("http://127.0.0.1:4370/partneram#partner-form", {
  waitUntil: "networkidle",
  timeout: 60_000,
});
await formPage.fill("#partner-name", "Тестовый собственник");
await formPage.fill("#partner-contact", "owner@example.com");
await formPage.fill("#partner-company", "Тестовая бухгалтерская компания");
await formPage.fill("#partner-region", "Москва");
await formPage.selectOption("#partner-scale", "clients-50-150");
await formPage.selectOption("#partner-scenario", "stay-and-grow");
await formPage.check("#partner-consent");
await formPage.getByRole("button", { name: "Рассказать о компании" }).last().click();
await formPage.locator(".partner-form-status.is-ready").waitFor({ timeout: 10_000 });
const formResult = await formPage.locator(".partner-form-status").innerText();
await formContext.close();

await browser.close();

const failures = results.filter(
  (result) =>
    result.status !== 200 ||
    result.overflow ||
    result.h1Count !== 1 ||
    result.faqCount !== 6 ||
    result.headerCta !== "Рассказать о компании" ||
    !result.hasThreshold ||
    result.hasUnapprovedDdx ||
    result.hasUnapprovedScale ||
    result.focusedAfterAnchor !== "partner-form",
);
if (noJs.faqAnswers !== 6 || !noJs.formAction.startsWith("mailto:") || !noJs.thresholdVisible) {
  failures.push({ viewport: "no-js", ...noJs });
}
if (!formResult.includes("Черновик обращения готов")) {
  failures.push({ viewport: "form", formResult });
}

const report = { results, noJs, formResult, failures };
fs.writeFileSync(path.join(outputDir, "partner-qa-results.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
if (failures.length > 0) process.exitCode = 1;
