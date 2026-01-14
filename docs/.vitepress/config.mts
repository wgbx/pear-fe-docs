import { defineConfig } from 'vitepress'
import { enSidebar, zhSidebar } from './sidebar'

export default defineConfig({
  head: [['link', { rel: 'icon', href: '/docs/favicon.svg', type: 'image/svg+xml' }]],
  title: 'Pear/docs',
  description: 'Modern JavaScript utility library',
  locales: {
    root: {
      label: 'English',
      lang: 'en',
      title: 'Pear/docs',
      description: 'Modern JavaScript utility library',
      themeConfig: {
        logo: '/favicon.svg',
        lastUpdated: {
          text: 'Last updated'
        },
        docFooter: {
          prev: 'Previous',
          next: 'Next'
        },
        outline: {
          label: 'On this page'
        },
        nav: [
          { text: 'Home', link: '/' },
          { text: 'Hooks', link: '/posts/hooks/index.md' },
          { text: 'Utils', link: '/posts/utils/index.md' }
        ],
        sidebar: enSidebar,
        search: {
          provider: 'local',
          options: {
            translations: {
              button: {
                buttonText: 'Search',
                buttonAriaLabel: 'Search documentation'
              },
              modal: {
                noResultsText: 'No results for',
                resetButtonTitle: 'Reset search',
                footer: {
                  selectText: 'to select',
                  navigateText: 'to navigate',
                  closeText: 'to close'
                }
              }
            }
          }
        },
        socialLinks: [{ icon: 'github', link: 'https://github.com/bosinc/fe-docs' }],
        footer: {
          message: 'Released under the MIT License.',
          copyright: 'Copyright © 2019-present pear'
        }
      }
    },
    zh: {
      label: '中文',
      lang: 'zh-CN',
      title: 'Pear/docs',
      description: '现代化前端工具库',
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
          { text: '首页', link: '/zh/' },
          { text: 'Hooks', link: '/zh/posts/hooks/index.md' },
          { text: 'Utils', link: '/zh/posts/utils/index.md' }
        ],
        sidebar: zhSidebar,
        search: {
          provider: 'local',
          options: {
            translations: {
              button: {
                buttonText: '搜索',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭'
                }
              }
            }
          }
        },
        socialLinks: [{ icon: 'github', link: 'https://github.com/bosinc/fe-docs' }],
        footer: {
          message: 'Released under the MIT License.',
          copyright: 'Copyright © 2019-present pear'
        }
      }
    }
  }
})
