import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { WhoPageAnalytics } from "@/components/who-page-analytics";
import { getPublishedWhoEvidence } from "@/data/who-claims";
import { responsibilityModels, teamRoles, whoRoutes } from "@/data/who-page";
import { absoluteUrl, siteUrl } from "@/lib/site-paths";

export const metadata: Metadata = {
  title: "Кто мы — люди, ИИ и ответственность | Aivel",
  description:
    "Aivel соединяет ИИ-агентов, бухгалтеров, финансистов и инженеров. Типовые операции выполняет ИИ, профессиональные решения принимают люди, а границы ответственности определяются заранее.",
  alternates: { canonical: "/kto-my" },
  openGraph: {
    title: "ИИ делает типовое. Люди отвечают за решения.",
    description:
      "Как в Aivel распределены роли ИИ-агентов, специалистов, инженеров и ответственность сторон.",
    url: "/kto-my",
  },
};

const heroRoles = [
  { number: "01", input: "Типовая операция", owner: "ИИ-агент", note: "В заданных границах" },
  { number: "02", input: "Исключение", owner: "Специалист", note: "С профессиональным суждением" },
  { number: "03", input: "Окончательное решение", owner: "Назначенная роль", note: "Ответственный человек" },
] as const;

const publishedEvidence = getPublishedWhoEvidence();

const aboutPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": `${absoluteUrl("/kto-my")}#page`,
  url: absoluteUrl("/kto-my"),
  name: "Кто мы — люди, ИИ и ответственность | Aivel",
  description:
    "Как Aivel распределяет работу между ИИ-агентами, специалистами и инженерами и заранее определяет ответственность сторон.",
  inLanguage: "ru-RU",
  isPartOf: { "@id": `${siteUrl}/#website` },
  about: { "@id": `${siteUrl}/#organization` },
};

export default function WhoWeAre() {
  return (
    <PageShell>
      <WhoPageAnalytics />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageJsonLd).replace(/</g, "\\u003c") }}
      />

      <section className="who-hero" aria-labelledby="who-page-title">
        <div className="who-hero-inner">
          <div className="who-hero-copy">
            <p className="eyebrow accent-rule">Кто мы</p>
            <h1 id="who-page-title">ИИ делает типовое. Люди отвечают за решения.</h1>
            <p className="who-hero-intro">
              Aivel — бухгалтерская и финансовая компания с собственными решениями на основе ИИ. Агенты выполняют операции в заданных границах, специалисты разбирают исключения и принимают профессиональные решения.
            </p>
            <a className="who-anchor-link" href="#komanda">
              Кто за что отвечает <span aria-hidden="true">↓</span>
            </a>
          </div>

          <figure className="who-role-sequence">
            <figcaption className="sr-only">
              Типовые операции выполняет ИИ-агент, исключения разбирает специалист, окончательное решение принимает назначенный человек.
            </figcaption>
            <ol>
              {heroRoles.map((role) => (
                <li key={role.number}>
                  <div className="who-sequence-input">
                    <span>{role.number}</span>
                    <strong>{role.input}</strong>
                  </div>
                  <span className="who-sequence-arrow" aria-hidden="true">→</span>
                  <div className="who-sequence-owner">
                    <strong>{role.owner}</strong>
                    <span>{role.note}</span>
                  </div>
                </li>
              ))}
            </ol>
            <p>Границы ответственности зависят от модели работы и закрепляются заранее.</p>
          </figure>
        </div>
      </section>

      <section className="who-section who-team" id="komanda" aria-labelledby="who-team-title">
        <div className="who-section-inner">
          <header className="who-section-heading">
            <p className="eyebrow">Модель команды</p>
            <h2 id="who-team-title">Одна команда. Разные роли.</h2>
            <p>Мы не заменили бухгалтеров ИИ. Мы пересобрали работу так, чтобы люди занимались решениями, а не переносом данных.</p>
          </header>

          <div className="who-team-grid">
            {teamRoles.map((role) => (
              <article className={`who-team-role who-team-role-${role.id}`} key={role.id}>
                <span className="who-role-number">{role.number}</span>
                <h3>{role.title}</h3>
                <dl>
                  <div>
                    <dt>Делают</dt>
                    <dd>{role.does}</dd>
                  </div>
                  <div>
                    <dt>Граница</dt>
                    <dd>{role.boundary}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>

          <p className="who-accountability-band">
            <span aria-hidden="true">→</span>
            <strong>Ответственность не передаётся алгоритму.</strong>
            <span className="who-accountability-copy">Для каждого процесса заранее определены ответственные роли Aivel и клиента.</span>
          </p>
        </div>
      </section>

      <section className="who-section who-responsibility" id="otvetstvennost" aria-labelledby="who-responsibility-title">
        <div className="who-section-inner who-responsibility-layout">
          <header className="who-section-heading who-responsibility-heading">
            <p className="eyebrow">Границы работы</p>
            <h2 id="who-responsibility-title">Ответственность не исчезает — она заранее распределена.</h2>
            <p>До начала работы мы фиксируем границы процесса, права агента, владельцев исключений и окончательные утверждения.</p>
          </header>

          <div className="who-responsibility-list">
            {responsibilityModels.map((model) => (
              <article key={model.id}>
                <header>
                  <span>{model.number}</span>
                  <h3>{model.title}</h3>
                </header>
                <dl>
                  <div><dt>Aivel</dt><dd>{model.aivel}</dd></div>
                  <div><dt>{model.counterpartLabel}</dt><dd>{model.counterpart}</dd></div>
                  <div><dt>ИИ и контроль</dt><dd>{model.ai}</dd></div>
                </dl>
                <Link
                  href={model.href}
                  data-who-event={model.analyticsEvent}
                  className="who-inline-link"
                >
                  {model.linkLabel} <span aria-hidden="true">→</span>
                </Link>
              </article>
            ))}
          </div>

          <p className="who-trace-principle">
            <span className="eyebrow">Проверяемый след</span>
            Для действий внутри согласованного процесса сохраняются исходные данные, применённое правило, статус и принятое решение — в пределах настроенного процесса и установленного срока хранения.
          </p>
        </div>
      </section>

      <section className="who-section who-proof" id="dokazatelstva" aria-labelledby="who-proof-title">
        <div className="who-section-inner">
          <header className="who-section-heading who-proof-heading">
            <p className="eyebrow">Основания доверия</p>
            <h2 id="who-proof-title">Работает не в презентации, а в реальном учёте.</h2>
            <p>Три внедрённых контура показывают, где уже работает модель «ИИ делает типовое — специалист решает исключения».</p>
          </header>

          <div className="who-proof-grid">
            {publishedEvidence.map((evidence) => (
              <article key={evidence.id}>
                <div className="who-proof-topline">
                  <span>{evidence.number}</span>
                  <p>{evidence.process}</p>
                </div>
                <div className={`who-proof-logos who-proof-logos-${evidence.logos.length}`}>
                  {evidence.logos.map((logo) => (
                    <Image
                      key={logo.name}
                      src={logo.src}
                      alt={logo.name}
                      width={logo.width}
                      height={logo.height}
                      loading="eager"
                      unoptimized
                    />
                  ))}
                </div>
                <h3>{evidence.statement}</h3>
                <dl>
                  <div><dt>Периметр</dt><dd>{evidence.perimeter}</dd></div>
                  <div><dt>Ответственная роль</dt><dd>{evidence.accountableRole}</dd></div>
                </dl>
                <Link
                  className="who-proof-link"
                  href={evidence.href}
                  data-who-event="who_proof_click"
                  data-client={evidence.id}
                  data-process={evidence.process}
                >
                  {evidence.linkLabel} <span aria-hidden="true">→</span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="who-section who-next" id="sleduyushchiy-shag" aria-labelledby="who-next-title">
        <div className="who-section-inner">
          <header className="who-section-heading who-next-heading">
            <p className="eyebrow">Следующий шаг</p>
            <h2 id="who-next-title">Познакомиться с Aivel в работе.</h2>
          </header>

          <div className="who-route-grid">
            {whoRoutes.map((route) => (
              <article key={route.id}>
                <span className="who-route-number">{route.number}</span>
                <p className="eyebrow">{route.audience}</p>
                <h3>{route.outcome}</h3>
                <div className="who-route-actions">
                  <Link
                    className="who-route-primary"
                    href={route.href}
                    data-who-event="who_route_click"
                    data-route={route.id}
                  >
                    {route.linkLabel} <span aria-hidden="true">→</span>
                  </Link>
                  {route.secondary ? (
                    <Link
                      className="who-route-secondary"
                      href={route.secondary.href}
                      data-who-event="who_demo_click"
                      data-placement="who_route_business"
                    >
                      {route.secondary.label}
                    </Link>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
