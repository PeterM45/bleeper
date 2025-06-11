#!/usr/bin/env node

import { filter, contains } from './dist/index.js';

console.log('🔍 Detailed Performance Analysis\n');

// Create the same test case as the performance test
const largeText = 'Very long text that goes on and on '.repeat(100) + 'shit';

console.log(`Text length: ${largeText.length} characters`);
console.log(`Text ends with: "${largeText.slice(-20)}"`);

// Test single operation
console.log('\n⏱️  Single Operation Test:');
const startFilter = performance.now();
const result = filter(largeText);
const endFilter = performance.now();

console.log(
  `filter() single operation: ${(endFilter - startFilter).toFixed(2)}ms`
);

const startContains = performance.now();
const containsResult = contains(largeText);
const endContains = performance.now();

console.log(
  `contains() single operation: ${(endContains - startContains).toFixed(2)}ms`
);

// Test performance like the perf script
console.log('\n⏱️  Performance Test (1000 iterations):');

const filterStartPerf = performance.now();
for (let i = 0; i < 1000; i++) {
  filter(largeText);
}
const filterTimePerf = performance.now() - filterStartPerf;
const filterOpsPerSec = Math.round(1000 / (filterTimePerf / 1000));

const containsStartPerf = performance.now();
for (let i = 0; i < 1000; i++) {
  contains(largeText);
}
const containsTimePerf = performance.now() - containsStartPerf;
const containsOpsPerSec = Math.round(1000 / (containsTimePerf / 1000));

console.log(`filter(): ${filterOpsPerSec.toLocaleString()} ops/sec`);
console.log(`contains(): ${containsOpsPerSec.toLocaleString()} ops/sec`);

console.log('\n✅ Analysis complete');
