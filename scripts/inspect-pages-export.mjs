import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const playwrightPath = `${process.env.TEMP.replaceAll("\\", "/")}/aivel-clone-tools/node_modules/playwright-core/index.mjs`;
const { chromium } = await import(pathToFileURL(playwrightPath));

const baseUrl = (process.env.PAGES_PREVIEW_URL ?? "http://127.0.0.1:4380/aivel-ai-site/").replace(/\/+$/, "/");
const publicBase = "https://adavydov.github.io/aivel-ai-site";
const outputDir = path.resolve("docs/research/local-qa");
fs.mkdirSync(outputDir, { recursive: true });

const sitemapResponse = await fetch(`${baseUrl}sitemap.xml`);
if (!sitemapResponse.ok) throw new Error(`Sitemap returned ${sitemapResponse.status}`);
const sitemap = await sitemapResponse.text();
const routes = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => {
  const pathname = new URL(match[1]).pathname.replace(/^\/aivel-ai-site\/?/, "");
  return pathname ? `${pathname.replace(/\/+$/, "")}/` : "";
});

const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  locale: "ru-RU",
  reducedMotion: "reduce",
});
const results = [];

for (const route of routes) {
  const page = await context.newPage();
  const localFailures = [];
  const consoleErrors = [];
  page.on("response", (response) => {
    if (response.url().startsWith(baseUrl) && response.status() >= 400) {
      localFailures.push({ url: response.url(), status: response.status() });
    }
  });
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  const response = await page.goto(`${baseUrl}${route}`, {
    waitUntil: "domcontentloaded",
    timeout: 60_000,
  });
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(350);

  const inspection = await page.evaluate((expectedBase) => {
    const localLinks = [...document.querySelectorAll("a[href]")]
      .map((link) => link.getAttribute("href") || "")
      .filter((href) => href.startsWith("/"));
    const images = [...document.querySelectorAll("img")];
    return {
      title: document.title,
      h1Count: document.querySelectorAll("h1").length,
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? "",
      brokenImages: images
        .filter((image) => !(image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0))
        .map((image) => image.getAttribute("src")),
      linksOutsideBase: localLinks.filter((href) => !href.startsWith(expectedBase)),
    };
  }, "/aivel-ai-site");

  results.push({ route, status: response?.status(), localFailures, consoleErrors, ...inspection });
  await page.close();
}

const mobileResults = [];
for (const route of ["", "dlya-korporatsiy/", "kto-my/", "partneram/"]) {
  const page = await context.newPage();
  await page.setViewportSize({ width: 375, height: 812 });
  const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "domcontentloaded", timeout: 60_000 });
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  mobileResults.push({ route, status: response?.status(), overflow });
  if (route === "") {
    await page.screenshot({ path: path.join(outputDir, "pages-export-home-mobile.png"), fullPage: false });
  }
  await page.close();
}

const formPage = await context.newPage();
let apiRequests = 0;
formPage.on("request", (request) => {
  if (request.url().includes("/api/partner-inquiries")) apiRequests += 1;
});
await formPage.goto(`${baseUrl}partneram/#partner-form`, { waitUntil: "domcontentloaded", timeout: 60_000 });
await formPage.fill("#partner-name", "Тест публикации");
await formPage.fill("#partner-contact", "owner@example.com");
await formPage.fill("#partner-company", "Тестовая компания");
await formPage.fill("#partner-region", "Москва");
await formPage.selectOption("#partner-scale", "clients-50-150");
await formPage.selectOption("#partner-scenario", "stay-and-grow");
await formPage.check("#partner-consent");
await formPage.getByRole("button", { name: "Рассказать о компании" }).click();
await formPage.locator(".partner-form-status.is-ready").waitFor({ timeout: 10_000 });
const formResult = {
  apiRequests,
  status: await formPage.locator(".partner-form-status").innerText(),
  mailto: await formPage.locator(".partner-form-status a").getAttribute("href"),
};
await formPage.close();

const robotsResponse = await fetch(`${baseUrl}robots.txt`);
const robots = await robotsResponse.text();
const failures = results.filter(
  (result) =>
    result.status !== 200 ||
    result.h1Count !== 1 ||
    result.overflow ||
    !result.canonical.startsWith(publicBase) ||
    result.brokenImages.length > 0 ||
    result.linksOutsideBase.length > 0 ||
    result.localFailures.length > 0 ||
    result.consoleErrors.length > 0,
);

if (mobileResults.some((result) => result.status !== 200 || result.overflow)) {
  failures.push({ route: "mobile", mobileResults });
}
if (formResult.apiRequests !== 0 || !formResult.status.includes("Черновик обращения готов") || !formResult.mailto?.startsWith("mailto:")) {
  failures.push({ route: "partner-form", formResult });
}
if (!robotsResponse.ok || !robots.includes(`${publicBase}/sitemap.xml`)) {
  failures.push({ route: "robots", status: robotsResponse.status, robots });
}

await context.close();
await browser.close();

const report = { baseUrl, routes, results, mobileResults, formResult, failures };
fs.writeFileSync(path.join(outputDir, "pages-export-qa-results.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
if (failures.length > 0) process.exitCode = 1;
