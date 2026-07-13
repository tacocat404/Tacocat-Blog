import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 비개발자가 .md 파일의 양식만 채우면 사이트에 반영된다.

const portfolio = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/portfolio' }),
  schema: z.object({
    title: z.string(),
    period: z.string().optional(),
    summary: z.string().optional(),
    tech: z.array(z.string()).default([]),
    links: z.array(z.object({ label: z.string(), url: z.string() })).default([]),
    order: z.number().default(0),
  }),
});

const awards = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/awards' }),
  schema: z.object({
    title: z.string(),
    org: z.string().optional(),
    date: z.string().optional(),
    rank: z.string().optional(),
    summary: z.string().optional(),
    order: z.number().default(0),
  }),
});

const activities = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/activities' }),
  schema: z.object({
    title: z.string(),
    role: z.string().optional(),
    period: z.string().optional(),
    summary: z.string().optional(),
    order: z.number().default(0),
  }),
});

const study = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/study' }),
  schema: z.object({
    title: z.string(),
    date: z.string().optional(),
    // 분류: 자유 문자열 — 새 분류는 frontmatter에 새 이름을 쓰면 자동으로 생긴다.
    category: z.string().default('기타'),
    // 시리즈 묶기 (강의/주차별 실습 등). seriesOrder로 시리즈 내 정렬.
    series: z.string().optional(),
    seriesOrder: z.number().optional(),
    tags: z.array(z.string()).default([]),
    summary: z.string().optional(),
    // 노션 원본 페이지 (동기화 추적용)
    notionUrl: z.string().optional(),
    // 책 정보 한 줄 (독서 글): 예) "혜민 저 · 이영철 그림 | 쌤앤파커스"
    bookInfo: z.string().optional(),
    // 함께 들은 노래: url은 유튜브/스포티파이 링크 (없으면 텍스트만 표시)
    music: z
      .array(
        z.object({
          title: z.string(),
          artist: z.string().optional(),
          url: z.string().optional(),
          note: z.string().optional(),
        }),
      )
      .default([]),
    // 하단 첨부파일: 클릭 미리보기 + 다운로드. file은 /public 기준 경로.
    attachments: z
      .array(
        z.object({
          label: z.string(),
          file: z.string(),
          kind: z.enum(['image', 'pdf']).default('image'),
        }),
      )
      .default([]),
    order: z.number().default(0),
  }),
});

export const collections = { portfolio, awards, activities, study };
