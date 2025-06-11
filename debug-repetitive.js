#!/usr/bin/env node

const largeText = 'Very long text that goes on and on '.repeat(100) + 'shit';

console.log('🔍 Repetitive Text Analysis\n');
console.log(`Text length: ${largeText.length}`);
console.log(`First 100 chars: "${largeText.slice(0, 100)}"`);
console.log(`Second 100 chars: "${largeText.slice(100, 200)}"`);

const pattern = 'Very long text that goes on and on ';
console.log(`\nPattern: "${pattern}"`);
console.log(`Pattern length: ${pattern.length}`);
console.log(
  `Expected repeats: ${Math.floor(largeText.length / pattern.length)}`
);

const sample1 = largeText.slice(0, 50);
const sample2 = largeText.slice(50, 100);
console.log(`\nSample 1 (0-50): "${sample1}"`);
console.log(`Sample 2 (50-100): "${sample2}"`);
console.log(`Samples equal: ${sample1 === sample2}`);

// Check if repetitive
let patternLength = 50;
while (patternLength < 200 && patternLength < largeText.length / 4) {
  const testPattern = largeText.slice(0, patternLength);
  const nextSegment = largeText.slice(patternLength, patternLength * 2);
  console.log(`\nTesting pattern length ${patternLength}:`);
  console.log(`Pattern: "${testPattern}"`);
  console.log(`Next segment: "${nextSegment}"`);
  console.log(`Match: ${testPattern === nextSegment}`);

  if (testPattern === nextSegment) {
    console.log(`Found repetitive pattern at length ${patternLength}!`);
    break;
  }
  patternLength += 10;
}
