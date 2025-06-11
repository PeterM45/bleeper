#!/usr/bin/env node

/**
 * CI-optimized performance test
 * Reduced iterations to minimize compute costs while ensuring functionality
 */

import { filter, contains } from '../dist/index.js';

console.log('⚡ CI Performance Test (Optimized)');

// Reduced test cases and iterations for CI
const testCases = [
  { text: 'This is clean text', iterations: 1000 },
  { text: 'This shit is bad', iterations: 1000 },
  { text: '$h1t happens', iterations: 500 },
];

let allPassed = true;

for (const testCase of testCases) {
  const { text, iterations } = testCase;

  console.log(
    `\nTesting: "${text.length > 50 ? text.substring(0, 47) + '...' : text}"`
  );

  // Test filter() performance
  const filterStart = process.hrtime.bigint();
  for (let i = 0; i < iterations; i++) {
    filter(text);
  }
  const filterEnd = process.hrtime.bigint();
  const filterTime = Number(filterEnd - filterStart) / 1000000; // Convert to ms
  const filterOpsPerSec = Math.round((iterations / filterTime) * 1000);

  // Test contains() performance
  const containsStart = process.hrtime.bigint();
  for (let i = 0; i < iterations; i++) {
    contains(text);
  }
  const containsEnd = process.hrtime.bigint();
  const containsTime = Number(containsEnd - containsStart) / 1000000;
  const containsOpsPerSec = Math.round((iterations / containsTime) * 1000);

  console.log(`  filter():   ${filterOpsPerSec.toLocaleString()} ops/sec`);
  console.log(`  contains(): ${containsOpsPerSec.toLocaleString()} ops/sec`);

  // Basic performance thresholds (lower than full benchmark)
  if (filterOpsPerSec < 10000) {
    console.log(`❌ filter() too slow: ${filterOpsPerSec} ops/sec`);
    allPassed = false;
  }

  if (containsOpsPerSec < 20000) {
    console.log(`❌ contains() too slow: ${containsOpsPerSec} ops/sec`);
    allPassed = false;
  }
}

if (allPassed) {
  console.log('\n✅ All CI performance tests passed!');
  console.log('🚀 Bleeper meets CI performance requirements');
  process.exit(0);
} else {
  console.log('\n❌ Some CI performance tests failed!');
  process.exit(1);
}
