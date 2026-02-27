/**
 * Fix all duplicate issues:
 * 1. Remove files with "-calculator-calculator" naming bug (keep the proper version)
 * 2. Remove duplicate slug files (keep the first registered one)
 * 3. Register all 200 unregistered files
 * 4. Deduplicate index.ts imports/registrations
 */
const fs = require('fs');
const path = require('path');

const CALC_DIR = path.join(__dirname, '..', 'src', 'calculators');
const INDEX_PATH = path.join(CALC_DIR, 'index.ts');

// === STEP 1: Fix -calculator-calculator naming bugs ===
const buggyFiles = [
  'gpa-calculator-calculator',
  'markup-calculator-calculator',
  'ibu-calculator-calculator',
  'keg-calculator-calculator',
];

const calcCalcFiles = fs.readdirSync(CALC_DIR)
  .filter(f => f.endsWith('.ts') && f.includes('-calc-calculator'));

const allBuggy = [...buggyFiles.map(f => f + '.ts'), ...calcCalcFiles];
let deletedCount = 0;

for (const file of allBuggy) {
  const fp = path.join(CALC_DIR, file);
  if (fs.existsSync(fp)) {
    fs.unlinkSync(fp);
    deletedCount++;
    console.log(`Deleted buggy: ${file}`);
  }
}

// === STEP 2: Fix exact slug collisions - remove the duplicate file ===
// Keep the FIRST file (shorter name), remove the second
const slugCollisions = [
  // [keep, remove] - keep the one already registered/shorter
  ['apgar-score.ts', 'apgar-calculator.ts'],
  ['long-division.ts', 'long-division-calc.ts'],
  ['lot-size-calculator.ts', 'lot-size-calc.ts'],
  ['mixed-number.ts', 'mixed-number-calc.ts'],
  ['moon-phase.ts', 'moon-phase-calc.ts'],
  ['permutation.ts', 'permutation-calc.ts'],
  ['scientific-notation.ts', 'scientific-notation-calc.ts'],
  ['shoe-size.ts', 'shoe-size-converter.ts'],
  // For IVF: keep ivf-due-date.ts, remove pregnancy-due-date-ivf.ts
  ['ivf-due-date.ts', 'pregnancy-due-date-ivf.ts'],
  // For citation: keep citation-count.ts, remove citation-generator.ts
  ['citation-count.ts', 'citation-generator.ts'],
];

for (const [keep, remove] of slugCollisions) {
  const fp = path.join(CALC_DIR, remove);
  if (fs.existsSync(fp)) {
    fs.unlinkSync(fp);
    deletedCount++;
    console.log(`Deleted collision dupe: ${remove} (keeping ${keep})`);
  }
}

// Also remove near-duplicate calorie files
const caloriedupes = [
  'hiking-calorie.ts',  // keep hiking-calories.ts
  'cycling-calorie.ts', // keep cycling-calories.ts
  'rope-jump-calorie.ts', // keep jump-rope-calories.ts
  'jump-rope-calorie-calculator.ts',
];
for (const file of caloriedupes) {
  const fp = path.join(CALC_DIR, file);
  if (fs.existsSync(fp)) {
    fs.unlinkSync(fp);
    deletedCount++;
    console.log(`Deleted calorie dupe: ${file}`);
  }
}

console.log(`\nTotal deleted: ${deletedCount}`);

// === STEP 3: Clean index.ts - remove imports/regs for deleted files ===
let content = fs.readFileSync(INDEX_PATH, 'utf8');

// Build set of deleted file basenames (without .ts)
const deletedSlugs = new Set();
for (const file of [...allBuggy, ...slugCollisions.map(x => x[1]), ...caloriedupes]) {
  deletedSlugs.add(file.replace('.ts', ''));
}

const lines = content.split('\n');
const filteredLines = [];
let inArray = false;

for (const line of lines) {
  const trimmed = line.trim();

  // Check if this is an import for a deleted file
  const importMatch = trimmed.match(/from "\.\/([^"]+)"/);
  if (importMatch && deletedSlugs.has(importMatch[1])) {
    console.log(`Removed import: ${importMatch[1]}`);
    continue;
  }

  filteredLines.push(line);
}

content = filteredLines.join('\n');

// Deduplicate: remove duplicate imports and registrations
const lines2 = content.split('\n');
const seenImports = new Set();
const toRemove = new Set();

for (let i = 0; i < lines2.length; i++) {
  const trimmed = lines2[i].trim();
  if (trimmed.startsWith('import {')) {
    if (seenImports.has(trimmed)) {
      toRemove.add(i);
    } else {
      seenImports.add(trimmed);
    }
  }
}

const finalLines = lines2.filter((_, i) => !toRemove.has(i));
content = finalLines.join('\n');

// Remove consecutive blank lines (more than 2)
content = content.replace(/\n{3,}/g, '\n\n');

fs.writeFileSync(INDEX_PATH, content);
console.log(`\nIndex cleaned: ${finalLines.length} lines, removed ${toRemove.size} dupe imports`);

// === STEP 4: Register unregistered files ===
// Get all current imports from index.ts
const currentImports = new Set();
for (const line of content.split('\n')) {
  const m = line.match(/from "\.\/([^"]+)"/);
  if (m) currentImports.add(m[1]);
}

// Get all .ts files that should be registered
const allFiles = fs.readdirSync(CALC_DIR)
  .filter(f => f.endsWith('.ts') && f !== 'types.ts' && f !== 'index.ts' && !f.startsWith('_'))
  .map(f => f.replace('.ts', ''));

const unregistered = allFiles.filter(f => !currentImports.has(f));
console.log(`\nUnregistered files to add: ${unregistered.length}`);

if (unregistered.length > 0) {
  // For each unregistered file, extract its export name
  const newImports = [];
  const newRegs = [];

  for (const slug of unregistered) {
    const filePath = path.join(CALC_DIR, slug + '.ts');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const exportMatch = fileContent.match(/export const (\w+)/);
    if (!exportMatch) {
      console.log(`  SKIP (no export): ${slug}`);
      continue;
    }
    const exportName = exportMatch[1];

    // Check if this export name already exists in imports (collision)
    const importLine = `import { ${exportName} } from "./${slug}";`;
    if (seenImports.has(importLine)) {
      console.log(`  SKIP (import exists): ${slug} -> ${exportName}`);
      continue;
    }

    // Check if export name is already used by another file
    const existingImport = [...seenImports].find(imp => imp.includes(`{ ${exportName} }`));
    if (existingImport) {
      console.log(`  SKIP (name collision): ${slug} -> ${exportName} (already: ${existingImport})`);
      continue;
    }

    newImports.push(importLine);
    newRegs.push(`  ${exportName},`);
    seenImports.add(importLine);
  }

  console.log(`\nAdding ${newImports.length} new registrations`);

  // Insert imports before the export const line
  let finalContent = fs.readFileSync(INDEX_PATH, 'utf8');
  const exportLine = 'export const calculators: CalculatorDefinition[] = [';
  const exportIdx = finalContent.indexOf(exportLine);

  finalContent = finalContent.slice(0, exportIdx) +
    newImports.join('\n') + '\n\n' +
    finalContent.slice(exportIdx);

  // Insert registrations before ];
  const newExportIdx = finalContent.indexOf(exportLine) + exportLine.length;
  const closingIdx = finalContent.indexOf('\n];', newExportIdx);

  finalContent = finalContent.slice(0, closingIdx) + '\n' +
    newRegs.join('\n') + '\n' +
    finalContent.slice(closingIdx);

  fs.writeFileSync(INDEX_PATH, finalContent);
  console.log('Done registering unregistered files');
}
