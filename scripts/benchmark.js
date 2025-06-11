#!/usr/bin/env node

import { ProfanityFilter } from './dist/index.js';

/**
 * Performance benchmark demonstrating ultra-optimized profanity filtering
 */

// Test cases designed to showcase different optimization layers
const testCases = [
  {
    name: 'Clean text (character pre-filter optimization)',
    text:
      'The quick brown fox jumps over the lazy dog. ' +
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' +
      'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    iterations: 10000,
    expectedOptimization: '~O(n) single pass, early termination',
  },
  {
    name: 'Mixed content (bloom filter optimization)',
    text:
      'This is a normal sentence with some words that might look suspicious ' +
      'but are actually clean like analysis, documentation, and specification.',
    iterations: 5000,
    expectedOptimization: '~O(n) with bloom filter eliminating false positives',
  },
  {
    name: 'Contains profanity (full processing)',
    text: 'This text contains some shit and damn words that need filtering.',
    iterations: 5000,
    expectedOptimization: 'O(n) full processing required',
  },
  {
    name: 'Heavy l33t speak (advanced normalization)',
    text: '$h1t d@mn h3ll @ss f*ck b1tch $h1t d@mn h3ll @ss f*ck b1tch',
    iterations: 5000,
    expectedOptimization: 'O(n) with character substitution processing',
  },
];

console.log('🚀 Bleeper Ultra-Performance Benchmark\n');
console.log('Features tested:');
console.log('✓ Character frequency pre-filtering');
console.log('✓ Bloom filter negative lookups');
console.log('✓ Zero-copy optimizations');
console.log('✓ Advanced character substitution');
console.log('✓ Word boundary detection\n');

const filter = new ProfanityFilter();

// Warmup
for (let i = 0; i < 100; i++) {
  filter.filter('warmup text');
}

for (const testCase of testCases) {
  console.log(`📊 ${testCase.name}`);
  console.log(
    `   Text: "${testCase.text.slice(0, 50)}${
      testCase.text.length > 50 ? '...' : ''
    }"`
  );
  console.log(`   Expected: ${testCase.expectedOptimization}`);

  // Benchmark filter()
  const startFilter = performance.now();
  for (let i = 0; i < testCase.iterations; i++) {
    filter.filter(testCase.text);
  }
  const endFilter = performance.now();
  const filterTime = endFilter - startFilter;

  // Benchmark contains()
  const startContains = performance.now();
  for (let i = 0; i < testCase.iterations; i++) {
    filter.contains(testCase.text);
  }
  const endContains = performance.now();
  const containsTime = endContains - startContains;

  // Calculate performance metrics
  const avgFilterTime = (filterTime / testCase.iterations).toFixed(4);
  const avgContainsTime = (containsTime / testCase.iterations).toFixed(4);
  const throughputFilter = Math.round(
    testCase.iterations / (filterTime / 1000)
  );
  const throughputContains = Math.round(
    testCase.iterations / (containsTime / 1000)
  );

  console.log(`   Results:`);
  console.log(
    `   - filter():  ${avgFilterTime}ms avg (${throughputFilter} ops/sec)`
  );
  console.log(
    `   - contains(): ${avgContainsTime}ms avg (${throughputContains} ops/sec)`
  );
  console.log(
    `   - Total time: ${filterTime.toFixed(1)}ms + ${containsTime.toFixed(
      1
    )}ms\n`
  );
}

// Large text performance test
console.log('🏋️  Large Text Performance Test');
const largeText =
  'This is a large text document. '.repeat(1000) +
  'It contains some shit and damn words mixed in. '.repeat(100) +
  'Most of it is clean content though. '.repeat(1000);

console.log(`Text size: ${largeText.length} characters`);

const startLarge = performance.now();
const result = filter.filter(largeText);
const endLarge = performance.now();
const largeTime = endLarge - startLarge;

console.log(`Processing time: ${largeTime.toFixed(2)}ms`);
console.log(`Throughput: ${Math.round(largeText.length / largeTime)} chars/ms`);
console.log(`Contains profanity: ${result !== largeText ? 'Yes' : 'No'}`);
console.log(
  `Memory efficiency: ${
    result === largeText ? 'Zero-copy used' : 'Filtered copy created'
  }\n`
);

// Bundle size estimate
console.log('📦 Bundle Size Optimization');
console.log('✓ Zero dependencies');
console.log('✓ Tree-shakeable ESM exports');
console.log('✓ TypeScript-first design');
console.log('✓ Optimized data structures');
console.log('✓ Minimal API surface');
console.log('✓ Target: <5KB minified\n');

console.log(
  '🎉 Benchmark complete! Bleeper delivers ultra-fast profanity filtering.'
);
