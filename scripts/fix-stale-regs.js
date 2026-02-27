const fs = require('fs');
const path = require('path');

const INDEX_PATH = path.join(__dirname, '..', 'src', 'calculators', 'index.ts');
let content = fs.readFileSync(INDEX_PATH, 'utf8');

// Build set of all imported names
const importedNames = new Set();
for (const line of content.split('\n')) {
  const m = line.match(/^import \{ (\w+) \}/);
  if (m) importedNames.add(m[1]);
}

console.log(`Total imported names: ${importedNames.size}`);

// Find registrations that reference non-imported names
const lines = content.split('\n');
const toRemove = [];
let inArray = false;

for (let i = 0; i < lines.length; i++) {
  const trimmed = lines[i].trim();
  if (trimmed.includes('export const calculators')) inArray = true;
  if (inArray && trimmed === '];') inArray = false;

  if (inArray && trimmed.endsWith(',') && !trimmed.includes('[') && !trimmed.includes(':') && !trimmed.includes('//') && !trimmed.includes('"')) {
    const name = trimmed.replace(',', '').trim();
    if (name && !importedNames.has(name)) {
      toRemove.push({ line: i, name });
    }
  }
}

console.log(`Stale registrations to remove: ${toRemove.length}`);
for (const { line, name } of toRemove) {
  console.log(`  Line ${line + 1}: ${name}`);
}

// Remove stale lines (reverse order)
for (const { line } of toRemove.reverse()) {
  lines.splice(line, 1);
}

fs.writeFileSync(INDEX_PATH, lines.join('\n'));
console.log(`Done. Lines: ${lines.length}`);
