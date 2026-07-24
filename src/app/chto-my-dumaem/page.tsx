import type { Metadata } from "next";
import Link from "next/link";
import { InsightsLibrary } from "@/components/insights-library";
import { PageShell } from "@/components/page-shell";
import { insightJobs, insights } from "@/data/insights";
import { absoluteUrl } from "@/lib/site-paths";

export const metadata: Metadata = {
  title: "Практика и исследования Aivel",
  description: "Разборы Aivel о своевременных сигналах для руководителя, надёжном учёте и автоматизации финансовых процессов с помощью ИИ.",
  alternates: { canonical: absoluteUrl("/chto-my-dumaem") },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "Aivel",
    url: absoluteUrl("/chto-my-dumaem"),
    title: "Практика и исследования Aivel",
    description: "Ответы, механизмы и критерии проверки для руководителей и финансовых команд.",
  },
};

export default function Thinking() {
  const featured = insights[0];

  return (
    <PageShell>
      <section className="thinking-hero">
        <div className="thinking-hero-copy">
          <p className="eyebrow accent-rule">Что мы думаем</p>
          <h1>Практика и исследования Aivel.</h1>
          <p>Не пересказываем новости. Разбираем решения, которые можно понять, проверить и применить в работе.</p>
        </div>

        <Link className="thinking-feature" href={`/chto-my-dumaem/${featured.slug}`}>
          <div className="thinking-feature-meta"><span>Главный разбор</span><time dateTime={featured.publishedAt}>{featured.publishedLabel}</time></div>
          <p>{featured.job}</p>
          <h2>{featured.title}</h2>
          <span className="thinking-feature-link">Прочитать за {featured.readingTime} →</span>
        </Link>
      </section>

      <section className="thinking-jobs" aria-labelledby="thinking-jobs-title">
        <div className="thinking-section-heading">
          <p className="eyebrow">Начните со своей задачи</p>
          <h2 id="thinking-jobs-title">Не тема. Решение, которое нужно принять.</h2>
        </div>
        <div className="thinking-job-grid">
          {insightJobs.map((job, index) => (
            <a href="#library" key={job.id}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{job.label}</strong>
              <p>{job.description}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="thinking-library-section" id="library" aria-labelledby="library-title">
        <div className="thinking-section-heading">
          <p className="eyebrow">Библиотека решений</p>
          <h2 id="library-title">Короткий ответ — прежде подробностей.</h2>
          <p>В каждом материале: узнаваемая ситуация, механизм, способ проверки и честные границы решения.</p>
        </div>
        <InsightsLibrary items={insights} />
      </section>

      <section className="thinking-standard" aria-labelledby="thinking-standard-title">
        <div>
          <p className="eyebrow">Редакционный стандарт</p>
          <h2 id="thinking-standard-title">Можно проверить не только вывод, но и нас.</h2>
        </div>
        <ol>
          <li><span>01</span><strong>Сразу отвечаем</strong><p>Главная мысль понятна без чтения всей страницы.</p></li>
          <li><span>02</span><strong>Показываем механизм</strong><p>Объясняем путь от факта до результата, а не обещание.</p></li>
          <li><span>03</span><strong>Называем границы</strong><p>Отделяем доказанное, предположение и условия применимости.</p></li>
        </ol>
      </section>

      <section className="thinking-cta" aria-labelledby="thinking-cta-title">
        <div><p className="eyebrow">Следующий шаг</p><h2 id="thinking-cta-title">Разберите одну задачу на своих данных.</h2></div>
        <a className="button light" href="mailto:hello@aivel.ai?subject=Разбор задачи с Aivel">Записаться на демонстрацию →</a>
      </section>
    </PageShell>
  );
}
