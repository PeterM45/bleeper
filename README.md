# Bleeper

Ultra-lightweight, zero-dependency profanity filter.

- 🚀 **Fast** - 500K+ operations/second
- 📦 **Tiny** - <5KB bundle, zero dependencies
- 🧠 **Smart** - Detects l33t speak (`$h1t` → `shit`)
- 🎯 **Modern** - TypeScript-first

## Install

```bash
npm install bleeper
```

## Usage

```typescript
import { filter, contains, analyze } from 'bleeper';

filter('This is shit'); // → 'This is ****'
contains('Bad shit'); // → true
analyze('Bad shit').found; // → ['shit']
```

## Advanced

```typescript
// Custom replacement
filter('shit', { replacement: '█' }); // → '████'

// Custom words
const filter = new ProfanityFilter({ customWords: ['badword'] });

// Custom only mode
const strict = new ProfanityFilter({
  customWords: ['restricted'],
  customOnly: true,
});
```

## Features

- Detects l33t speak: `$h1t`, `a$$`, `f*ck`
- Unicode support: Greek, Cyrillic, emoji
- Word boundaries: won't flag "class" for containing "ass"
- Zero false positives

## API

See [docs/API.md](docs/API.md) for complete reference.

## License

MIT
