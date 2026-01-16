# Pear FE Docs

Frontend development documentation site built with VitePress, containing React Hooks, utility functions, development standards, and incident reports.

## Features

- 🎣 **React Hooks**: A rich collection of custom Hooks covering state management, side effects, DOM operations, and other common scenarios
- 🛠️ **Utility Functions**: Practical JavaScript utility functions including string, object, array, time, and other common operations
- 📚 **Development Standards**: Project development standards and best practices, including React coding standards, Git workflows, GitHub collaboration standards, etc.
- 📝 **Incident Reports**: Post-mortem reports and learnings from production incidents

## Tech Stack

- [VitePress](https://vitepress.dev/) - Static site generator
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [oxlint](https://oxc-project.github.io/docs/linter/) - Fast linter
- [pnpm](https://pnpm.io/) - Package manager

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm >= 8

### Installation

```bash
# Install dependencies
pnpm install
```

### Development

```bash
# Start development server (default port: 8888)
pnpm dev

# Or use the explicit command
pnpm docs:dev
```

The documentation site will be available at `http://localhost:8888`.

### Build

```bash
# Build for production
pnpm docs:build
```

### Preview

```bash
# Preview production build locally
pnpm docs:preview
```

### Linting

```bash
# Run linter
pnpm lint

# Fix linting issues automatically
pnpm lint:fix
```

## Project Structure

```md
pear-fe-docs/
├── docs/                    # English documentation
│   ├── posts/
│   │   ├── hooks/          # React Hooks documentation
│   │   ├── incidents/      # Incident reports
│   │   ├── standard/       # Development standards
│   │   └── utils/          # Utility functions
│   └── index.md            # Home page
├── docs/zh/                 # Chinese documentation
│   └── posts/              # Same structure as docs/posts/
├── package.json
├── tsconfig.json
└── oxc.json                # Linter configuration
```

## Contributing

1. Create a new branch for your changes
2. Make your changes following the project's coding standards
3. Run linting: `pnpm lint`
4. Commit your changes
5. Create a pull request

## License

MIT
