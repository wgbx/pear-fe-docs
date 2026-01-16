export const enSidebar = {
  '/posts/standard/': [
    {
      text: 'Standard',
      items: [
        { text: 'Introduction', link: '/posts/standard/index.md' },
        {
          text: 'React',
          collapsed: false,
          items: [
            { text: 'React Coding Standards', link: '/posts/standard/react/react-coding-standards.md' },
            { text: 'Avoid Arrow Functions in JSX', link: '/posts/standard/react/avoid-arrow-function-in-jsx.md' },
            { text: 'useMemo and useCreation Guide', link: '/posts/standard/react/usememo-usecreation-guide.md' },
            { text: 'React Architecture 30 Principles', link: '/posts/standard/react/react-architecture-principles.md' }
          ]
        },
        {
          text: 'Best Practices',
          collapsed: false,
          items: [
            { text: 'Git Standard', link: '/posts/standard/best-practices/git-standard.md' },
            { text: 'Function Declaration Standard', link: '/posts/standard/best-practices/function-declaration.md' },
            { text: 'SVG File Optimization Standard', link: '/posts/standard/best-practices/svg-optimization.md' },
            { text: 'Prohibition of Enum Standard', link: '/posts/standard/best-practices/no-enum.md' },
            { text: 'Module Export Standard', link: '/posts/standard/best-practices/module-export.md' }
          ]
        },
        {
          text: 'GitHub',
          collapsed: false,
          items: [{ text: 'PR Description Guidelines', link: '/posts/standard/github/pr-description.md' }]
        }
      ]
    }
  ],
  '/posts/incidents/': [
    {
      text: 'Incident Postmortem',
      items: [
        { text: 'Introduction', link: '/posts/incidents/index.md' },
        { text: 'PayPal SDK Crash', link: '/posts/incidents/paypal-sdk-crash-2026-01-15.md' }
      ]
    }
  ],
  '/posts/hooks/': [
    {
      text: 'Hooks',
      items: [{ text: 'Introduction', link: '/posts/hooks/index.md' }]
    }
  ],
  '/posts/utils/': [
    {
      text: 'Utils',
      items: [{ text: 'Introduction', link: '/posts/utils/index.md' }]
    }
  ],
  '/posts/components/': [
    {
      text: 'Components',
      items: [
        { text: 'Introduction', link: '/posts/components/index.md' },
        {
          text: 'Business Components',
          collapsed: false,
          items: [
            { text: 'BookmarkBanner', link: '/posts/components/business/bookmark-banner.md' }
          ]
        }
      ]
    }
  ]
}
