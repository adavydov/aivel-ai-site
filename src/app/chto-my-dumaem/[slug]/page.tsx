import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { getInsightBySlug, insights } from "@/data/insights";
import { siteUrl } from "@/lib/site-paths";

type InsightPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return insights.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: InsightPageProps): Promise<Metadata> {
  const { slug } = await params;
  const insight = getInsightBySlug(slug);

  if (!insight) {
    return {};
  }

  const canonical = `${siteUrl}/chto-my-dumaem/${insight.slug}`;

  return {
    title: `${insight.title} | Aivel`,
    description: insight.description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "article",
      locale: "ru_RU",
      siteName: "Aivel",
      url: canonical,
      title: insight.title,
      description: insight.description,
      publishedTime: insight.publishedAt,
      modifiedTime: insight.modifiedAt,
    },
    twitter: {
      card: "summary",
      title: insight.title,
      description: insight.description,
    },
  };
}

export default async function InsightPage({ params }: InsightPageProps) {
  const { slug } = await params;
  const insight = getInsightBySlug(slug);

  if (!insight) {
    notFound();
  }

  const canonical = `${siteUrl}/chto-my-dumaem/${insight.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: insight.title,
    description: insight.description,
    inLanguage: "ru-RU",
    datePublished: insight.publishedAt,
    dateModified: insight.modifiedAt,
    articleSection: insight.job,
    author: {
      "@type": "Organization",
      name: "Aivel",
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "Aivel",
      url: siteUrl,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonical,
    },
  };

  return (
    <PageShell>
      <article className="article-page">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />

        <header className="article-hero">
          <div className="article-hero-inner">
            <Link className="article-back-link" href="/chto-my-dumaem">
              Все материалы
            </Link>
            <p className="article-kicker">
              {insight.format} · {insight.job}
            </p>
            <h1>{insight.title}</h1>
            <p className="article-deck">{insight.description}</p>
            <div className="article-meta" aria-label="Сведения о материале">
              <span>Aivel</span>
              <time dateTime={insight.publishedAt}>{insight.publishedLabel}</time>
              <span>{insight.readingTime}</span>
            </div>
          </div>
        </header>

        <div className="article-body">
          <section className="article-section article-answer" aria-labelledby="short-answer-title">
            <p className="article-section-label">Короткий ответ</p>
            <h2 id="short-answer-title">Что важно понять</h2>
            <p>{insight.shortAnswer}</p>
          </section>

          <section className="article-section" aria-labelledby="situation-title">
            <p className="article-section-label">Узнаваемая ситуация</p>
            <h2 id="situation-title">Почему прежний способ не решает задачу</h2>
            <div className="article-copy">
              {insight.situation.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>

          <section className="article-section" aria-labelledby="mechanism-title">
            <p className="article-section-label">Механизм</p>
            <h2 id="mechanism-title">Как работает целостный процесс</h2>
            <ol className="article-steps">
              {insight.mechanism.map((step, index) => (
                <li className="article-step" key={step.title}>
                  <span className="article-step-number" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="article-section" aria-labelledby="verification-title">
            <p className="article-section-label">Критерий проверки</p>
            <h2 id="verification-title">Как проверить решение до покупки</h2>
            <p>{insight.verificationIntro}</p>
            <ul className="article-checklist">
              {insight.verification.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="article-section article-boundaries" aria-labelledby="boundaries-title">
            <p className="article-section-label">Границы</p>
            <h2 id="boundaries-title">Что решение не отменяет</h2>
            <ul>
              {insight.boundaries.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <aside className="article-related" aria-labelledby="related-title">
            <p className="article-section-label">{insight.relatedProduct.eyebrow}</p>
            <h2 id="related-title">{insight.relatedProduct.title}</h2>
            <p>{insight.relatedProduct.text}</p>
            <Link className="article-text-link" href={insight.relatedProduct.link.href}>
              {insight.relatedProduct.link.label} →
            </Link>
          </aside>
        </div>

        <section className="article-cta" aria-labelledby="article-cta-title">
          <div>
            <p className="article-section-label">Следующий шаг</p>
            <h2 id="article-cta-title">{insight.cta.title}</h2>
            <p>{insight.cta.text}</p>
          </div>
          <Link className="article-cta-link" href={insight.cta.link.href}>
            {insight.cta.link.label}
          </Link>
        </section>
      </article>
    </PageShell>
  );
}
