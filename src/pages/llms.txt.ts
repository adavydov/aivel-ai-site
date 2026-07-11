import type { APIRoute } from "astro";
import { site } from "../data/site";

export const GET: APIRoute = () => new Response(
  `# Aivel

> Бухгалтерское сопровождение, которое помогает раньше замечать важные изменения и проверять их основание.

Основные страницы:
- ${site.url}/vazhnoe/
- ${site.url}/voprosy/
- ${site.url}/buhgalterskoe-soprovozhdenie/
- ${site.url}/kak-rabotaet/
- ${site.url}/kak-formiruetsya-otvet/
- ${site.url}/ogranicheniya/

Публичные примеры используют обезличенные учебные данные. Aivel не гарантирует обнаружение любого события. Реальный сигнал и ответ зависят от подключённых источников, их свежести, состояния учёта и согласованных правил важности.
`,
  { headers: { "Content-Type": "text/plain; charset=utf-8" } }
);
