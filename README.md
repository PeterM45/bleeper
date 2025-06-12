# Bleeper

Lightweight profanity filter with zero dependencies.

## Install

### From npm (public registry)
```bash
npm install bleeper
```

### From GitHub Packages
First, configure npm to use GitHub Packages for packages from the `PeterM45` owner:
```bash
echo "@peterm45:registry=https://npm.pkg.github.com" >> .npmrc
```

Then install with your GitHub token:
```bash
npm install bleeper --registry=https://npm.pkg.github.com
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

## Features

- **Character substitution**: `f*ck`, `$h1t`, `h3ll0`, etc.
- **Unicode support**: Greek (`αss`), Cyrillic (`а$$`), etc.
- **Word boundaries**: Won't flag "Class" for containing "ass"
- **Zero dependencies**: Pure TypeScript
- **Lightweight**: ~8KB package size

## API

### `filter(text, options?)`

Replaces profanity with asterisks.

```typescript
filter('Hello shit');
// → 'Hello ****'

filter('Hello shit', { replacement: '[CENSORED]' });
// → 'Hello [CENSORED]'

filter('Hello shit', { customWords: ['hello'] });
// → '**** ****'
```

### `contains(text, options?)`

Returns `true` if text contains profanity.

```typescript
contains('Hello shit'); // → true
contains('Hello world'); // → false
```

### `analyze(text, options?)`

Returns detailed analysis.

```typescript
analyze('Hello shit');
// → {
//     clean: 'Hello ****',
//     hasProfanity: true,
//     found: ['shit']
//   }
```

## Development

### Version Management

To ensure version consistency across `package.json`, `CHANGELOG.md`, and git tags:

```bash
# Check version consistency
npm run check-version

# Bump version (updates all files + creates git tag)
npm run bump patch "Fix character substitution bug"
npm run bump minor "Add new feature"
npm run bump major "Breaking API change"
```

## License

MIT
