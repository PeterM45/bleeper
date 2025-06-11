import { test, describe } from 'node:test';
import { strict as assert } from 'node:assert';
import { filter, ProfanityFilter } from '../dist/index.js';

describe('filter() function', () => {
  test('should replace profanity with asterisks', () => {
    assert.equal(filter('This is shit'), 'This is ****');
    assert.equal(filter('What the hell'), 'What the ****');
    assert.equal(filter('That is crap'), 'That is ****');
    assert.equal(filter('Clean text'), 'Clean text');
  });

  test('should handle character substitutions', () => {
    assert.equal(filter('This is $h1t'), 'This is ****');
    assert.equal(filter('What the h3ll'), 'What the ****');
    assert.equal(filter('That is cr@p'), 'That is ****');
    assert.equal(filter('What the f*ck'), 'What the ****'); // * -> u, so f*ck -> fuck
  });

  test('should respect word boundaries', () => {
    assert.equal(filter('Class assignment'), 'Class assignment'); // 'ass' in 'class' should not match
    assert.equal(filter('The assumption'), 'The assumption'); // 'ass' in 'assumption' should not match
    assert.equal(filter('You are an ass'), 'You are an ***'); // standalone 'ass' should match
    assert.equal(filter('Classic example'), 'Classic example'); // 'ass' in 'classic' should not match
  });

  test('should handle case insensitivity', () => {
    assert.equal(filter('SHIT'), '****');
    assert.equal(filter('Shit'), '****');
    assert.equal(filter('sHiT'), '****');
    assert.equal(filter('HELL'), '****');
    assert.equal(filter('Hell'), '****');
  });

  test('should work with custom options', () => {
    assert.equal(
      filter('This is shit', {
        replacement: '[CENSORED]',
        preserveLength: false,
      }),
      'This is [CENSORED]'
    );
    assert.equal(
      filter('This is shit', { preserveLength: false, replacement: '***' }),
      'This is ***'
    );
    assert.equal(
      filter('This is damn shit', { replacement: '█' }),
      'This is ████ ████'
    );
  });

  test('should work with custom words', () => {
    const customFilter = new ProfanityFilter({ customWords: ['badword'] });
    assert.equal(customFilter.filter('This is badword'), 'This is *******');
    assert.equal(customFilter.filter('This is shit'), 'This is ****'); // Default word still works
  });

  test('should work with custom only mode', () => {
    const customOnlyFilter = new ProfanityFilter({
      customWords: ['badword'],
      customOnly: true,
    });
    assert.equal(customOnlyFilter.filter('This is shit'), 'This is shit'); // Default word ignored
    assert.equal(customOnlyFilter.filter('This is badword'), 'This is *******'); // Custom word filtered
  });

  test('should handle empty and edge cases', () => {
    assert.equal(filter(''), '');
    assert.equal(filter('   '), '   ');
    assert.equal(filter('!@#$%^&*()'), '!@#$%^&*()');
    assert.equal(filter('123456789'), '123456789');
  });

  test('should handle advanced character substitutions', () => {
    assert.equal(filter('phuck'), '*****'); // ph -> f, so phuck -> fuk (5 chars)
    assert.equal(filter('shi+'), '****'); // + -> t, so shi+ -> shit (4 chars)
    assert.equal(filter('a$$'), '***'); // $ -> s, so a$$ -> ass (3 chars)
    assert.equal(filter('h3ll'), '****'); // 3 -> e, so h3ll -> hell (4 chars)
    assert.equal(filter('d@mn'), '****'); // @ -> a, so d@mn -> damn (4 chars)
  });

  test('should handle international and Unicode substitutions', () => {
    // Greek letters as substitutions
    assert.equal(filter('αss'), '***'); // Greek α -> a
    assert.equal(filter('shiτ'), '****'); // Greek τ -> t
    assert.equal(filter('hεll'), '****'); // Greek ε -> e

    // Cyrillic letters as substitutions
    assert.equal(filter('аss'), '***'); // Cyrillic а -> a
    assert.equal(filter('shiт'), '****'); // Cyrillic т -> t

    // Mixed international l33t speak
    assert.equal(filter('$hiτ'), '****'); // $ -> s, τ -> t
    assert.equal(filter('fμck'), '****'); // μ -> u

    // Extended ASCII substitutions
    assert.equal(filter('ƒuck'), '****'); // ƒ -> f
    assert.equal(filter('а$$'), '***'); // Cyrillic а -> a, $ -> s
  });

  test('should handle multiple profanity words', () => {
    assert.equal(filter('This shit is damn awful'), 'This **** is **** awful');
    assert.equal(filter('Hell, that crap is bad'), '****, that **** is bad');
    assert.equal(
      filter('What the fuck is this shit'),
      'What the **** is this ****'
    );
  });

  test('should maintain reasonable performance for large text', () => {
    const largeText = 'This is clean text. '.repeat(1000) + 'shit';
    const start = performance.now();
    const result = filter(largeText);
    const duration = performance.now() - start;

    const isCI = process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';
    assert.ok(duration < (isCI ? 150 : 100), `Performance too slow: ${duration}ms`);
    assert.ok(result.includes('****'));
    assert.ok(result.startsWith('This is clean text.'));
  });
});
