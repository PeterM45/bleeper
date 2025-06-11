/**
 * Text normalization module
 *
 * Handles advanced character substitution for l33t speak, Unicode variants,
 * and international character detection. Optimized for performance with
 * comprehensive coverage of substitution patterns.
 *
 * @module Normalization
 */

export { normalizeText } from './normalize.js';
export { getAllNormalizations } from './variants.js';
export { CHAR_SUBSTITUTIONS } from './constants.js';
