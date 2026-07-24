import type { MetadataRoute } from "next";
import { corporateProducts } from "@/data/corporate-products";
import { insights } from "@/data/insights";
import { siteUrl } from "@/lib/site-paths";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/chto-my-delaem`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/dlya-korporatsiy`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/chto-my-dumaem`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/kto-my`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/partneram`, changeFrequency: "monthly", priority: 0.7 },
  ];

  const productPages: MetadataRoute.Sitemap = corporateProducts.map((product) => ({
    url: `${siteUrl}/dlya-korporatsiy/${product.slug}`,
    changeFrequency: "monthly",
    priority: product.isPlatform ? 0.75 : 0.8,
  }));

  const insightPages: MetadataRoute.Sitemap = insights.map((insight) => ({
    url: `${siteUrl}/chto-my-dumaem/${insight.slug}`,
    lastModified: insight.modifiedAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...productPages, ...insightPages];
}
