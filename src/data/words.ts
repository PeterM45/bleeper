/**
 * Profanity word list data
 *
 * Optimized collection of profanity words for filtering.
 * Uses Set for O(1) lookups and compact storage.
 *
 * @module Data/Words
 */

/**
 * Optimized profanity word list for minimal bundle size and maximum effectiveness
 *
 * Curated collection focusing on:
 * - Common profanity across English variants
 * - Offensive terms that should be filtered
 * - Racial slurs and hate speech terms
 * - Sexual and inappropriate content
 *
 * Uses Set for O(1) lookup performance and deduplication.
 */
export const DEFAULT_WORDS = new Set([
  // Common profanity
  'damn',
  'hell',
  'crap',
  'shit',
  'fuck',
  'fuk',
  'bitch',
  'ass',
  'asshole',
  'bastard',
  'piss',
  'cock',
  'dick',
  'pussy',
  'whore',
  'slut',
  'cunt',
  'twat',

  // Regional variants
  'dammit',
  'bloody',
  'bugger',
  'bollocks',
  'prick',
  'wanker',
  'tosser',
  'git',
  'sod',
  'arse',
  'shag',
  'shite',
  'feck',
  'frig',

  // Offensive/derogatory terms
  'retard',
  'retarded',
  'spastic',
  'mongoloid',

  // Racial slurs (for filtering purposes)
  'nigger',
  'nigga',
  'kike',
  'spic',
  'chink',
  'gook',
  'wetback',
  'beaner',
  'towelhead',
  'raghead',
  'coon',

  // Sexual content
  'tits',
  'boobs',
  'penis',
  'vagina',
  'balls',
  'nuts',
  'boner',
  'horny',
  'orgasm',
  'cum',
  'masturbate',
  'wank',
  'blowjob',
  'anal',

  // Drug references
  'weed',
  'pot',
  'marijuana',
  'joint',
  'crack',
  'cocaine',
  'meth',
  'heroin',

  // Violence/threats
  'kill',
  'murder',

  // Hate speech indicators
  'nazi',
  'hitler',
  'racist',
  'fascist',

  // Inappropriate behavior
  'pervert',
  'creep',
  'rapist',
  'pedophile',
  'pedo',
]);

/**
 * Get default words as readonly array for external use
 *
 * @returns Readonly array of default profanity words
 *
 * @example
 * ```typescript
 * const words = getDefaultWords();
 * console.log(words.length); // Number of default words
 * console.log(words.includes('badword')); // Check if word exists
 * ```
 */
export const getDefaultWords = (): readonly string[] =>
  Array.from(DEFAULT_WORDS);
