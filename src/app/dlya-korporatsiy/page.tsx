import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { agentProducts, platformProduct } from "@/data/corporate-products";
import { assetPath } from "@/lib/site-paths";

export const metadata: Metadata = {
  title: "Для корпораций — ИИ-агенты Aivel",
  description:
    "Aivel автоматизирует финансовые процессы целиком: от документа, выписки или запроса до готового результата в 1С с контролем исключений.",
  alternates: { canonical: "/dlya-korporatsiy" },
};

const proofBrands = [
  { name: "ДДХ", src: assetPath("/brands/ddx.png"), width: 482, height: 140 },
  { name: "Нефтьмагистраль", src: assetPath("/brands/neftmagistral.png"), width: 480, height: 138 },
  { name: "Братья Караваевы", src: assetPath("/brands/karavaevi-wordmark.svg"), width: 132, height: 37 },
  { name: "Гольфстрим", src: assetPath("/brands/golfstrim-official.svg"), width: 278, height: 48 },
  { name: "ВсеИнструменты.ру", src: assetPath("/brands/vseinstrumenti.png"), width: 482, height: 138 },
] as const;

const processSteps = [
  { number: "01", title: "Получает операцию", text: "Из банка, ЭДО, почты, 1С или рабочей системы." },
  { number: "02", title: "Выполняет по правилам", text: "Проверяет данные и делает согласованные действия." },
  { number: "03", title: "Передаёт исключение", text: "Специалист видит только случай, где нужно решение." },
  { number: "04", title: "Возвращает результат", text: "Готовая операция попадает в 1С или исходный процесс." },
] as const;

export default function EnterprisePage() {
  return (
    <PageShell>
      <section className="enterprise-hero">
        <div className="enterprise-hero-copy">
          <p className="eyebrow accent-rule">Для корпораций</p>
          <h1>Больше операций. Тот же штат. Более точный учёт.</h1>
          <p>
            Aivel автоматизирует финансовый процесс целиком — от документа, выписки или события до результата в 1С. ИИ выполняет типовые операции, специалист решает исключения, платформа сохраняет контроль.
          </p>
          <Link className="button primary" href="#products">Выбрать процесс</Link>
        </div>

        <figure className="enterprise-task-map" aria-labelledby="enterprise-task-map-title">
          <figcaption id="enterprise-task-map-title">Две задачи. Один механизм.</figcaption>

          <div className="enterprise-capacity-chart" aria-label="Объём операций растёт, команда остаётся прежней">
            <div className="capacity-chart-labels">
              <span>Больше операций</span>
              <span>Та же команда</span>
            </div>
            <svg viewBox="0 0 520 190" role="img" aria-label="Рост объёма операций при неизменной численности команды">
              <path className="capacity-grid" d="M16 24H504M16 72H504M16 120H504M16 168H504" />
              <path className="capacity-team" d="M20 132C142 130 258 132 500 130" />
              <path className="capacity-volume" d="M20 150C120 148 166 132 228 116C300 97 356 76 500 34" />
              <circle className="capacity-point" cx="500" cy="34" r="6" />
              <circle className="capacity-team-point" cx="500" cy="130" r="5" />
            </svg>
          </div>

          <div className="enterprise-operation-flow" aria-label="Типовые операции выполняет ИИ, исключения получает специалист">
            <div className="flow-node flow-source"><span>01</span><strong>Операция</strong></div>
            <div className="flow-line" aria-hidden="true" />
            <div className="flow-node flow-ai"><span>02</span><strong>ИИ действует<br />по правилам</strong></div>
            <div className="flow-split" aria-hidden="true" />
            <div className="flow-destinations">
              <div className="flow-node flow-ready"><span>03</span><strong>Готовый результат</strong></div>
              <div className="flow-node flow-human"><span>!</span><strong>Исключение — специалисту</strong></div>
            </div>
          </div>
        </figure>
      </section>

      <section className="enterprise-section enterprise-mechanism">
        <div className="enterprise-heading">
          <p className="eyebrow">Как устроено</p>
          <h2>Повторяющиеся действия — ИИ. Решения — специалисту.</h2>
          <p>Для каждого процесса заранее задаются правила, проверки и момент передачи человеку.</p>
        </div>

        <ol className="enterprise-process" aria-label="Механика работы ИИ-агента">
          {processSteps.map((step) => (
            <li key={step.number}>
              <span>{step.number}</span>
              <strong>{step.title}</strong>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>

        <Link className="enterprise-platform-rail" href={`/dlya-korporatsiy/${platformProduct.slug}`}>
          <span className="eyebrow">Платформа Aivel</span>
          <strong>Управляет ролями, очередью и статусами. Сохраняет путь каждой операции.</strong>
          <span>Посмотреть платформу →</span>
        </Link>
      </section>

      <section className="enterprise-section enterprise-products" id="products">
        <div className="enterprise-heading">
          <p className="eyebrow">Продукты</p>
          <h2>Выберите процесс, который нужно довести до результата.</h2>
          <p>Каждый ИИ-агент отвечает за один законченный участок — от входного события до готового результата.</p>
        </div>

        <div className="enterprise-product-grid">
          {agentProducts.map((product, index) => (
            <Link className={`enterprise-product-card ${index === 0 ? "is-featured" : ""}`} href={`/dlya-korporatsiy/${product.slug}`} key={product.slug}>
              <p className="enterprise-card-number">{String(index + 1).padStart(2, "0")}</p>
              <h3>{product.menuLabel}</h3>
              <dl className="enterprise-range">
                <div><dt>От</dt><dd>{product.from}</dd></div>
                <div><dt>До</dt><dd>{product.to}</dd></div>
              </dl>
              <div className="enterprise-card-footer">
                <span>{product.result.value} {product.result.label}</span>
                <b aria-hidden="true">→</b>
              </div>
            </Link>
          ))}
        </div>

        <Link className="enterprise-platform-product" href={`/dlya-korporatsiy/${platformProduct.slug}`}>
          <div>
            <p className="eyebrow">Продукт внутри корпоративного контура</p>
            <h3>{platformProduct.title}</h3>
          </div>
          <dl className="enterprise-range">
            <div><dt>От</dt><dd>{platformProduct.from}</dd></div>
            <div><dt>До</dt><dd>{platformProduct.to}</dd></div>
          </dl>
          <span>Открыть продукт →</span>
        </Link>
      </section>

      <section className="enterprise-section enterprise-control">
        <div className="enterprise-heading">
          <p className="eyebrow">Контроль</p>
          <h2>Автоматизация не создаёт новый чёрный ящик.</h2>
          <p>В платформе видны работа ИИ, момент передачи человеку и основание каждого решения.</p>
        </div>

        <div className="platform-showcase">
          <div className="platform-window" aria-label="Пример интерфейса платформы Aivel">
            <div className="platform-window-top">
              <div><span className="platform-mark" aria-hidden="true">A</span><strong>Работа процессов</strong></div>
              <span>Пример интерфейса</span>
            </div>
            <div className="platform-tabs">
              <span className="is-active">Все операции</span>
              <span>Исключения</span>
              <span>Завершённые</span>
            </div>
            <div className="platform-workspace">
              <div className="platform-queue">
                <article className="is-selected">
                  <i aria-hidden="true" />
                  <div><strong>Поступление №4821</strong><span>Первичные документы</span></div>
                  <b>Проверено ИИ</b>
                </article>
                <article>
                  <i aria-hidden="true" />
                  <div><strong>Акт сверки · Альфа</strong><span>Сверки</span></div>
                  <b className="needs-human">Нужен специалист</b>
                </article>
                <article>
                  <i aria-hidden="true" />
                  <div><strong>Закрытие периода</strong><span>Стандартные проверки</span></div>
                  <b>В работе</b>
                </article>
              </div>
              <aside className="platform-trace">
                <p className="eyebrow">След операции</p>
                <strong>Поступление №4821</strong>
                <ol>
                  <li><span>09:41</span>Получен документ из ЭДО</li>
                  <li><span>09:41</span>Реквизиты и сумма проверены</li>
                  <li><span>09:42</span>Поступление создано в 1С</li>
                </ol>
                <div><span>Ответственная роль</span><b>ИИ · Первичные документы</b></div>
              </aside>
            </div>
          </div>

          <div className="control-list">
            {[
              ["01", "Границы роли", "Агент действует только в разрешённом процессе и источниках."],
              ["02", "Человек на исключениях", "Неоднозначная операция останавливается и получает ответственного."],
              ["03", "Проверяемый след", "Источник, проверки и решение сохраняются вместе с операцией."],
              ["04", "Ваш периметр", "Развёртывание в российском облаке или внутри инфраструктуры заказчика."],
            ].map(([number, title, text]) => (
              <article key={number}>
                <span>{number}</span>
                <div><strong>{title}</strong><p>{text}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="enterprise-section enterprise-proof" id="demo">
        <div className="enterprise-heading">
          <p className="eyebrow">Доказательство</p>
          <h2>Сначала один процесс. Затем решение о масштабе.</h2>
        </div>

        <div className="enterprise-proof-grid">
          <article className="enterprise-proof-lead">
            <span>×2</span>
            <h3>ДДХ выросли в два раза без найма новых бухгалтеров.</h3>
          </article>
          <article><span>70%</span><h3>Первичных документов без человека в Нефтьмагистрали.</h3></article>
          <article><span>70%</span><h3>Первичных документов без человека в Братьях Караваевых.</h3></article>
        </div>

        <div className="enterprise-brand-strip" aria-label="Опыт внедрений Aivel">
          <p>Опыт внедрений</p>
          <div>
            {proofBrands.map((brand) => (
              <span className="enterprise-brand-tile" key={brand.name}>
                <Image src={brand.src} alt={brand.name} width={brand.width} height={brand.height} unoptimized />
              </span>
            ))}
          </div>
        </div>

        <div className="enterprise-next-step">
          <div>
            <p className="eyebrow">Следующий шаг</p>
            <h2>Выберите один процесс для демонстрации.</h2>
            <p>Покажем путь от источника до результата и согласуем реальную выборку для проверки.</p>
          </div>
          <ol>
            <li><span>01</span>Выбрать процесс</li>
            <li><span>02</span>Проверить выборку</li>
            <li><span>03</span>Сравнить результат</li>
          </ol>
          <a className="button light" href="mailto:hello@aivel.ai?subject=Демонстрация корпоративного процесса Aivel">Записаться на демонстрацию →</a>
        </div>
      </section>
    </PageShell>
  );
}
