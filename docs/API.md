# API Reference

## Quick Start

```typescript
import { filter, contains, analyze } from 'bleeper';

filter('This is shit'); // → 'This is ****'
filter('What the f*ck'); // → 'What the ****'
filter('h3ll0 world'); // → '***** world'
contains('Bad f*ck'); // → true
analyze('Bad f*ck').found; // → ['fuck']
```

## Functions

### `filter(text, options?)`

Replaces profanity with asterisks.

```typescript
filter('This is shit'); // 'This is ****'
filter('What the f*ck'); // 'What the ****'
filter('h3ll0', { replacement: '█' }); // '█████'
```

### `contains(text, options?)`

Returns true if profanity is found.

```typescript
contains('This is clean'); // false
contains('This is f*ck'); // true
contains('h3ll0 world'); // true
```

### `analyze(text, options?)`

Returns detailed analysis.

```typescript
analyze('This f*ck is h3ll0');
// { clean: 'This **** is *****', hasProfanity: true, found: ['fuck', 'hell'] }
```

## Options

```typescript
interface FilterOptions {
  replacement?: string; // Default: '*'
  customWords?: string[]; // Additional words to filter
  customOnly?: boolean; // Use only custom words
  preserveLength?: boolean; // Default: true
}
```

## Custom Usage

```typescript
// Custom replacement
filter('shit', { replacement: '[CENSORED]' }); // '[CENSORED]'

// Custom words
const filter = new ProfanityFilter({ customWords: ['badword'] });
filter.filter('This badword sucks'); // 'This ******* sucks'

// Custom only
const strict = new ProfanityFilter({
  customWords: ['restricted'],
  customOnly: true,
});
strict.filter('This shit is restricted'); // 'This shit is **********'
```

## Character Substitution

Automatically detects l33t speak and Unicode variants:

**ASCII L33t Speak:**

- `$h1t` → `shit`
- `a$$` → `ass`
- `h3ll` → `hell`
- `f*ck` → `fuck`
- `h3ll0` → `hello` (detects `hell` within)
- `phuck` → `fuck`

**Unicode & International:**

- `αss` → `ass` (Greek alpha)
- `shiτ` → `shit` (Greek tau)
- `а$$` → `ass` (Cyrillic a)
- `shiт` → `shit` (Cyrillic t)
- `ƒuck` → `fuck` (Extended ASCII)

**Mixed Patterns:**

- `$hiτ` → `shit` (ASCII $ + Greek τ)
- `nlgg@` → `nigga` (l→i + @→a)
- `fμck` → `fuck` (Greek μ→u)

**Advanced Features:**

- **Substring Detection**: Finds profanity within normalized text (`h3ll0` → `hello` containing `hell`)
- **Smart Boundaries**: Preserves word boundaries for normal text (`Class` won't match `ass`)
- **Hybrid Matching**: Uses different strategies based on presence of substitution characters

Supports comprehensive Unicode normalization and mixed character patterns.
