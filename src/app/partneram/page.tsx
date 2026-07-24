import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import {
  getPublishedPartnerClaim,
  getPublishedPartnerClaims,
} from "@/data/partner-claims";
import {
  ownerOutcomes,
  partnerFaq,
  partnerResponsibilities,
} from "@/data/partner-program";
import { absoluteUrl, siteUrl } from "@/lib/site-paths";
import { PartnerInquiryForm } from "./partner-inquiry-form";

const title = "Партнёрство с Aivel для владельцев бухгалтерских компаний";
const description =
  "Aivel приобретает долю от 51% в бухгалтерской компании, берёт на себя технологию и производственный процесс. Модель ролей, этапы сделки, факторы оценки и первый шаг без передачи закрытых данных.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/partneram" },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "/partneram",
    title,
    description,
    images: [
      {
        url: absoluteUrl("/partneram/opengraph-image"),
        width: 1200,
        height: 630,
        alt: "Партнёрство Aivel для владельцев бухгалтерских компаний",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [absoluteUrl("/partneram/opengraph-image")],
  },
};

const acquisitionClaim = getPublishedPartnerClaim("partner-acquisition-threshold");
const categoryClaim = getPublishedPartnerClaim("partner-category-boundary");
const controlClaim = getPublishedPartnerClaim("partner-control-boundary");
const ownershipClaim = getPublishedPartnerClaim("partner-ownership-options");
const partnerProof = getPublishedPartnerClaims("implementation-proof")[0];
const partnerProfiles = getPublishedPartnerClaims("partner-profile");
const scaleClaims = getPublishedPartnerClaims("scale");
const showPartnerNeeds = partnerProfiles.length >= 3;
const showScale = scaleClaims.length >= 2;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${absoluteUrl("/partneram")}#webpage`,
      url: absoluteUrl("/partneram"),
      name: title,
      description,
      inLanguage: "ru-RU",
      dateModified: "2026-07-20",
      isPartOf: { "@id": `${siteUrl}/#website` },
      about: { "@id": `${siteUrl}/#organization` },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${absoluteUrl("/partneram")}#breadcrumbs`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Главная",
          item: siteUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Партнёрам",
          item: absoluteUrl("/partneram"),
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${absoluteUrl("/partneram")}#faq`,
      mainEntity: partnerFaq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ],
};

export default function Partners() {
  return (
    <PageShell
      headerCta={{
        label: "Рассказать о компании",
        shortLabel: "Анкета",
        href: "/partneram#partner-form",
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />

      <article className="partners-page">
        <section className="partners-hero" aria-labelledby="partners-title">
          <div className="partners-hero-copy">
            <p className="eyebrow accent-rule">Владельцам бухгалтерских компаний</p>
            <h1 id="partners-title">
              <span>Расти без найма.</span>
              <span>Стать финансовым партнёром для клиента.</span>
            </h1>
            {acquisitionClaim && (
              <p className="partners-hero-intro">
                {acquisitionClaim.wording} Aivel берёт на себя технологии и производственный процесс.
                Если собственник остаётся в бизнесе, его роль, права и ответственность за клиентов и
                рост заранее закрепляются в структуре сделки.
              </p>
            )}
            {categoryClaim && <p className="partners-qualifier">{categoryClaim.wording}</p>}
            <div className="partners-hero-actions">
              <Link className="button primary" href="#partner-form">Рассказать о компании</Link>
              <Link className="partners-secondary-link" href="#partnership-model">
                Как устроено партнёрство ↓
              </Link>
            </div>
            <nav className="partners-route-away" aria-label="Другие решения Aivel">
              <span>Ищете другой формат?</span>
              <Link href="/">Решения для бизнеса</Link>
              <Link href="/dlya-korporatsiy">Решения для крупных компаний</Link>
            </nav>
          </div>

          <div className="partners-hero-trajectory" aria-hidden="true">
            <div className="trajectory-axis">
              <span>Новая выручка</span>
              <i />
              <strong>больше клиентов</strong>
            </div>
            <div className="trajectory-turn">+</div>
            <div className="trajectory-axis is-blue">
              <span>Новая роль</span>
              <i />
              <strong>больше времени у клиента</strong>
            </div>
          </div>
        </section>

        <section className="partners-section partners-model" id="partnership-model" aria-labelledby="partnership-model-title">
          <header className="partners-section-heading">
            <p className="eyebrow">Суть партнёрства</p>
            <h2 id="partnership-model-title">Вы отвечаете за рост. Aivel — за производительность.</h2>
            <p>
              Партнёрство разделяет зоны работы до сделки, чтобы новая роль собственника и границы
              ответственности не оставались обещанием на словах.
            </p>
          </header>

          <div className="partners-responsibility-map">
            {Object.values(partnerResponsibilities).map((area, index) => (
              <article className={`responsibility-area responsibility-area-${index + 1}`} key={area.label}>
                <div className="responsibility-heading">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{area.label}</p>
                </div>
                <h3>{area.title}</h3>
                <ul>
                  {area.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </article>
            ))}
          </div>

          {(controlClaim || ownershipClaim) && (
            <aside className="partners-control-boundary" aria-label="Граница влияния и варианты сделки">
              <div>
                <p className="eyebrow">Честная граница влияния</p>
                {controlClaim && <p>{controlClaim.wording}</p>}
              </div>
              <div className="partners-ownership-options">
                <span>Варианты</span>
                <strong>100%</strong>
                <i aria-hidden="true">или</i>
                <strong>51% → 100%</strong>
                {ownershipClaim && <p>{ownershipClaim.wording}</p>}
              </div>
            </aside>
          )}
        </section>

        <section className="partners-section partners-owner-role" aria-labelledby="owner-role-title">
          <header className="partners-section-heading">
            <p className="eyebrow">Что меняется для собственника</p>
            <h2 id="owner-role-title">Не выход из бизнеса. Новая роль в нём.</h2>
          </header>

          <div className="owner-role-transition">
            <article>
              <span className="owner-role-label">Сейчас</span>
              <h3>Собственник удерживает производство вручную.</h3>
              <p>Сроки, люди, исключения и качество требуют ежедневного внимания. Новый клиент добавляет операционную нагрузку.</p>
            </article>
            <div className="owner-role-arrow" aria-hidden="true"><span>→</span></div>
            <article className="is-future">
              <span className="owner-role-label">После объединения</span>
              <h3>Собственник развивает клиентов и практику.</h3>
              <p>ИИ-агенты ведут типовой поток, специалисты разбирают исключения и консультируют, собственник отвечает за рост и сервис.</p>
            </article>
          </div>

          <ol className="partners-outcomes">
            {ownerOutcomes.map((outcome) => (
              <li key={outcome.number}>
                <span>{outcome.number}</span>
                <h3>{outcome.title}</h3>
                <p>{outcome.copy}</p>
              </li>
            ))}
          </ol>

          {partnerProof && partnerProof.proofPassport && (
            <aside className="partners-published-proof">
              <p className="eyebrow">Проверяемый пример</p>
              <p>{partnerProof.wording}</p>
              <a href={partnerProof.proofPassport.sourceUrl}>Источник и границы измерения →</a>
            </aside>
          )}

          <div className="partners-technology-path">
            <p>
              Проверить производственную систему можно до обсуждения сделки: посмотреть работу
              конкретного ИИ-агента, а референс-встречу провести по согласованию с клиентом.
            </p>
            <Link className="partners-secondary-link" href="/dlya-korporatsiy">
              Посмотреть ИИ-агентов →
            </Link>
          </div>

          {showScale && !showPartnerNeeds && (
            <div className="partners-scale-line" aria-label="Подтверждённый масштаб Aivel">
              {scaleClaims.slice(0, 3).map((claim) => (
                <span key={claim.id}>{claim.scaleMetric?.value}</span>
              ))}
            </div>
          )}
        </section>

        {showPartnerNeeds && (
          <section className="partners-section partners-needs" aria-labelledby="partner-needs-title">
            <header className="partners-section-heading">
              <p className="eyebrow">Актуально сейчас</p>
              <h2 id="partner-needs-title">Aivel особенно нужны партнёры с конкретной экспертизой.</h2>
              <p>Список проверен <time dateTime="2026-07-20">20 июля 2026 года</time>.</p>
            </header>
            <ol className="partners-needs-list">
              {partnerProfiles.slice(0, 6).map((claim, index) => (
                <li key={claim.id}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{claim.partnerProfile?.geography}</strong>
                  <p>{claim.partnerProfile?.specialization}</p>
                  <p>{claim.partnerProfile?.networkValue}</p>
                </li>
              ))}
            </ol>
            {showScale && (
              <div className="partners-scale-line" aria-label="Подтверждённый масштаб Aivel">
                {scaleClaims.slice(0, 3).map((claim) => (
                  <span key={claim.id}>{claim.scaleMetric?.value}</span>
                ))}
              </div>
            )}
          </section>
        )}

        <section className="partners-section partners-faq" aria-labelledby="partner-faq-title">
          <div className="partners-faq-intro">
            <p className="eyebrow">Вопросы собственника</p>
            <h2 id="partner-faq-title">Сначала — ясность. Потом — условия.</h2>
            {acquisitionClaim && <p className="partners-faq-qualifier">{acquisitionClaim.wording}</p>}
            <p className="partners-review-date">
              Условия страницы проверены <time dateTime="2026-07-20">20 июля 2026 года</time>.
            </p>
          </div>
          <div className="partners-faq-list">
            {partnerFaq.map((item, index) => (
              <details key={item.question} open={index === 0}>
                <summary>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{item.question}</strong>
                  <i aria-hidden="true" />
                </summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="partners-section partners-lead" aria-labelledby="partner-form">
          <div className="partners-lead-copy">
            <p className="eyebrow">Следующий шаг</p>
            <h2 id="partner-form" tabIndex={-1}>Начнём без закрытых данных.</h2>
            <p>
              Расскажите, где работает компания, каков её примерный масштаб и какую роль вы
              рассматриваете для себя. Клиентские списки, отчётность и точная выручка на первом шаге
              не нужны.
            </p>
            <div className="partners-data-note" id="partner-data-policy">
              <h3>Как используются данные</h3>
              <p>
                Только чтобы ответить на обращение и понять, подходит ли формат партнёрства. Если
                приём заявок ещё не подключён, сайт ничего не отправляет — он готовит письмо, которое
                вы подтверждаете сами. По вопросам изменения или удаления обращения: <a href="mailto:hello@aivel.ai">hello@aivel.ai</a>.
              </p>
            </div>
          </div>
          <PartnerInquiryForm />
        </section>
      </article>
    </PageShell>
  );
}
