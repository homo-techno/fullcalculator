const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'src', 'calculators', 'index.ts');
const importsFile = path.join(__dirname, 'new-imports-europe.txt');
const regsFile = path.join(__dirname, 'new-regs-europe.txt');

const content = fs.readFileSync(indexPath, 'utf8');
const newImports = fs.readFileSync(importsFile, 'utf8').trim();
const newRegs = fs.readFileSync(regsFile, 'utf8').trim();

const lines = content.split('\n');

// Find last import line
let lastImportIdx = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].startsWith('import ')) lastImportIdx = i;
}

// Find the closing bracket of the calculators array
// Look for the line that has just "];" which closes the array
let closingBracketIdx = -1;
for (let i = lines.length - 1; i >= 0; i--) {
  if (lines[i].trim() === '];') {
    closingBracketIdx = i;
    break;
  }
}

if (lastImportIdx === -1 || closingBracketIdx === -1) {
  console.error('Could not find insertion points!');
  console.log('Last import idx:', lastImportIdx);
  console.log('Closing bracket idx:', closingBracketIdx);
  process.exit(1);
}

console.log(`Last import at line ${lastImportIdx + 1}`);
console.log(`Closing bracket at line ${closingBracketIdx + 1}`);

// Insert imports after last import line
const importLines = newImports.split('\n');
lines.splice(lastImportIdx + 1, 0, ...importLines);

// Adjust closing bracket index (shifted by the number of imports we inserted)
const adjustedClosingIdx = closingBracketIdx + importLines.length;

// Insert registrations before closing bracket
const regLines = newRegs.split('\n');
lines.splice(adjustedClosingIdx, 0, ...regLines);

fs.writeFileSync(indexPath, lines.join('\n'));
console.log(`Inserted ${importLines.length} imports and ${regLines.length} registrations`);
console.log('Done!');
