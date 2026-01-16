export const zhSidebar = {
  '/zh/posts/standard/': [
    {
      text: '规范',
      items: [
        { text: '介绍', link: '/zh/posts/standard/index.md' },
        {
          text: 'React',
          collapsed: false,
          items: [
            { text: 'React 编码规范', link: '/zh/posts/standard/react/react-coding-standards.md' },
            { text: '避免在 JSX 中直接写箭头函数', link: '/zh/posts/standard/react/avoid-arrow-function-in-jsx.md' },
            { text: 'useCreation 使用指南', link: '/zh/posts/standard/react/usememo-usecreation-guide.md' },
            { text: '架构 30 条原则', link: '/zh/posts/standard/react/react-architecture-principles.md' }
          ]
        },
        {
          text: '最佳实践',
          items: [
            { text: 'Git 规范', link: '/zh/posts/standard/best-practices/git-standard.md' },
            { text: '工具函数声明规范', link: '/zh/posts/standard/best-practices/function-declaration.md' },
            { text: 'SVG 文件优化规范', link: '/zh/posts/standard/best-practices/svg-optimization.md' },
            { text: '禁止使用枚举规范', link: '/zh/posts/standard/best-practices/no-enum.md' },
            { text: '模块导出规范', link: '/zh/posts/standard/best-practices/module-export.md' }
          ]
        },
        {
          text: 'GitHub',
          items: [{ text: 'PR 描述规范', link: '/zh/posts/standard/github/pr-description.md' }]
        }
      ]
    }
  ],
  '/zh/posts/incidents/': [
    {
      text: '事故',
      items: [
        { text: '介绍', link: '/zh/posts/incidents/index.md' },
        { text: 'PayPal SDK 崩溃事故', link: '/zh/posts/incidents/paypal-sdk-crash-2026-01-15.md' }
      ]
    }
  ],
  '/zh/posts/hooks/': [
    {
      text: 'Hooks',
      items: [{ text: '介绍', link: '/zh/posts/hooks/index.md' }]
    }
  ],
  '/zh/posts/utils/': [
    {
      text: 'Utils',
      items: [{ text: '介绍', link: '/zh/posts/utils/index.md' }]
    }
  ]
}
