import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// 404tacocatblog — 레트로 데스크톱 OS 픽셀 블로그
// 커스텀 도메인 구매 시 site만 바꾸면 canonical/OG/sitemap이 함께 갱신된다.
export default defineConfig({
  site: 'https://tacocat-blog.vercel.app',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: { theme: 'monokai' },
  },
  i18n: {
    defaultLocale: 'ko',
    locales: ['ko', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
