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
  'turd',
  'douchebag',
  'douche',
  'jerk',
  'jackass',
  'dipshit',
  'bullshit',
  'horseshit',
  'goddam',
  'goddamn',
  'goddammit',
  'dumbass',
  'dumbshit',
  'fucktard',
  'shithead',
  'dickhead',
  'asshat',
  'motherfucker',
  'fuckface',
  'cocksucker',
  'pisser',
  'shitface',
  'bitchass',

  // Regional variants & alternatives
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
  'knob',
  'pillock',
  'minger',
  'munter',
  'slag',
  'tart',
  'scrubber',
  'muppet',
  'plonker',
  'numpty',
  'bell',
  'bellend',
  'twatface',
  'fanny',
  'minge',
  'gash',
  'snatch',
  'punani',
  'cooch',

  // Offensive/derogatory terms (genuinely offensive in most contexts)
  'retard',
  'retarded',
  'spastic',
  'mongoloid',
  'tard',
  'gimp',
  'cripple',
  'fatass',
  'fatso',
  'ho',
  'hoe',
  'skank',
  'tramp',
  'floozy',
  'hussy',

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
  'jap',
  'nip',
  'slope',
  'zipperhead',
  'cracker',
  'honky',
  'whitey',
  'gringo',
  'kraut',
  'dago',
  'wop',
  'guinea',
  'polack',

  // Sexual content (explicit terms)
  'tits',
  'boobs',
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
  'rimjob',
  'handjob',
  'titfuck',
  'buttfuck',
  'assfuck',
  'facefuck',
  'gangbang',
  'bukkake',
  'creampie',
  'facial',
  'milf',
  'nympho',
  'hooker',
  'prostitute',
  'porn',
  'porno',
  'xxx',

  // Drug slang (street terms)
  'weed',
  'pot',
  'joint',
  'crack',
  'meth',
  'dope',
  'hash',
  'ganja',
  'chronic',
  'kush',
  'blunt',
  'spliff',
  'bong',

  // Hate speech indicators
  'nazi',
  'hitler',
  'fascist',
  'kkk',
  'klan',
  'aryan',
  'skinhead',
  'neonazi',

  // LGBTQ+ slurs (for filtering)
  'fag',
  'faggot',
  'dyke',
  'homo',
  'tranny',
  'shemale',
  'ladyboy',
  'sissy',
  'fairy',
  'pansy',
  'flamer',

  // Inappropriate behavior
  'pervert',
  'creep',
  'rapist',
  'pedophile',
  'pedo',
  'molester',
  'predator',
  'stalker',
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
