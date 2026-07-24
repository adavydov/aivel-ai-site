import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const playwrightPath = `${process.env.TEMP.replaceAll("\\", "/")}/aivel-clone-tools/node_modules/playwright-core/index.mjs`;
const { chromium } = await import(pathToFileURL(playwrightPath));

const pages = [
  { slug: "services", url: "https://www.accenture.com/us-en/services" },
  { slug: "ai-data", url: "https://www.accenture.com/us-en/services/ai-data" },
  { slug: "industry", url: "https://www.accenture.com/us-en/industries/consumer-goods-services" },
  { slug: "insights", url: "https://www.accenture.com/us-en/insights" },
  { slug: "about", url: "https://www.accenture.com/us-en/about/company-index" },
];

const outputDir = path.resolve("docs/research/accenture-capture/page-families");
fs.mkdirSync(outputDir, { recursive: true });

const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});

const results = [];
for (const item of pages) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    locale: "en-US",
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto(item.url, { waitUntil: "domcontentloaded", timeout: 90_000 });
  await page.waitForTimeout(4_000);

  const reject = page.getByRole("button", { name: /reject all/i }).first();
  if (await reject.count()) {
    try { await reject.click({ timeout: 2_000 }); } catch {}
  }

  await page.screenshot({ path: path.join(outputDir, `${item.slug}-full.png`), fullPage: true });
  await page.screenshot({ path: path.join(outputDir, `${item.slug}-fold.png`), fullPage: false });

  const snapshot = await page.evaluate(() => ({
    title: document.title,
    url: location.href,
    scrollHeight: document.documentElement.scrollHeight,
    headings: [...document.querySelectorAll("h1,h2,h3")].slice(0, 120).map((el) => ({
      level: el.tagName,
      text: (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 260),
    })),
    labels: [...document.querySelectorAll("main a, main button")].slice(0, 120).map((el) =>
      (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 180)
    ).filter(Boolean),
    sectionNav: [...document.querySelectorAll("nav a")].slice(0, 80).map((el) =>
      (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 180)
    ).filter(Boolean),
  }));
  results.push({ ...item, ...snapshot });
  await context.close();
}

fs.writeFileSync(path.join(outputDir, "page-families.json"), JSON.stringify(results, null, 2));
await browser.close();
