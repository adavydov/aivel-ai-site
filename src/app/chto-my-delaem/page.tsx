import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Что делает Aivel",
  description: "Решения Aivel для бизнеса и крупных компаний: своевременные сигналы, надёжный учёт и ИИ-агенты по финансовым процессам.",
  alternates: { canonical: "/chto-my-delaem" },
};

const businessOffers = [
  { number: "01", id: "vazhnoe", title: "Увидеть важное", text: "Aivel сообщает о кассовых разрывах, потерянной выручке, снижении прибыльности и деньгах, застрявших в запасах или расчётах — и показывает основание вывода.", href: "/#vazhnoe" },
  { number: "02", id: "uchet", title: "Надёжный учёт", text: "Бухгалтерский, налоговый, зарплатный и управленческий учёт — с людьми на профессиональных исключениях.", href: "/#demo" },
];

const largeCompanyOffers = [
  { number: "01", id: "operatsii", title: "Автоматизировать финансовые операции", text: "Передать ИИ повторяющийся процесс от входящих данных до результата в учётной системе.", href: "/#demo" },
  { number: "02", id: "agenty", title: "ИИ-агенты по процессам", text: "Первичные документы, банковские операции, сверки, закрытие периода, зарплата и кадры — с человеком на исключениях.", href: "/#demo" },
];

export default function WhatWeDo() {
  return (
    <PageShell>
      <section className="page-hero">
        <div><p className="eyebrow accent-rule">Что мы делаем</p><h1>Финансы становятся системой действий.</h1></div>
        <p>Мы помогаем бизнесу вовремя видеть важное, а крупным компаниям — передавать ИИ отдельные финансовые процессы.</p>
      </section>
      <section className="section hub-section" id="dlya-biznesa">
        <div className="section-heading"><p className="eyebrow">Для бизнеса</p><h2>Знать, что происходит. Опираться на точные данные.</h2></div>
        <div className="simple-grid">
          {businessOffers.map((offer) => <Link className="simple-card" id={offer.id} href={offer.href} key={offer.title}><span className="card-number">{offer.number}</span><h3>{offer.title}</h3><p>{offer.text}</p><span className="text-link">Подробнее →</span></Link>)}
        </div>
      </section>
      <section className="section hub-section alt" id="dlya-krupnyh-kompaniy">
        <div className="section-heading"><p className="eyebrow">Для крупных компаний</p><h2>Автоматизировать процесс. Сохранить контроль.</h2><p>Начните с одной операции, заранее определите границы, способ проверки и измеримый результат.</p></div>
        <div className="simple-grid">
          {largeCompanyOffers.map((offer) => <Link className="simple-card" id={offer.id} href={offer.href} key={offer.title}><span className="card-number">{offer.number}</span><h3>{offer.title}</h3><p>{offer.text}</p><span className="text-link">Подробнее →</span></Link>)}
        </div>
      </section>
    </PageShell>
  );
}
