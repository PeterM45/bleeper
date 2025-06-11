import { contains, analyze } from '../dist/index.js';

console.log('🎉 Final Verification: All Test Cases\n');

// Test all the originally failing cases
const testCases = ['f*ck', 'What the f*ck', 'h3ll0', 'phuck', '$h1t'];

for (const text of testCases) {
  console.log(`--- Testing: "${text}" ---`);

  try {
    const containsResult = contains(text);
    const analyzeResult = analyze(text);

    console.log(`✅ contains(): ${containsResult}`);
    console.log(`✅ analyze() found: [${analyzeResult.found.join(', ')}]`);
    console.log(`✅ analyze() clean: "${analyzeResult.clean}"`);
    console.log('');
  } catch (error) {
    console.error(`❌ Error testing "${text}":`, error.message);
  }
}

console.log('🔍 Testing word boundary protection...');

// Test that word boundaries are still respected
const boundaryTests = [
  'Class assignment', // should NOT detect 'ass' in 'Class'
  'You are an ass', // should detect standalone 'ass'
];

for (const text of boundaryTests) {
  const result = contains(text);
  console.log(`"${text}" contains profanity: ${result}`);
}
