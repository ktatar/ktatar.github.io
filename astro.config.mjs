import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import rehypeExternalLinks from 'rehype-external-links';

export default defineConfig({
  site: 'https://kivanctatar.com',
  devToolbar: { enabled: false },
  vite: {
    server: {
      watch: {
        ignored: ['**/public/content-images/**', '**/.astro/**', '**/.git/**', '**/node_modules/**']
      }
    }
  },
  markdown: {
    processor: unified({
      rehypePlugins: [
        [
          rehypeExternalLinks,
          {
            target: '_blank',
            rel: ['noopener', 'noreferrer']
          }
        ]
      ]
    })
  },
  trailingSlash: 'ignore'
});
