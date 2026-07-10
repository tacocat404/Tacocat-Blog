import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// 마크다운 이미지에 lazy 로딩 자동 부여 (rehype 커스텀 플러그인)
function rehypeLazyImages() {
  return (tree) => {
    const walk = (node) => {
      if (node.tagName === 'img') {
        node.properties = node.properties ?? {};
        node.properties.loading = 'lazy';
        node.properties.decoding = 'async';
      }
      (node.children ?? []).forEach(walk);
    };
    walk(tree);
  };
}

// 404tacocatblog — 레트로 데스크톱 OS 픽셀 블로그
// 커스텀 도메인 구매 시 site만 바꾸면 canonical/OG/sitemap이 함께 갱신된다.
export default defineConfig({
  site: 'https://tacocat-blog-xpsx.vercel.app',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: { theme: 'monokai' },
    // remarkMath: $...$ / $$...$$ 를 수식 노드로 파싱 -> rehypeKatex: KaTeX HTML로 렌더
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeLazyImages, rehypeKatex],
  },
});
