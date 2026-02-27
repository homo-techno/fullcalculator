const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'src', 'calculators', 'index.ts');
let content = fs.readFileSync(indexPath, 'utf8');

const dupeFiles = [
  'cat-age-human-calculator',
  'cups-to-grams-calculator',
  'dental-insurance-calculator',
  'dog-age-human-calculator',
  'frequency-wavelength-calculator',
  'long-term-care-calculator',
  'minecraft-crafting-calculator',
  'pregnancy-weight-gain-calculator',
  'reading-speed-calculator',
  'vision-insurance-calculator',
];

function slugToName(slug) {
  const c = slug.replace(/^(\d)/, 'n$1').replace(/-(\w)/g, (_, c) => c.toUpperCase());
  return c.endsWith('Calculator') ? c : c + 'Calculator';
}

for (const slug of dupeFiles) {
  const name = slugToName(slug);
  // Remove the import line for the new duplicate
  const importLine = `import { ${name} } from "./${slug}";\n`;
  content = content.replace(importLine, '');

  // Delete the file
  const filePath = path.join(__dirname, '..', 'src', 'calculators', slug + '.ts');
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`Deleted: ${slug}.ts`);
  }
}

fs.writeFileSync(indexPath, content);
console.log('Fixed duplicate imports');

// Verify
const lines = content.split('\n');
const seen = {};
for (const line of lines) {
  const m = line.match(/^import \{ (\w+) \}/);
  if (m) {
    if (seen[m[1]]) console.log(`STILL DUP: ${m[1]}`);
    else seen[m[1]] = true;
  }
}
console.log('Verification done');
