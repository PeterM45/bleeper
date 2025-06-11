---
applyTo: '**'
---

# Bleeper - Ultra-Lightweight Profanity Filter

## CORE REQUIREMENTS

- ZERO dependencies
- Bundle size < 5KB
- TypeScript-first
- O(1) or O(log n) performance
- Pure functions only

## MANDATORY PATTERNS

### Code Style

- Use named exports (never default exports)
- Strong TypeScript types (no `any`)
- Immutable parameters
- Single responsibility functions
- JSDoc all public APIs

### Performance Rules

- Maps/Sets over objects for lookups
- Avoid regex (use string operations)
- Normalize text once, not per check
- Reuse objects, avoid creation in loops
- Use tries for word matching
- Use const assertions: `as const`

### Bundle Optimization

- ESM + CommonJS dual exports
- Tree-shaking friendly exports
- Mark package as side-effect-free
- Minimal API surface
- No polyfills

## PROFANITY FILTER SPECIFICS

- Character substitution mapping (@ → a, 3 → e, etc.)
- Word boundary detection
- Case-insensitive matching
- Unicode normalization
- Avoid false positives
- Real-time performance priority

## FORBIDDEN

- External dependencies
- Global state
- Synchronous I/O
- Object creation in hot paths
- Complex abstractions
- Feature creep beyond profanity filtering
