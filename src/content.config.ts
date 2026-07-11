import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const questions = defineCollection({
  loader: glob({ base: "./src/content/questions", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    shortTitle: z.string(),
    description: z.string(),
    category: z.enum(["money", "profit", "growth"]),
    categoryLabel: z.string(),
    decision: z.string(),
    answerLead: z.string(),
    period: z.string(),
    freshness: z.string(),
    scope: z.string(),
    dataNeeded: z.array(z.string()),
    sourceLabels: z.array(z.string()),
    limitation: z.string(),
    specialist: z.string(),
    order: z.number(),
    featured: z.boolean().default(false),
    related: z.array(z.string()).default([])
  })
});

export const collections = { questions };
