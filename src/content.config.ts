import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 모든 섹션은 한/영 제목·요약을 frontmatter에 함께 담는다.
// 비개발자가 .md 파일의 양식만 채우면 사이트에 반영된다.

const portfolio = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/portfolio' }),
  schema: z.object({
    title: z.string(),
    titleEn: z.string().optional(),
    period: z.string().optional(),
    summary: z.string().optional(),
    summaryEn: z.string().optional(),
    tech: z.array(z.string()).default([]),
    links: z.array(z.object({ label: z.string(), url: z.string() })).default([]),
    order: z.number().default(0),
  }),
});

const awards = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/awards' }),
  schema: z.object({
    title: z.string(),
    titleEn: z.string().optional(),
    org: z.string().optional(),
    date: z.string().optional(),
    rank: z.string().optional(),
    summary: z.string().optional(),
    summaryEn: z.string().optional(),
    order: z.number().default(0),
  }),
});

const activities = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/activities' }),
  schema: z.object({
    title: z.string(),
    titleEn: z.string().optional(),
    role: z.string().optional(),
    period: z.string().optional(),
    summary: z.string().optional(),
    summaryEn: z.string().optional(),
    order: z.number().default(0),
  }),
});

const study = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/study' }),
  schema: z.object({
    title: z.string(),
    titleEn: z.string().optional(),
    date: z.string().optional(),
    tags: z.array(z.string()).default([]),
    summary: z.string().optional(),
    summaryEn: z.string().optional(),
    order: z.number().default(0),
  }),
});

export const collections = { portfolio, awards, activities, study };
