const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'src', 'calculators', 'index.ts');
const importsFile = path.join(__dirname, 'new-imports-batch1.txt');
const regsFile = path.join(__dirname, 'new-regs-batch1.txt');

const content = fs.readFileSync(indexPath, 'utf8');
const newImports = fs.readFileSync(importsFile, 'utf8').trim();
const newRegs = fs.readFileSync(regsFile, 'utf8').trim();

const lines = content.split('\n');

let lastImportIdx = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].startsWith('import ')) lastImportIdx = i;
}

let closingBracketIdx = -1;
for (let i = lines.length - 1; i >= 0; i--) {
  if (lines[i].trim() === '];') {
    closingBracketIdx = i;
    break;
  }
}

if (lastImportIdx === -1 || closingBracketIdx === -1) {
  console.error('Could not find insertion points!');
  process.exit(1);
}

console.log(`Last import at line ${lastImportIdx + 1}`);
console.log(`Closing bracket at line ${closingBracketIdx + 1}`);

const importLines = newImports.split('\n');
lines.splice(lastImportIdx + 1, 0, ...importLines);

const adjustedClosingIdx = closingBracketIdx + importLines.length;
const regLines = newRegs.split('\n');
lines.splice(adjustedClosingIdx, 0, ...regLines);

fs.writeFileSync(indexPath, lines.join('\n'));
console.log(`Inserted ${importLines.length} imports and ${regLines.length} registrations`);
console.log('Done!');
