const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'src', 'calculators', 'index.ts');
const importsFile = path.join(__dirname, 'new-imports-batch5.txt');
const regsFile = path.join(__dirname, 'new-regs-batch5.txt');

const index = fs.readFileSync(indexPath, 'utf8');
const lines = index.split('\n');

const newImports = fs.readFileSync(importsFile, 'utf8').trim();
const newRegs = fs.readFileSync(regsFile, 'utf8').trim();

let lastImportIdx = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].startsWith('import ')) lastImportIdx = i;
}

let closingIdx = -1;
for (let i = lines.length - 1; i >= 0; i--) {
  if (lines[i].trim() === '];') { closingIdx = i; break; }
}

if (lastImportIdx === -1 || closingIdx === -1) {
  console.error('Could not find insertion points');
  process.exit(1);
}

const importLines = newImports.split('\n');
lines.splice(lastImportIdx + 1, 0, ...importLines);

const newClosingIdx = closingIdx + importLines.length;
const regLines = newRegs.split('\n');
lines.splice(newClosingIdx, 0, ...regLines);

fs.writeFileSync(indexPath, lines.join('\n'));
console.log('Done! Inserted', importLines.length, 'imports and', regLines.length, 'registrations');
