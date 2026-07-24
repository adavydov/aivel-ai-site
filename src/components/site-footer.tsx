import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-lead">
        <p className="eyebrow">Aivel</p>
        <h2>Финансы, которые помогают действовать.</h2>
      </div>
      <div className="footer-links">
        <div>
          <p className="eyebrow">Что мы делаем</p>
          <Link href="/#vazhnoe">Увидеть важное</Link>
          <Link href="/chto-my-delaem#uchet">Надёжный учёт</Link>
          <Link href="/chto-my-delaem#operatsii">Автоматизировать операции</Link>
          <Link href="/chto-my-delaem#agenty">ИИ-агенты по процессам</Link>
        </div>
        <div>
          <p className="eyebrow">Компания</p>
          <Link href="/chto-my-dumaem">Что мы думаем</Link>
          <Link href="/kto-my">Кто мы</Link>
          <Link href="/partneram">Партнёрам</Link>
        </div>
        <div>
          <p className="eyebrow">Связаться</p>
          <Link href="/#demo">Записаться на демонстрацию</Link>
          <a href="mailto:hello@aivel.ai">hello@aivel.ai</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Aivel</span>
        <span>Рабочий образец. Не публичная версия.</span>
      </div>
    </footer>
  );
}
