import { test, describe } from 'node:test';
import { strict as assert } from 'node:assert';
import { filter, contains, analyze, ProfanityFilter } from '../dist/index.js';

describe('Bleeper Profanity Filter', () => {
  test('filter() should replace profanity with asterisks', () => {
    assert.equal(filter('This is shit'), 'This is ****');
    assert.equal(filter('What the hell'), 'What the ****');
    assert.equal(filter('Clean text'), 'Clean text');
  });

  test('filter() should handle character substitutions', () => {
    assert.equal(filter('This is $h1t'), 'This is ****');
    assert.equal(filter('What the h3ll'), 'What the ****');
    assert.equal(filter('Th@t is cr@p'), 'Th@t is ****');
  });

  test('filter() should respect word boundaries', () => {
    assert.equal(filter('Class assignment'), 'Class assignment'); // 'ass' in 'class' should not match
    assert.equal(filter('The assumption'), 'The assumption'); // 'ass' in 'assumption' should not match
    assert.equal(filter('You are an ass'), 'You are an ***'); // standalone 'ass' should match
  });

  test('filter() should handle case insensitivity', () => {
    assert.equal(filter('SHIT'), '****');
    assert.equal(filter('Shit'), '****');
    assert.equal(filter('sHiT'), '****');
  });

  test('contains() should detect profanity', () => {
    assert.equal(contains('This is shit'), true);
    assert.equal(contains('Clean text'), false);
    assert.equal(contains('This is $h1t'), true);
  });

  test('analyze() should provide detailed results', () => {
    const result1 = analyze('This shit is damn good');
    assert.equal(result1.hasProfanity, true);
    assert.equal(result1.clean, 'This **** is **** good');
    assert.deepEqual(result1.found, ['shit', 'damn']);

    const result2 = analyze('Clean text');
    assert.equal(result2.hasProfanity, false);
    assert.equal(result2.clean, 'Clean text');
    assert.deepEqual(result2.found, []);
  });

  test('custom options should work', () => {
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
  });

  test('custom words should work', () => {
    const customFilter = new ProfanityFilter({ customWords: ['badword'] });
    assert.equal(customFilter.filter('This is badword'), 'This is *******');
    assert.equal(customFilter.contains('This is badword'), true);
  });

  test('custom only mode should work', () => {
    const customOnlyFilter = new ProfanityFilter({
      customWords: ['badword'],
      customOnly: true,
    });
    assert.equal(customOnlyFilter.filter('This is shit'), 'This is shit'); // Default word ignored
    assert.equal(customOnlyFilter.filter('This is badword'), 'This is *******'); // Custom word filtered
  });

  test('empty and edge cases should be handled', () => {
    assert.equal(filter(''), '');
    assert.equal(filter('   '), '   ');
    assert.equal(contains(''), false);

    const emptyResult = analyze('');
    assert.equal(emptyResult.hasProfanity, false);
    assert.equal(emptyResult.clean, '');
    assert.deepEqual(emptyResult.found, []);
  });

  test('advanced character substitutions should work', () => {
    assert.equal(filter('phuck'), '*****'); // ph -> f, ck -> k, so phuck -> fuk (5 chars)
    assert.equal(filter('shi+'), '****'); // + -> t, so shi+ -> shit (4 chars)
    assert.equal(filter('a$$'), '***'); // $ -> s, so a$$ -> ass (3 chars)
    assert.equal(filter('n1gger'), '******'); // 1 -> i, so n1gger -> nigger (6 chars)
    assert.equal(filter('nlgga'), '*****'); // l -> i, so nlgga -> nigga (5 chars)
    assert.equal(filter('nlgg@'), '*****'); // l -> i, @ -> a, so nlgg@ -> nigga (5 chars)
  });

  test('international and Unicode substitutions should work', () => {
    // Greek letters as substitutions
    assert.equal(filter('αss'), '***'); // Greek α -> a
    assert.equal(filter('shiτ'), '****'); // Greek τ -> t

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

  test('performance should be reasonable for large text', () => {
    const largeText = 'This is clean text. '.repeat(1000) + 'shit';
    const start = performance.now();
    const result = filter(largeText);
    const duration = performance.now() - start;

    assert.ok(duration < 100, `Performance too slow: ${duration}ms`); // Should be much faster
    assert.ok(result.includes('****'));
  });
});
