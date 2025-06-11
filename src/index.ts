/**
 * Bleeper - Lightweight profanity filter
 *
 * Zero dependencies, maximum performance, TypeScript-first profanity filtering
 * with advanced character substitution detection and international support.
 *
 * @example Basic Usage
 * ```typescript
 * import { filter, contains, analyze } from 'bleeper';
 *
 * // Filter profanity
 * console.log(filter('This is shit'));     // 'This is ****'
 * console.log(filter('$h1t'));            // '****'
 *
 * // Check for profanity
 * console.log(contains('Clean text'));    // false
 * console.log(contains('Bad shit'));      // true
 *
 * // Detailed analysis
 * const result = analyze('This shit is damn good');
 * console.log(result.hasProfanity);       // true
 * console.log(result.found);              // ['shit', 'damn']
 * console.log(result.clean);              // 'This **** is **** good'
 * ```
 *
 * @example Advanced Configuration
 * ```typescript
 * import { ProfanityFilter } from 'bleeper';
 *
 * const filter = new ProfanityFilter({
 *   replacement: '[CENSORED]',
 *   customWords: ['badword'],
 *   customOnly: false,
 *   preserveLength: false
 * });
 *
 * console.log(filter.filter('This badword is shit'));
 * // 'This [CENSORED] is [CENSORED]'
 * ```
 *
 * @module Bleeper
 * @version 0.1.0
 * @license MIT
 */

// Export core types
export type { FilterOptions, FilterResult } from './types/index.js';

// Export main filter class and convenience functions
export { ProfanityFilter, filter, contains, analyze } from './core/index.js';

// Export utilities for advanced usage
export {
  normalizeText,
  getAllNormalizations,
  CHAR_SUBSTITUTIONS,
} from './normalization/index.js';

export { getDefaultWords } from './data/index.js';
