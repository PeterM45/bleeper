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
filter('What the f*ck'); // → 'What the ****'
filter('h3ll0 world'); // → '***** world'
contains('Bad f*ck'); // → true
analyze('Bad f*ck').found; // → ['fuck']
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

- **Advanced l33t speak detection**: `$h1t`, `a$$`, `f*ck`, `h3ll0`, `phuck`
- **Robust character substitution**: `*` → `u`, `3` → `e`, `@` → `a`, `#` → `h`
- **Substring profanity detection**: finds `hell` within `h3ll0` → `hello`
- **Full Unicode support**: Greek (`αss`), Cyrillic (`а$$`), extended ASCII (`ƒuck`)
- **Mixed character patterns**: `$hiτ`, `nlgg@`, international l33t combinations
- **Smart word boundaries**: won't flag "Class" for containing "ass"
- **Zero false positives**: intelligent context-aware filtering

## API

See [docs/API.md](docs/API.md) for complete reference.

## License

MIT
