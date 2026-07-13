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
- короткие проверяемые сигналы в Telegram или по почте без необходимости заранее формулировать вопрос;
- автоматизация первичных документов, банковских операций, сверок, закрытия периода, расчёта зарплаты, кадрового учёта и обращений.

Канонические страницы:
- Увидеть важное — главная продуктовая страница и четыре самодостаточных примера: ${site.url}/
- Подробная модель сигналов и справочные разборы: ${site.url}/vazhnoe/
- Наладить учёт — бухгалтерский, налоговый, кадровый и управленческий учёт, ИИ-помощники с измеренными результатами и экспресс-аудит: ${site.url}/buhgalterskoe-soprovozhdenie/
- Обслуживание 1С — лицензии, облако или контур компании, техническая поддержка, доработки и связи с ИИ-помощниками: ${site.url}/1s-i-integratsii/
- Понять, как это работает — механика продукта, контроль и аудиторский след: ${site.url}/kak-rabotaet/
- Автоматизация учёта: ${site.url}/avtomatizatsiya-ucheta/
- Первичные документы: ${site.url}/avtomatizatsiya-ucheta/pervichnye-dokumenty/
- Банковские операции: ${site.url}/avtomatizatsiya-ucheta/bankovskie-operatsii/
- Запросы подразделений и клиентов: ${site.url}/avtomatizatsiya-ucheta/kommunikatsii-s-klientami/
- Сверки с контрагентами: ${site.url}/avtomatizatsiya-ucheta/sverki-s-kontragentami/
- Закрытие периода: ${site.url}/avtomatizatsiya-ucheta/zakrytie-perioda/
- Расчёт зарплаты и кадровый учёт: ${site.url}/avtomatizatsiya-ucheta/zarplata-i-kadry/
- Контроль качества: ${site.url}/avtomatizatsiya-ucheta/kontrol-kachestva/
- Стать партнёром — собственникам бухгалтерских компаний: ${site.url}/buhgalterskim-kompaniyam/
- Крупным компаниям: ${site.url}/krupnym-kompaniyam/
- О компании: ${site.url}/o-kompanii/
- Открытый реестр для ИИ-систем: ${site.url}/dlya-ii-agentov/
- Данные и источники: ${site.url}/dannye-i-istochniki/
- Ограничения: ${site.url}/ogranicheniya/

Справочные разборы типичных важных ситуаций:
- ${site.url}/voprosy/pochemu-pribyl-est-a-deneg-net/
- ${site.url}/voprosy/hvatit-li-deneg-na-nalogi-i-zarplatu/
- ${site.url}/voprosy/gde-vyrosli-rashody/

Совокупные показатели реализованных внедрений:
${metrics}

Названные клиенты: ${publicClients.join(", ")}.
Показатели не приписываются отдельным названным клиентам.

Ограничения:
- Aivel не гарантирует обнаружение любого события.
- Реальный сигнал зависит от подключённых источников, их свежести, состояния учёта и согласованных правил важности.
- Налоговое, юридическое и управленческое суждение остаётся у ответственного человека.
- Публичные примеры используют обезличенные учебные данные.

Официальная почта: info@aivel.ru
Карта сайта: ${site.url}/sitemap.xml
Правила обхода: ${site.url}/robots.txt
Сведения проверены ${contentReviewedAt.label}.
`,
  { headers: { "Content-Type": "text/plain; charset=utf-8" } }
);
