import path from "node:path";
import { pathToFileURL } from "node:url";

const playwrightPath = `${process.env.TEMP.replaceAll("\\", "/")}/aivel-clone-tools/node_modules/playwright-core/index.mjs`;
const { chromium } = await import(pathToFileURL(playwrightPath));
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, locale: "ru-RU", reducedMotion: "reduce" });
const page = await context.newPage();
const outputDir = path.resolve("docs/research/local-qa");

await page.goto("http://127.0.0.1:4370/dlya-korporatsiy", { waitUntil: "domcontentloaded" });
await page.locator(".enterprise-products").screenshot({ path: path.join(outputDir, "desktop-corporate-products.png") });
await page.locator(".enterprise-control").screenshot({ path: path.join(outputDir, "desktop-corporate-control.png") });

await page.goto("http://127.0.0.1:4370/dlya-korporatsiy/platforma", { waitUntil: "domcontentloaded" });
await page.locator(".product-demo").screenshot({ path: path.join(outputDir, "desktop-platform-product-demo.png") });

await browser.close();
