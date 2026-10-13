#!/usr/bin/env node
import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join, relative, basename, extname, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DOCS_DIR = join(__dirname, '../src/content/docs');
let fixed = 0;

function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) repair(full);
  }
}

function repair(filePath) {
  let text = readFileSync(filePath, 'utf8').trim();
  let changed = false;

  // 1. Strip outer code fences wrapping the whole doc
  const fenceMatch = text.match(/^```(?:markdown)?\n([\s\S]*?)\n```$/m);
  if (fenceMatch) {
    text = fenceMatch[1].trim();
    changed = true;
    console.log(`  [fences] ${relative(DOCS_DIR, filePath)}`);
  }

  // 2. Ensure frontmatter with title
  if (!text.startsWith('---')) {
    const headingMatch = text.match(/^#\s+(.+)$/m);
    const title = headingMatch
      ? headingMatch[1].trim()
      : basename(filePath, extname(filePath)).split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const body = headingMatch ? text.replace(/^#\s+.+\n?/m, '').trim() : text;
    text = `---\ntitle: ${title}\n---\n\n${body}`;
    changed = true;
    console.log(`  [frontmatter] ${relative(DOCS_DIR, filePath)} — title: "${title}"`);
  } else {
    const fmEnd = text.indexOf('---', 3);
    if (fmEnd !== -1 && !/^title\s*:/m.test(text.slice(0, fmEnd + 3))) {
      const title = basename(filePath, extname(filePath)).split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      text = text.slice(0, 3) + `\ntitle: ${title}` + text.slice(3);
      changed = true;
      console.log(`  [title] ${relative(DOCS_DIR, filePath)} — added title: "${title}"`);
    }
  }

  if (changed) { writeFileSync(filePath, text + '\n', 'utf8'); fixed++; }
}

console.log(`Scanning ${DOCS_DIR}...`);
walk(DOCS_DIR);
console.log(fixed > 0 ? `\nRepaired ${fixed} file(s).` : '\nAll docs look good.');
