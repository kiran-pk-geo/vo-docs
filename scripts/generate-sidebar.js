#!/usr/bin/env node

// Regenerates _sidebar.md from the actual files in services/ and features/.
// Run locally: node scripts/generate-sidebar.js
// Run in CI:   same command

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

function listDocs(dir) {
  const full = path.join(root, dir);
  if (!fs.existsSync(full)) return [];
  return fs.readdirSync(full)
    .filter(f => f.endsWith('.md') && f !== '.gitkeep')
    .map(f => f.replace('.md', ''))
    .sort();
}

function toTitle(slug) {
  return slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

const services = listDocs('services');
const features = listDocs('features');

const lines = [
  '- [Overview](/)',
  '',
  '- **Services**',
  ...services.map(s => `- [${toTitle(s)}](services/${s})`),
  '',
  '- **Features**',
  ...features.map(f => `- [${toTitle(f)}](features/${f})`),
  '',
];

const sidebar = lines.join('\n');
fs.writeFileSync(path.join(root, '_sidebar.md'), sidebar);
console.log(`[generate-sidebar] Written with ${services.length} services, ${features.length} features`);
