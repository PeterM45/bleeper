/**
 * Character substitution constants and mapp  ['1', 'i'],
  ['!', 'i'],
  ['|', 'i'],gs
 *
 * Comprehensive collection of character substitutions for detecting
 * l33t speak, Unicode variants, and international characters.
 *
 * @module Normalization/Constants
 */

/**
 * Advanced character substitution map for comprehensive detection
 * Optimized for O(1) lookups with expanded international coverage
 */
export const CHAR_MAP = new Map([
  // Basic ASCII substitutions
  ['@', 'a'],
  ['4', 'a'],
  ['∀', 'a'],
  ['α', 'a'],
  ['а', 'a'], // Cyrillic a
  ['8', 'b'],
  ['ß', 'b'],
  ['6', 'b'],
  ['в', 'b'], // German ß, Cyrillic в
  ['(', 'c'],
  ['{', 'c'],
  ['¢', 'c'],
  ['©', 'c'],
  ['с', 'c'], // Cyrillic с
  ['|)', 'd'],
  ['[)', 'd'],
  ['о', 'd'], // Cyrillic о as d
  ['3', 'e'],
  ['2', 'e'], // 2 can look like e in some fonts/contexts
  ['€', 'e'],
  ['е', 'e'],
  ['э', 'e'],
  ['ε', 'e'], // Greek epsilon
  ['є', 'e'], // Cyrillic є, Greek ε, Cyrillic е, э
  ['|=', 'f'],
  ['ph', 'f'],
  ['ƒ', 'f'],
  ['6', 'g'],
  ['9', 'g'],
  ['&', 'g'],
  ['ق', 'g'], // Arabic ق
  // ['#', 'h'], // REMOVED: # should be boundary character, not substitution
  ['|-|', 'h'],
  ['н', 'h'], // Cyrillic н
  ['1', 'i'],
  ['!', 'i'],
  ['|', 'i'],
  ['ι', 'i'],
  ['і', 'i'],
  ['ї', 'i'], // Greek ι, Cyrillic і, ї
  ['_|', 'j'],
  ['у', 'j'], // Cyrillic у as j
  ['|<', 'k'],
  ['|{', 'k'],
  ['к', 'k'], // Cyrillic к
  ['/', 'l'],
  ['\\', 'l'],
  ['ł', 'l'],
  ['ľ', 'l'],
  ['|v|', 'm'],
  ['^^', 'm'],
  ['м', 'm'], // Cyrillic м
  ['|\\|', 'n'],
  ['/\\/', 'n'],
  ['η', 'n'],
  ['п', 'n'], // Greek η, Cyrillic п as n
  ['0', 'o'],
  ['()', 'o'],
  ['[]', 'o'],
  ['ο', 'o'],
  ['о', 'o'],
  ['ø', 'o'], // Greek ο, Cyrillic о, Danish ø
  ['|*', 'p'],
  ['|>', 'p'],
  ['9', 'p'],
  ['р', 'p'], // Cyrillic р
  ['(_,)', 'q'],
  ['9', 'q'],
  ['12', 'r'],
  ['я', 'r'],
  ['®', 'r'], // Cyrillic я as r
  ['5', 's'],
  ['$', 's'],
  ['§', 's'],
  ['ѕ', 's'], // Cyrillic ѕ
  ['7', 't'],
  ['+', 't'],
  ['†', 't'],
  ['τ', 't'],
  ['т', 't'], // Greek tau, Cyrillic т
  ['*', 'u'], // Common l33t speak: f*ck -> fuck
  ['|_|', 'u'],
  ['υ', 'u'],
  ['μ', 'u'],
  ['и', 'u'],
  ['ц', 'u'],
  ['v', 'u'], // Common l33t speak substitution
  ['ü', 'u'], // Umlaut u
  ['ù', 'u'], // Accented u
  ['ú', 'u'], // Accented u
  ['û', 'u'], // Accented u variants, Greek υ, μ, Cyrillic и, ц
  ['\\/', 'v'],
  ['ν', 'v'],
  ['в', 'v'], // Greek ν, Cyrillic в as v
  ['vv', 'w'],
  ['\\/\\/', 'w'],
  ['ω', 'w'],
  ['щ', 'w'], // Greek ω, Cyrillic щ as w
  ['><', 'x'],
  ['×', 'x'],
  ['χ', 'x'],
  ['х', 'x'], // Greek χ, Cyrillic х
  ['`/', 'y'],
  ['γ', 'y'],
  ['у', 'y'],
  ['ч', 'y'], // Greek γ, Cyrillic у, ч
  ['2', 'z'],
  ['~', 'z'],
  ['ζ', 'z'],
  ['з', 'z'], // Greek ζ, Cyrillic з

  // Special Unicode lookalikes
  ['₳', 'a'],
  ['฿', 'b'],
  ['₵', 'c'],
  ['₫', 'd'],
  ['€', 'e'],
  ['₣', 'f'],
  ['₲', 'g'],
  ['₴', 'h'],
  ['ł', 'i'],
  ['₭', 'k'],
  ['£', 'l'],
  ['₥', 'm'],
  ['₦', 'n'],
  ['₱', 'p'],
  ['₹', 'r'],
  ['$', 's'],
  ['₮', 't'],
  ['μ', 'u'],
  ['₩', 'w'],
  ['¥', 'y'],

  // Emoji and symbols that represent letters
  ['🅰️', 'a'],
  ['🅱️', 'b'],
  ['©️', 'c'],
  ['🇩', 'd'],
  ['📧', 'e'],
  ['🎏', 'f'],
  ['⛽', 'g'],
  ['🏨', 'h'],
  ['ℹ️', 'i'],
  ['🗾', 'j'],
  ['🎋', 'k'],
  ['🏷️', 'l'],
  ['📧', 'm'],
  ['📰', 'n'],
  ['⭕', 'o'],
  ['🅿️', 'p'],
  ['🔍', 'q'],
  ['®️', 'r'],
  ['💰', 's'],
  ['✝️', 't'],
  ['⛎', 'u'],
  ['✌️', 'v'],
  ['〰️', 'w'],
  ['❌', 'x'],
  ['💴', 'y'],
  ['💤', 'z'],
]);

/**
 * Multi-character substitutions - order matters, longest first
 * Applied before single character substitutions for optimal results
 */
export const MULTI_CHAR_SUBS: ReadonlyArray<readonly [string, string]> = [
  // English multi-char patterns
  ['ph', 'f'],
  ['xx', 'x'],
  ['kk', 'k'],
  ['teh', 'the'],
  ['pwn', 'own'],
  ['n00b', 'noob'],

  // Advanced l33t speak patterns
  ['|-|', 'h'],
  ['|_|', 'u'],
  ['|\\|', 'n'],
  ['|v|', 'm'],
  ['|*', 'p'],
  ['|>', 'p'],
  ['(_,)', 'q'],
  ['\\/', 'v'],
  ['vv', 'w'],
  ['\\/\\/', 'w'],
  ['><', 'x'],
  ['`/', 'y'],

  // International lookalike pairs
  ['th', 'th'],
  ['ng', 'ng'],
  ['ch', 'ch'],
  ['sh', 'sh'],
] as const;

/**
 * Characters that have multiple possible letter substitutions
 * Used for generating variant normalizations of ambiguous characters
 */
export const AMBIGUOUS_CHARS = new Map([
  ['1', ['i', 'l']], // 1 can be i or l
  ['|', ['i', 'l']], // | can be i or l
  ['l', ['l', 'i']], // l can be l or i (for cases like nlgga -> nigga)
  ['0', ['o', 'd']], // 0 can be o or d
  ['6', ['g', 'b']], // 6 can be g or b
  ['9', ['g', 'q']], // 9 can be g or q
] as const);

/**
 * Export for backward compatibility and testing
 * Combined single and multi-character substitutions
 */
export const CHAR_SUBSTITUTIONS: ReadonlyArray<readonly [string, string]> = [
  ...Array.from(CHAR_MAP.entries()),
  ...MULTI_CHAR_SUBS,
];
