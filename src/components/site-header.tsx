"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { assetPath } from "@/lib/site-paths";

const businessOffers = [
  { label: "Увидеть важное", href: "/#vazhnoe" },
  { label: "Надёжный учёт", href: "/#uchet" },
  { label: "Тарифы", href: "/#price" },
] as const;

const corporateOffers = [
  { label: "Первичные документы", href: "/dlya-korporatsiy/pervichnye-dokumenty" },
  { label: "Банковские операции", href: "/dlya-korporatsiy/bankovskie-operatsii" },
  { label: "Сверки с контрагентами", href: "/dlya-korporatsiy/sverki-s-kontragentami" },
  { label: "Закрытие периода", href: "/dlya-korporatsiy/zakrytie-perioda" },
  { label: "Зарплата и кадры", href: "/dlya-korporatsiy/zarplata-i-kadry" },
  { label: "Запросы подразделений", href: "/dlya-korporatsiy/zaprosy-podrazdeleniy" },
] as const;

const companyLinks = [
  { label: "Что мы думаем", href: "/chto-my-dumaem" },
  { label: "Кто мы", href: "/kto-my" },
  { label: "Партнёрам", href: "/partneram" },
] as const;

export type HeaderCta = {
  label: string;
  shortLabel: string;
  href: string;
};

const defaultCta: HeaderCta = {
  label: "Записаться на демонстрацию",
  shortLabel: "Демо",
  href: "/#demo",
};

export function SiteHeader({ cta = defaultCta }: { cta?: HeaderCta }) {
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const megaButtonRef = useRef<HTMLButtonElement>(null);
  const megaMenuRef = useRef<HTMLElement>(null);

  const closeMenus = () => {
    setMegaOpen(false);
    setMobileOpen(false);
  };

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMegaOpen(false);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!megaOpen) return;

    const closeOnOutsidePointer = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (megaButtonRef.current?.contains(target) || megaMenuRef.current?.contains(target)) return;
      setMegaOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsidePointer);
    return () => document.removeEventListener("pointerdown", closeOnOutsidePointer);
  }, [megaOpen]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1161px)");
    const closeForLayout = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setMobileOpen(false);
      } else {
        setMegaOpen(false);
      }
    };
    desktop.addEventListener("change", closeForLayout);
    return () => desktop.removeEventListener("change", closeForLayout);
  }, []);

  return (
    <header className="site-header">
      <nav className="topbar" aria-label="Главная навигация">
        <button
          className="mobile-menu-button"
          type="button"
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          onClick={() => {
            setMegaOpen(false);
            setMobileOpen((value) => !value);
          }}
        >
          <span aria-hidden="true">{mobileOpen ? "×" : "☰"}</span>
          <span className="sr-only">{mobileOpen ? "Закрыть меню" : "Открыть меню"}</span>
        </button>

        <Link className="brand" href="/" aria-label="Aivel — главная" onClick={closeMenus}>
          <Image src={assetPath("/aivel-wordmark-light.png")} alt="Aivel" width={227} height={40} priority />
        </Link>

        <div className="desktop-nav">
          <button
            ref={megaButtonRef}
            className="nav-link nav-button"
            type="button"
            aria-expanded={megaOpen}
            aria-controls="what-we-do-menu"
            onClick={() => {
              setMobileOpen(false);
              setMegaOpen((value) => !value);
            }}
          >
            Что мы делаем <span className="nav-chevron" aria-hidden="true" />
          </button>
          {companyLinks.map((item) => (
            <Link className="nav-link" href={item.href} key={item.href} onClick={closeMenus}>
              {item.label}
            </Link>
          ))}
        </div>

        <Link
          className="header-cta"
          href={cta.href}
          aria-label={cta.label}
          onClick={closeMenus}
        >
          <span className="header-cta-full">{cta.label}</span>
          <span className="header-cta-short" aria-hidden="true">{cta.shortLabel}</span>
        </Link>
      </nav>

      <nav
        ref={megaMenuRef}
        id="what-we-do-menu"
        className={`mega-menu ${megaOpen ? "is-open" : ""}`}
        aria-label="Что мы делаем"
        aria-hidden={!megaOpen}
        hidden={!megaOpen}
      >
        <div className="mega-inner">
          <div className="mega-group">
            <Link className="mega-group-title eyebrow" href="/#vazhnoe" onClick={closeMenus}>
              Для бизнеса
            </Link>
            <div className="mega-links">
              {businessOffers.map((item) => (
                <Link href={item.href} key={item.href} onClick={closeMenus}>{item.label}</Link>
              ))}
            </div>
          </div>
          <div className="mega-group mega-corporate-group">
            <Link className="mega-group-title eyebrow" href="/dlya-korporatsiy" onClick={closeMenus}>
              Для корпораций
            </Link>
            <div className="mega-links mega-product-links">
              {corporateOffers.map((item) => (
                <Link href={item.href} key={item.href} onClick={closeMenus}>{item.label}</Link>
              ))}
            </div>
          </div>
          <Link className="mega-feature" href="/dlya-korporatsiy/platforma" onClick={closeMenus}>
            <span className="eyebrow">Для корпораций · Продукт</span>
            <strong>Платформа управления работой ИИ.</strong>
            <span>Очередь, роли, исключения и история решений →</span>
          </Link>
        </div>
      </nav>

      <nav
        id="mobile-menu"
        className={`mobile-menu ${mobileOpen ? "is-open" : ""}`}
        aria-label="Мобильная навигация"
        aria-hidden={!mobileOpen}
      >
        <div className="mobile-menu-inner">
          <Link className="eyebrow mobile-group-title" href="/#vazhnoe" onClick={closeMenus}>Для бизнеса</Link>
          {businessOffers.map((item) => (
            <Link href={item.href} key={item.href} onClick={closeMenus}>{item.label}</Link>
          ))}

          <Link className="eyebrow mobile-group mobile-group-title" href="/dlya-korporatsiy" onClick={closeMenus}>Для корпораций</Link>
          {corporateOffers.map((item) => (
            <Link href={item.href} key={item.href} onClick={closeMenus}>{item.label}</Link>
          ))}
          <Link href="/dlya-korporatsiy/platforma" onClick={closeMenus}>Платформа управления ИИ</Link>

          <p className="eyebrow mobile-group">Компания</p>
          {companyLinks.map((item) => (
            <Link href={item.href} key={item.href} onClick={closeMenus}>{item.label}</Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
