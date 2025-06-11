/**
 * Text normalization core functionality
 *
 * Provides the primary text normalization function that applies
 * character substitutions in the optimal order for maximum effectiveness.
 *
 * @module Normalization/Normalize
 */

import { CHAR_MAP, MULTI_CHAR_SUBS } from './constants.js';

/**
 * Normalize text by applying comprehensive character substitutions
 *
 * Uses a single-pass algorithm with international and advanced l33t speak support.
 * Multi-character substitutions are applied first, followed by single-character
 * substitutions for optimal detection coverage.
 *
 * @param text - Input text to normalize
 * @returns Normalized text with character substitutions applied
 *
 * @example
 * ```typescript
 * normalizeText('$h1t'); // returns 'shit'
 * normalizeText('ph*ck'); // returns 'f*ck'
 * normalizeText('a$$h0le'); // returns 'asshole'
 * ```
 *
 * @performance O(n) where n is the length of input text
 */
export const normalizeText = (text: string): string => {
  if (!text) return text;

  let result = text.toLowerCase();

  // Apply multi-character substitutions first for optimal results
  for (const [from, to] of MULTI_CHAR_SUBS) {
    // Use split/join for broader compatibility than replaceAll
    result = result.split(from).join(to);
  }

  // Apply single character substitutions in one pass
  let normalized = '';
  for (let i = 0; i < result.length; i++) {
    const char = result[i]!;
    normalized += CHAR_MAP.get(char) ?? char;
  }

  return normalized;
};
