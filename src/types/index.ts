/**
 * TypeScript type definitions
 *
 * Core type definitions for the Bleeper profanity filter library.
 * Provides comprehensive typing for all public APIs.
 *
 * @module Types
 */

/**
 * Configuration options for the profanity filter
 *
 * @example
 * ```typescript
 * const options: FilterOptions = {
 *   replacement: '[CENSORED]',
 *   customWords: ['badword', 'anotherbad'],
 *   customOnly: false,
 *   preserveLength: true
 * };
 * ```
 */
export interface FilterOptions {
  /**
   * Custom replacement character(s) - defaults to '*'
   *
   * @example
   * ```typescript
   * // Single character
   * { replacement: '█' }
   *
   * // Multiple characters
   * { replacement: '[CENSORED]' }
   * ```
   */
  readonly replacement?: string;

  /**
   * Custom word list to add to the default list
   *
   * @example
   * ```typescript
   * { customWords: ['badword', 'inappropriate'] }
   * ```
   */
  readonly customWords?: readonly string[];

  /**
   * Whether to use only custom words (ignore default list)
   *
   * When true, only words in customWords will be filtered.
   * When false (default), both default and custom words are filtered.
   *
   * @default false
   */
  readonly customOnly?: boolean;

  /**
   * Whether to preserve word length when replacing
   *
   * When true (default), replacement matches original word length.
   * When false, uses replacement string as-is regardless of original length.
   *
   * @default true
   *
   * @example
   * ```typescript
   * // preserveLength: true (default)
   * filter('shit', { replacement: '█' }); // '████'
   *
   * // preserveLength: false
   * filter('shit', { replacement: '█', preserveLength: false }); // '█'
   * ```
   */
  readonly preserveLength?: boolean;
}

/**
 * Result of profanity analysis
 *
 * Comprehensive information about profanity detection and filtering results.
 *
 * @example
 * ```typescript
 * const result: FilterResult = analyze('This shit is damn good');
 * console.log(result.clean); // 'This **** is **** good'
 * console.log(result.hasProfanity); // true
 * console.log(result.found); // ['shit', 'damn']
 * ```
 */
export interface FilterResult {
  /**
   * The filtered/cleaned text with profanity replaced
   *
   * If no profanity was found, this will be identical to the original text.
   */
  readonly clean: string;

  /**
   * Whether any profanity was found in the text
   *
   * True if at least one profane word was detected, false otherwise.
   */
  readonly hasProfanity: boolean;

  /**
   * List of profane words found (normalized form)
   *
   * Contains the normalized forms of detected profanity words.
   * Duplicates are removed, so each word appears only once.
   *
   * @example
   * ```typescript
   * // For input: 'This $h1t is damn $h1t'
   * // found: ['shit', 'damn'] (normalized and deduplicated)
   * ```
   */
  readonly found: readonly string[];
}

/**
 * Internal character substitution mapping type
 *
 * Used internally for defining character substitution rules.
 * Each tuple represents [from, to] character mapping.
 *
 * @internal
 */
export type CharSubstitution = readonly [string, string][];
