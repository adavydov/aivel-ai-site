import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
const playwrightPath = `${process.env.TEMP.replaceAll("\\", "/")}/aivel-clone-tools/node_modules/playwright-core/index.mjs`;
const { chromium } = await import(pathToFileURL(playwrightPath));

const outputDir = path.resolve("docs/research/accenture-capture");
fs.mkdirSync(outputDir, { recursive: true });

const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});

const targets = [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 390, height: 844 },
];

const results = [];
for (const target of targets) {
  const context = await browser.newContext({
    viewport: { width: target.width, height: target.height },
    locale: "en-US",
    colorScheme: "light",
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto("https://www.accenture.com/us-en", {
    waitUntil: "domcontentloaded",
    timeout: 90_000,
  });
  await page.waitForTimeout(6_000);
  await page.screenshot({
    path: path.join(outputDir, `${target.name}-full.png`),
    fullPage: true,
  });
  await page.screenshot({
    path: path.join(outputDir, `${target.name}-above-fold.png`),
    fullPage: false,
  });

  const snapshot = await page.evaluate(() => {
    const style = (el) => {
      const s = getComputedStyle(el);
      return {
        tag: el.tagName.toLowerCase(),
        text: (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 180),
        fontFamily: s.fontFamily,
        fontSize: s.fontSize,
        fontWeight: s.fontWeight,
        lineHeight: s.lineHeight,
        letterSpacing: s.letterSpacing,
        color: s.color,
        backgroundColor: s.backgroundColor,
        display: s.display,
        position: s.position,
        padding: s.padding,
        margin: s.margin,
        gap: s.gap,
        borderRadius: s.borderRadius,
        maxWidth: s.maxWidth,
      };
    };
    const selectors = ["header", "nav", "main h1", "main h2", "main p", "main a", "footer"];
    const samples = {};
    for (const selector of selectors) {
      samples[selector] = [...document.querySelectorAll(selector)].slice(0, 8).map(style);
    }
    return {
      title: document.title,
      url: location.href,
      body: style(document.body),
      viewport: { width: innerWidth, height: innerHeight },
      scrollHeight: document.documentElement.scrollHeight,
      landmarkCounts: {
        headers: document.querySelectorAll("header").length,
        navs: document.querySelectorAll("nav").length,
        mains: document.querySelectorAll("main").length,
        sections: document.querySelectorAll("main section").length,
        footers: document.querySelectorAll("footer").length,
      },
      headings: [...document.querySelectorAll("h1,h2,h3")].slice(0, 80).map((el) => ({
        level: el.tagName,
        text: (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 220),
      })),
      samples,
    };
  });

  const menuControl = page.getByRole("button", { name: /menu/i }).first();
  if (await menuControl.count()) {
    try {
      await menuControl.click({ timeout: 5_000 });
      await page.waitForTimeout(800);
      await page.screenshot({
        path: path.join(outputDir, `${target.name}-menu-open.png`),
        fullPage: false,
      });
      snapshot.menuText = (await page.locator("body").innerText()).slice(0, 6_000);
    } catch (error) {
      snapshot.menuError = String(error);
    }
  }
  results.push({ target, ...snapshot });
  await context.close();
}

fs.writeFileSync(path.join(outputDir, "computed-styles.json"), JSON.stringify(results, null, 2));
await browser.close();
