# Messages Package

Internationalization (i18n) package for piar project.

**Status**: ✅ Implemented  
**Date**: January 17, 2026

## Overview

The `@piar/messages` package provides a type-safe internationalization solution for the piar monorepo. It supports three languages: Catalan (primary), Spanish, and English.

## Package Structure

```
packages/messages/
├── src/
│   ├── types/                      # TypeScript type definitions
│   │   ├── common.ts              # Common message types
│   │   ├── comingSoon.ts          # Coming soon message types
│   │   └── index.ts               # Type exports
│   ├── constants.ts                # Language constants
│   ├── index.ts                    # Main entry point
│   ├── es/                         # Spanish messages
│   │   ├── common.ts
│   │   ├── comingSoon.ts
│   │   ├── messagesStructure.ts
│   │   └── index.ts
│   ├── ca/                         # Catalan messages
│   │   ├── common.ts
│   │   ├── comingSoon.ts
│   │   ├── messagesStructure.ts
│   │   └── index.ts
│   └── en/                         # English messages
│       ├── common.ts
│       ├── comingSoon.ts
│       ├── messagesStructure.ts
│       └── index.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Features

### ✅ Type Safety
All messages are fully typed with TypeScript interfaces, ensuring compile-time safety and autocomplete support.

### ✅ Multi-language Support
- **Catalan (ca)**: Default language - Primary for Barcelona region
- **Spanish (es)**: Secondary language
- **English (en)**: International support

### ✅ Modular Structure
Messages are organized by:
1. **Feature/Module**: `common`, `comingSoon`, etc.
2. **Language**: Separate folders for each language

### ✅ Easy to Extend
Adding new messages or languages follows a consistent pattern.

## Usage

### Import Messages by Language

```typescript
// Import all messages for a specific language
import { messages as caMessages } from '@piar/messages/ca';
import { messages as esMessages } from '@piar/messages/es';
import { messages as enMessages } from '@piar/messages/en';

// Use in your app
console.log(caMessages.common.nav.home); // "Inici"
console.log(esMessages.common.nav.home); // "Inicio"
console.log(enMessages.common.nav.home); // "Home"
```

### Import Specific Message Categories

```typescript
import { common, comingSoon } from '@piar/messages/ca';

// Use specific categories
console.log(common.actions.save); // "Guardar"
console.log(comingSoon.title);    // "Properament"
```

### Import Types

```typescript
import type { Messages, CommonMessages, ComingSoonMessages } from '@piar/messages';

function getMessages(lang: string): Messages {
  // Your logic here
}
```

### Import Constants

```typescript
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, LANGUAGE_NAMES } from '@piar/messages';

console.log(DEFAULT_LANGUAGE);      // "ca"
console.log(SUPPORTED_LANGUAGES);   // ["es", "ca", "en"]
console.log(LANGUAGE_NAMES.ca);     // "Català"
```

## Message Categories

### Common Messages (`common`)
General-purpose messages used across the application:
- **Navigation**: home, about, programs, contact, login, logout
- **Actions**: save, cancel, delete, edit, create, confirm, close, back, next, submit, search
- **Status**: loading, success, error, warning, info
- **General**: yes, no, ok, notAvailable, required, optional

### Coming Soon Messages (`comingSoon`)
Messages for features under development:
- title
- subtitle
- description
- notifyMe
- learnMore
- backHome

## Adding New Messages

### 1. Define Types

Create or update a type file in `src/types/`:

```typescript
// src/types/myFeature.ts
export interface MyFeatureMessages {
  title: string;
  description: string;
}
```

### 2. Update Message Structure

Add to `src/messagesStructure.ts`:

```typescript
import type { MyFeatureMessages } from './types/myFeature';

export const messagesStructure: Messages = {
  // ... existing messages
  myFeature: {
    title: '',
    description: '',
  },
};
```

### 3. Implement Translations

Create message files for each language:

```typescript
// src/ca/myFeature.ts
import type { MyFeatureMessages } from '../types/myFeature';

export const myFeature: MyFeatureMessages = {
  title: 'El meu títol',
  description: 'La meva descripció',
};
```

Repeat for `es/` and `en/` folders.

### 4. Export in Language Index

```typescript
// src/ca/index.ts
export { myFeature } from './myFeature';
```

## Adding New Languages

### 1. Update Constants

```typescript
// src/constants.ts
export const SUPPORTED_LANGUAGES = ['es', 'ca', 'en', 'fr'] as const;

export const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  // ... existing
  fr: 'Français',
};
```

### 2. Create Language Folder

```
src/fr/
├── common.ts
├── comingSoon.ts
├── messagesStructure.ts
└── index.ts
```

### 3. Implement All Messages

Translate all message categories to the new language.

### 4. Update Package Exports

```json
// package.json
{
  "exports": {
    "./fr": {
      "types": "./dist/fr/index.d.ts",
      "default": "./dist/fr/index.js"
    }
  }
}
```

## Best Practices

### ✅ Always Use Types
Import and use TypeScript types for type safety:
```typescript
import type { CommonMessages } from '@piar/messages';
```

### ✅ Keep Messages Flat
Avoid deeply nested message structures. Two levels max is recommended.

### ✅ Use Descriptive Keys
Message keys should be self-explanatory:
```typescript
// Good
nav.home
actions.save

// Bad
n.h
a.s
```

### ✅ Consistency Across Languages
Ensure all languages have the same structure and keys.

### ✅ No Hardcoded Strings
All user-facing text should come from this package.

## Integration with Applications

### Web App Example

```typescript
// apps/client/web/src/lib/i18n.ts
import { messages as caMessages } from '@piar/messages/ca';
import { messages as esMessages } from '@piar/messages/es';

export function getMessages(locale: string) {
  switch(locale) {
    case 'es': return esMessages;
    case 'ca': return caMessages;
    default: return caMessages;
  }
}
```

### Component Usage

```tsx
import { getMessages } from '@/lib/i18n';

export function MyComponent({ locale }: { locale: string }) {
  const messages = getMessages(locale);
  
  return (
    <div>
      <h1>{messages.common.nav.home}</h1>
      <button>{messages.common.actions.save}</button>
    </div>
  );
}
```

## Development

```bash
# Build the package
pnpm build

# Type check
pnpm typecheck

# Lint
pnpm lint

# Test
pnpm test
```

## Dependencies

The package has minimal dependencies:
- TypeScript for type checking
- Vitest for testing
- ESLint for linting

No runtime dependencies required.

## Related Documentation

- [Repository Configuration](../../../docs/features/repository-configuration.md)
- [Creating Packages Guide](../../../docs/features/creating-packages.md)

## Future Enhancements

- [ ] Add validation to ensure all languages have the same keys
- [ ] Create CLI tool to check for missing translations
- [ ] Add pluralization support
- [ ] Add date/time formatting helpers
- [ ] Add number formatting helpers
