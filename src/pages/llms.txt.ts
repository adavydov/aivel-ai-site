import type { APIRoute } from "astro";
import {
  contentReviewedAt,
  implementationMetrics,
  publicClients,
  site
} from "../data/site";

const metrics = implementationMetrics
  .map((metric) => `- ${metric.value}: ${metric.label}. ${metric.note}`)
  .join("\n");

export const GET: APIRoute = () => new Response(
  `# Aivel

> Бухгалтерская и технологическая компания: ведёт учёт, помогает вовремя замечать важные изменения и показывает проверяемое основание до решения.

Основные возможности:
- бухгалтерское и налоговое сопровождение;
- важные изменения с периодом, свежестью, источником и границей;
- проверяемые ответы на вопросы о бизнесе;
- автоматизация первичных документов, банковских операций, обращений и сверок.

Канонические страницы:
- Важные изменения и вопросы: ${site.url}/vazhnoe/
- Для бизнеса — учёт и своевременные сигналы: ${site.url}/buhgalterskoe-soprovozhdenie/
- Как работает продукт: ${site.url}/kak-rabotaet/
- Автоматизация учёта: ${site.url}/avtomatizatsiya-ucheta/
- Первичные документы: ${site.url}/avtomatizatsiya-ucheta/pervichnye-dokumenty/
- Банковские операции: ${site.url}/avtomatizatsiya-ucheta/bankovskie-operatsii/
- Обращения клиентов: ${site.url}/avtomatizatsiya-ucheta/kommunikatsii-s-klientami/
- Сверки с контрагентами: ${site.url}/avtomatizatsiya-ucheta/sverki-s-kontragentami/
- Контроль качества: ${site.url}/avtomatizatsiya-ucheta/kontrol-kachestva/
- Результаты внедрений: ${site.url}/rezultaty/
- Партнёрам — бухгалтерским компаниям: ${site.url}/buhgalterskim-kompaniyam/
- Крупным компаниям: ${site.url}/krupnym-kompaniyam/
- О компании: ${site.url}/o-kompanii/
- Открытый реестр для ИИ-систем: ${site.url}/dlya-ii-agentov/
- Данные и источники: ${site.url}/dannye-i-istochniki/
- Ограничения: ${site.url}/ogranicheniya/

Примеры поисковых страниц с проверяемыми ответами:
- ${site.url}/voprosy/pochemu-pribyl-est-a-deneg-net/
- ${site.url}/voprosy/hvatit-li-deneg-na-nalogi-i-zarplatu/
- ${site.url}/voprosy/gde-vyrosli-rashody/

Совокупные показатели реализованных внедрений:
${metrics}

Названные клиенты: ${publicClients.join(", ")}.
Показатели не приписываются отдельным названным клиентам.

Ограничения:
- Aivel не гарантирует обнаружение любого события.
- Реальный сигнал или ответ зависит от подключённых источников, их свежести, состояния учёта и согласованных правил важности.
- Налоговое, юридическое и управленческое суждение остаётся у ответственного человека.
- Публичные примеры используют обезличенные учебные данные.

Официальная почта: info@aivel.ru
Карта сайта: ${site.url}/sitemap.xml
Правила обхода: ${site.url}/robots.txt
Сведения проверены ${contentReviewedAt.label}.
`,
  { headers: { "Content-Type": "text/plain; charset=utf-8" } }
);
