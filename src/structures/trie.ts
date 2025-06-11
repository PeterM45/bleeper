/**
 * Efficient Trie (prefix tree) implementation for fast word matching
 *
 * Optimized for memory usage and lookup performance with profanity detection.
 * Uses character-based nodes for O(m) insertion and lookup where m is word length.
 *
 * @module Structures/Trie
 */

/**
 * Individual node in the Trie structure
 * Uses Map for O(1) character lookups and minimal memory overhead
 */
class TrieNode {
  /** Child nodes keyed by character */
  public readonly children = new Map<string, TrieNode>();
  /** Indicates if this node represents the end of a valid word */
  public isEndOfWord = false;
}

/**
 * High-performance Trie implementation for word matching
 *
 * Provides fast insertion and lookup operations for profanity detection.
 * Optimized for the specific use case of finding complete words within text
 * while respecting word boundaries.
 *
 * @example
 * ```typescript
 * const trie = new Trie();
 * trie.insert('badword');
 * trie.insert('anotherbad');
 *
 * console.log(trie.contains('badword')); // true
 * console.log(trie.contains('good')); // false
 *
 * const matches = trie.findMatches('This badword is anotherbad word');
 * // Returns: [{ word: 'badword', start: 5, end: 12 }, { word: 'anotherbad', start: 16, end: 26 }]
 * ```
 */
export class Trie {
  private readonly root = new TrieNode();

  /**
   * Insert word into trie
   *
   * @param word - Word to insert (should be normalized)
   * @complexity O(m) where m is word length
   */
  public insert(word: string): void {
    let node = this.root;

    for (const char of word) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char)!;
    }

    node.isEndOfWord = true;
  }

  /**
   * Check if word exists in trie
   *
   * @param word - Word to search for (should be normalized)
   * @returns True if word exists in trie, false otherwise
   * @complexity O(m) where m is word length
   */
  public contains(word: string): boolean {
    let node = this.root;

    for (const char of word) {
      const child = node.children.get(char);
      if (!child) return false;
      node = child;
    }

    return node.isEndOfWord;
  }

  /**
   * Find all profane words in text efficiently
   *
   * Scans through text and identifies all matching words while respecting
   * word boundaries to prevent false positives (e.g., 'class' containing 'ass').
   *
   * @param text - Text to search through
   * @returns Array of found words with their positions
   * @complexity O(n * m) where n is text length, m is average word length
   */
  public findMatches(
    text: string
  ): Array<{ word: string; start: number; end: number }> {
    const matches: Array<{ word: string; start: number; end: number }> = [];
    const length = text.length;

    for (let i = 0; i < length; i++) {
      // Check if we're at a word boundary
      if (i > 0 && this.isWordChar(text.charAt(i - 1))) continue;

      let node = this.root;
      let j = i;

      // Try to match as long as possible
      while (j < length) {
        const char = text.charAt(j);
        if (!node.children.has(char)) break;

        node = node.children.get(char)!;
        j++;

        // If we found a complete word and it's at word boundary
        if (
          node.isEndOfWord &&
          (j === length || !this.isWordChar(text.charAt(j)))
        ) {
          matches.push({
            word: text.substring(i, j),
            start: i,
            end: j,
          });
        }
      }
    }

    return matches;
  }

  /**
   * Check if character is part of a word (alphanumeric)
   *
   * @param char - Character to check
   * @returns True if character is alphanumeric, false otherwise
   * @internal
   */
  private isWordChar(char: string): boolean {
    const code = char.charCodeAt(0);
    return (
      (code >= 48 && code <= 57) || // 0-9
      (code >= 65 && code <= 90) || // A-Z
      (code >= 97 && code <= 122) // a-z
    );
  }

  /**
   * Find all substring matches without word boundary restrictions
   * Used for profanity detection in normalized text where we want to find
   * profanity substrings anywhere within the text (e.g., 'hell' in 'hello')
   *
   * @param text - Text to search through
   * @returns Array of found words with their positions
   * @complexity O(n * m) where n is text length, m is average word length
   */
  public findSubstrings(
    text: string
  ): Array<{ word: string; start: number; end: number }> {
    const matches: Array<{ word: string; start: number; end: number }> = [];
    const length = text.length;

    for (let i = 0; i < length; i++) {
      let node = this.root;
      let j = i;

      // Try to match as long as possible
      while (j < length) {
        const char = text.charAt(j);
        if (!node.children.has(char)) break;

        node = node.children.get(char)!;
        j++;

        // If we found a complete word
        if (node.isEndOfWord) {
          matches.push({
            word: text.substring(i, j),
            start: i,
            end: j,
          });
        }
      }
    }

    return matches;
  }
}
