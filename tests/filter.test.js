import { test, describe } from 'node:test';
import { strict as assert } from 'node:assert';
import { filter, ProfanityFilter } from '../dist/index.js';

describe('filter() function', () => {
  test('should replace basic profanity with asterisks', () => {
    assert.equal(filter('This is shit'), 'This is ****');
    assert.equal(filter('What the hell'), 'What the ****');
    assert.equal(filter('That is crap'), 'That is ****');
    assert.equal(filter('Clean text'), 'Clean text');
    assert.equal(filter('damn it all'), '**** it all');
    assert.equal(filter('fuck this'), '**** this');
  });
  test('should handle character substitutions comprehensively', () => {
    // Test basic substitutions that are working
    assert.equal(filter('This is $hit'), 'This is ****');
    assert.equal(filter('What the h3ll'), 'What the ****');
    assert.equal(filter('That is cr4p'), 'That is ****');
    assert.equal(filter('d4mn it'), '**** it');

    // Test @ substitution
    assert.equal(filter('@ss hole'), '*** hole');
    assert.equal(filter('d@mn'), '****');

    // Test number substitutions
    assert.equal(filter('sh1t'), '****'); // 1 -> i
    assert.equal(filter('h3ll'), '****'); // 3 -> e
    assert.equal(filter('4ss'), '***'); // 4 -> a

    // Clean text should not match
    assert.equal(filter('This is $uper clean'), 'This is $uper clean');
    assert.equal(filter('H3llo w0rld'), 'H3llo w0rld');
  });

  test('should handle punctuation at word boundaries', () => {
    // Punctuation at start
    assert.equal(filter('.shit'), '.****');
    assert.equal(filter(',damn'), ',****');
    assert.equal(filter('!fuck'), '!****');
    assert.equal(filter('"hell"'), '"****"');
    assert.equal(filter("'crap'"), "'****'");
    assert.equal(filter('(shit)'), '(****)');
    assert.equal(filter('[damn]'), '[****]');
    assert.equal(filter('{fuck}'), '{****}');

    // Punctuation at end
    assert.equal(filter('shit.'), '****.');
    assert.equal(filter('damn!'), '****!');
    assert.equal(filter('fuck?'), '****?');
    assert.equal(filter('hell,'), '****,');
    assert.equal(filter('crap;'), '****;');
    assert.equal(filter('shit:'), '****:');

    // Multiple punctuation
    assert.equal(filter('...shit...'), '...****...');
    assert.equal(filter('!!!damn!!!'), '!!!****!!!');
    assert.equal(filter('???fuck???'), '???****???');
  });

  test('should handle asterisk masking patterns', () => {
    // Single asterisk
    assert.equal(filter('sh*t'), '****');
    assert.equal(filter('f*ck'), '****');
    assert.equal(filter('d*mn'), '****');
    assert.equal(filter('h*ll'), '****');

    // Multiple asterisks
    assert.equal(filter('s**t'), '****');
    assert.equal(filter('f**k'), '****');
    assert.equal(filter('****'), '****'); // all asterisks

    // Mixed with other substitutions
    assert.equal(filter('$h*t'), '****');
    assert.equal(filter('f*ck3d'), '******');
    assert.equal(filter('d@mn*t'), '******');
  });

  test('should respect word boundaries correctly', () => {
    // Should NOT match when part of larger words
    assert.equal(filter('Class assignment'), 'Class assignment');
    assert.equal(filter('The assumption'), 'The assumption');
    assert.equal(filter('Classic example'), 'Classic example');
    assert.equal(filter('Assessment time'), 'Assessment time');
    assert.equal(filter('Grasshopper'), 'Grasshopper');
    assert.equal(filter('Hellenistic'), 'Hellenistic');
    assert.equal(filter('Shitake mushroom'), 'Shitake mushroom'); // Different from 'shit'

    // SHOULD match standalone words
    assert.equal(filter('You are an ass'), 'You are an ***');
    assert.equal(filter('Go to hell'), 'Go to ****');
    assert.equal(filter('That shit'), 'That ****');
    assert.equal(filter('Pure crap'), 'Pure ****');
  });

  test('should handle case variations', () => {
    assert.equal(filter('SHIT'), '****');
    assert.equal(filter('Shit'), '****');
    assert.equal(filter('sHiT'), '****');
    assert.equal(filter('ShIt'), '****');
    assert.equal(filter('HELL'), '****');
    assert.equal(filter('Hell'), '****');
    assert.equal(filter('HeLl'), '****');

    // With substitutions
    assert.equal(filter('SH*T'), '****');
    assert.equal(filter('F*CK'), '****');
    assert.equal(filter('D@MN'), '****');
  });

  test('should handle sentence boundaries', () => {
    // Start of sentences
    assert.equal(filter('Shit happens every day'), '**** happens every day');
    assert.equal(filter('Damn, I forgot'), '****, I forgot');
    assert.equal(filter('Hell! That was close'), '****! That was close');

    // End of sentences
    assert.equal(filter('I hate this shit.'), 'I hate this ****.');
    assert.equal(filter('What the hell?'), 'What the ****?');
    assert.equal(filter('Oh damn!'), 'Oh ****!');

    // Multiple sentences
    assert.equal(filter('Shit. Hell. Damn.'), '****. ****. ****.');
    assert.equal(
      filter('This is shit! What the hell?'),
      'This is ****! What the ****?'
    );
  });

  test('should handle multiple profanity words', () => {
    assert.equal(filter('Shit and damn'), '**** and ****');
    assert.equal(
      filter('This shit is damn annoying'),
      'This **** is **** annoying'
    );
    assert.equal(filter('Hell, this is shit'), '****, this is ****');
    assert.equal(filter('Fuck this damn shit'), '**** this **** ****');

    // With substitutions
    assert.equal(filter('$h!t and d@mn'), '**** and ****');
    assert.equal(filter('F*ck this $h!t'), '**** this ****');
  });

  test('should handle whitespace variations', () => {
    // Multiple spaces
    assert.equal(filter('This  is  shit'), 'This  is  ****');
    assert.equal(filter('Damn   it'), '****   it');

    // Tabs and newlines
    assert.equal(filter('shit\t\there'), '****\t\there');
    assert.equal(filter('damn\nit'), '****\nit');
    assert.equal(filter('hell\r\nno'), '****\r\nno');
  });

  test('should handle numbers and special characters', () => {
    // Numbers adjacent to profanity
    assert.equal(filter('shit123'), 'shit123'); // Should not match if attached to numbers
    assert.equal(filter('123shit'), '123shit'); // Should not match if attached to numbers
    assert.equal(filter('shit 123'), '**** 123'); // Should match if separated
    assert.equal(filter('123 shit'), '123 ****');

    // Special characters
    assert.equal(filter('shit#hashtag'), 'shit#hashtag'); // Attached, shouldn't match
    assert.equal(filter('shit #hashtag'), '**** #hashtag'); // Separated, should match
    assert.equal(filter('#shit'), '#****'); // With separator
  });

  test('should handle Unicode and international characters', () => {
    // Greek substitutions
    assert.equal(filter('shιt'), '****'); // ι looks like i
    assert.equal(filter('αss'), '***'); // α looks like a

    // Cyrillic substitutions
    assert.equal(filter('shіt'), '****'); // і (Cyrillic) looks like i
    assert.equal(filter('аss'), '***'); // а (Cyrillic) looks like a

    // With punctuation
    assert.equal(filter('shιt!'), '****!');
    assert.equal(filter('αss?'), '***?');
  });

  test('should work with custom replacement options', () => {
    assert.equal(
      filter('Hello shit', { replacement: '[CENSORED]' }),
      'Hello [CENSORED]'
    );
    assert.equal(
      filter('Damn this', { replacement: '***', preserveLength: false }),
      '*** this'
    );
    assert.equal(
      filter('What hell', { replacement: '[BLEEP]' }),
      'What [BLEEP]'
    );
    assert.equal(filter('Fuck off', { replacement: 'XXXX' }), 'XXXX off');

    // Multiple words with custom replacement
    assert.equal(
      filter('Shit and damn', { replacement: '[BAD]' }),
      '[BAD] and [BAD]'
    );
  });

  test('should work with custom words', () => {
    assert.equal(
      filter('Hello world', { customWords: ['hello'] }),
      '***** world'
    );
    assert.equal(
      filter('Nice day today', { customWords: ['nice', 'day'] }),
      '**** *** today'
    );
    assert.equal(
      filter('Custom bad word', { customWords: ['bad'] }),
      'Custom *** word'
    );

    // With substitutions in custom words
    assert.equal(
      filter('h3llo w0rld', { customWords: ['hello', 'world'] }),
      '***** *****'
    );
  });

  test('should work with custom only mode', () => {
    const customOnly = { customWords: ['bad'], customOnly: true };

    // Should only filter custom words, not built-in profanity
    assert.equal(filter('This is bad', customOnly), 'This is ***');
    assert.equal(filter('This is shit', customOnly), 'This is shit'); // Built-in word ignored
    assert.equal(filter('Bad shit happens', customOnly), '*** shit happens');
  });

  test('should handle empty and edge cases', () => {
    assert.equal(filter(''), '');
    assert.equal(filter(' '), ' ');
    assert.equal(filter('   '), '   ');
    assert.equal(filter('\n'), '\n');
    assert.equal(filter('\t'), '\t');

    // Single characters
    assert.equal(filter('a'), 'a');
    assert.equal(filter('!'), '!');
    assert.equal(filter('*'), '*');

    // Punctuation only
    assert.equal(filter('...'), '...');
    assert.equal(filter('!!!'), '!!!');
    assert.equal(filter('???'), '???');
  });

  test('should handle advanced character substitutions', () => {
    // Complex patterns
    assert.equal(filter('5h!7'), '****'); // 5->s, !->i, 7->t = shit
    assert.equal(filter('fu(k'), '****'); // ( looks like c
    assert.equal(filter('h311'), '****'); // 3->e, 11->ll = hell
    assert.equal(filter('@55'), '***'); // @->a, 55->ss = ass

    // Multiple substitution types
    assert.equal(filter('5h!7 h@pp3n5'), '**** h@pp3n5'); // Only first word should match
    assert.equal(filter('th@7 !5 5h!7'), 'th@7 !5 ****'); // Only last word should match
  });

  test('should handle international and Unicode substitutions', () => {
    // Greek letters that look like Latin
    assert.equal(filter('ѕhit'), '****'); // Cyrillic s
    assert.equal(filter('shit'), '****'); // Normal
    assert.equal(filter('ѕhіt'), '****'); // Both Cyrillic s and i

    // More Unicode lookalikes
    assert.equal(filter('аss'), '***'); // Cyrillic a
    assert.equal(filter('αss'), '***'); // Greek alpha

    // Should work with punctuation
    assert.equal(filter('αss!'), '***!');
    assert.equal(filter('ѕhit?'), '****?');
  });

  test('should handle realistic social media scenarios', () => {
    // Hashtags
    assert.equal(filter('This is #shit'), 'This is #****');
    assert.equal(filter('#damn that'), '#**** that');

    // Mentions
    assert.equal(filter('@user this is shit'), '@user this is ****');
    assert.equal(filter('shit @user'), '**** @user');

    // URLs (shouldn't break)
    assert.equal(filter('Check shit out'), 'Check **** out');
    assert.equal(filter('Visit example.com/shit'), 'Visit example.com/shit'); // Part of URL
    assert.equal(
      filter('Visit example.com shit happens'),
      'Visit example.com **** happens'
    );

    // Emojis and text
    assert.equal(filter('This shit 😂'), 'This **** 😂');
    assert.equal(filter('😡 damn it'), '😡 **** it');
  });

  test('should maintain reasonable performance for large text', () => {
    const largeText = 'This is a very long text with some shit in it. '.repeat(
      100
    );
    const start = Date.now();
    const result = filter(largeText);
    const end = Date.now();

    // Should complete in reasonable time (less than 100ms for 5000+ chars)
    assert.ok(
      end - start < 100,
      `Performance test failed: ${end - start}ms for ${
        largeText.length
      } characters`
    );
    assert.ok(
      result.includes('****'),
      'Should still filter profanity in large text'
    );
  });

  test('should handle repeated character patterns', () => {
    // Repeated letters
    assert.equal(filter('shiiiit'), '*******'); // Extended profanity
    assert.equal(filter('fuuuck'), '******');
    assert.equal(filter('dammmn'), '******');

    // But not excessively repeated
    assert.equal(filter('shiiiiiiiiit'), 'shiiiiiiiiit'); // Too many i's, might not match

    // Repeated punctuation in substitutions
    assert.equal(filter('sh!!!!t'), 'sh!!!!t'); // Multiple !, shouldn't match
    assert.equal(filter('sh!t'), '****'); // Single !, should match
  });
});
