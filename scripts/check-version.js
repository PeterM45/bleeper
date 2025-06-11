#!/usr/bin/env node

import fs from 'fs';
import { execSync } from 'child_process';

console.log('🔍 Checking version consistency...\n');

// Get package.json version
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const packageVersion = pkg.version;

// Get CHANGELOG.md version
const changelog = fs.readFileSync('CHANGELOG.md', 'utf8');
const changelogMatch = changelog.match(/## \[([^\]]+)\]/);
const changelogVersion = changelogMatch ? changelogMatch[1] : null;

// Get git tag
let gitTag = null;
try {
  const tag = execSync('git describe --tags --abbrev=0', {
    encoding: 'utf8',
  }).trim();
  gitTag = tag.startsWith('v') ? tag.slice(1) : tag;
} catch {
  gitTag = null;
}

console.log(`📦 package.json:  ${packageVersion}`);
console.log(`📝 CHANGELOG.md:  ${changelogVersion || 'Not found'}`);
console.log(`🏷️  Git tag:       ${gitTag || 'None'}\n`);

// Check consistency
let hasErrors = false;

if (changelogVersion && packageVersion !== changelogVersion) {
  console.log('❌ Version mismatch: package.json and CHANGELOG.md');
  hasErrors = true;
}

if (gitTag && packageVersion !== gitTag) {
  console.log('⚠️  Git tag does not match package.json version');
}

if (!hasErrors && changelogVersion === packageVersion) {
  console.log('✅ All versions are consistent!');
} else if (hasErrors) {
  console.log('\n💡 Fix by updating CHANGELOG.md to match package.json');
  process.exit(1);
}
