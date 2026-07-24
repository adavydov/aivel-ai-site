import type { Metadata } from "next";
import { siteUrl } from "@/lib/site-paths";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Aivel — профессиональные услуги и ИИ для финансов",
  description:
    "Aivel сообщает руководителю, что изменилось в бизнесе, ведёт надёжный учёт и автоматизирует финансовые операции.",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "Aivel",
    title: "Aivel — профессиональные услуги и ИИ для финансов",
    description: "Своевременные сигналы руководителю, надёжный учёт и автоматизация финансовых операций.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Aivel",
        url: siteUrl,
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name: "Aivel",
        url: siteUrl,
        inLanguage: "ru-RU",
        publisher: { "@id": `${siteUrl}/#organization` },
      },
    ],
  };

  return (
    <html lang="ru">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c") }}
        />
        {children}
      </body>
    </html>
  );
}
