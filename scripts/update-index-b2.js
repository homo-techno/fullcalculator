const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'src', 'calculators', 'index.ts');
const importsPath = path.join(__dirname, 'new-imports-b2.txt');
const regsPath = path.join(__dirname, 'new-regs-b2.txt');

const newImports = fs.readFileSync(importsPath, 'utf8').trim();
const newRegs = fs.readFileSync(regsPath, 'utf8').trim();

let content = fs.readFileSync(indexPath, 'utf8');

const exportLine = 'export const calculators: CalculatorDefinition[] = [';
const exportIndex = content.indexOf(exportLine);
if (exportIndex === -1) { console.error('Could not find array'); process.exit(1); }

content = content.slice(0, exportIndex) + '\n' + newImports + '\n\n' + content.slice(exportIndex);

const newExportIndex = content.indexOf(exportLine) + exportLine.length;
const closingIndex = content.indexOf('\n];', newExportIndex);
if (closingIndex === -1) { console.error('Could not find ];'); process.exit(1); }

content = content.slice(0, closingIndex) + '\n' + newRegs + '\n' + content.slice(closingIndex);

// Remove duplicate imports and registrations
const lines = content.split('\n');
const seenImports = new Set();
const seenRegs = new Set();
const toRemove = new Set();
let inArray = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  if (line.startsWith('import {')) {
    if (seenImports.has(line)) toRemove.add(i);
    else seenImports.add(line);
  }
  if (line.includes('export const calculators')) inArray = true;
  if (inArray && line === '];') inArray = false;
  if (inArray && line.endsWith(',') && !line.includes('[') && !line.includes(':') && !line.includes('//')) {
    if (seenRegs.has(line)) toRemove.add(i);
    else seenRegs.add(line);
  }
}

const sortedRemove = [...toRemove].sort((a, b) => b - a);
for (const idx of sortedRemove) lines.splice(idx, 1);

fs.writeFileSync(indexPath, lines.join('\n'));
console.log(`Updated: ${lines.length} lines, removed ${toRemove.size} duplicates`);
