# @piar/messages

Internationalization (i18n) messages package for the piar project.

## Features

- ✅ **Multi-language support**: Spanish (es), Catalan (ca), English (en)
- ✅ **Type-safe messages**: Full TypeScript support
- ✅ **Modular structure**: Organized by feature and language
- ✅ **Easy to extend**: Add new languages and message keys easily

## Supported Languages

- **Spanish (es)**: Primary language
- **Catalan (ca)**: Primary language for Barcelona region
- **English (en)**: International support

## Usage

### Import all messages for a language

```typescript
import { messages as esMessages } from '@piar/messages/es';
import { messages as caMessages } from '@piar/messages/ca';
import { messages as enMessages } from '@piar/messages/en';
```

### Import specific message categories

```typescript
import { common, comingSoon } from '@piar/messages/es';
```

### Type definitions

```typescript
import type { Messages, CommonMessages, ComingSoonMessages } from '@piar/messages';
```

## Structure

```
src/
├── types/
│   ├── common.ts           # Common message types
│   ├── comingSoon.ts       # Coming soon message types
│   └── index.ts            # Export all types
├── constants.ts            # Constants (supported languages, etc.)
├── messagesStructure.ts    # Message structure definition
├── index.ts                # Main entry point
├── es/                     # Spanish messages
│   ├── common.ts
│   ├── comingSoon.ts
│   ├── messagesStructure.ts
│   └── index.ts
├── ca/                     # Catalan messages
│   ├── common.ts
│   ├── comingSoon.ts
│   ├── messagesStructure.ts
│   └── index.ts
└── en/                     # English messages
    ├── common.ts
    ├── comingSoon.ts
    ├── messagesStructure.ts
    └── index.ts
```

## Adding New Messages

1. Define types in `src/types/`
2. Add message keys to `src/messagesStructure.ts`
3. Implement translations in `src/{language}/` folders

## Development

```bash
# Build
pnpm build

# Type check
pnpm typecheck

# Lint
pnpm lint

# Test
pnpm test
```
