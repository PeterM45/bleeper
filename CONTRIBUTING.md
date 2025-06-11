# Contributing

## Setup

```bash
git clone https://github.com/PeterM45/bleeper.git
cd bleeper
npm install
npm run build
npm test
```

## Rules

- Zero dependencies
- Bundle size < 5KB
- TypeScript-first
- Performance critical
- Named exports only
- JSDoc for public APIs

## Structure

```
src/
├── core/           # Main filtering logic
├── normalization/  # Character substitution
├── structures/     # Data structures
├── data/           # Word lists
└── types/          # TypeScript definitions
```

## Contributing

1. Fork and create branch
2. Make changes with tests
3. Ensure build passes
4. Submit PR

## Performance Requirements

- 500K+ filter ops/sec
- Bundle stays under 5KB
- No object creation in hot paths
