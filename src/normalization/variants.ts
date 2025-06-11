/**
 * Text normalization variants generation
 *
 * Handles generation of multiple normalization variants for text containing
 * ambiguous characters that could represent multiple letters.
 *
 * @module Normalization/Variants
 */

import { CHAR_MAP, MULTI_CHAR_SUBS, AMBIGUOUS_CHARS } from './constants.js';

/**
 * Generate all possible normalizations for text with ambiguous characters
 *
 * Ultra-optimized version with early termination and minimal allocations.
 * Returns the primary normalization plus essential variants only.
 *
 * @param text - Input text to generate normalizations for
 * @returns Array of normalized variants (typically 1-2 variants)
 *
 * @performance O(n) for most cases, optimized for contains() speed
 */
export const getAllNormalizations = (text: string): string[] => {
  if (!text) return [text];

  // Fast path: Convert to lowercase and apply basic substitutions in one pass
  let primaryNormalized = '';
  let hasAmbiguous = false;
  const textLength = text.length;

  for (let i = 0; i < textLength; i++) {
    const char = text[i]!.toLowerCase();
    const substituted = CHAR_MAP.get(char) ?? char;
    primaryNormalized += substituted;

    if (!hasAmbiguous && AMBIGUOUS_CHARS.has(char as any)) {
      hasAmbiguous = true;
    }
  }

  // Apply multi-character substitutions (only if needed)
  for (const [from, to] of MULTI_CHAR_SUBS) {
    if (primaryNormalized.includes(from)) {
      primaryNormalized = primaryNormalized.split(from).join(to);
    }
  }

  // If no ambiguous characters, return single result (most common case)
  if (!hasAmbiguous) {
    return [primaryNormalized];
  }

  // Generate only ONE additional variant for performance
  // Focus on the most common ambiguous character substitution
  for (let i = 0; i < primaryNormalized.length; i++) {
    const char = primaryNormalized[i]!;
    const ambiguousOptions = AMBIGUOUS_CHARS.get(char as any);

    if (ambiguousOptions && ambiguousOptions.length > 1) {
      // Generate one variant with the most common alternative
      const alternative = ambiguousOptions[1] || ambiguousOptions[0]!;
      if (alternative !== char) {
        const variant =
          primaryNormalized.slice(0, i) +
          alternative +
          primaryNormalized.slice(i + 1);
        return [primaryNormalized, variant];
      }
    }
  }

  return [primaryNormalized];
};

/**
 * Apply single character substitutions to normalized text
 *
 * @param text - Input text to apply substitutions to
 * @returns Text with character substitutions applied
 * @internal
 */
function applyCharacterSubstitutions(text: string): string {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const char = text[i]!;
    result += CHAR_MAP.get(char) ?? char;
  }
  return result;
}
