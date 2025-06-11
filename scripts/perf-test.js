#!/usr/bin/env node

/**
 * Quick performance test
 * Runs basic performance checks to ensure core requirements are met
 */

import { filter, contains } from '../dist/index.js';

console.log('⚡ Quick Performance Test\n');

// Test data
const testCases = [
  'This is clean text',
  'This shit is bad',
  '$h1t happens',
  'Very long text that goes on and on '.repeat(100) + 'shit',
];

// Performance targets - CI-friendly thresholds
const isCI = process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';
const MIN_FILTER_OPS = isCI ? 30000 : 100000; // 30K ops/sec in CI, 100K locally
const MIN_CONTAINS_OPS = isCI ? 50000 : 200000; // 50K ops/sec in CI, 200K locally

for (const text of testCases) {
  console.log(
    `Testing: "${text.slice(0, 50)}${text.length > 50 ? '...' : ''}"`
  );

  // Test filter performance
  const filterStart = performance.now();
  for (let i = 0; i < 10000; i++) {
    filter(text);
  }
  const filterTime = performance.now() - filterStart;
  const filterOpsPerSec = Math.round(10000 / (filterTime / 1000));

  // Test contains performance
  const containsStart = performance.now();
  for (let i = 0; i < 10000; i++) {
    contains(text);
  }
  const containsTime = performance.now() - containsStart;
  const containsOpsPerSec = Math.round(10000 / (containsTime / 1000));

  console.log(`  filter():   ${filterOpsPerSec.toLocaleString()} ops/sec`);
  console.log(`  contains(): ${containsOpsPerSec.toLocaleString()} ops/sec`);

  // Check if meets minimum requirements
  if (filterOpsPerSec < MIN_FILTER_OPS) {
    console.log(
      `❌ filter() performance too slow (minimum: ${MIN_FILTER_OPS.toLocaleString()})`
    );
    process.exit(1);
  }

  if (containsOpsPerSec < MIN_CONTAINS_OPS) {
    console.log(
      `❌ contains() performance too slow (minimum: ${MIN_CONTAINS_OPS.toLocaleString()})`
    );
    process.exit(1);
  }

  console.log('');
}

console.log('✅ All performance tests passed!');
console.log('🚀 Bleeper meets performance requirements');
