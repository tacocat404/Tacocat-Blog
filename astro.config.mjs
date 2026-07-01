import { defineConfig } from 'astro/config';

// 404Tacocat.com — 레트로 데스크톱 OS 픽셀 블로그
export default defineConfig({
  site: 'https://404tacocat.com',
  i18n: {
    defaultLocale: 'ko',
    locales: ['ko', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
