import { test, describe } from 'node:test';
import { strict as assert } from 'node:assert';
import { analyze, ProfanityFilter } from '../dist/index.js';

describe('analyze() function', () => {
  test('should provide detailed analysis of profanity', () => {
    const result1 = analyze('This shit is damn good');
    assert.equal(result1.hasProfanity, true);
    assert.equal(result1.clean, 'This **** is **** good');
    assert.deepEqual(result1.found, ['shit', 'damn']);

    const result2 = analyze('Clean text here');
    assert.equal(result2.hasProfanity, false);
    assert.equal(result2.clean, 'Clean text here');
    assert.deepEqual(result2.found, []);
  });

  test('should handle character substitutions in analysis', () => {
    const result1 = analyze('This $h1t is h3ll');
    assert.equal(result1.hasProfanity, true);
    assert.equal(result1.clean, 'This **** is ****');
    assert.deepEqual(result1.found, ['shit', 'hell']);

    const result2 = analyze('What the f*ck');
    assert.equal(result2.hasProfanity, true);
    assert.equal(result2.clean, 'What the ****');
    assert.deepEqual(result2.found, ['fuck']);
  });

  test('should respect word boundaries in analysis', () => {
    const result1 = analyze('Class assignment');
    assert.equal(result1.hasProfanity, false);
    assert.equal(result1.clean, 'Class assignment');
    assert.deepEqual(result1.found, []);

    const result2 = analyze('You are an ass');
    assert.equal(result2.hasProfanity, true);
    assert.equal(result2.clean, 'You are an ***');
    assert.deepEqual(result2.found, ['ass']);
  });

  test('should handle case insensitivity in analysis', () => {
    const result1 = analyze('SHIT happens');
    assert.equal(result1.hasProfanity, true);
    assert.equal(result1.clean, '**** happens');
    assert.deepEqual(result1.found, ['shit']);

    const result2 = analyze('What the HELL');
    assert.equal(result2.hasProfanity, true);
    assert.equal(result2.clean, 'What the ****');
    assert.deepEqual(result2.found, ['hell']);
  });

  test('should work with custom replacement options', () => {
    const result1 = analyze('This is shit', {
      replacement: '[CENSORED]',
      preserveLength: false,
    });
    assert.equal(result1.hasProfanity, true);
    assert.equal(result1.clean, 'This is [CENSORED]');
    assert.deepEqual(result1.found, ['shit']);

    const result2 = analyze('This is damn shit', { replacement: '█' });
    assert.equal(result2.hasProfanity, true);
    assert.equal(result2.clean, 'This is ████ ████');
    assert.deepEqual(result2.found, ['damn', 'shit']);
  });

  test('should work with custom words', () => {
    const customFilter = new ProfanityFilter({ customWords: ['badword'] });
    const result1 = customFilter.analyze('This is badword');
    assert.equal(result1.hasProfanity, true);
    assert.equal(result1.clean, 'This is *******');
    assert.deepEqual(result1.found, ['badword']);

    const result2 = customFilter.analyze('This is badword and shit');
    assert.equal(result2.hasProfanity, true);
    assert.equal(result2.clean, 'This is ******* and ****');
    assert.deepEqual(result2.found, ['badword', 'shit']);
  });

  test('should work with custom only mode', () => {
    const customOnlyFilter = new ProfanityFilter({
      customWords: ['badword'],
      customOnly: true,
    });

    const result1 = customOnlyFilter.analyze('This is shit');
    assert.equal(result1.hasProfanity, false);
    assert.equal(result1.clean, 'This is shit');
    assert.deepEqual(result1.found, []);

    const result2 = customOnlyFilter.analyze('This is badword');
    assert.equal(result2.hasProfanity, true);
    assert.equal(result2.clean, 'This is *******');
    assert.deepEqual(result2.found, ['badword']);
  });

  test('should handle empty and edge cases', () => {
    const result1 = analyze('');
    assert.equal(result1.hasProfanity, false);
    assert.equal(result1.clean, '');
    assert.deepEqual(result1.found, []);

    const result2 = analyze('   ');
    assert.equal(result2.hasProfanity, false);
    assert.equal(result2.clean, '   ');
    assert.deepEqual(result2.found, []);

    const result3 = analyze('!@#$%^&*()');
    assert.equal(result3.hasProfanity, false);
    assert.equal(result3.clean, '!@#$%^&*()');
    assert.deepEqual(result3.found, []);
  });

  test('should handle advanced character substitutions', () => {
    const result1 = analyze('phuck this shi+');
    assert.equal(result1.hasProfanity, true);
    assert.equal(result1.clean, '***** this ****');
    assert.deepEqual(result1.found, ['fuck', 'shit']);

    const result2 = analyze('a$$ and d@mn');
    assert.equal(result2.hasProfanity, true);
    assert.equal(result2.clean, '*** and ****');
    assert.deepEqual(result2.found, ['ass', 'damn']);
  });

  test('should handle international and Unicode substitutions', () => {
    const result1 = analyze('αss and shiτ');
    assert.equal(result1.hasProfanity, true);
    assert.equal(result1.clean, '*** and ****');
    assert.deepEqual(result1.found, ['ass', 'shit']);

    const result2 = analyze('аss and shiт'); // Cyrillic characters
    assert.equal(result2.hasProfanity, true);
    assert.equal(result2.clean, '*** and ****');
    assert.deepEqual(result2.found, ['ass', 'shit']);

    const result3 = analyze('$hiτ and fμck'); // Mixed l33t speak
    assert.equal(result3.hasProfanity, true);
    assert.equal(result3.clean, '**** and ****');
    assert.deepEqual(result3.found, ['shit', 'fuck']);
  });

  test('should handle multiple profanity words', () => {
    const result1 = analyze('This shit is damn awful hell');
    assert.equal(result1.hasProfanity, true);
    assert.equal(result1.clean, 'This **** is **** awful ****');
    assert.deepEqual(result1.found, ['shit', 'damn', 'hell']);

    const result2 = analyze('What the fuck is this crap');
    assert.equal(result2.hasProfanity, true);
    assert.equal(result2.clean, 'What the **** is this ****');
    assert.deepEqual(result2.found, ['fuck', 'crap']);
  });

  test('should handle duplicate words correctly', () => {
    const result1 = analyze('shit shit shit');
    assert.equal(result1.hasProfanity, true);
    assert.equal(result1.clean, '**** **** ****');
    assert.deepEqual(result1.found, ['shit', 'shit', 'shit']);

    const result2 = analyze('This is shit, really shit');
    assert.equal(result2.hasProfanity, true);
    assert.equal(result2.clean, 'This is ****, really ****');
    assert.deepEqual(result2.found, ['shit', 'shit']);
  });

  test('should maintain reasonable performance for large text', () => {
    const largeText = 'This is clean text. '.repeat(1000) + 'shit and damn';
    const start = performance.now();
    const result = analyze(largeText);
    const duration = performance.now() - start;

    const isCI =
      process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';
    assert.ok(
      duration < (isCI ? 150 : 100),
      `Performance too slow: ${duration}ms`
    );
    assert.equal(result.hasProfanity, true);
    assert.deepEqual(result.found, ['shit', 'damn']);
    assert.ok(result.clean.includes('****'));
  });

  test('should return correct data types', () => {
    const result = analyze('This is shit');

    assert.equal(typeof result, 'object');
    assert.equal(typeof result.hasProfanity, 'boolean');
    assert.equal(typeof result.clean, 'string');
    assert.ok(Array.isArray(result.found));
    assert.equal(typeof result.found[0], 'string');
  });
});
