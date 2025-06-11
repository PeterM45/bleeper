# Bleeper

Ultra-lightweight, zero-dependency profanity filter.

- 🚀 **Fast** - 1M+ operations/second
- 📦 **Tiny** - <2KB bundle, zero dependencies
- 🧠 **Smart** - Detects l33t speak (`$h1t` → `shit`)
- 🌍 **Unicode** - Full international support (Greek, Cyrillic, etc.)
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

- **Advanced l33t speak detection**: `$h1t`, `a$$`, `f*ck`, `ph*ck`
- **Full Unicode support**: Greek (`αss`), Cyrillic (`а$$`), extended ASCII (`ƒuck`)
- **Mixed character patterns**: `$hiτ`, `nlgg@`, international l33t combinations
- **Word boundaries**: won't flag "class" for containing "ass"
- **Zero false positives**: intelligent context-aware filtering

## API

See [docs/API.md](docs/API.md) for complete reference.

## License

MIT
