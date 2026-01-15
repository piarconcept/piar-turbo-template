# PIAR Monorepo

> **🚀 Production-Ready Monorepo Template by [Piar Concept](https://piarconcept.com)**
> 
> A complete, AI-friendly starter kit for building modern web applications with Next.js, TypeScript, and a scalable monorepo architecture. Perfect for startups and businesses that need to move fast without compromising on quality.

Monorepo for PIAR project containing multiple applications and shared packages.

## 📁 Project Structure

```
piar-repo/
├── eslint.config.mjs          # Root ESLint configuration
├── vitest.config.ts           # Workspace test configuration
├── coverage/                  # Test coverage reports (gitignored)
├── apps/
│   ├── api/                    # Backend API
│   ├── client/
│   │   ├── backoffice/        # Admin application (Next.js)
│   │   └── web/               # Public website (Next.js)
│   └── lambda/                # Serverless functions
├── packages/
│   └── domain/
│       └── models/            # @piar/domain-models - Shared entities
├── docs/                      # 📚 Documentation (AI Context)
│   ├── AI-context.md         # Main index and guidelines
│   └── features/             # Feature-specific documentation
└── turbo.json                # Turbo build configuration
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20.x
- pnpm 10.28.0

### Installation

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm turbo build

# Run all tests
pnpm test

# Verify everything works (install, build, typecheck, test)
pnpm verify

# Start development
pnpm turbo dev
```

## 📦 Packages

### @piar/domain-models
Shared domain entities and models used across all applications.

```bash
# Build
pnpm turbo build --filter=@piar/domain-models

# Watch mode
pnpm --filter @piar/domain-models dev
```

[→ Documentation](./packages/domain/models/README.md)

## 🏗️ Development

### Build Commands

```bash
# Build all packages and apps
pnpm turbo build

# Build specific package/app
pnpm turbo build --filter=@piar/backoffice

# Type check all

# Lint all code
pnpm turbo lint
```

### Test Commands

```bash
# Run all tests in the workspace
pnpm test

# Run all tests with coverage reports
pnpm test:coverage -- --run

# Run tests for specific package
pnpm --filter @piar/domain-models test
```

### Complete Verification

```bash
# Run all checks: install, build, typecheck, lint, test with coverage
# Run all checks: install, build, typecheck, test
pnpm verify
```

This runs:
1. `pnpm install` - Installs all dependencies
2. `pnpm turbo build` - Builds all packages
3. `pnpm typecheck` - Checks TypeScript types
4. `pnpm test:coverage -- --run` - Runs all tests with coverage
5. `pnpm lint` - Lints all code

Perfect for CI/CD or before committing.

### Running Apps

```bash
# Run backoffice in dev mode
pnpm --filter @piar/backoffice dev

# Run web in dev mode
pnpm --filter @piar/web dev
```

## 📚 Documentation

All documentation is in the `docs/` folder:

- **[AI-context.md](./docs/AI-context.md)** - Main index and guidelines (START HERE)
- **[Repository Configuration](./docs/features/repository-configuration.md)** - Critical setup rules
- **[Creating Packages](./docs/features/creating-packages.md)** - Guide for new packages
- **[Testing Guide](./docs/features/testing-guide.md)** - Testing standards and examples
- **[Domain Models](./docs/features/domain-models.md)** - Entity p14-step guide for new packages
- **[Testing Guide](./docs/features/testing-guide.md)** - Testing standards and examples
- **[ESLint Configuration](./docs/features/eslint-configuration.md)** - Linting setup and ru
### For AI Agents
Start with [docs/AI-context.md](./docs/AI-context.md) - it contains all critical guidelines and indexes all documentation.

## 🔧 Tech Stack
10.28.0 with workspaces
- **Build System**: Turbo 2.7.4 for caching and orchestration
- **Frontend**: Next.js 16.1.2, React 19.2.3
- **Language**: TypeScript 5.9.3 (strict mode)
- **Testing**: Vitest 2.1.8 with @vitest/coverage-v8
- **Linting**: ESLint 9.x with TypeScript supportact 19
- **Language**: TypeScript 5.9
- **Node**: 20.x

## 📋 Package Naming Convention

All packages use the `@piar/` scope:
- `@piar/domain-models` - Domain entities
- `@piar/backoffice` - Admin app
- `@piar/web` - Public website

## 🤝 Contributing

Before making changes:
1. R� About Piar Concept

This template was created and is maintained by **Piar Concept** - a team specialized in building fast, scalable web applications for startups and businesses.

### Need Help?

- 🌐 **Website**: [piarconcept.com](https://piarconcept.com)
- 💬 **Contact**: Visit our website to get in touch
- 🚀 **Services**: Custom development, architecture consulting, team augmentation

We offer:
- ✅ Implementation support for this template
- ✅ Custom feature development
- ✅ Architecture and scaling consulting
- ✅ Startup acceleration services
- ✅ AI integration and automation

**Feel free to contact us - we're here to help make your project successful!**

## 📝 License

MIT License - Copyright (c) 2026 Piar Concept

This template is free to use for any purpose. See the [LICENSE](./LICENSE) file for details.

### Attribution

While not required, we appreciate:
- 💙 Giving credit to Piar Concept in your project
- 🔗 Linking to [piarconcept.com](https://piarconcept.com)
- ⭐ Starring this repository
- 📢 Sharing your success story with us!

**Source Code**: This template was created by Piar Concept. For support, visit [piarconcept.com](https://piarconcept.com)

---

**Built with ❤️ by [Piar Concept](https://piarconcept.com)**Document changes in `docs/features/`

## 📝 License

ISC
