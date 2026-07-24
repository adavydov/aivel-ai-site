import { pathToFileURL } from "node:url";

const playwrightPath = `${process.env.TEMP.replaceAll("\\", "/")}/aivel-clone-tools/node_modules/playwright-core/index.mjs`;
const { chromium } = await import(pathToFileURL(playwrightPath));
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto("http://127.0.0.1:4370/", { waitUntil: "networkidle", timeout: 60_000 });
await page.getByRole("button", { name: "Открыть меню" }).click();
await page.waitForTimeout(350);
const result = await page.evaluate(() => {
  const menu = document.querySelector(".mobile-menu");
  const inner = document.querySelector(".mobile-menu-inner");
  const first = inner?.querySelector("a");
  const inspect = (element) => {
    if (!element) return null;
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return {
      className: element.getAttribute("class"),
      text: element.textContent?.trim().replace(/\s+/g, " "),
      rect: { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom },
      display: style.display,
      visibility: style.visibility,
      opacity: style.opacity,
      transform: style.transform,
      color: style.color,
      background: style.backgroundColor,
    };
  };
  return { menu: inspect(menu), inner: inspect(inner), first: inspect(first) };
});
console.log(JSON.stringify(result, null, 2));
await browser.close();
