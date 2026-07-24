import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { corporateProducts, getCorporateProduct } from "@/data/corporate-products";
import { absoluteUrl } from "@/lib/site-paths";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return corporateProducts.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getCorporateProduct(slug);

  if (!product) {
    return { title: "Продукт не найден — Aivel" };
  }

  return {
    title: `${product.title} — Aivel`,
    description: `${product.hero} От ${product.from} до ${product.to}.`,
    alternates: { canonical: absoluteUrl(`/dlya-korporatsiy/${product.slug}`) },
  };
}

function PlatformDemo() {
  return (
    <div className="product-platform-demo" aria-label="Пример интерфейса платформы управления ИИ">
      <div className="product-platform-sidebar">
        <span className="platform-mark" aria-hidden="true">A</span>
        <nav aria-label="Разделы примера платформы">
          <b>Очередь</b><span>Процессы</span><span>Команда</span><span>Журнал</span>
        </nav>
      </div>
      <div className="product-platform-main">
        <header><div><p>Работа процессов</p><strong>Очередь операций</strong></div><span>Сегодня</span></header>
        <div className="product-platform-columns">
          <div className="product-platform-list">
            <article className="is-active"><span>Первичные документы</span><strong>Поступление №4821</strong><small>Проверено ИИ</small></article>
            <article><span>Сверки</span><strong>Акт сверки · Альфа</strong><small className="is-exception">Нужен специалист</small></article>
            <article><span>Закрытие периода</span><strong>Проверка незавершённых операций</strong><small>В работе</small></article>
          </div>
          <aside>
            <p className="eyebrow">Путь операции</p>
            <h3>Поступление №4821</h3>
            <ol>
              <li><time>09:41</time><span>Документ получен из ЭДО</span></li>
              <li><time>09:41</time><span>Реквизиты проверены</span></li>
              <li><time>09:42</time><span>Поступление создано в 1С</span></li>
            </ol>
            <div><span>Роль</span><strong>ИИ · Первичные документы</strong></div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default async function CorporateProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getCorporateProduct(slug);

  if (!product) {
    notFound();
  }

  return (
    <PageShell>
      <section className="product-hero">
        <div className="product-hero-copy">
          <Link className="product-back" href="/dlya-korporatsiy">← Все решения для корпораций</Link>
          <p className="eyebrow accent-rule">{product.title}</p>
          <h1>{product.hero}</h1>
          <p>{product.lead}</p>
          <a className="button primary" href="#product-demo">Посмотреть процесс</a>
        </div>

        <div className="product-range-board" aria-label={`От ${product.from} до ${product.to}`}>
          <p className="eyebrow">Процесс целиком</p>
          <div><span>От</span><strong>{product.from}</strong></div>
          <i aria-hidden="true">↓</i>
          <div className="is-result"><span>До</span><strong>{product.to}</strong></div>
        </div>
      </section>

      <section className="product-section product-demo" id="product-demo">
        <div className="product-heading">
          <p className="eyebrow">Как работает</p>
          <h2>От {product.from} — до {product.to}.</h2>
        </div>

        <div className={`product-demo-grid ${product.isPlatform ? "is-platform" : ""}`}>
          {product.isPlatform ? (
            <PlatformDemo />
          ) : (
            <div className="product-video-frame">
              <iframe
                src={`https://drive.google.com/file/d/${product.videoId}/preview`}
                title={product.videoLabel}
                allow="autoplay; fullscreen"
                loading="lazy"
                allowFullScreen
              />
              <p>{product.videoLabel}</p>
            </div>
          )}

          <ol className="product-steps">
            {product.steps.map((step, index) => (
              <li key={step.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div><strong>{step.title}</strong><p>{step.text}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="product-section product-result">
        <div className="product-result-metric">
          <p className="eyebrow">Что уже измерено</p>
          <strong>{product.result.value}</strong>
          <h2>{product.result.label}</h2>
          <p>{product.result.note}</p>
        </div>

        <div className="product-comparison">
          <p className="eyebrow">Отличие</p>
          <h2>Не фрагмент автоматизации. Готовый результат процесса.</h2>
          <article>
            <span>Распознавание или отдельный робот</span>
            <p>{product.partialSolution}</p>
          </article>
          <article className="is-aivel">
            <span>Aivel</span>
            <p>{product.aivelDifference}</p>
          </article>
        </div>
      </section>

      <section className="product-section product-control" id="product-contact">
        <div className="product-control-copy">
          <p className="eyebrow">Контроль</p>
          <h2>Каждый результат можно проверить.</h2>
          <p>Платформа связывает исходные данные, проверки, действие ИИ и решение специалиста в один путь.</p>
        </div>
        <ol className="product-control-list">
          {product.controls.map((control, index) => (
            <li key={control}><span>{String(index + 1).padStart(2, "0")}</span>{control}</li>
          ))}
        </ol>
        <div className="product-contact-card">
          <p className="eyebrow">Следующий шаг</p>
          <h3>Проверим этот процесс на вашей выборке.</h3>
          <a className="button light" href={`mailto:hello@aivel.ai?subject=${encodeURIComponent(`Демонстрация: ${product.title}`)}`}>Записаться на демонстрацию →</a>
        </div>
      </section>
    </PageShell>
  );
}
