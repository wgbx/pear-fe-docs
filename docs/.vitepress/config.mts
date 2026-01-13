import { defineConfig } from 'vitepress'
import sidebar from './sidebar'

export default defineConfig({
  base: '/docs/',
  head: [['link', { rel: 'icon', href: '/docs/favicon.svg', type: 'image/svg+xml' }]],
  lang: 'zh-CN',
  title: 'docs',
  description: '现代JavaScript使用工具库',
  themeConfig: {
    logo: '/favicon.svg',
    lastUpdated: {
      text: '更新时间'
    },
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    outline: {
      label: '大纲'
    },
    nav: [
      { text: '首页', link: '/' },
      { text: 'hooks', link: '/posts/hooks/index.md' },
      { text: 'utils', link: '/posts/utils/index.md' }
    ],
    sidebar,
    search: {
      provider: 'local'
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/pear/docs' }],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2019-present pear'
    }
  }
})
