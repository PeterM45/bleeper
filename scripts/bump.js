#!/usr/bin/env node

/**
 * Version bump utility
 * Updates package.json, CHANGELOG.md, and creates git tag
 */

import fs from 'fs';
import { execSync } from 'child_process';

const VALID_TYPES = ['patch', 'minor', 'major'];

function showUsage() {
  console.log(`
Usage: npm run bump <type> [message]

Types:
  patch   Bug fixes (0.1.3 → 0.1.4)
  minor   New features (0.1.3 → 0.2.0)  
  major   Breaking changes (0.1.3 → 1.0.0)

Examples:
  npm run bump patch "Fix character substitution"
  npm run bump minor "Add emoji support"
`);
}

function bumpVersion(current, type) {
  const [major, minor, patch] = current.split('.').map(Number);

  switch (type) {
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'major':
      return `${major + 1}.0.0`;
    default:
      throw new Error(`Invalid type: ${type}`);
  }
}

function updatePackageJson(newVersion) {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  pkg.version = newVersion;
  fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
}

function updateChangelog(newVersion, message) {
  const today = new Date().toISOString().split('T')[0];
  const changelog = fs.readFileSync('CHANGELOG.md', 'utf8');

  const newEntry = `## [${newVersion}] - ${today}

### ${message.startsWith('Fix') ? 'Fixed' : 'Changed'}
- ${message}

`;

  // Insert after the first "## [" line
  const lines = changelog.split('\n');
  const insertIndex = lines.findIndex((line) => line.startsWith('## ['));

  if (insertIndex === -1) {
    throw new Error('Could not find insertion point in CHANGELOG.md');
  }

  lines.splice(insertIndex, 0, newEntry);
  fs.writeFileSync('CHANGELOG.md', lines.join('\n'));
}

function main() {
  const [, , type, ...messageParts] = process.argv;

  if (!type || !VALID_TYPES.includes(type)) {
    showUsage();
    process.exit(1);
  }

  const message = messageParts.join(' ') || `${type} release`;

  // Get current version
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const currentVersion = pkg.version;
  const newVersion = bumpVersion(currentVersion, type);

  console.log(`\n🚀 Bumping: ${currentVersion} → ${newVersion}`);
  console.log(`📝 Message: ${message}\n`);

  try {
    // Update files
    updatePackageJson(newVersion);
    console.log('✅ Updated package.json');

    updateChangelog(newVersion, message);
    console.log('✅ Updated CHANGELOG.md');

    // Git operations
    execSync('git add package.json CHANGELOG.md', { stdio: 'inherit' });
    execSync(`git commit -m "chore: bump to ${newVersion} - ${message}"`, {
      stdio: 'inherit',
    });
    execSync(`git tag v${newVersion}`, { stdio: 'inherit' });
    console.log(`✅ Created commit and tag v${newVersion}`);

    console.log(`\n🎉 Version bump complete!`);
    console.log(`\nTo publish: git push origin main --tags`);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
