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

const routes = [
  "/",
  "/chto-my-delaem",
  "/chto-my-dumaem",
  "/kto-my",
  "/partneram",
  "/dlya-korporatsiy",
  "/dlya-korporatsiy/pervichnye-dokumenty",
  "/dlya-korporatsiy/platforma",
];
const results = [];

for (const viewport of [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "mobile", width: 390, height: 844 },
]) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    locale: "ru-RU",
    reducedMotion: "reduce",
  });
  const page = await context.newPage();

  for (const route of routes) {
    const response = await page.goto(`http://127.0.0.1:4370${route}`, {
      waitUntil: "domcontentloaded",
      timeout: 60_000,
    });
    await page.waitForTimeout(450);
    const geometry = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      h1: document.querySelector("h1")?.textContent?.trim() || "",
      title: document.title,
      offenders: [...document.querySelectorAll("body *")]
        .map((element) => {
          const rect = element.getBoundingClientRect();
          return {
            tag: element.tagName.toLowerCase(),
            className: element.getAttribute("class") || "",
            text: (element.textContent || "").trim().replace(/\s+/g, " ").slice(0, 80),
            left: Math.round(rect.left),
            right: Math.round(rect.right),
            width: Math.round(rect.width),
          };
        })
        .filter((item) => item.right > document.documentElement.clientWidth + 1)
        .sort((a, b) => b.right - a.right)
        .slice(0, 12),
    }));
    results.push({
      viewport: viewport.name,
      route,
      status: response?.status(),
      overflow: geometry.scrollWidth > geometry.clientWidth,
      ...geometry,
    });

    if (route === "/") {
      await page.screenshot({
        path: path.join(outputDir, `${viewport.name}-home-full.png`),
        fullPage: true,
      });
      await page.screenshot({
        path: path.join(outputDir, `${viewport.name}-home-above-fold.png`),
        fullPage: false,
      });
      if (viewport.name === "desktop") {
        await page.getByRole("button", { name: /Что мы делаем/ }).click();
        await page.getByRole("navigation", { name: "Что мы делаем" }).waitFor();
        await page.screenshot({
          path: path.join(outputDir, "desktop-mega-menu.png"),
          fullPage: false,
        });
      } else {
        await page.getByRole("button", { name: "Открыть меню" }).click();
        await page.waitForTimeout(350);
        await page.screenshot({
          path: path.join(outputDir, "mobile-menu.png"),
          fullPage: false,
        });
      }
    }

    if (["/dlya-korporatsiy", "/dlya-korporatsiy/pervichnye-dokumenty", "/dlya-korporatsiy/platforma"].includes(route)) {
      const screenshotName = route === "/dlya-korporatsiy"
        ? "corporate"
        : route.endsWith("platforma")
          ? "platform"
          : "primary-agent";
      await page.screenshot({
        path: path.join(outputDir, `${viewport.name}-${screenshotName}-full.png`),
        fullPage: true,
      });
      await page.screenshot({
        path: path.join(outputDir, `${viewport.name}-${screenshotName}-above-fold.png`),
        fullPage: false,
      });
    }
  }

  await context.close();
}

await browser.close();
fs.writeFileSync(path.join(outputDir, "qa-results.json"), JSON.stringify(results, null, 2));

const failures = results.filter((result) => result.status !== 200 || result.overflow || !result.h1);
console.log(JSON.stringify({ results, failures }, null, 2));
if (failures.length > 0) process.exitCode = 1;
