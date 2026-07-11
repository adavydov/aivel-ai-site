import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { allStaticRoutes, site } from "../data/site";

export const GET: APIRoute = async () => {
  const questions = await getCollection("questions");
  const routes = [...allStaticRoutes, ...questions.map((question) => `/voprosy/${question.id}/`)];
  const urls = routes
    .map((route) => `<url><loc>${site.url}${route}</loc></url>`)
    .join("");
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, {
    headers: { "Content-Type": "application/xml; charset=utf-8" }
  });
};
