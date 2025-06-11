#!/usr/bin/env node

/**
 * Bundle size verification script
 * Ensures the built package stays under the 5KB limit
 */

import { readFileSync, statSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const MAX_BUNDLE_SIZE = 5 * 1024; // 5KB limit

console.log('📦 Bundle Size Check\n');

try {
  // Check main bundle
  const distPath = join(projectRoot, 'dist', 'index.js');
  const bundleSize = statSync(distPath).size;

  console.log(
    `Main bundle: ${bundleSize} bytes (${(bundleSize / 1024).toFixed(2)}KB)`
  );
  console.log(`Limit: ${MAX_BUNDLE_SIZE} bytes (${MAX_BUNDLE_SIZE / 1024}KB)`);

  if (bundleSize > MAX_BUNDLE_SIZE) {
    console.log('❌ Bundle size exceeds limit!');
    process.exit(1);
  }

  // Calculate percentage of limit used
  const percentage = ((bundleSize / MAX_BUNDLE_SIZE) * 100).toFixed(1);
  console.log(`✅ Bundle size OK (${percentage}% of limit)`);

  // Check dependencies
  const packageJson = JSON.parse(
    readFileSync(join(projectRoot, 'package.json'), 'utf8')
  );

  const deps = Object.keys(packageJson.dependencies || {});
  const devDeps = Object.keys(packageJson.devDependencies || {});

  console.log(`\n📊 Dependencies:`);
  console.log(`Runtime dependencies: ${deps.length} (target: 0)`);
  console.log(`Dev dependencies: ${devDeps.length}`);

  if (deps.length > 0) {
    console.log('❌ Runtime dependencies found!');
    console.log('Dependencies:', deps);
    process.exit(1);
  }

  console.log('✅ Zero runtime dependencies maintained');
} catch (error) {
  console.log('❌ Error checking bundle size:', error.message);
  process.exit(1);
}
