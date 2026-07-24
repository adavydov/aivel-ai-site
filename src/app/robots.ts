import type { MetadataRoute } from "next";
import { absoluteUrl, siteUrl } from "@/lib/site-paths";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: new URL(siteUrl).origin,
  };
}
