import { test, describe } from 'node:test';
import { strict as assert } from 'node:assert';
import { contains, ProfanityFilter } from '../dist/index.js';

describe('contains() function', () => {
  test('should detect profanity in text', () => {
    assert.equal(contains('This is shit'), true);
    assert.equal(contains('What the hell'), true);
    assert.equal(contains('That is crap'), true);
    assert.equal(contains('Clean text'), false);
    assert.equal(contains('This is fine'), false);
  });

  test('should detect character substitutions', () => {
    assert.equal(contains('This is $h1t'), true);
    assert.equal(contains('What the h3ll'), true);
    assert.equal(contains('That is cr@p'), true);
    assert.equal(contains('What the f*ck'), true);
    assert.equal(contains('This is $uper clean'), false);
  });

  test('should respect word boundaries', () => {
    assert.equal(contains('Class assignment'), false); // 'ass' in 'class' should not match
    assert.equal(contains('The assumption'), false); // 'ass' in 'assumption' should not match
    assert.equal(contains('You are an ass'), true); // standalone 'ass' should match
    assert.equal(contains('Classic example'), false); // 'ass' in 'classic' should not match
    assert.equal(contains('Assassin game'), false); // 'ass' in 'assassin' should not match
  });

  test('should handle case insensitivity', () => {
    assert.equal(contains('SHIT'), true);
    assert.equal(contains('Shit'), true);
    assert.equal(contains('sHiT'), true);
    assert.equal(contains('HELL'), true);
    assert.equal(contains('Hell'), true);
    assert.equal(contains('CLEAN TEXT'), false);
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

    assert.ok(duration < 50, `Performance too slow: ${duration}ms`);
    assert.equal(result, true);
  });

  test('should handle performance for very large clean text', () => {
    const largeCleanText = 'This is clean text with no bad words. '.repeat(
      2000
    );
    const start = performance.now();
    const result = contains(largeCleanText);
    const duration = performance.now() - start;

    assert.ok(
      duration < 20,
      `Performance too slow for clean text: ${duration}ms`
    );
    assert.equal(result, false);
  });
});
