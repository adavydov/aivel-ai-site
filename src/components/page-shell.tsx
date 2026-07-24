import type { ReactNode } from "react";
import { SiteFooter } from "./site-footer";
import { SiteHeader, type HeaderCta } from "./site-header";

export function PageShell({ children, headerCta }: { children: ReactNode; headerCta?: HeaderCta }) {
  return (
    <>
      <a className="skip-link" href="#main-content">Перейти к содержанию</a>
      <SiteHeader cta={headerCta} />
      <main id="main-content" tabIndex={-1}>{children}</main>
      <SiteFooter />
    </>
  );
}
