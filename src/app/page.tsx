import type { Metadata } from "next";
import Image from "next/image";
import { PageShell } from "@/components/page-shell";
import { assetPath } from "@/lib/site-paths";

export const metadata: Metadata = {
  description: "Aivel заранее сообщает о кассовых разрывах, потерянной выручке, снижении прибыльности и деньгах в запасах — на основе надёжного учёта.",
  alternates: { canonical: "/" },
};

const signals = [
  {
    label: "Денежный поток",
    title: "Через 12 дней на зарплату не хватит 2,4 млн ₽.",
    reason: "Причина: платёж поставщику уйдёт раньше ожидаемого поступления от клиента.",
    time: "Сегодня, 09:40",
  },
  {
    label: "Невыставленная выручка",
    title: "Оказанные услуги на 1,8 млн ₽ ещё не выставлены клиентам.",
    reason: "Причина: услуги закрыты в рабочей системе, но акт и счёт не созданы.",
    time: "Сегодня, 10:15",
  },
  {
    label: "Прибыльность заказа",
    title: "Маржа заказа № 184 снизилась: 24% → 16%.",
    reason: "Причина: себестоимость выросла, а цена для клиента осталась прежней.",
    time: "Вчера, 18:20",
  },
];

const managementJobs = [
  {
    number: "01",
    title: "Высвободить деньги из запасов",
    text: "Находит дубли и залежавшиеся позиции, связывает номенклатуру с продажами и показывает, что можно не закупать снова.",
  },
  {
    number: "02",
    title: "Видеть прибыльность каждой операции",
    text: "Считает прибыль проекта, заказа, услуги или отгрузки до закрытия месяца — по данным рабочих систем и учёта.",
  },
  {
    number: "03",
    title: "Не терять выручку",
    text: "Сверяет оказанные услуги, отгрузки, договоры, тарифы и счета. Находит то, что сделали, но не выставили клиенту.",
  },
  {
    number: "04",
    title: "Вернуть недополученные деньги",
    text: "Сопоставляет отчёты площадок, агентов и партнёров с продажами, возвратами и тарифами. Показывает недоплаты.",
  },
  {
    number: "05",
    title: "Быстрее получать оплату",
    text: "Показывает, где зависли деньги: нет акта, счёт не принят, возник спор или уже подошёл срок оплаты.",
  },
  {
    number: "06",
    title: "Заранее увидеть кассовый разрыв",
    text: "Сопоставляет будущие платежи и поступления и сообщает дату, сумму дефицита и его первопричину.",
  },
];

const tariffs = [
  {
    name: "Небольшой бизнес",
    price: "29 900 ₽",
    limit: "До 5 сотрудников",
    volume: "До 50 документов и операций в месяц",
  },
  {
    name: "Растущая компания",
    price: "59 900 ₽",
    limit: "До 20 сотрудников",
    volume: "До 150 документов и операций в месяц",
  },
  {
    name: "Бизнес до 50 сотрудников",
    price: "99 900 ₽",
    limit: "До 50 сотрудников",
    volume: "До 300 документов и операций в месяц",
  },
];

const brands = [
  { name: "ДДХ", src: assetPath("/brands/ddx.png"), width: 132, height: 72 },
  { name: "Нефтьмагистраль", src: assetPath("/brands/neftmagistral.png"), width: 206, height: 72 },
  { name: "Братья Караваевы", src: assetPath("/brands/karavaevi-wordmark.svg"), width: 216, height: 72 },
  { name: "Гольфстрим", src: assetPath("/brands/golfstrim-official.svg"), width: 188, height: 72 },
];

export default function Home() {
  return (
    <PageShell>
      <section className="hero" id="vazhnoe">
        <div className="hero-noise" aria-hidden="true" />
        <div className="hero-copy">
          <p className="eyebrow accent-rule">Финансы, которые помогают действовать</p>
          <h1>Ваш ИИ-финансовый директор сам сообщит, что изменилось в бизнесе.</h1>
          <p className="hero-subtitle">Он постоянно проверяет учёт, замечает значимые изменения и объясняет их причину — не нужно ждать отчёт или ответа аналитика.</p>
        </div>
        <div className="signal-stack" aria-label="Примеры сообщений ИИ-финансового директора">
          {signals.map((signal) => (
            <article className="signal-card" key={signal.title}>
              <p className="signal-meta"><span>{signal.label}</span><time>{signal.time}</time></p>
              <h2>{signal.title}</h2>
              <p className="signal-reason">{signal.reason}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mechanism section" id="mechanism">
        <div className="section-heading">
          <p className="eyebrow">Механизм</p>
          <h2>От факта — к решению.</h2>
          <p>Не ещё один отчёт. Короткая цепочка, которая объясняет, почему сигнал заслуживает внимания.</p>
        </div>
        <ol className="process-line">
          <li><span>01</span><strong>Собирает факты</strong><p>Учёт, банк, документы и рабочие системы.</p></li>
          <li><span>02</span><strong>Проверяет контекст</strong><p>Планы, правила, связи и особенности бизнеса.</p></li>
          <li><span>03</span><strong>Выделяет значимое</strong><p>То, что требует решения именно сейчас.</p></li>
          <li><span>04</span><strong>Показывает основание</strong><p>Расчёт, операцию и первичный документ.</p></li>
        </ol>

        <div className="management-jobs" id="management-jobs">
          <div className="management-jobs-heading">
            <p className="eyebrow">Управленческий учёт</p>
            <h3>Aivel показывает, где деньги теряются, застревают или заканчиваются.</h3>
          </div>
          <div className="management-jobs-grid">
            {managementJobs.map((job) => (
              <article key={job.number}>
                <span>{job.number}</span>
                <div>
                  <h4>{job.title}</h4>
                  <p>{job.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="accounting-foundation section" id="uchet">
        <div className="section-heading wide-heading">
          <p className="eyebrow">Учёт как основание</p>
          <h2>Мы отвечаем за учёт, на котором основан каждый сигнал.</h2>
          <p>Aivel собирает документы, деньги и операции в единую учётную основу. ИИ выполняет типовые действия, специалисты разбирают исключения, а каждый вывод можно проверить до исходных данных.</p>
        </div>

        <div className="accounting-map" aria-label="Как формируется надёжная учётная основа">
          <div className="source-cluster">
            <p className="map-label">Факты бизнеса</p>
            <span>Документы</span>
            <span>Деньги</span>
            <span>Операции</span>
          </div>
          <div className="map-arrow" aria-hidden="true">→</div>
          <div className="work-cluster">
            <p className="map-label">Обработка</p>
            <div><strong>ИИ</strong><span>Типовые действия</span></div>
            <div><strong>Специалист</strong><span>Исключения</span></div>
          </div>
          <div className="map-arrow" aria-hidden="true">→</div>
          <div className="foundation-result">
            <p className="map-label">Основание</p>
            <strong>Надёжный учёт</strong>
            <span>Проверяемые данные для каждого сигнала владельцу.</span>
          </div>
        </div>

        <ul className="accounting-scope" aria-label="Что входит в учёт">
          <li>Бухгалтерский и налоговый учёт</li>
          <li>Отчётность</li>
          <li>Зарплата и кадры</li>
          <li>Банк и первичные документы</li>
        </ul>
      </section>

      <section className="pricing-section section" id="price">
        <div className="section-heading wide-heading">
          <p className="eyebrow">Цена</p>
          <h2>Учёт и сигналы владельцу — от 29 900 ₽ в месяц.</h2>
          <p>Во всех тарифах Aivel ведёт учёт и сообщает владельцу о важных изменениях. Цена зависит от числа сотрудников и объёма операций.</p>
        </div>

        <div className="pricing-grid">
          {tariffs.map((tariff) => (
            <article className="tariff-card" key={tariff.name}>
              <p className="tariff-name">{tariff.name}</p>
              <p className="tariff-price">{tariff.price}</p>
              <p className="tariff-period">в месяц</p>
              <div className="tariff-details">
                <strong>{tariff.limit}</strong>
                <span>{tariff.volume}</span>
              </div>
            </article>
          ))}
        </div>

        <div className="complex-tariff">
          <div><p className="eyebrow">Сложный контур</p><strong>от 149 900 ₽ в месяц</strong></div>
          <p>Несколько юридических лиц, ОСНО, НДС, производство или сложные обмены.</p>
        </div>
      </section>

      <section className="evidence-demo section" id="demo">
        <div className="section-heading wide-heading">
          <p className="eyebrow">Доказательство и демонстрация</p>
          <h2>Это уже работает. Проверьте на своём бизнесе.</h2>
        </div>

        <div className="evidence-grid">
          <article>
            <p className="evidence-value">×2</p>
            <h3>ДДХ</h3>
            <p>Бизнес вырос в два раза без найма новых бухгалтеров.</p>
          </article>
          <article>
            <p className="evidence-value">70%</p>
            <h3>Нефтьмагистраль</h3>
            <p>Первичных документов обработано без участия человека.</p>
          </article>
          <article>
            <p className="evidence-value">70%</p>
            <h3>Братья Караваевы</h3>
            <p>Первичных документов обработано без участия человека.</p>
          </article>
        </div>

        <div className="brand-proof" aria-label="Компании, в которых работает опыт Aivel">
          <p>Опыт внедрений</p>
          <div>
            {brands.map((brand) => (
              <Image
                className="proof-logo"
                src={brand.src}
                alt={brand.name}
                width={brand.width}
                height={brand.height}
                key={brand.name}
                loading="eager"
                unoptimized
              />
            ))}
          </div>
        </div>

        <div className="demo-panel">
          <div>
            <p className="eyebrow">30 минут</p>
            <h3>Проверьте Aivel на одном сигнале.</h3>
            <p>Покажем, что произошло, почему это важно и как дойти до первопричины.</p>
          </div>
          <ol aria-label="Что покажем на демонстрации">
            <li><span>01</span>Что произошло</li>
            <li><span>02</span>Почему это важно</li>
            <li><span>03</span>Откуда взялись данные</li>
          </ol>
          <a className="button light" href="mailto:hello@aivel.ai?subject=Демонстрация Aivel">Записаться на демонстрацию →</a>
        </div>
      </section>
    </PageShell>
  );
}
