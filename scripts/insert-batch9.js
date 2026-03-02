const fs = require('fs');
const path = require('path');
const indexPath = path.join(__dirname, '..', 'src', 'calculators', 'index.ts');
const newImports = fs.readFileSync(path.join(__dirname, 'new-imports-batch9.txt'), 'utf8').trim();
const newRegs = fs.readFileSync(path.join(__dirname, 'new-regs-batch9.txt'), 'utf8').trim();
const lines = fs.readFileSync(indexPath, 'utf8').split('\n');
let lastImportIdx = -1;
for (let i = 0; i < lines.length; i++) { if (lines[i].startsWith('import ')) lastImportIdx = i; }
let closingIdx = -1;
for (let i = lines.length - 1; i >= 0; i--) { if (lines[i].trim() === '];') { closingIdx = i; break; } }
const importLines = newImports.split('\n');
lines.splice(lastImportIdx + 1, 0, ...importLines);
const newClosingIdx = closingIdx + importLines.length;
lines.splice(newClosingIdx, 0, ...newRegs.split('\n'));
fs.writeFileSync(indexPath, lines.join('\n'));
console.log('Done! Inserted', importLines.length, 'imports and', newRegs.split('\n').length, 'registrations');
