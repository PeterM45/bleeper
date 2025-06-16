import { test, describe } from 'node:test';
import { strict as assert } from 'node:assert';
import { contains, ProfanityFilter } from '../dist/index.js';

describe('contains() function', () => {
  test('should detect basic profanity', () => {
    assert.equal(contains('This is shit'), true);
    assert.equal(contains('What the hell'), true);
    assert.equal(contains('That is crap'), true);
    assert.equal(contains('Clean text'), false);
    assert.equal(contains('damn it all'), true);
    assert.equal(contains('fuck this'), true);
    assert.equal(contains('This is fine'), false);
  });

  test('should detect character substitutions comprehensively', () => {
    // Basic substitutions
    assert.equal(contains('This is $h1t'), true);
    assert.equal(contains('What the h3ll'), true);
    assert.equal(contains('That is cr@p'), true);
    assert.equal(contains('What the f*ck'), true);

    // Multiple substitutions in one word
    assert.equal(contains('$h!t'), true); // $ -> s, ! -> i
    assert.equal(contains('f*ck3d'), true); // * -> u, 3 -> e
    assert.equal(contains('d@mn'), true); // @ -> a
    assert.equal(contains('h3ll0'), true); // 3 -> e, 0 -> o

    // Complex substitutions
    assert.equal(contains('f**k'), true); // multiple *
    assert.equal(contains('sh!7'), true); // ! -> i, 7 -> t
    assert.equal(contains('b!7ch'), true); // ! -> i, 7 -> t
    assert.equal(contains('@$$'), true); // @ -> a

    // Should NOT match clean text with substitutions
    assert.equal(contains('This is $uper clean'), false);
    assert.equal(contains('H3llo w0rld'), false);
  });

  test('should handle punctuation at word boundaries', () => {
    // Punctuation at start
    assert.equal(contains('.shit'), true);
    assert.equal(contains(',damn'), true);
    assert.equal(contains('!fuck'), true);
    assert.equal(contains('"hell"'), true);
    assert.equal(contains("'crap'"), true);
    assert.equal(contains('(shit)'), true);
    assert.equal(contains('[damn]'), true);
    assert.equal(contains('{fuck}'), true);

    // Punctuation at end
    assert.equal(contains('shit.'), true);
    assert.equal(contains('damn!'), true);
    assert.equal(contains('fuck?'), true);
    assert.equal(contains('hell,'), true);
    assert.equal(contains('crap;'), true);
    assert.equal(contains('shit:'), true);

    // Multiple punctuation
    assert.equal(contains('...shit...'), true);
    assert.equal(contains('!!!damn!!!'), true);
    assert.equal(contains('???fuck???'), true);
  });

  test('should handle asterisk masking patterns', () => {
    // Single asterisk
    assert.equal(contains('sh*t'), true);
    assert.equal(contains('f*ck'), true);
    assert.equal(contains('d*mn'), true);
    assert.equal(contains('h*ll'), true);

    // Multiple asterisks
    assert.equal(contains('s**t'), true);
    assert.equal(contains('f**k'), true);
    assert.equal(contains('****'), true); // all asterisks

    // Mixed with other substitutions
    assert.equal(contains('$h*t'), true);
    assert.equal(contains('f*ck3d'), true);
    assert.equal(contains('d@mn*t'), true);
  });

  test('should respect word boundaries correctly', () => {
    // Should NOT match when part of larger words
    assert.equal(contains('Class assignment'), false);
    assert.equal(contains('The assumption'), false);
    assert.equal(contains('Classic example'), false);
    assert.equal(contains('Assessment time'), false);
    assert.equal(contains('Grasshopper'), false);
    assert.equal(contains('Hellenistic'), false);
    assert.equal(contains('Shitake mushroom'), false); // Different from 'shit'

    // SHOULD match standalone words
    assert.equal(contains('You are an ass'), true);
    assert.equal(contains('Go to hell'), true);
    assert.equal(contains('That shit'), true);
    assert.equal(contains('Pure crap'), true);
  });

  test('should handle case variations', () => {
    assert.equal(contains('SHIT'), true);
    assert.equal(contains('Shit'), true);
    assert.equal(contains('sHiT'), true);
    assert.equal(contains('ShIt'), true);
    assert.equal(contains('HELL'), true);
    assert.equal(contains('Hell'), true);
    assert.equal(contains('HeLl'), true);
    assert.equal(contains('CLEAN TEXT'), false);

    // With substitutions
    assert.equal(contains('SH*T'), true);
    assert.equal(contains('F*CK'), true);
    assert.equal(contains('D@MN'), true);
  });

  test('should handle sentence boundaries', () => {
    // Start of sentences
    assert.equal(contains('Shit happens every day'), true);
    assert.equal(contains('Damn, I forgot'), true);
    assert.equal(contains('Hell! That was close'), true);

    // End of sentences
    assert.equal(contains('I hate this shit.'), true);
    assert.equal(contains('What the hell?'), true);
    assert.equal(contains('Oh damn!'), true);

    // Multiple sentences
    assert.equal(contains('Shit. Hell. Damn.'), true);
    assert.equal(contains('This is shit! What the hell?'), true);
    assert.equal(contains('Clean. Text. Here.'), false);
  });

  test('should detect multiple profanity words', () => {
    assert.equal(contains('Shit and damn'), true);
    assert.equal(contains('This shit is damn annoying'), true);
    assert.equal(contains('Hell, this is shit'), true);
    assert.equal(contains('Fuck this damn shit'), true);

    // With substitutions
    assert.equal(contains('$h!t and d@mn'), true);
    assert.equal(contains('F*ck this $h!t'), true);
    assert.equal(contains('Clean and nice text'), false);
  });

  test('should handle whitespace variations', () => {
    // Multiple spaces
    assert.equal(contains('This  is  shit'), true);
    assert.equal(contains('Damn   it'), true);

    // Tabs and newlines
    assert.equal(contains('shit\t\there'), true);
    assert.equal(contains('damn\nit'), true);
    assert.equal(contains('hell\r\nno'), true);
    assert.equal(contains('clean\t\ttext'), false);
  });

  test('should handle numbers and special characters', () => {
    // Numbers adjacent to profanity
    assert.equal(contains('shit123'), false); // Should not match if attached to numbers
    assert.equal(contains('123shit'), false); // Should not match if attached to numbers
    assert.equal(contains('shit 123'), true); // Should match if separated
    assert.equal(contains('123 shit'), true);

    // Special characters
    assert.equal(contains('shit#hashtag'), false); // Attached, shouldn't match
    assert.equal(contains('shit #hashtag'), true); // Separated, should match
    assert.equal(contains('#shit'), true); // With separator
  });

  test('should handle Unicode and international characters', () => {
    // Greek substitutions
    assert.equal(contains('shιt'), true); // ι looks like i
    assert.equal(contains('αss'), true); // α looks like a

    // Cyrillic substitutions
    assert.equal(contains('shіt'), true); // і (Cyrillic) looks like i
    assert.equal(contains('аss'), true); // а (Cyrillic) looks like a

    // With punctuation
    assert.equal(contains('shιt!'), true);
    assert.equal(contains('αss?'), true);
  });

  test('should handle advanced character substitutions', () => {
    // Complex patterns
    assert.equal(contains('5h!7'), true); // 5->s, !->i, 7->t = shit
    assert.equal(contains('fu(k'), true); // ( looks like c
    assert.equal(contains('h311'), true); // 3->e, 11->ll = hell
    assert.equal(contains('@55'), true); // @->a, 55->ss = ass

    // Multiple substitution types
    assert.equal(contains('5h!7 h@pp3n5'), true); // First word should match
    assert.equal(contains('th@7 !5 5h!7'), true); // Last word should match

    // Should NOT match clean text with similar patterns
    assert.equal(contains('5h@r3'), false); // Similar pattern but not profanity
  });

  test('should handle international and Unicode substitutions', () => {
    // Greek letters that look like Latin
    assert.equal(contains('ѕhit'), true); // Cyrillic s
    assert.equal(contains('shit'), true); // Normal
    assert.equal(contains('ѕhіt'), true); // Both Cyrillic s and i

    // More Unicode lookalikes
    assert.equal(contains('аss'), true); // Cyrillic a
    assert.equal(contains('αss'), true); // Greek alpha

    // Should work with punctuation
    assert.equal(contains('αss!'), true);
    assert.equal(contains('ѕhit?'), true);
  });

  test('should handle realistic social media scenarios', () => {
    // Hashtags
    assert.equal(contains('This is #shit'), true);
    assert.equal(contains('#damn that'), true);

    // Mentions
    assert.equal(contains('@user this is shit'), true);
    assert.equal(contains('shit @user'), true);

    // URLs (shouldn't break)
    assert.equal(contains('Check shit out'), true);
    assert.equal(contains('Visit example.com/shit'), false); // Part of URL
    assert.equal(contains('Visit example.com shit happens'), true);

    // Emojis and text
    assert.equal(contains('This shit 😂'), true);
    assert.equal(contains('😡 damn it'), true);
    assert.equal(contains('😊 happy day'), false);
  });

  test('should handle repeated character patterns', () => {
    // Repeated letters
    assert.equal(contains('shiiiit'), true); // Extended profanity
    assert.equal(contains('fuuuck'), true);
    assert.equal(contains('dammmn'), true);

    // But not excessively repeated
    assert.equal(contains('shiiiiiiiiit'), false); // Too many i's, might not match

    // Repeated punctuation in substitutions
    assert.equal(contains('sh!!!!t'), false); // Multiple !, shouldn't match
    assert.equal(contains('sh!t'), true); // Single !, should match
  });

  test('should work with custom words', () => {
    const customFilter = new ProfanityFilter({ customWords: ['badword'] });
    assert.equal(customFilter.contains('This is badword'), true);
    assert.equal(customFilter.contains('This is shit'), true); // Default word still works
    assert.equal(customFilter.contains('This is clean'), false);
  });

  test('should work with custom only mode', () => {
    const customOnlyFilter = new ProfanityFilter({
      customWords: ['badword'],
      customOnly: true,
    });
    assert.equal(customOnlyFilter.contains('This is shit'), false); // Default word ignored
    assert.equal(customOnlyFilter.contains('This is badword'), true); // Custom word detected
    assert.equal(customOnlyFilter.contains('This is clean'), false);
  });

  test('should handle empty and edge cases', () => {
    assert.equal(contains(''), false);
    assert.equal(contains('   '), false);
    assert.equal(contains('!@#$%^&*()'), false);
    assert.equal(contains('123456789'), false);
    assert.equal(contains('a'), false); // Too short
    assert.equal(contains('ab'), false); // Too short
  });

  test('should handle advanced character substitutions', () => {
    assert.equal(contains('phuck'), true); // ph -> f, so phuck -> fuck
    assert.equal(contains('shi+'), true); // + -> t, so shi+ -> shit
    assert.equal(contains('a$$'), true); // $ -> s, so a$$ -> ass
    assert.equal(contains('h3ll0'), true); // 3 -> e, 0 -> o, so h3ll0 -> hello -> hell
    assert.equal(contains('d@mn'), true); // @ -> a, so d@mn -> damn
  });

  test('should handle international and Unicode substitutions', () => {
    // Greek letters as substitutions
    assert.equal(contains('αss'), true); // Greek α -> a
    assert.equal(contains('shiτ'), true); // Greek τ -> t
    assert.equal(contains('hεll'), true); // Greek ε -> e

    // Cyrillic letters as substitutions
    assert.equal(contains('аss'), true); // Cyrillic а -> a
    assert.equal(contains('shiт'), true); // Cyrillic т -> t

    // Mixed international l33t speak
    assert.equal(contains('$hiτ'), true); // $ -> s, τ -> t
    assert.equal(contains('fμck'), true); // μ -> u

    // Extended ASCII substitutions
    assert.equal(contains('ƒuck'), true); // ƒ -> f
    assert.equal(contains('а$$'), true); // Cyrillic а -> a, $ -> s
  });

  test('should detect multiple profanity words', () => {
    assert.equal(contains('This shit is damn awful'), true);
    assert.equal(contains('Hell, that crap is bad'), true);
    assert.equal(contains('What the fuck is this shit'), true);
    assert.equal(contains('This is a very clean sentence'), false);
  });

  test('should maintain reasonable performance for large text', () => {
    const largeText = 'This is clean text. '.repeat(1000) + 'shit';
    const start = performance.now();
    const result = contains(largeText);
    const duration = performance.now() - start;

    const isCI =
      process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';
    assert.ok(
      duration < (isCI ? 60 : 50),
      `Performance too slow: ${duration}ms`
    );
    assert.equal(result, true);
  });

  test('should handle performance for very large clean text', () => {
    const largeCleanText = 'This is clean text with no bad words. '.repeat(
      2000
    );
    const start = performance.now();
    const result = contains(largeCleanText);
    const duration = performance.now() - start;

    const isCI =
      process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';
    assert.ok(
      duration < (isCI ? 50 : 20),
      `Performance too slow for clean text: ${duration}ms`
    );
    assert.equal(result, false);
  });
});
