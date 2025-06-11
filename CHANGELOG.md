# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.1] - 2025-06-10

### Changed

- **Major Code Restructuring**: Reorganized codebase for professional standards and maintainability
  - Split large files (`filter.ts` ~450 lines, `normalize.ts` ~300+ lines) into focused modules
  - Created logical directory structure:
    - `src/core/` - Main filtering functionality
    - `src/normalization/` - Text normalization and character substitution
    - `src/structures/` - Data structures (Trie implementation)
    - `src/data/` - Word lists and data management
    - `src/types/` - TypeScript type definitions
- **Enhanced Documentation**: Improved JSDoc comments throughout codebase
- **Type Safety Improvements**: Strengthened TypeScript types and eliminated `any` usage
- **Performance Optimizations**: Maintained all existing performance characteristics
- **Professional Code Standards**: Cleaned up comments and improved code organization

### Technical Details

- Broke down monolithic files into single-responsibility modules
- Maintained 100% backward compatibility - all existing APIs unchanged
- Enhanced import/export structure for better tree-shaking
- Improved type definitions with comprehensive JSDoc examples
- All 13 tests continue to pass with identical performance characteristics

## [0.1.0] - 2025-06-10

### Added

- Initial release of Bleeper profanity filter
- Ultra-lightweight (~11KB) zero-dependency package
- Advanced character substitution detection (l33t speak, Unicode)
- Trie-based word matching for O(log n) performance
- TypeScript-first with full type definitions
- ESM support with proper module exports
- Comprehensive test suite with 100% pass rate
- Performance benchmarks showing 500K+ ops/sec
- Word boundary detection to prevent false positives
- Configurable replacement characters and options
- Custom word list support
- React/Next.js integration examples
- Complete API documentation
