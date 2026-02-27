const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'src', 'calculators', 'index.ts');
const importsPath = path.join(__dirname, 'new-imports.txt');
const regsPath = path.join(__dirname, 'new-registrations.txt');

const newImports = fs.readFileSync(importsPath, 'utf8').trim();
const newRegs = fs.readFileSync(regsPath, 'utf8').trim();

let content = fs.readFileSync(indexPath, 'utf8');

// Find the line "export const calculators: CalculatorDefinition[] = ["
// Insert imports just before it
const exportLine = 'export const calculators: CalculatorDefinition[] = [';
const exportIndex = content.indexOf(exportLine);
if (exportIndex === -1) {
  console.error('Could not find calculators array declaration');
  process.exit(1);
}

// Add imports before the export line
const importBlock = '\n' + newImports + '\n\n';
content = content.slice(0, exportIndex) + importBlock + content.slice(exportIndex);

// Find the closing "];" of the calculators array
// It's the "];" that comes after the export line
const newExportIndex = content.indexOf(exportLine) + exportLine.length;
const closingIndex = content.indexOf('\n];', newExportIndex);
if (closingIndex === -1) {
  console.error('Could not find closing of calculators array');
  process.exit(1);
}

// Add registrations before the closing "];
const regBlock = '\n' + newRegs + '\n';
content = content.slice(0, closingIndex) + regBlock + content.slice(closingIndex);

fs.writeFileSync(indexPath, content, 'utf8');

// Verify
const finalContent = fs.readFileSync(indexPath, 'utf8');
const importCount = (finalContent.match(/^import /gm) || []).length;
const lines = finalContent.split('\n').length;
console.log(`Updated index.ts: ${lines} lines, ${importCount} imports`);
